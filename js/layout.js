"use strict";
/* THE MODERATOR — the desktop screen (layout C, 22.11.2026; the author's mock-up + the analyst's notes).
   The interface answers three questions at any moment: what is happening, what can I check or do, how does Mia react.
     · the video is big; «Записать» sits in its corner, the night's clips counter next to it, viewers top-left;
     · one line under the video: Mia's state in words over a thin three-part panic bar (no percent), the current task on the right;
     · chat: clean lines; hover → a small «Бан»; click → the line stays selected, «Показать Мие» appears left of «Бан»;
     · room: three zones in a strip, NORMAL / BRIGHT; heat only in the endless shift;
     · smart home: four slots always; the ones this night has not opened are locked with «?»; donation only in the endless shift.
   Hints appear next to their element, one at a time (tip() in ui.js calls hintAt).
   Styles: css/layout.css. This file replaced the prototype modules v2/pass, v2/calm, v2/ui/layout-c (22.11 fold). */

const LAY={ tip:null, tipQ:[], tipUntil:0, tutTask:'', tutStep:'', mia:'', trust:-1, trustKey:null, banLbl:null };

/* ---------------- tools of a night (campaign); nights not reworked yet keep every tool; Friday has its own «off» list */
const LAY_TOOLS={ mon:['blinds'], tue:['blinds'] };
function nightTools(){ if(!S) return []; const N=S.night;
  let t = N.endless ? ['blinds','dog','steps','alarm','donate'] : (LAY_TOOLS[N.key] || ['blinds','dog','steps','alarm']);
  if(N.off) t=t.filter(k=>!N.off.includes(k));
  return t; }
function toolOpen(k){ return nightTools().includes(k); }

/* ---------------- hints next to their element */
const HINT_AT={ red:'lamp', dim:'lamp', light:'lamp', heat:'lamp', hot:'lamp', surge:'lamp', breaker:'lamp', max:'lamp', adapt:'lamp', frame:'lamp', decoy:'lamp',
  heatCamp:'lamp', blindsHeat:'#shBlinds', closet:'#lamp-closet', donate:'#actDonate', away:'#video', creepy:'#video', first:'lamp', nw:'.mod.lighting',
  windowEvidence:'#lamp-window', evidenceCaptured:'#lcClips', recdone:'#actRec', routeB:'#lamp-door', tox:'#lcTox' };
function hintTarget(key){ const id=key&&String(key).replace(/^tip_?/,''); let sel=HINT_AT[id];
  if(id==='creepy'){ const r=[...list.querySelectorAll('.msg.stalker:not(.deleted)')].pop(); if(r) return r; }   /* «это писал не зритель» - by his line */
  if(sel==='lamp'){ const z=S&&S.st&&STAGE_LAMP&&STAGE_LAMP[S.st.stage]; sel=z?'#lamp-'+z:'.mod.lighting'; }
  return document.querySelector(sel||'#video'); }
function hintAt(text,anchor,o={}){ LAY.tipQ=LAY.tipQ.filter(q=>q.text!==text); LAY.tipQ.push({text,anchor,step:o.step,ttl:o.ttl||7,keep:!!o.keep,tut:!!o.tut}); if(o.now) hintNext(true); }
function hintNext(force){ const el=document.getElementById('clTip'); if(!el) return;
  if(!force && LAY.tip && (LAY.tip.keep || performance.now()<LAY.tipUntil)) return;
  LAY.tip=LAY.tipQ.shift()||null; if(!LAY.tip){ el.hidden=true; return; }
  el.innerHTML=(LAY.tip.step?`<small>${esc(LAY.tip.step)}</small>`:'')+esc(LAY.tip.text); el.hidden=false; LAY.tipUntil=performance.now()+LAY.tip.ttl*1000; hintPlace(); }
