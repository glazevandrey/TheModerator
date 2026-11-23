"use strict";
/* THE MODERATOR — review «telemetry v1» (22.11.2026): an event journal of one night, for playtests.
   Loaded LAST by review/window_v2. The game is untouched: only wraps its functions and reads its state.
   What is recorded (game time S.t, seconds; Friday: after the pre-show the clock restarts at 0, the pre-show is marked «pre»):
     - panic: every change by a cause (scripted causes from friday.js; the background growth of panicTick split by source:
       his distance at the window / door / closet / behind, dark or glaring lamps, Mia away; the natural fade);
       a sample every 0.5 s (panic, his stage and distance, red eyes, lamps, blinds, window);
     - the stalker: every stage change, each visit as one record (from where, max distance, how long, how it ended,
       the player's first reaction time and what it was);
     - the player: lamps, blinds, smart home, pin / hide / ban (with the message), answers to Mia, highlight/evidence, pause;
     - Mia: faces, walks away and back, phone, drinking, typing on/off;
     - the Friday director's own journal (friLog) and the end of the night.
   Export: the «⬇ лог ночи» button on the end screen, Ctrl+Shift+L at any time, or FLOG.download() in the console.
   Two files: a readable .txt (timeline + summary) and the full .json. The last log also stays in localStorage (flog_last). */
const FLOG={ on:true, sid:null, t0:0, ev:[], samp:[], visits:[], cur:null, pan:{}, last:{}, sampleT:0, phase:'', srcTick:null };
function flT(){ return S ? +(S.t||0).toFixed(2) : 0; }
function flPh(){ return S&&S.fri&&S.fri.pre ? 'pre' : ''; }
function flE(kind,text,data){ if(!FLOG.on||!S) return; if(FLOG.sid!==S) flReset();
  const e={t:flT(),ph:flPh(),k:kind,x:text}; if(data) e.d=data; FLOG.ev.push(e); if(FLOG.ev.length>6000) FLOG.ev.shift(); return e; }
function flReset(){ FLOG.sid=S; FLOG.ev=[]; FLOG.samp=[]; FLOG.visits=[]; FLOG.cur=null; FLOG.pan={}; FLOG.last={}; FLOG.sampleT=0; FLOG.started=new Date().toISOString();
  FLOG.night=S&&S.night?S.night.key:'?'; }
function flPanAdd(src,v){ FLOG.pan[src]=(FLOG.pan[src]||0)+v; }

/* ---- panic: scripted adds (friCause), the background of panicTick split by its sources, and the fade */
{ const p0=panicTick; panicTick=function(dt){ if(!S||!FLOG.on) return p0.apply(this,arguments);
    const st=S.st, src=[]; for(const z of ZONES){ const m=lampMode(z); const g=m==='DEAD'?.3:m==='DIM'?.18:m==='BOOST'?.08:0; if(g) src.push(['свет '+z+' '+m,g]); }
    if(st.stage==='window'&&st.p>.5) src.push(['он у окна',.45]); if(st.stage==='door') src.push(['он у двери',.25+.35*st.p]);
    if(st.stage==='closet') src.push(['он в шкафу',.2+.35*st.p]); if(st.stage==='behind'&&!S.tut.active) src.push(['он СЗАДИ',1.6+1.6*st.p]);
    if(S.mia.awayT>0) src.push(['Мия не за столом',.2]);
    FLOG.srcTick=src; FLOG.tickAdd=0; const before=S.panic; const r=p0.apply(this,arguments); FLOG.srcTick=null;
    const net=S.panic-before, f=(FLOG.tickAdd||0)-net; if(f>1e-6) flPanAdd('спад (само успокаивается)',-f); FLOG.tickAdd=null;   /* adds are counted in addPanic; the rest is the fade */
    return r; }; }
{ const a0=addPanic; addPanic=function(v,opt){ if(!S) return a0.apply(this,arguments); const p0=S.panic; const r=a0.apply(this,arguments); const d=S.panic-p0;
    if(FLOG.on && d){
      if(FLOG.srcTick){ const tot=FLOG.srcTick.reduce((a,b)=>a+b[1],0)||1; for(const [n,g] of FLOG.srcTick) flPanAdd('фон: '+n, d*g/tot); FLOG.tickAdd=(FLOG.tickAdd||0)+d; }
      else { let why=(typeof friCause!=='undefined'&&friCause)||null;
        if(!why){ const st=(new Error().stack||'').split('\n'); why=(st[2]||'').trim().split(' ')[1]||'?'; why='событие игры: '+why; }
        flPanAdd(why,d); if(Math.abs(d)>=1) flE('panic',(d>0?'+':'')+d.toFixed(1)+' → '+S.panic.toFixed(0)+'% · '+why,{d:+d.toFixed(2),p:+S.panic.toFixed(1)}); } }
    return r; }; }

