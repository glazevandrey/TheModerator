import re,os,sys,shutil,subprocess
# usage: python3 tools/build.py <src dir> <out html> <itch|sdk|vk|cg|gj|nosdk> [--no-min]
# itch build: every JS/CSS file is minified with esbuild (if found) before being inlined; sources stay readable.
src,out,mode=sys.argv[1],sys.argv[2],sys.argv[3]
sdk=mode=='sdk'
MIN = mode in ('itch','sdk','vk','cg','gj') and '--no-min' not in sys.argv

def find_esbuild():
  for c in [os.environ.get('ESBUILD'), shutil.which('esbuild'), '/opt/npm-tools/node_modules/.bin/esbuild', '/opt/npm-tools/node_modules/esbuild/bin/esbuild']:
    if c and os.path.exists(c): return c
  return None
ESB = find_esbuild() if MIN else None
if MIN and not ESB: print('! esbuild not found (npm i -g esbuild) — building WITHOUT minification')

def minify(code,loader):
  if not ESB: return code
  r=subprocess.run([ESB,'--minify','--loader='+loader,'--legal-comments=none','--charset=utf8','--log-level=error'],input=code.encode(),capture_output=True)
  if r.returncode!=0: sys.exit('esbuild failed on '+loader+':\n'+r.stderr.decode())
  return r.stdout.decode().strip()

def read(p): return open(os.path.join(src,p),encoding='utf-8').read()
h=read('index.html')
h=re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">',lambda m:'<style>\n'+minify(read(m.group(1)),'css')+'\n</style>',h)
import json
def inline_js(p):
  # big data files are split into one <script> per entry, so the boot loader's progress bar moves while they download
  if p in ('js/musicdata.js','js/sfxdata.js'):
    code=read(p); name='MUSIC_DATA' if 'music' in p else 'SFX_DATA'
    obj=json.loads(code[code.index('{',code.index('const '+name)):code.rindex('}')+1])
    parts=[f'<script>\nconst {name}={{}};\n</script>']+[f'<script>\n{name}[{json.dumps(k)}]={json.dumps(v,separators=(",",":"))};\n</script>' for k,v in obj.items()]
    return '\n'.join(parts)
  return '<script>\n'+minify(read(p),'js')+'\n</script>'
h=re.sub(r'<script src="(js/[^"]+)"></script>',lambda m:inline_js(m.group(1)),h)
# boot loader progress: after every inline script below the loader, report how far through the file we are
bi=h.find('<div id="boot">')
if bi>0:
  outp=[]; pos=0; total=len(h)
  for m in re.finditer(r'\n</script>',h):
    if m.start()<bi: continue
    outp.append(h[pos:m.end()]); pos=m.end()
    outp.append(f'<script>window.__bp&&__bp({m.end()/total:.3f})</script>')
  outp.append(h[pos:]); h=''.join(outp)
VK_BRIDGE='https://unpkg.com/@vkontakte/vk-bridge@2.14.1/dist/browser.min.js'   # VK Games: bridge from the CDN (pinned), init right away (must be < 30 s)
VK_HEAD=f"<script>window.MOD_PLATFORM='vk';</script>\n<script async src=\"{VK_BRIDGE}\" onload=\"try{{vkBridge.send('VKWebAppInit',{{}});}}catch(e){{}}\"></script>"
CG_HEAD="<script>window.MOD_PLATFORM='cg';</script>\n<script async src=\"https://sdk.crazygames.com/crazygames-sdk-v3.js\"></script>"   # CrazyGames SDK v3 (their URL is not versioned)
h=h.replace('<!--YASDK-->','<script src="/sdk.js"></script>' if sdk else ("<script>window.MOD_PLATFORM='itch';</script>" if mode=='itch' else "<script>window.MOD_PLATFORM='gj';</script>" if mode=='gj' else VK_HEAD if mode=='vk' else CG_HEAD if mode=='cg' else ''))
if sdk or mode in ('itch','vk','cg','gj'):
  h=re.sub(r'^\s*(?:\ufeff)?<!doctype html>\s*','',h,flags=re.I)
  h=re.sub(r'<meta charset="utf-8">\s*','',h,count=1)
  h='<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n'+h.replace('<svg width="0"','</head>\n<body>\n<svg width="0"',1)+'\n</body>\n</html>\n'
os.makedirs(os.path.dirname(out),exist_ok=True); open(out,'w',encoding='utf-8').write(h); print(out,len(h),'(minified)' if ESB else '')
