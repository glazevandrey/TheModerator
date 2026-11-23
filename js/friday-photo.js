"use strict";
/* Friday: the photo from the note is evidence the player studies himself (block D, 19.11).
   Capture (as before) → open → zoom → find the monitor (required) and the time stamp (optional) → ONE decision:
   send it to Mia or keep it. No other investigation systems on purpose: we test whether studying evidence is fun.
   States, F.ev:
     undefined - the note was never captured
     'saved'   - captured, never studied               → nothing is held against the player
     'found'   - the monitor was found, no decision     → counts as silence, but she never "knows" it
     'shown'   - sent to Mia                            → she learns, goes quiet, sits further from the window, stays wary
     'kept'    - studied and kept                       → she keeps chatting, unaware
   Mia never learns what the player did by magic: "nobody told me" is said only after she finds the photo herself.
   F.photoKnown stays the one flag for "she has seen the photo"; F.photoFrom says from where: 'mod' or 'self'. */
Object.assign(STR.ru,{
  px_evTitle:'Осмотри снимок: найди две странные детали',
  px_evFound:'Найдено: {n}/2',
  px_evHint:'Подсказка',
  px_evHint1:'Посмотри, что светится у неё за спиной.',
  px_evHint2:'И загляни в углы снимка.',
  px_evAsk:'Показать Мие этот снимок?',
  px_evShow:'Показать Мие',
  px_evShowSub:'Мия увидит фотографию',
  px_evKeep:'Оставить себе',
  px_evKeepSub:'Снимок останется только у тебя',
  px_evUndecided:'Решение не принято. Можно искать дальше или решить сейчас.',
  px_evZoom:'Нажми на снимок, чтобы приблизить; на деталь — чтобы отметить; в пустое место — отдалить.',
  fph_hint:'Нажми на снимок, чтобы приблизить. Присмотрись.',
  fph_hintZoom:'Приближено. Нажми на то, что кажется странным, или в пустое место, чтобы отдалить.',
  fph_hintLate:'Присмотрись к тому, что светится за её спиной.',
  fph_mon:'На мониторе — заставка «эфир окончен». Её снимали сразу после стрима, когда все разошлись. Снаружи, через стекло.',
  fph_time:'В углу время: 00:20. Сейчас ещё нет полуночи, а записка уже висит — снимок не сегодняшний. Он уже приходил.',
  fph_ask:'Что сделать с находкой?',
  fph_send:'Отправить Мие в личку', fph_sendSub:'она узнает. и будет знать, что ты рядом',
  fph_keep:'Оставить себе', fph_keepSub:'не пугать её посреди эфира',
  fph_sent:'Отправлено. Мия увидит, когда вернёшься к эфиру.',
  fph_kept:'Снимок остался у тебя.',
  fph_miaSee:'…это после эфира. я выключила стрим и сидела одна. а он стоял там',
  fph_miaSeeKnown:'я видела фото… но на мониторе «эфир окончен». он ждал, пока все уйдут',
  fph_miaYest:'и время… 00:20. это было не сегодня. он уже приходил',
  fph_police:'в полицию я уже ходила. им «пока ничего не случилось». а это для них — просто бумажка на окне',
  fph_miaThanks:'спасибо, что сказал, модер. только не уходи, ладно?',
  fph_miaNobody:'оно висело тут весь эфир… и никто мне не сказал?',
  fph_readKnown:'да, модер мне уже прислал. бумажка так и висит… к окну не подхожу',
  fph_noOpen:'открыть окно? нет. я знаю, что там',
  fri_dmPhotoMod:'модер... тот снимок, что ты прислал. я весь эфир чувствую, что он смотрит.',
  fri_wh_sent:'ты сам ей показал. теперь она держится только за тебя',
  fri_wh_kept:'ты всё рассмотрел — и промолчал. хорошо',
});
Object.assign(STR.en,{
  px_evTitle:'Study the photo: find two odd details',
  px_evFound:'Found: {n}/2',
  px_evHint:'Hint',
  px_evHint1:'Look at what is glowing behind her.',
  px_evHint2:'And check the corners of the photo.',
  px_evAsk:'Show Mia this photo?',
  px_evShow:'Show Mia',
  px_evShowSub:'Mia will see the photo',
  px_evKeep:'Keep it',
  px_evKeepSub:'The photo stays only with you',
  px_evUndecided:'No decision yet. Keep looking or decide now.',
  px_evZoom:'Click the photo to zoom in; a detail to mark it; an empty spot to zoom out.',
  fph_hint:'Click the photo to zoom in. Look closely.',
  fph_hintZoom:'Zoomed in. Click whatever looks wrong, or an empty spot to zoom out.',
  fph_hintLate:'Look at what is glowing behind her.',
  fph_mon:'The monitor shows the "stream ended" screen. It was taken right after the stream, when everyone had left. From outside, through the glass.',
  fph_time:"A time in the corner: 00:20. It isn't midnight yet and the note is already there — this photo is not from tonight. He has been here before.",
  fph_ask:'What do you do with it?',
  fph_send:'Send it to Mia in DMs', fph_sendSub:"she'll know. and she'll know you're here",
  fph_keep:'Keep it to yourself', fph_keepSub:"don't scare her in the middle of the stream",
  fph_sent:'Sent. Mia will see it when you go back to the stream.',
  fph_kept:'The photo stays with you.',
  fph_miaSee:"…that's after the stream. i ended it and sat there alone. and he stood there",
  fph_miaSeeKnown:'i saw the photo… but the monitor says "stream ended". he waited until everyone left',
  fph_miaYest:"and the time… 00:20. that wasn't tonight. he's been here before",
  fph_police:'i already went to the police. to them "nothing has happened yet". and this is just a note on a window',
  fph_miaThanks:"thank you for telling me, mod. just don't go anywhere, okay?",
  fph_miaNobody:'it hung there the whole stream… and nobody told me?',
  fph_readKnown:"yeah, the mod already sent it to me. the paper is still there… i'm staying away from the window",
  fph_noOpen:'open the window? no. i know what is out there',
  fri_dmPhotoMod:'mod... that photo you sent. the whole stream i feel him watching.',
  fri_wh_sent:'you showed her yourself. now she holds on only to you',
  fri_wh_kept:'you looked at it all — and said nothing. good',
});
Object.assign(FRI_SUM.ru,{
  evSaved:'Ты снял записку, но снимок не рассматривал.',
  evShown:'Ты рассмотрел снимок и отправил Мие → она узнала, что её снимали сразу после эфира, и отодвинулась от окна.',
  evKept:'Ты рассмотрел снимок и промолчал → Мия не знала, что её снимали сразу после эфира.',
  evKeptSelf:'Ты рассмотрел снимок и промолчал → позже Мия нашла фото сама: «и никто мне не сказал?»',
  evTime:'Ты заметил время на снимке: 00:20 — снимок не сегодняшний, он уже приходил.',
  realKnown:'Предупреждение mint_fern лишь подтвердило то, что Мия уже знала от тебя.',
  dmBReady:'В личке ты сказал «я слежу» → она успокоилась.' });
