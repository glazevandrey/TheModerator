/* Build the approved main UI into one HTML file. No external dependencies. */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
let html=read('index.html').replace('<!--YASDK-->','<script>window.MOD_PLATFORM="itch";</script>');
html=html.replace(/<link rel="stylesheet" href="(css\/[^\"]+)">/g,(_,p)=>'<style>\n'+read(p)+'\n</style>');
html=html.replace(/<script src="(js\/[^\"]+)"><\/script>/g,(_,p)=>'<script>\n'+read(p)+'\n</script>');
if(html.includes('mod_preview_'))throw new Error('Preview save keys in production sources');
if(!html.includes("const STATS_SITE='themoderator-game';"))throw new Error('Production analytics configuration missing');
fs.mkdirSync(path.join(root,'dist/itch'),{recursive:true});fs.writeFileSync(path.join(root,'dist/itch/index.html'),html,'utf8');
console.log('dist/itch/index.html · '+Buffer.byteLength(html)+' bytes');