function hintClear(){ LAY.tip=null; LAY.tipQ.length=0; const el=document.getElementById('clTip'); if(el) el.hidden=true; }
/* above the target if there is room, else below; never over it */
function hintPlace(){ const el=document.getElementById('clTip'); if(!el||el.hidden||!LAY.tip) return;
  let a=LAY.tip.anchor; if(typeof a==='function') a=a(); if(!a||!a.isConnected){ el.style.visibility='hidden'; return; }
  const st=document.getElementById('stage').getBoundingClientRect(), k=st.width/document.getElementById('stage').offsetWidth||1;
  const r=a.getBoundingClientRect(), w=el.offsetWidth*k, h=el.offsetHeight*k;
  let x=Math.max(st.left+6, Math.min(st.right-w-6, r.left+r.width/2-w/2)), y=r.top-h-10, below=false;
  const low=r.top+r.height/2>st.top+st.height*.5;                    /* lower panels: under them, so the picture stays clear */
  if(y<st.top+6 || (low && r.bottom+10+h<st.bottom-4)){ y=r.bottom+10; below=true; }
  el.classList.toggle('below',below); el.style.left=((x-st.left)/k)+'px'; el.style.top=((y-st.top)/k)+'px';
  el.style.setProperty('--ax',((r.left+r.width/2-x)/k)+'px'); el.style.visibility='visible'; }

/* ---------------- the task line under the video: one task, set by events */
function taskNow(){ if(!S) return {t:'',s:''}; const F=S.fri, R=LANG==='ru';
  { const k=(typeof monTask==='function'&&monTask())||(typeof tueTask==='function'&&tueTask()); if(k) return k; }
  if(F&&F.pre) return {t:LAY.tutTask||(R?'Обучение':'Tutorial'), s:LAY.tutStep||''};
  if(F){ if(F.ev==='shown') return {t:R?'Снимок у Мии':'Mia has the photo', s:'', ev:1};
    if(F.ev==='kept') return {t:R?'Снимок у тебя':'You kept the photo', s:'', ev:1};
    if(S.ev.noteRec) return {t:R?'Рассмотри снимок':'Examine the photo', s:F.ev==='found'?(R?'решение не принято':'no decision yet'):'', ev:1};
    if(S.ev.note){ const look=!S.blinds.closed && lampMode('window')==='BOOST';
      return look?{t:R?'Запиши момент':'Record the moment', s:R?'кнопка ЗАПИСАТЬ МОМЕНТ · R':'RECORD MOMENT · R'}
                 :{t:R?'Осмотри окно':'Look at the window', s:R?'что-то шлёпнуло по стеклу':'something hit the glass'}; } }
  return {t:R?'Следи за комнатой':'Watch the room', s:R?'тролли — бан':'trolls — ban'}; }

/* ---------------- Mia in words */
const LAY_TXT={
  ru:{ calm:'спокойна', tense:'напряжена', edge:'на пределе', t3:'доверяет тебе', t2:'немного сомневается', t1:'сомневается в тебе', t0:'не слушает тебя',
       mia:'Мия', task:'ЗАДАЧА', ev:'Улика', clips:'клипы ночи', rec:'Записать', chat:'Чат эфира', tox:'Токсичность', later:'Откроется позже',
       tip_t2:'Мия немного сомневается в тебе', tip_t1:'Мия сомневается в тебе', tip_t0:'Мия больше не слушает тебя', tip_edge:'Мия на пределе',
       show:'Показать Мие', read:'Уже прочитано', pinned:'Мия прочтёт первым', ban:'Бан', f_read:'Мия уже прочитала', f_pinned:'Мия и так прочтёт первым',
       trust:'Доверие', idleTask:'Следи за комнатой', sh_open:'Открыты', sh_closed:'Закрыты', sh_closedT:'Закрыты · {n} с', sh_jam:'Заело', sh_ready:'Готово', sh_cd:'Повтор через {n} с', clipsTip:'Сохранённые моменты' },
  en:{ calm:'calm', tense:'tense', edge:'at her limit', t3:'trusts you', t2:'a little unsure of you', t1:'doubts you', t0:'stopped listening to you',
       mia:'Mia', task:'TASK', ev:'Evidence', clips:'clips tonight', rec:'Record', chat:'Stream chat', tox:'Toxicity', later:'Unlocks later',
       tip_t2:'Mia is a little unsure of you', tip_t1:'Mia doubts you', tip_t0:'Mia stopped listening to you', tip_edge:'Mia is at her limit',
       show:'Show Mia', read:'Already read', pinned:'Mia reads it first', ban:'Ban', f_read:'Mia already read it', f_pinned:'Mia will read it first anyway',
       trust:'Trust', idleTask:'Watch the room', sh_open:'Open', sh_closed:'Closed', sh_closedT:'Closed · {n} s', sh_jam:'Jammed', sh_ready:'Ready', sh_cd:'Again in {n} s', clipsTip:'Saved moments' } };