Object.assign(FRI_SUM.en,{
  evSaved:'You captured the note but never studied the photo.',
  evShown:'You studied the photo and sent it to Mia → she learned she was photographed right after a stream, and moved away from the window.',
  evKept:'You studied the photo and kept quiet → Mia never knew she was photographed right after a stream.',
  evKeptSelf:'You studied the photo and kept quiet → later Mia found it herself: "and nobody told me?"',
  evTime:'You noticed the time on the photo: 00:20 — not from tonight, he has been here before.',
  realKnown:"mint_fern's warning only confirmed what Mia already knew from you.",
  dmBReady:'In DMs you said "I\'m watching" → she calmed down.' });

/* the two things to find, in the photo's own 320×200 units (see render.js drawPhotoBack) */
const FPH_SPOTS={ mon:[209,76,278,129], time:[262,176,314,194] };   /* mon: the monitor on the author's photo (render.js drawPhoto) */
const FPH={ big:null, z:1, tz:1, cx:160, cy:100, tcx:160, tcy:100, raf:0, openAt:0, late:false };

function fphRender(){
  const cv=$('evidencePhoto'); if(!cv||!FPH.big) return; const c=cv.getContext('2d'), F=S&&S.fri;
  const k=FPH.big.width/320, sw=320/FPH.z, sh=200/FPH.z;
  const x0=Math.max(0,Math.min(320-sw,FPH.cx-sw/2)), y0=Math.max(0,Math.min(200-sh,FPH.cy-sh/2));
  c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,cv.width,cv.height);
  c.drawImage(FPH.big,x0*k,y0*k,sw*k,sh*k,0,0,cv.width,cv.height);
  /* found details get a soft ring, so the player sees what he has already noticed */
  if(F&&F.phFound) for(const id in F.phFound){ const [a,b,d,e]=FPH_SPOTS[id], s=cv.width/sw;
    c.strokeStyle='rgba(255,214,120,.85)'; c.lineWidth=2; c.setLineDash([6,4]);
    c.beginPath(); c.ellipse(((a+d)/2-x0)*s,((b+e)/2-y0)*s,(d-a)/2*s+4,(e-b)/2*s+4,0,0,7); c.stroke(); c.setLineDash([]); }
  FPH.view=[x0,y0,sw,sh];
}
function fphAnim(){
  FPH.raf=0; const e=.22; FPH.z+=(FPH.tz-FPH.z)*e; FPH.cx+=(FPH.tcx-FPH.cx)*e; FPH.cy+=(FPH.tcy-FPH.cy)*e;
  fphRender(); fphLate();
  const done=Math.abs(FPH.tz-FPH.z)<.01 && Math.abs(FPH.tcx-FPH.cx)<.1 && Math.abs(FPH.tcy-FPH.cy)<.1;
  if(!done || !$('evidenceViewer').hidden && !FPH.late) FPH.raf=requestAnimationFrame(fphAnim);
}
function fphKick(){ if(!FPH.raf) FPH.raf=requestAnimationFrame(fphAnim); }
function fphLate(){}   /* 22.11: no automatic nudge - the panel has a «Подсказка» button (fphPanel) */
function fphHit(px,py){ for(const id in FPH_SPOTS){ const [a,b,d,e]=FPH_SPOTS[id]; if(px>=a&&px<=d&&py>=b&&py<=e) return id; } return null; }
function fphClick(ev){
  const F=S&&S.fri; if(!F) return; const cv=$('evidencePhoto'), r=cv.getBoundingClientRect();
  const fx=(ev.clientX-r.left)/r.width, fy=(ev.clientY-r.top)/r.height; const [x0,y0,sw,sh]=FPH.view||[0,0,320,200];
  const px=x0+fx*sw, py=y0+fy*sh;
  if(FPH.tz<1.5){ FPH.tz=2.6; FPH.tcx=px; FPH.tcy=py; $('fphHint').textContent=T('fph_hintZoom'); cv.style.cursor='crosshair'; fphKick(); return; }
  const id=fphHit(px,py);
  if(id && !(F.phFound&&F.phFound[id])){ fphFind(id); return; }
  FPH.tz=1; FPH.tcx=160; FPH.tcy=100; $('fphHint').textContent=T('fph_hint'); cv.style.cursor='zoom-in'; fphKick();
}
function fphFind(id){
  const F=S.fri; F.pxHint=null; F.phFound=F.phFound||{}; F.phFound[id]=true; if(id==='time') F.phTime=true;
  friLog('ИГРОК нашёл на снимке: '+(id==='mon'?'монитор (её эфир)':'время 00:20'));
  stat('fri/photo/find/'+id); SFX.click&&SFX.click();
  if(id==='mon' && !F.ev || id==='mon' && F.ev==='saved') F.ev='found';
  fphPanel(); fphRender();
}
/* the text under the photo: what he found and, once the monitor is found, the one decision */
/* 22.11: two steps - «find two odd details · n/2» with a Hint button, then «Show Mia this photo?» with two equal buttons.
   Back keeps what was found: «no decision yet». */