/* ---- the player's actions */
function flWrap(name,fn){ if(typeof window[name]!=='function') return; const o=window[name]; window[name]=function(){ try{ fn.apply(this,arguments); }catch(e){} return o.apply(this,arguments); }; }
function flAct(text,zone){ const e=flE('act',text); const v=FLOG.cur; if(v && !v.react && S.st.stage!=='hidden'){ v.react={t:+(flT()-v.t0).toFixed(2),what:text}; } return e; }
{ const o=setLamp; setLamp=function(z,mode){ const was=S&&S.lamps[z]?S.lamps[z].mode:null; const r=o.apply(this,arguments);
    if(S&&S.lamps[z]&&S.lamps[z].mode!==was&&S.running) flAct('свет '+z+': '+was+' → '+mode,z); return r; }; }
{ const o=toggleBlinds; toggleBlinds=function(){ const was=S&&S.blinds.closed; const r=o.apply(this,arguments); if(S&&S.blinds.closed!==was) flAct('жалюзи '+(S.blinds.closed?'ЗАКРЫТЫ':'открыты'),'window'); else if(S) flE('act','жалюзи: не сработали ('+(S.blinds.jammed?'заело':S.blinds.cd>0?'перезарядка '+Math.ceil(S.blinds.cd)+' с':'?')+')'); return r; }; }
{ const o=smartHome; smartHome=function(kind){ const before=S&&S.sh?S.sh[kind]:0; const r=o.apply(this,arguments); if(S&&S.sh&&S.sh[kind]!==before) flAct('умный дом: '+kind); else if(S) flE('act','умный дом: '+kind+' — не сработал (откл./перезарядка)'); return r; }; }
{ const o=mod2Act; mod2Act=function(kind){ const m=S&&S.selected!=null?S.chat.find(x=>x.id===S.selected):null; const r=o.apply(this,arguments);
    if(m) flAct((kind==='pin'?'ЗАКРЕП ':'СКРЫТЬ ')+m.user+' «'+String(m.text).slice(0,60)+'» ('+m.type+')'); return r; }; }
{ const o=ban; ban=function(id){ const m=S&&S.chat.find(x=>x.id===id); const r=o.apply(this,arguments); if(m&&m.banned) flE('act','БАН '+m.user+' «'+String(m.text).slice(0,50)+'» ('+m.type+')'); return r; }; }
flWrap('friAskClose',c=>flE('choice','ответ Мии при всех: '+({A:'сказал правду про бумажку',B:'«ерунда, спам»'}[c]||c)));
flWrap('friDmAnswer',c=>flE('choice','ЛИЧКА: '+({A:'A «закрой окно»',B:'B «я слежу»',C:'C «заканчивай эфир»'}[c]||c)));
flWrap('evidenceCaptured',()=>flE('act','записал момент (улика)'));
flWrap('setPause',v=>flE('ui',v?'ПАУЗА':'продолжить'));
{ const o=window.redLessonStart; if(typeof o==='function') window.redLessonStart=function(){ const was=S&&S.guide&&S.guide.active; const r=o.apply(this,arguments); if(S&&S.guide&&S.guide.active&&!was&&S.guide.kind==='red') flE('ui','УРОК «красные глаза» — ночь на паузе'); return r; }; }
{ const o=window.onboardingFinish; if(typeof o==='function') window.onboardingFinish=function(reason){ const g=S&&S.guide; const k=g&&g.active&&g.kind; const r=o.apply(this,arguments); if(k==='red') flE('ui','урок «красные глаза» закончен ('+reason+')'); return r; }; }
flWrap('endGame',why=>{ flVisitEnd('конец ночи'); flE('end','КОНЕЦ НОЧИ: '+why+' · паника '+(S?S.panic.toFixed(0):'?')+'%'); setTimeout(flEndButton,600); try{ localStorage.setItem('flog_last',JSON.stringify(flJson())); }catch(e){} });
if(typeof friLog==='function'){ const o=friLog; friLog=function(text){ flE('dir',String(text)); return o.apply(this,arguments); }; }