const LT=k=>(LAY_TXT[LANG]||LAY_TXT.en)[k];
function miaMood(){ const p=S.panic; return p>=70?'edge':p>=35?'tense':'calm'; }
function trustKey(){ if(S.distrust||S.trust<=0) return 't0'; const r=S.trust/(S.maxTrust||3); return r>=.99?'t3':r>=.6?'t2':'t1'; }

/* ---------------- chat line actions: «Показать Мие» (selected line, mod2 nights) + «Бан» (hover / selected) */
function msgActions(m){ if(m.type==='sys'||m.type==='donation') return '';
  return `<span class="cl-act"><button type="button" data-px="pin" class="cl-show">${esc(LT('show'))}</button><button type="button" data-px="ban" class="cl-ban">${esc(LT('ban'))}</button></span>`; }
/* «Показать Мие» on a line she already read does nothing for the scene: the button goes inactive */
function showState(m){ const g=S&&S.m2; if(!m) return 'ok'; if(g&&g.pinned===m.id&&!g.pinnedReadAt) return 'pinned'; return m.st==='read'?'read':'ok'; }
function showBtnTick(){ if(!S||S.selected==null) return; const b=document.querySelector('.msg.sel .cl-show'); if(!b) return;
  const st=showState(S.chat.find(x=>x.id===S.selected)), tx=LT(st==='ok'?'show':st);
  if(b.textContent!==tx) b.textContent=tx; b.disabled=st!=='ok'; b.classList.toggle('lc-off',st!=='ok'); }
/* one quiet mark on the next line she reads */
function nextMarkTick(){ if(!S||!list) return; const on=mod2On()&&S.running;
  let first=null; if(on){ const {ids}=mod2NextSet(); const c=S.chat.filter(m=>ids.has(m.id)); c.sort((a,b)=>(b.id===S.m2.pinned)-(a.id===S.m2.pinned)||(a.feedAt||0)-(b.feedAt||0)); first=c[0]?c[0].id:null; }
  const stop=MOD2K.paused||(S.mia&&S.mia.awayT>0);
  list.querySelectorAll('.msg').forEach(el=>{ el.classList.toggle('cl-next',+el.dataset.id===first && !stop); }); }

/* ---------------- the screen: built once from the game's own elements (ids stay, the guide and hotkeys find them) */
function layoutBoot(){
  const $q=s=>document.querySelector(s);
  const video=$('video'), stream=$('streamPanel'), chat=$('chat');
  /* video corner: record + clips; viewers top-left; the donation under them (endless shift only) */
  const rec=$('actRec'); if(rec) video.appendChild(rec);
  /* 23.11 (reference): no bezel under the screen on desktop - pause and sound live in the stream header, the language is in the pause card */
  if(!(typeof MOBILE!=='undefined'&&MOBILE)){ const mb=$('muteBtn'), p2=$('pauseBtn2');
    if(mb&&p2){ mb.classList.add('iconkey','hd-mute'); p2.after(mb); } document.documentElement.classList.add('noBezel'); }
  const clips=document.createElement('button'); clips.type='button'; clips.id='lcClips'; clips.innerHTML='<svg class="i"><use href="#i-clap"/></svg><b>0</b>';
  clips.dataset.n='0'; clips.onclick=()=>clipsOpen();   /* the clapperboard is explained by its tooltip */ video.appendChild(clips);
  const vw=document.createElement('div'); vw.id='lcViewers'; vw.innerHTML='<svg class="i"><use href="#i-eye"/></svg><b>0</b>'; video.appendChild(vw);
  const dn=$('actDonate'); if(dn) video.appendChild(dn);
  /* the line under the video */
  const bar=document.createElement('div'); bar.id='lcBar';
  bar.innerHTML=`<div id="lcMia"><span class="lc-dot"></span><b class="lc-who"></b> <span class="lc-st"></span><span class="lc-sep">·</span><span class="lc-tr"></span>
      <div class="lc-pan"><i class="lc-z1"></i><i class="lc-z2"></i><i class="lc-z3"></i><em></em></div></div>
    <div id="lcTask"><small></small><span class="lc-t"></span><span class="lc-s"></span><button type="button" class="lc-ev" hidden></button></div>`;
  bar.querySelector('.lc-ev').onclick=()=>evidenceOpen();
  /* 23.11 (reference): no line under the video - Mia's mood is a small pill in the camera, the task shows up briefly
     when it changes (and stays while there is evidence to open), trust and toxicity sit at the bottom of the chat */
  video.appendChild(bar.querySelector('#lcMia')); video.appendChild(bar.querySelector('#lcTask'));
  if(rec){ const sm=rec.querySelector('small'); if(sm) sm.textContent='R'; const st=rec.querySelector('.i.st use'); if(st) st.setAttribute('href','#i-cam'); }
  /* chat: toxicity at the bottom, HC there too in the endless shift */
  const foot=document.createElement('div'); foot.id='lcChatFoot';
  const tox=$('toxbar'); if(tox){ tox.hidden=true; foot.appendChild(tox); }   /* still updated by ui.js, shown as the row below */
  const stats=document.createElement('div'); stats.id='lcStats';
  stats.innerHTML='<span id="lcTrust" tabindex="0"><svg class="i"><use href="#i-shield"/></svg><span class="tl"></span><span class="segs"></span></span><i class="dv"></i><span id="lcTox"><span class="tl"></span><b></b></span>';
  foot.appendChild(stats);
  const sp=document.createElement('span'); sp.className='sp'; foot.appendChild(sp);
  const coin=$q('.trustrow .coin'), hc=$('hcval'); if(coin) foot.appendChild(coin); if(hc) foot.appendChild(hc);
  chat.appendChild(foot);
  /* smart home: the blinds join the tools */
  const sh=$q('.smarthome .shbtns'), bl=$('actBlinds'); if(sh&&bl) sh.insertBefore(bl,sh.firstChild);
  /* the hint bubble */
  { const pc=$q('#ovPause .pausecard .sub'); if(pc){ const t=document.createElement('p'); t.id='pcTask'; t.className='pctask'; t.hidden=true; pc.after(t); } }
  const tipEl=document.createElement('div'); tipEl.id='clTip'; tipEl.hidden=true; $('stage').appendChild(tipEl);
  const cv=document.createElement('div'); cv.id='clipsView'; cv.hidden=true; video.appendChild(cv);   /* centred on Mia's screen */
  addEventListener('resize',()=>{ capPlace(); hintPlace(); });
  setInterval(layoutTick,100);
}

