"use strict";
/* THE MODERATOR — private messages with Mia between nights (23.11.2026, demo plan).
   A short messenger, 1–2 minutes: her lines come one by one with «печатает…», the player picks one of 2–3 answers,
   the branches meet again. What the player chose is kept in PROG (the next night reads it).
   dmShow(script, done): script = [{mia:'text'} | {pick:[{id, text, then:[{mia:'…'}…]}], save:fn(id)}]. */

const DM_TXT={ru:{who:'Мия · NyanBun', typing:'печатает…', next:'Дальше', after:'после эфира'},
  en:{who:'Mia · NyanBun', typing:'typing…', next:'Next', after:'after the stream'}};
const DT=k=>(DM_TXT[LANG]||DM_TXT.en)[k];
let DM=null;
function dmEl(){ let w=$('dmWin'); if(w) return w;
  w=document.createElement('div'); w.id='dmWin'; w.hidden=true;
  w.innerHTML=`<div class="dm-box"><div class="dm-head"><span class="dm-av"></span><b></b><small></small></div><div class="dm-log"></div><div class="dm-picks"></div></div>`;
  $('stage').appendChild(w); return w; }
function dmShow(script,done,opt){ opt=opt||{}; const w=dmEl(); DM={q:script.slice(),done,busy:false,keep:!!opt.keep,cls:opt.cls||'mia'};   /* 23.11 opt: who / sub (header), cls (bubble + window style), keep (no «Next», the window stays) */
  w.querySelector('.dm-head b').textContent=opt.who||DT('who'); w.querySelector('.dm-head small').textContent=opt.sub||DT('after'); w.dataset.who=opt.cls||'mia';
  { const n=w.querySelector('.dm-note'); if(n) n.hidden=true; }
  w.querySelector('.dm-log').innerHTML=''; w.querySelector('.dm-picks').innerHTML=''; w.hidden=false; dmStep(); }
function dmBubble(cls,text){ const log=$('dmWin').querySelector('.dm-log'); const b=document.createElement('div'); b.className='dm-b '+cls; b.textContent=text; log.appendChild(b); log.scrollTop=log.scrollHeight; return b; }
function dmStep(){ if(!DM) return; const w=$('dmWin'), picks=w.querySelector('.dm-picks'); picks.innerHTML='';
  const it=DM.q.shift();
  if(!it&&DM.keep){ const d=DM.done; DM=null; setTimeout(()=>d&&d(),300); return; }
  if(!it){ const b=document.createElement('button'); b.type='button'; b.className='pbtn dm-next'; b.textContent=DT('next');
    b.onclick=()=>{ w.hidden=true; const d=DM.done; DM=null; d&&d(); }; picks.appendChild(b); return; }
  if(it.mia!=null){ const t=dmBubble(DM.cls+' dm-typing',DT('typing'));
    const ms=Math.min(2200,700+String(it.mia).length*28);
    setTimeout(()=>{ t.classList.remove('dm-typing'); t.textContent=it.mia; SFX.click&&SFX.click(); setTimeout(dmStep,450); },ms); return; }
  if(it.pick){ for(const p of it.pick){ const b=document.createElement('button'); b.type='button'; b.className='dm-pick'; b.textContent=p.text;
      b.onclick=()=>{ picks.innerHTML=''; if(p.text!=='…') dmBubble('me',p.text); if(it.save) it.save(p.id); DM.q.unshift(...(p.then||[])); setTimeout(dmStep,500); };
      picks.appendChild(b); } } }

/* ---------------- Monday → Tuesday */
const DM_MON={ru:{
  hi:'спасибо за эфир, модер 🙏', catOk:'{cat} передаёт привет', catNo:'кот так и остался без имени, кстати 😅',
  mint:'чат сегодня милый был. mint_fern опять всех смешила — мы с ней ещё со школы дружим',
  so:'слушай…', qLight:'ты включал свет у окна, пока меня не было? я вернулась — а там горит',
  qKnock:'когда я вернулась, что-то стукнуло в окно. ты ничего не видел на камере?', qNone:'ты ничего странного не заметил, пока меня не было?',
  truth:'там кто-то стоял у окна', lieLight:'проверял, как работают лампы', lie:'ничего, тебе показалось', quiet:'…',
  rTruth1:'что?.. серьёзно?', rTruth2:'…ладно. спасибо, что сказал. страшно, но лучше знать',
  rLie:'фух. а я уже накрутила себя 😅', rQuiet:'модер? ты тут? …спишь, наверное',
  bye:'я ночью окно не открываю, если что. спокойной ночи 🌙' },
en:{
  hi:'thanks for the stream, mod 🙏', catOk:'{cat} says hi', catNo:'the cat still has no name, btw 😅',
  mint:'chat was sweet tonight. mint_fern kept everyone laughing again — we\'ve been friends since school',
  so:'hey…', qLight:'did you turn on the window light while i was away? i came back and it was on',
  qKnock:'when i came back something hit the window. did you see anything on camera?', qNone:'did you notice anything weird while i was away?',
  truth:'someone was standing at the window', lieLight:'i was testing the lamps', lie:'nothing, you imagined it', quiet:'…',
  rTruth1:'what?.. seriously?', rTruth2:'…okay. thanks for telling me. it\'s scary, but better to know',
  rLie:'phew. i was already freaking out 😅', rQuiet:'mod? you there? …asleep, probably',
  bye:'i don\'t open the window at night, just so you know. good night 🌙' }};
function dmMonday(done){ const L=DM_MON[LANG]||DM_MON.en, P=PROG.mon||{}, c=P.contact;
  const cat=P.cat?(P.cat[LANG]||P.cat.ru):null;
  const q=c==='light'?L.qLight:c==='knock'?L.qKnock:L.qNone;
  dmShow([{mia:L.hi},{mia:cat?L.catOk.replace('{cat}',cat):L.catNo},{mia:L.mint},{mia:L.so},{mia:q},
    {pick:[{id:'truth',text:L.truth,then:[{mia:L.rTruth1},{mia:L.rTruth2}]},
           {id:'lie',text:c==='light'?L.lieLight:L.lie,then:[{mia:L.rLie}]},
           {id:'quiet',text:L.quiet,then:[{mia:L.rQuiet}]}],
     save:id=>{ PROG.mon=PROG.mon||{}; PROG.mon.dm=id; try{ saveProg(); }catch(e){} }},
    {mia:L.bye}],done); }