/* ---- the stalker's visits, Mia's states, samples */
function flVisitEnd(how){ const v=FLOG.cur; if(!v) return; v.dur=+(flT()-v.t0).toFixed(2); v.end=how; v.pEnd=+S.st.p.toFixed(2); v.panicEnd=+S.panic.toFixed(1); FLOG.visits.push(v); FLOG.cur=null; }
function flTick(dt){ if(!S||!FLOG.on) return; if(FLOG.sid!==S) flReset(); const st=S.st, L=FLOG.last;
  const sk=st.stage+(st.red?'·красн':'');
  if(L.stage!==undefined && L.stage!==sk){
    flE('stalker','сталкер: '+L.stage+' → '+sk+' (p='+st.p.toFixed(2)+')');
    if(st.stage==='hidden') flVisitEnd(L.p>=.95?'дошёл до конца':'отогнан / ушёл');
    else { if(!FLOG.cur) FLOG.cur={t0:flT(),ph:flPh(),zones:[],pMax:0,panic0:+S.panic.toFixed(1),red:!!st.red,react:null}; FLOG.cur.zones.push(sk); }
  }
  L.stage=sk; L.p=st.p; if(FLOG.cur){ FLOG.cur.pMax=Math.max(FLOG.cur.pMax,+st.p.toFixed(2)); if(st.red) FLOG.cur.red=true; }
  const face=(typeof MV2!=='undefined'&&MV2.curKey)||'?'; if(face!==L.face && !/blink|talk/.test(face+(L.face||''))){ flE('mia','лицо: '+face); } L.face=face;
  const away=S.mia.awayT>0; if(away!==L.away){ flE('mia',away?'Мия ушла от стола ('+(document.getElementById('awaybadge')||{}).textContent+')':'Мия вернулась'); L.away=away; }
  const ph=S.mia.phone||null; if(ph!==L.phone){ flE('mia','телефон: '+(ph||'нет')); L.phone=ph; }
  const dr=typeof DRK!=='undefined'&&DRK.active; if(dr!==L.drink){ flE('anim',dr?'глоток: начала':'глоток: закончила'+(DRK.why?' ('+DRK.why+')':'')); L.drink=dr; }
  const ty=typeof TYP!=='undefined'&&TYP.auto; if(ty!==L.typ){ flE('anim',ty?'печать: может печатать':'печать: стоп'+(typeof AMBV!=='undefined'?' ('+AMBV.last+')':'')); L.typ=ty; }
  FLOG.sampleT-=dt; if(FLOG.sampleT<=0){ FLOG.sampleT=.5;
    FLOG.samp.push([flT(),flPh(),+S.panic.toFixed(1),st.stage,+st.p.toFixed(2),st.red?1:0,ZONES.map(z=>lampMode(z)[0]).join(''),S.blinds.closed?1:0,S.winOpen?1:0,S.mia.awayT>0?1:0]); }
}
{ const u0=update; update=function(dt){ const r=u0.apply(this,arguments); try{ if(S&&(S.running||S.fri&&S.fri.pre)) flTick(dt); }catch(e){ console.warn(e); } return r; }; }