/* ---------------- the night's clips: recorded → counter → list → one clip big → (the note) the evidence viewer.
   The night stops while it is open, like the evidence viewer. */
const CLIPS_TXT={ru:{title:'Клипы этой ночи', none:'Пока ничего не записано. «Записать» — в углу видео (R).', in:'в кадре', empty:'ничего особенного',
    note:'записка на окне', read:'📄 Прочитать записку', photo:'🔍 Рассмотреть снимок', back:'← ко всем клипам', close:'Закрыть'},
  en:{title:'Clips tonight', none:'Nothing recorded yet. «Record» is in the video corner (R).', in:'in frame', empty:'nothing special',
    note:'the note on the window', read:'📄 Read the note', photo:'🔍 Inspect the photo', back:'← all clips', close:'Close'}};
const CT=k=>(CLIPS_TXT[LANG]||CLIPS_TXT.en)[k];
let clipsWasRunning=false;
function clipLabel(c){ return c.kind==='note'?T('zl_window'):(c.label||CT('empty')); }   /* neutral in the list: the player finds the note in the open clip */
function clipsRender(i){ const box=$('clipsView'), L=(S&&S.clips)||[];
  let h=`<div class="cv-head"><b>${esc(CT('title'))}</b><button type="button" class="cv-x" data-cv="close">${esc(CT('close'))}</button></div>`;
  if(i!=null && L[i]){ const c=L[i];
    h+=`<div class="cv-big${c.kind==='yard'?' cv-zoomable':''}">${c.img?`<div class="cv-imgw"><img src="${c.img}" alt=""></div>`:''}`+
      (c.kind==='yard'?`<p class="cv-find${S.tue&&S.tue.found?' ok':''}">${esc(T(S.tue&&S.tue.found?'tue_clipFound':'tue_clipHint'))}</p>`:'')+
      `<p><b>${esc(c.clock)}</b> · ${esc(CT('in'))}: ${esc(clipLabel(c))}</p>`+
      (c.kind==='note'&&S.ev.noteRec?`<button type="button" class="pbtn" data-cv="ev">${esc(CT(S.night.key==='fri'?'photo':'read'))}</button>`:'')+
      `<button type="button" class="cv-back" data-cv="list">${esc(CT('back'))}</button></div>`; }
  else if(!L.length) h+=`<p class="cv-none">${esc(CT('none'))}</p>`;
  else h+=`<div class="cv-list">`+L.map((c,k)=>`<button type="button" class="cv-item" data-cv="${k}">${c.img?`<img src="${c.img}" alt="">`:'<i></i>'}<span><b>${esc(c.clock)}</b><small>${esc(CT('in'))}: ${esc(clipLabel(c))}</small></span></button>`).join('')+`</div>`;
  box.innerHTML=h;
  { const im=box.querySelector('.cv-zoomable img'); if(im) im.onclick=e=>tueClipClick(im,e); }   /* the yard frame: zoom and find the detail */
  box.querySelectorAll('[data-cv]').forEach(b=>b.onclick=()=>{ const a=b.dataset.cv;
    if(a==='close') clipsClose(); else if(a==='list') clipsRender(null);
    else if(a==='ev'){ clipsClose(false); evidenceOpen(); } else clipsRender(+a); }); }