function fphPanel(){ const F=S.fri, box=$('fphBox'); if(!box) return; const f=F.phFound||{}, n=(f.mon?1:0)+(f.time?1:0);
  let h=`<div class="px-ev1"><b>${esc(T('px_evTitle'))}</b><span class="px-evn">${esc(T('px_evFound',{n}))}</span>`+
    (n<2?`<button type="button" class="px-evh" data-pxh="1">${esc(T('px_evHint'))}</button>`:'')+`</div>`;
  h+=`<p class="fph-hint" id="fphHint">${esc(F.pxHint?T(F.pxHint):T('px_evZoom'))}</p>`;
  const finds=[]; if(f.mon) finds.push(T('fph_mon')); if(f.time) finds.push(T('fph_time'));
  if(finds.length) h+=`<ul class="fph-finds">${finds.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  if(f.mon && F.ev==='found') h+=`<div class="px-ev2"><b>${esc(T('px_evAsk'))}</b><div class="px-evb">
      <button type="button" data-fph="send">${esc(T('px_evShow'))}<small>${esc(T('px_evShowSub'))}</small></button>
      <button type="button" data-fph="keep">${esc(T('px_evKeep'))}<small>${esc(T('px_evKeepSub'))}</small></button></div><p class="px-evu">${esc(T('px_evUndecided'))}</p></div>`;
  else if(F.ev==='shown') h+=`<p class="fph-done">${esc(T('fph_sent'))}</p>`;
  else if(F.ev==='kept') h+=`<p class="fph-done">${esc(T('fph_kept'))}</p>`;
  box.innerHTML=h;
  box.querySelectorAll('[data-fph]').forEach(b=>b.onclick=()=>fphDecide(b.dataset.fph));
  const hb=box.querySelector('[data-pxh]'); if(hb) hb.onclick=()=>{ F.pxHint=!f.mon?'px_evHint1':'px_evHint2'; F.pxHintN=(F.pxHintN||0)+1; friLog('ИГРОК попросил подсказку на снимке'); fphPanel(); }; }
function fphDecide(c){
  const F=S.fri; if(F.ev!=='found') return;
  if(c==='send'){ F.ev='shown'; friLog('ИГРОК отправил снимок Мие'+(F.photoKnown?' (фото она уже видела — новое: эфир на мониторе)':'')); stat('fri/photo/send');
    F.phQ=[{at:S.t+.6,fn:fphReact}]; } /* the night is paused while the viewer is open: this fires right after it closes */
  else { F.ev='kept'; friLog('ИГРОК оставил снимок себе'); stat('fri/photo/keep'); }
  fphPanel();
}
/* what sending does, on the stream: she goes quiet, looks at the window, moves away from it, stays wary */
function fphReact(){
  const F=S.fri, knew=F.photoKnown;
  if(!knew){ F.photoKnown=true; F.photoFrom='mod'; friPanic(8,'модер прислал её фото со стекла'); }
  else friPanic(4,'на снимке её эфир — снимал во время стрима');
  F.wary=true; friFace('scared',4.5); miaFlinch(.7); miaLean(1.8,-.6,4,'win'); miaShy(.9);
  const t0=S.t, say=(dt,fn)=>F.phQ.push({at:t0+dt,fn});
  say(1.4,()=>{ mod2Say('fphSee',T(knew?'fph_miaSeeKnown':'fph_miaSee')); S.mia.lineT=S.t+2; friLog('Мия получила снимок: замолчала, смотрит на окно, отодвинулась'); });
  if(F.phTime) say(5.2,()=>{ friFace('anxious',3); miaLean(1.2,0,2.5,'win'); mod2Say('fphYest',T('fph_miaYest')); S.mia.lineT=S.t+2; });
  say(F.phTime?8.4:4.8,()=>{ fphPoliceAsk(); F.policeSaid=true; });
  say(F.phTime?12.4:8.8,()=>{ friFace('anxious',2.5); mod2Say('fphThanks',T('fph_miaThanks')); friLog('Мия: «спасибо, что сказал… не уходи»'); });
}
/* 22.11: the police line answers the chat, not the air: a viewer asks first, she answers ~3 s later */
function fphPoliceAsk(){ const F=S.fri; if(!F) return;
  pushMsg('normal','tinyenjoyer',LANG==='ru'?'мия, звони в полицию!!':'mia, call the police!!');
  F.phQ=(F.phQ||[]).concat([{at:S.t+3,fn:()=>mod2Say('fphPolice',T('fph_police'))}]); }
function fphTick(){
  const F=S.fri; if(!F) return;
  if(F.phQ&&F.phQ.length){ const q=F.phQ; F.phQ=[]; for(const x of q){ if(S.t>=x.at) x.fn(); else F.phQ.push(x); } }
  /* she found it herself after the player had studied it and kept quiet → the only place "nobody told me" can come from */
  if(F.photoKnown && !F.phSelfSeen){ F.phSelfSeen=true; if(!F.photoFrom) F.photoFrom='self';
    if(F.photoFrom==='self' && !F.policeSaid){ F.policeSaid=true; F.phQ=(F.phQ||[]).concat([{at:S.t+(F.ev==='kept'||F.ev==='found'?9:6),fn:fphPoliceAsk}]); } /* why she does not just call the police */
    if(F.photoFrom==='self' && (F.ev==='kept'||F.ev==='found')){ F.keptThenSelf=true; F.phQ=(F.phQ||[]).concat([{at:S.t+4.5,fn:()=>{ friFace('anxious',3); mod2Say('fphNobody',T('fph_miaNobody')); friLog('Мия нашла фото сама после того, как модер его рассмотрел и промолчал'); }}]); } }
}
/* a persistent small shift away from the window for the rest of the night (render.js adds it to her pose) */
function miaShy(dx){ if(typeof miaMo!=='function'||!miaMoOn()) return; miaMo().bx=dx; }

/* ---------------- hooks into what exists */
{ const capOld=evidenceCaptured; evidenceCaptured=function(){ capOld(); if(friOn()){ const F=FRS(); if(!F.ev) F.ev='saved'; } }; }
{ const openOld=evidenceOpen; evidenceOpen=function(){ openOld();
    const old=$('fphBox'); if(old) old.remove(); $('evidenceViewer').classList.remove('fph-on'); const cv=$('evidencePhoto'); cv.onclick=null; cv.style.cursor='';
    if(!friOn()||$('evidenceViewer').hidden) return;
    FPH.big=document.createElement('canvas'); FPH.big.width=1600; FPH.big.height=1000; drawPhoto(FPH.big);
    FPH.z=FPH.tz=1; FPH.cx=FPH.tcx=160; FPH.cy=FPH.tcy=100; FPH.openAt=performance.now(); FPH.late=false;
    cv.insertAdjacentHTML('afterend','<div id="fphBox" class="fph-box"></div>'); $('evidenceViewer').classList.add('fph-on'); cv.style.cursor='zoom-in'; cv.onclick=fphClick;
    fphPanel(); fphRender(); fphKick(); friLog('ИГРОК открыл снимок'); }; }
/* the notes button was bound to the old function itself (playtest-clarity.js): point it at the wrapper */
evidenceButton.onclick=()=>evidenceOpen();
{ const tickOld=friTick; friTick=function(dt){ tickOld(dt); fphTick(); }; }
/* she already knows from the mod: the warning confirms it, it does not send her to the window again */
{ const rrOld=friReadReal; friReadReal=function(m,aloud){ const F=FRS();
    if(F.photoFrom==='mod' && !F.warningRead){ F.warningRead=true; F.truthSure=!!aloud; F.wary=true; friFace('anxious',3); later(()=>mod2Say('fphReadKnown',T('fph_readKnown')),300); friLog('Мия прочла mint_fern — фото она уже знает от модера'); return; }
    rrOld(m,aloud); }; }
{ const rfOld=friReadFake; friReadFake=function(m,aloud){ const F=FRS();
    if(F.photoFrom==='mod' && !F.fakeRead && !F.truthSure){ F.fakeRead=true; friPanic(3,'«открой окно» — но она уже знает про фото'); friFace('anxious',3); mod2Say('fphNoOpen',T('fph_noOpen')); friLog('Мия НЕ открывает окно: фото она уже видела'); return; }
    rfOld(m,aloud); }; }
{ const sOld=friStory2; friStory2=function(){ const out=sOld(), F=S.fri, L=FRI_SUM[LANG]||FRI_SUM.en;
    /* "no head start" is wrong when she was ready anyway (e.g. she knew about the photo) */
    { const j=out.indexOf(L.dmB); if(j>=0 && !F.finScared && !F.wrap) out[j]=L.dmBReady; }
    if(F.photoFrom==='mod'){ const j=out.findIndex(x=>x===L.realWeak||x===L.realPin||x===L.doubt); if(j>=0) out[j]=L.realKnown; }
    if(F.ev==='shown'){ const i=out.indexOf(L.photo); if(i>=0) out.splice(i,1); out.push(L.evShown); }
    else if(F.ev==='kept'||F.ev==='found') out.push(F.keptThenSelf?L.evKeptSelf:L.evKept);
    else if(F.ev==='saved') out.push(L.evSaved);
    if(F.phTime) out.push(L.evTime);
    return out; }; }