/* ---- export */
function flJson(){ return { night:FLOG.night, started:FLOG.started, ended:new Date().toISOString(), result:S?S.overReason:null, panicFinal:S?+S.panic.toFixed(1):null,
  panicBySource:Object.fromEntries(Object.entries(FLOG.pan).map(([k,v])=>[k,+v.toFixed(1)]).sort((a,b)=>b[1]-a[1])),
  visits:FLOG.visits, events:FLOG.ev, samples:{cols:['t','phase','panic','stage','p','red','lamps W/C/D','blinds','window open','away'],rows:FLOG.samp} }; }
function flTxt(){ const j=flJson(), L=[];
  L.push('THE MODERATOR · журнал ночи · '+j.night+' · '+j.started); L.push('итог: '+(j.result||'—')+' · паника в конце '+j.panicFinal+'%'); L.push('');
  L.push('ПАНИКА ПО ИСТОЧНИКАМ (сумма за ночь, %):'); for(const [k,v] of Object.entries(j.panicBySource)) L.push('  '+(v>0?'+':'')+v.toFixed(1).padStart(6)+'  '+k); L.push('');
  L.push('ВИЗИТЫ СТАЛКЕРА:'); j.visits.forEach((v,i)=>L.push('  '+(i+1)+') '+(v.ph?'[обуч] ':'')+v.t0.toFixed(1)+' с · '+v.zones.join(' → ')+' · макс p '+v.pMax+(v.red?' · КРАСНЫЕ':'')+' · '+v.dur+' с · '+v.end+
    ' · первая реакция игрока: '+(v.react?v.react.t+' с ('+v.react.what+')':'нет')+' · паника '+v.panic0+' → '+v.panicEnd)); L.push('');
  L.push('ХРОНОЛОГИЯ:'); for(const e of j.events) L.push((e.ph?'обуч ':'')+e.t.toFixed(1).padStart(6)+'  '+e.k.padEnd(7)+' '+e.x); L.push('');
  L.push('СРЕЗ КАЖДЫЕ 0.5 С: '+j.samples.cols.join(' | ')); for(const r of j.samples.rows) L.push('  '+r.join(' | '));
  return L.join('\n'); }
function flSave(name,text,type){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500); }
FLOG.download=function(){ const stamp=new Date().toISOString().slice(0,16).replace(/[:T]/g,'-'), base='moderator_'+(FLOG.night||'night')+'_'+stamp;
  flSave(base+'.txt',flTxt(),'text/plain;charset=utf-8'); setTimeout(()=>flSave(base+'.json',JSON.stringify(flJson(),null,1),'application/json'),300); };
FLOG.text=flTxt; FLOG.json=flJson;
function flEndButton(){ const end=document.getElementById('ovEnd'); if(!end||end.hidden||document.getElementById('flBtn')) return;
  const b=document.createElement('button'); b.id='flBtn'; b.type='button'; b.textContent='⬇ лог ночи (для теста)'; b.className='pbtn';
  b.style.cssText='margin:10px auto 0;display:block;font:600 14px system-ui,sans-serif;padding:8px 14px;border-radius:8px;border:1px solid #6d5a7a;background:#2a2131;color:#fff;cursor:pointer';
  b.onclick=FLOG.download; (end.querySelector('.panel,.box,.card')||end).appendChild(b); }
addEventListener('keydown',e=>{ if(e.ctrlKey&&e.shiftKey&&e.code==='KeyL'){ e.preventDefault(); FLOG.download(); } });