function clipsOpen(){ if(!S||S.over||!$('clipsView').hidden) return; LAY.clipsSeen=(S.clips||[]).length;   /* 23.11: opening the archive stops the «new clip» pulse */
  clipsWasRunning=S.running; if(clipsWasRunning){ setPause(true); $('ovPause').hidden=true; }
  const L=S.clips||[]; clipsRender(L.length===1?0:null); $('clipsView').hidden=false; }
function clipsClose(resume=true){ const v=$('clipsView'); if(v.hidden) return; v.hidden=true;
  if(clipsWasRunning){ clipsWasRunning=false; if(resume) setPause(false); else paused=false; } }
addEventListener('keydown',e=>{ const v=$('clipsView'); if(!v||v.hidden) return; if(e.key==='Escape'){ e.preventDefault(); e.stopImmediatePropagation(); clipsClose(); } },true);

/* subtitles: a fixed band over the desk */
function capPlace(){ const v=$('video'), c=$('prsCap'); if(!v||!c) return;
  if(c.parentElement!==v.parentElement) return; c.style.top=(v.offsetTop+v.offsetHeight-58)+'px'; c.style.left=v.offsetLeft+'px'; c.style.width=v.offsetWidth+'px'; }

function layoutTick(){ try{
  document.documentElement.classList.toggle('clm-m2',!!(S&&mod2On()));
  /* 23.11: on desktop Mia's subtitles live in their own strip under the camera (a grid cell), not over the picture */
  { const pc=$('prsCap'), sc=$('screen'); if(pc&&sc&&!(typeof MOBILE!=='undefined'&&MOBILE)&&document.documentElement.classList.contains('noBezel')&&pc.parentElement!==sc){ sc.appendChild(pc); pc.removeAttribute('style'); } }
  capPlace(); showBtnTick(); nextMarkTick();
  /* the ban label follows a language switch */
  const bl=LT('ban'); if(LAY.banLbl!==bl){ LAY.banLbl=bl; document.querySelectorAll('#chatlist .cl-ban').forEach(b=>{ b.textContent=bl; }); }
  /* the Friday tutorial bubble goes away with the tutorial */
  if(LAY.tip&&LAY.tip.tut&&!(S&&S.fri&&S.fri.pre)) hintClear();
  hintNext(false); hintPlace();
  if(!S) return;
  /* video corner */
  const vw=document.querySelector('#lcViewers b'); if(vw){ const v=(S.viewers|0).toLocaleString(LANG==='ru'?'ru-RU':'en-US'); if(vw.textContent!==v) vw.textContent=v; }
  const cl=$('lcClips'); if(cl){ const ct=LT('clipsTip'); if(cl.title!==ct){ cl.title=ct; cl.setAttribute('aria-label',ct); } const n=(S.clips||[]).length; const b=cl.querySelector('b'); if(b.textContent!==String(n)){ b.textContent=n; cl.dataset.n=n; } cl.classList.toggle('has',!!(S.ev&&S.ev.noteRec));  }
  const rb=$('actRec'); if(rb){ const l=rb.querySelector('b'); const t=LT('rec'); if(l&&l.textContent!==t&&!S.rec.active) l.textContent=t; rb.classList.toggle('on',S.rec.active>0); }
  /* Mia */
  const m=$('lcMia'); if(m){ const st=miaMood(), tk=trustKey();
    m.className=st+(tk==='t1'||tk==='t2'?' doubt':tk==='t0'?' lost':'');
    m.querySelector('.lc-who').textContent=LT('mia'); m.querySelector('.lc-st').textContent=LT(st); m.querySelector('.lc-tr').textContent=LT(tk);
    const tr=$('lcTrust'); if(tr){ const max=Math.max(1,S.maxTrust||3), n=Math.max(0,Math.min(max,S.trust|0)), sg=tr.querySelector('.segs');
      if(sg.childElementCount!==max) sg.innerHTML='<i></i>'.repeat(max);
      [...sg.children].forEach((x,i)=>x.classList.toggle('on',i<n&&!S.distrust));
      tr.querySelector(".tl").textContent=LT('trust'); const tt=LT('mia')+' '+LT(tk); if(tr.title!==tt){ tr.title=tt; tr.setAttribute('aria-label',LT('trust')+': '+tt); }
      tr.className=tk; }
    const tx=$('lcTox'); if(tx){ tx.querySelector(".tl").textContent=LT('tox'); const v=Math.round(S.tox||0)+'%'; const b=tx.querySelector('b'); if(b.textContent!==v) b.textContent=v;
      tx.classList.toggle('hot',S.tox>TOX.half); tx.classList.toggle('crit',S.tox>80); }
    m.querySelector('.lc-pan em').style.width=Math.min(100,Math.max(0,S.panic)).toFixed(1)+'%';
    if(S.running && S.t>2){
      if(LAY.trust>=0 && tk!==LAY.trustKey && tk!=='t3') hintAt(LT('tip_'+tk),()=>$('lcTrust'),{ttl:3.5,now:true});
      if(st==='edge' && LAY.mia!=='edge') hintAt(LT('tip_edge'),()=>$('lcMia'),{ttl:3,now:true});
    }
    LAY.trustKey=tk; LAY.trust=S.trust; LAY.mia=st; }
  /* the task line */
  const tb=$('lcTask'); if(tb){ const k=taskNow(), key=k.t+'|'+k.s;
    if(tb.dataset.k!==key){ const fresh=!!tb.dataset.k; tb.dataset.k=key; tb.querySelector('small').textContent=LT('task');
      tb.querySelector('.lc-t').textContent=k.t; tb.querySelector('.lc-s').textContent=k.s||''; if(fresh){ tb.classList.remove('new'); void tb.offsetWidth; tb.classList.add('new'); }
      LAY.taskText=k.t; }
    const ev=tb.querySelector('.lc-ev'); ev.hidden=!k.ev; if(k.ev) ev.textContent=LT('ev');
    { const r=$('actRec'); if(r){ const want=!!k.rec&&S.rec.active<=0&&S.rec.cd<=0; if(r.classList.contains('lc-pulse')!==want) r.classList.toggle('lc-pulse',want); } }
    { const cl=$('lcClips'), n=(S.clips||[]).length; if(LAY.clipsNight!==S.night.key){ LAY.clipsNight=S.night.key; LAY.clipsSeen=n; }
      if(cl){ const nw=n>(LAY.clipsSeen||0); if(cl.classList.contains('lc-new')!==nw) cl.classList.toggle('lc-new',nw); } }
    const on=!!k.ev||(!!k.t&&k.t!==LT('idleTask'));   /* 23.11: one line for as long as the tutorial / scripted task lasts */ if(tb.classList.contains('on')!==on) tb.classList.toggle('on',on);
    const pt=$('pcTask'); if(pt){ const tx=k.t&&k.t!==LT('idleTask')?LT('task')+': '+k.t+(k.s?' — '+k.s:''):''; if(pt.textContent!==tx) pt.textContent=tx; pt.hidden=!tx; } }
  /* chat head */
  const ch=document.querySelector('#chat .chathead b'); if(ch&&ch.textContent!==LT('chat')) ch.textContent=LT('chat');
  /* smart home: every slot is on screen; the ones this night has not opened yet are locked with «?» */
  const tools=nightTools(), map={blinds:'actBlinds',dog:'actDog',steps:'actSteps',alarm:'actAlarm',donate:'actDonate'};
  for(const k in map){ const b=$(map[k]); if(!b) continue;
    if(k==='donate'){ const show=!!(S.night.endless); if(b.hidden===show) b.hidden=!show; continue; }
    if(b.hidden) b.hidden=false;
    const lock=!tools.includes(k); b.classList.toggle('lc-locked',lock); if(lock) b.disabled=true; else if(b.dataset.lcLock==='1') b.disabled=false;
    b.dataset.lcLock=lock?'1':'0'; const tip=lock?LT('later'):''; if(b.title!==tip){ b.title=tip; if(lock){ b.dataset.tip=tip; b.setAttribute('aria-label',tip); } else { delete b.dataset.tip; b.removeAttribute('aria-label'); } } }
  { const mb=$('muteBtn'); if(mb&&typeof A!=='undefined'){ const t=T(A.muted?'soundOff':'soundOn'); mb.classList.toggle('muted',!!A.muted); if(mb.getAttribute('aria-label')!==t){ mb.setAttribute('aria-label',t); mb.title=t; } } }
  { const st=$('stage'), m=$('ovMenu'); if(st&&m){ const g=m.hidden; if(st.classList.contains('ingame')!==g) st.classList.toggle('ingame',g); } }   /* menu keeps the global vignette/grain */
  for(const z of ['window','closet','door']){ const c=$('lamp-'+z), L=S.lamps&&S.lamps[z]; if(!c||!L) continue; const zero=!L.burned&&L.heat<.5; if(c.classList.contains('h0')!==zero) c.classList.toggle('h0',zero); }
  /* heat bar colour: lilac while mild, amber over 60 (blinds hint threshold), coral over 80 (.hot from ui.js) */
  for(const z of ['window','closet','door']){ const c=$('lamp-'+z), L=S.lamps&&S.lamps[z]; if(!c||!L) continue;
    c.classList.toggle('bp-hot',L.heat>60&&L.heat<=80); }   /* over 80 the game itself sets .hot */
  /* the status line under each tool name (author's reference): blinds open / closed / jammed, the others ready or a countdown */
  for(const [k,id] of [['blinds','actBlinds'],['dog','actDog'],['steps','actSteps'],['alarm','actAlarm']]){ const b=$(id); if(!b) continue;
    let st=b.querySelector('.shs'); if(!st){ st=document.createElement('span'); st.className='shs'; b.appendChild(st); }
    let tx, cd=false;
    if(k==='blinds'){ const B=S.blinds; if(B.jammed) tx=LT('sh_jam'); else if(B.cd>0&&!B.closed){ cd=true; tx=LT('sh_cd').replace('{n}',Math.ceil(B.cd)); } else if(B.closed&&B.timer>0&&B.timer<100) tx=LT('sh_closedT').replace('{n}',Math.ceil(B.timer)); else tx=LT(B.closed?'sh_closed':'sh_open'); }
    else { const c=S.sh[k]||0; cd=c>0; tx=cd?LT('sh_cd').replace('{n}',Math.ceil(c)):LT('sh_ready'); }
    if(b.classList.contains('lc-locked')){ tx=LT('later'); cd=false; }   /* 23.11: locked tools show their name dimmed + «unlocks later» */
    if(st.textContent!==tx) st.textContent=tx; b.classList.toggle('sh-cd',cd); b.classList.toggle('sh-jam',k==='blinds'&&!!S.blinds.jammed); }
}catch(e){ console.warn(e); } }

/* ---------------- a nick → a card with this viewer's recent messages on this stream (tells mint_fern from her look-alike) */
function nickCard(u,x,y){ let c=document.getElementById('pxCard'); if(!c){ c=document.createElement('div'); c.id='pxCard'; document.body.appendChild(c); }
  const own=S.chat.filter(m=>m.user===u&&!m.banned&&m.type!=='sys').slice(-4);
  c.innerHTML=`<b>${esc(u)}</b><small>${LANG==='ru'?'последние сообщения в этом эфире':'recent messages on this stream'}</small>`+(own.length?own.map(m=>`<p>${esc(m.text)}</p>`).join(''):`<p class="e">${LANG==='ru'?'— пока ничего':'— nothing yet'}</p>`);
  c.style.left=Math.min(innerWidth-300,x+12)+'px'; c.style.top=(y+26)+'px'; c.hidden=false; }
list.addEventListener('mouseover',e=>{ const u=e.target.closest('.px-u'); if(!u||!S) return; const r=u.getBoundingClientRect(); nickCard(u.textContent,r.right,r.top); });
list.addEventListener('mouseout',e=>{ if(e.target.closest('.px-u')){ const c=document.getElementById('pxCard'); if(c) c.hidden=true; } });

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(layoutBoot,30)); else setTimeout(layoutBoot,30);
