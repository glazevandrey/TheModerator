"use strict";
/* ======================= MODERATION v2 (Steam, Friday slice) =======================
   Active only on nights with `mod2:true` (see NIGHTS in state.js); every other night keeps the old rules.
   - The moderator's filter holds a message for `hold` seconds when its TEXT has a trigger word.
     The rule is the same for everyone (viewers, trolls, Stranger_99, imitators). Only the
     `exempt` account ids of a night skip it (none on Friday); a look-alike nick is a different account.
   - Leaving the filter is not reading. Mia reads with glances every `glance` seconds;
     a message must sit in her feed `minFeed` seconds first (fairness), the pinned one goes first.
   - Player: Q pin (she reads it aloud at the next glance), E hide (viewers still see it), X ban.
     Hiding something she has already read: depends on what it was (see mod2Removed).
   Message states (m.st): held → feed → read; or hidden / banned. sys and donations: 'na'. */

const MOD2_TRIGGERS={
  ru:['окн','стекл','сзади','за спин','позади','обернис','оборачив','оглян','шкаф','двер','бумажк','записк','глаз','он здесь','он тут','снаружи','фото'],
  en:['window','glass','behind','turn around','closet','wardrobe','door','note','paper','eyes',"he's here",'outside','photo']
};
const MOD2_PER_GLANCE=3;

Object.assign(STR.ru,{
  m2_pin:'ПОКАЗАТЬ МИЕ', m2_hide:'СКРЫТЬ', m2_pinned:'МИЯ ПРОЧТЁТ', m2_pinWait:'Мия прочтёт первым и ответит', m2_pinDone:'Мия прочла вслух',
  m2_hiddenLbl:'скрыто от Мии · зрители видят', m2_glance:'МИЯ СМОТРИТ В ЧАТ',
  m2_hint:'Q · X', m2_foot:'Выбери сообщение: Q показать Мие · X бан',
  m2_st_held:'держит фильтр', m2_st_feed:'ждёт взгляда Мии', m2_st_read:'Мия прочла', m2_st_hidden:'скрыто от Мии', m2_st_na:'',
  m2_footSel:'{user} · {st}',
  m2_pinSay:'модер показывает… «{text}»', m2_noticed:'эй… куда делось сообщение? я же его видела',
  m2_noticedWarn:'стоп. кто-то удалил предупреждение? что там было?..',
  m2_warnSay:['что? где?..','чат, вы о чём?..','подождите… что там?']
});
Object.assign(STR.en,{
  m2_pin:'SHOW MIA', m2_hide:'HIDE', m2_pinned:'MIA WILL READ', m2_pinWait:'Mia reads it first and answers', m2_pinDone:'Mia read it aloud',
  m2_hiddenLbl:'hidden from Mia · viewers see it', m2_glance:'MIA IS READING CHAT',
  m2_hint:'Q · X', m2_foot:'Select a message: Q show Mia · X ban',
  m2_st_held:'held by the filter', m2_st_feed:'waiting for Mia to look', m2_st_read:'Mia read it', m2_st_hidden:'hidden from Mia', m2_st_na:'',
  m2_footSel:'{user} · {st}',
  m2_pinSay:'the mod is showing me… "{text}"', m2_noticed:'wait… where did that message go? i saw it',
  m2_noticedWarn:'hold on. did someone delete a warning? what did it say?..',
  m2_warnSay:['what? where?..','chat, what are you talking about?..','wait… what is it?']
});

const MOD2_DEBUG=/[?&]debug\b/.test(location.search);
function mod2On(){ return !!(S && S.night && S.night.mod2 && !S.tut.active); }
function mod2Cfg(){ const N=S.night; return {hold:N.hold||6, g0:(N.glance||[2,4])[0], g1:(N.glance||[2,4])[1], minFeed:N.minFeed||1.5, exempt:N.exempt||[]}; }
function mod2State(){ if(!S.m2) S.m2={glanceIn:rnd(1.5,3), flash:0, pinned:null, pinnedReadAt:0}; return S.m2; }
function mod2Trigger(text){ const t=String(text||'').toLowerCase(); return MOD2_TRIGGERS[LANG].some(w=>t.includes(w)) || MOD2_TRIGGERS.en.some(w=>t.includes(w)); }

/* called from pushMsg() for every new message */
function mod2Admit(m){
  if(!mod2On()) return;
  const c=mod2Cfg();
  if(m.type==='sys'||m.type==='donation'){ m.st='na'; }
  else if(S.night.filter!==false && !c.exempt.includes(m.acc||'') && mod2Trigger(m.text)){   /* the word filter: Friday on; the new Monday has none */ /* exemptions by account id (opts.acc), never by the shown nick */ m.st='held'; m.heldLeft=c.hold; }
  else { m.st='feed'; m.feedAt=S.t; }
  mod2Sync(m);
}

function mod2El(m){ return list.querySelector(`[data-id="${m.id}"]`); }
const MOD2_EYE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
function mod2Sync(m){
  const el=mod2El(m); if(!el||m.banned||el.classList.contains('deleted')) return;
  if(!el.querySelector('.m2eye') && m.st!=='na'){
    el.insertAdjacentHTML('beforeend',`<span class="m2eye" title="">${MOD2_EYE}</span>`);
    const b=el.querySelector('.body'); if(b) b.insertAdjacentHTML('beforeend','<span class="m2bar"><i></i></span><span class="m2hid"></span>');
  }
  for(const s of ['held','feed','read','hidden']) el.classList.toggle('m2-'+s, m.st===s);
  el.classList.toggle('m2-pinned', !!S.m2 && S.m2.pinned===m.id);
  const h=el.querySelector('.m2hid'); if(h) h.textContent = m.st==='hidden' ? T('m2_hiddenLbl') : '';
  if(m.st==='held') mod2Bar(m,el);
}
function mod2Bar(m,el){ const i=(el||mod2El(m))&&(el||mod2El(m)).querySelector('.m2bar i'); if(i) i.style.transform='scaleX('+clamp(m.heldLeft/mod2Cfg().hold,0,1).toFixed(3)+')'; }

/* what reading a message does to Mia (moved here from the old auto-read in chatTick) */
function mod2Effect(m,aloud){
  const st=S.st, mul=aloud?1.5:1;
  if(m.type==='stalker'){
    S.stats.readStalker=(S.stats.readStalker||0)+1; addPanic(8*mul);
    if(st.stage!=='hidden') st.p=Math.min(.95,st.p+.15); else st.wait=Math.max(.5,st.wait-4); /* her fear feeds him */
    if(!aloud) say('readcreep',T('m_creep',{text:m.text}),5);
  } else if(m.type==='troll'||m.type==='spam'){
    /* halved vs the old auto-read (4/7): she now reads a troll in 2-4 s instead of 9 s, so the old numbers punished twice as often */
    if(camp()) readTrollCost(mul*.6); else addPanic((S.tox>TOX.half?4:2)*mul);   /* 22.11: campaign - toxicity and sadness, not panic */
    if(!aloud) say('readtroll',T('m_troll'),12);
  } else if(m.warn){ /* a viewer's warning about the room: she looks where they point */
    addPanic(3); S.mia.look = m.warn==='window'?-1:m.warn==='door'?1:.4; S.mia.lookT=1.6;
    if(!aloud){ const w=TA('m2_warnSay'); say('warnread',w[(Math.random()*w.length)|0],10); }
  }
  if(aloud){ S.storyCaptionUntil=Math.min(S.storyCaptionUntil||0,S.t); mod2Say('m2pin',T('m2_pinSay',{text:m.text})); }
}

/* a pause in her talk: no caption on screen and no story line holding it */
function mod2FreeToTalk(){ return !(captionTimer>0) && !(S.storyCaptionUntil>S.t); }
/* something is visibly coming for her: she watches it, she does not read chat aloud (silent glances go on - that is how warnings reach her) */
function mod2Danger(){ const st=S.st; return S.scareT>0 || st.stage==='behind' || (st.stage!=='hidden' && st.p>.45); }

/* key moments: a story line, her question to the mod, a pinned message read aloud, a scripted caption.
   Her glances wait while she says it (at most 6 s for one moment), so she never «reads» a troll mid-sentence. */
const MOD2K={start:null, paused:false};
function mod2Talking(){ return typeof captionTimer!=='undefined' && captionTimer>0; }
function mod2KeyMoment(){ if(!S) return false;
  const ask=document.getElementById('friAsk'); if(ask&&!ask.hidden) return true;
  if(S.storyCaptionUntil>S.t) return true;
  return mod2Talking() && /^(fri|fbl|fph|m2pin|story|force)/.test(SAYK.key); }
/* the lines her NEXT glance takes (same rule as mod2Glance) - for the quiet «next» mark in the chat */
function mod2NextSet(){ const g=S&&S.m2; if(!g||!mod2On()) return {ids:new Set(),eta:0};
  const c=mod2Cfg(), T=S.t+Math.max(0,g.glanceIn);
  const cand=S.chat.filter(m=>!m.banned&&(m.st==='feed'||(m.st==='held'&&m.heldLeft<=g.glanceIn))).map(m=>({m,fa:m.st==='feed'?m.feedAt:S.t+m.heldLeft}))
    .filter(o=>T-o.fa>=c.minFeed || (o.m.id===g.pinned && T-o.fa>=c.minFeed));
  cand.sort((a,b)=>(b.m.id===g.pinned)-(a.m.id===g.pinned)||a.fa-b.fa);
  return {ids:new Set(cand.slice(0,MOD2_PER_GLANCE).map(o=>o.m.id)),eta:g.glanceIn}; }
function mod2Glance(){
  /* a Friday tutorial option waiting for «Показать Мие» is not read on her own glance */
  for(const m of S.chat) if(m.waitPin && m.st==='feed' && !(S.m2&&S.m2.pinned===m.id)) m.st='waitpin';
  const g=mod2State(), c=mod2Cfg();
  g.glanceIn=rnd(c.g0,c.g1); g.flash=.9;
  const free=mod2FreeToTalk();
  /* fairness: nothing is read before it has sat in her feed minFeed s - pinned and exempt included */
  const pin=g.pinned!=null?S.chat.find(x=>x.id===g.pinned):null;
  /* priorities of her attention: danger > story line > pinned > small talk.
     She cuts only small talk short (after 5 s past fairness); a story line ends first; during danger the pin waits. */
  const pinFree=!mod2Danger() && (free || !!(pin && pin.waitPin) || !!(pin && !(S.storyCaptionUntil>S.t) && S.t-Math.max(pin.feedAt||0,g.pinnedAt||0)>c.minFeed+5));
  const ready=S.chat.filter(m=>m.st==='feed' && !m.banned && S.t-m.feedAt>=c.minFeed && !(m.id===g.pinned && !pinFree));
  ready.sort((a,b)=>(b.id===g.pinned)-(a.id===g.pinned) || a.feedAt-b.feedAt);
  for(const m of ready.slice(0,MOD2_PER_GLANCE)){
    const aloud=m.id===g.pinned;
    m.st='read'; m.read=true; m.readAt=S.t; mod2Effect(m,aloud);
    if(m.onRead) m.onRead(m,aloud); /* scripted reactions (js/friday.js) */
    if(aloud) g.pinnedReadAt=S.t;
    mod2Sync(m);
  }
  /* pinned after she had already read it to herself: aloud at the first glance when she is not talking */
  const pm=g.pinned!=null?S.chat.find(x=>x.id===g.pinned):null;
  if(pm && pm.st==='read' && !g.pinnedReadAt && pinFree){ S.storyCaptionUntil=Math.min(S.storyCaptionUntil||0,S.t); mod2Say('m2pin',T('m2_pinSay',{text:pm.text})); g.pinnedReadAt=S.t;
    if(pm.onRead) pm.onRead(pm,true); } /* scripted reactions must hear this aloud reading too */
  stat('mod2/glance');
}

/* replaces the old "Mia reads what moderators leave in chat" loop when mod2 is on */
function mod2Tick(dt){
  const g=mod2State(), c=mod2Cfg();
  for(const m of S.chat){
    if(m.banned){ if(m.st&&m.st!=='banned'){ m.st='banned'; } continue; }
    if(m.st==='held'){ m.heldLeft-=dt; if(m.heldLeft<=0){ m.st='feed'; m.feedAt=S.t; mod2Sync(m); } else mod2Bar(m); }
    else if(m.read && (m.st==='feed'||m.st==='held')){ m.st='read'; mod2Sync(m); } /* other code marked it read (story lines) */
  }
  const key=mod2KeyMoment(); if(key){ if(MOD2K.start==null) MOD2K.start=S.t; } else MOD2K.start=null;
  MOD2K.paused=!!(key && S.t-MOD2K.start<6);
  if(MOD2K.paused) g.glanceIn=Math.max(g.glanceIn,.35);   /* the countdown stands still */
  else if(S.mia.awayT<=0 && !(S.guide&&S.guide.active)){ g.glanceIn-=dt; if(g.glanceIn<=0) mod2Glance(); }
  g.flash=Math.max(0,g.flash-dt);
  if(g.pinned!=null && g.pinnedReadAt && S.t-g.pinnedReadAt>6){ g.pinned=null; g.pinnedReadAt=0; }
}

/* ---- player actions */
/* her own reactions to the moderator win over a background line already on screen */
function mod2Say(key,text){ if(!S) return; S.mia.lineT=-1e9; say(key,text,3); }
/* she already read it and now it is gone:
   troll / spam / Stranger_99 and his imitators - ordinary moderation, nothing happens;
   a warning about the room - she gets suspicious and more anxious;
   any other viewer line - she only notices (a small, counted loss of her trust in the mod, used later by the night summary and dialogues) */
function mod2Removed(m){
  const g=mod2State();
  if(m.type==='troll'||m.type==='spam'||m.type==='stalker') return;
  if(m.warn||mod2Trigger(m.text)){ g.erasedWarn=(g.erasedWarn||0)+1; addPanic(4); mod2Say('m2noticedWarn',T('m2_noticedWarn')); stat('mod2/erased/warn'); return; }
  g.erased=(g.erased||0)+1; if(!(S.t-(g.erasedSaidAt??-1e9)<20)){ g.erasedSaidAt=S.t; mod2Say('m2noticed',T('m2_noticed')); } stat('mod2/erased/plain');
}
function mod2Act(kind){
  if(!mod2On()||!S.running) return;
  const m=S.selected!=null?S.chat.find(x=>x.id===S.selected):null;
  if(!m||m.banned||m.st==='na'){ const b=$(kind==='pin'?'actPin':'actHide'); if(b){ b.classList.add('nope'); setTimeout(()=>b.classList.remove('nope'),400); } return; }
  if(kind==='pin'){
    const st=showState(m); if(st!=='ok'){ floaty(LT(st==='read'?'f_read':'f_pinned')); SFX.wrong&&SFX.wrong(); return; }   /* already read / already shown */
    if(m.waitPin){ m.st='held'; const g0=mod2State(); g0.glanceIn=Math.min(g0.glanceIn,1); }   /* she asked and waits for this answer: she looks at chat within a second */
    if(S.fri&&S.fri.pre&&S.fri.preStep===1&&m.teaOpt){ S.fri.ids.tea=m.id; STR.ru.fri_tea=m.teaReply.ru; STR.en.fri_tea=m.teaReply.en; } }
  const g=mod2State(), prev=g.pinned!=null?S.chat.find(x=>x.id===g.pinned):null;
  if(kind==='pin'){
    if(S.distrust){ floaty(T('f_distrust')); SFX.wrong&&SFX.wrong(); return; }   /* 22.11: trust is gone - she no longer listens to the mod */
    if(m.st==='held'||m.st==='hidden'){ m.st='feed'; m.feedAt=S.t; } /* pin skips the filter, not the 1.5 s in her feed */
    g.pinned=m.id; g.pinnedReadAt=0; g.pinnedAt=S.t; /* she reads it at her next suitable glance, never on the click */
    if(prev&&prev!==m) mod2Sync(prev);
    SFX.ui&&SFX.ui(); stat('mod2/pin/'+m.type);
  }
  mod2Sync(m); mod2Plaque();
  /* drop the selection after an action: clicking a still-selected line toggled it OFF, so the next Q/E hit nothing */
  S.selected=null; list.querySelectorAll('.msg.sel').forEach(x=>x.classList.remove('sel'));
}

/* ban() stays in chat.js; here we only add "she noticed" and keep the pin plaque honest */
{ const banOld=ban;
  ban=function(id){
    const m=S&&S.chat.find(x=>x.id===id);
    banOld(id); /* a wrong ban already costs trust and panic in chat.js; banning a troll/stalker she has read is normal moderation */
    if(m&&m.banned&&mod2On()){ m.st='banned'; if(S.m2&&S.m2.pinned===m.id) S.m2.pinned=null; mod2Plaque(); }
  };
}

/* ---- DOM: pinned plaque, two buttons next to BAN, debug badge (built once, hidden off mod2 nights) */
let mod2Dom=null;
function mod2BuildDom(){
  if(mod2Dom) return mod2Dom;
  const lst=$('chatlist');
  const plaque=document.createElement('div'); plaque.className='m2plaque'; plaque.id='m2plaque'; plaque.hidden=true;
  lst.parentNode.insertBefore(plaque,lst); /* interface.js may wrap the list */
  const acts=document.createElement('div'); acts.className='m2acts'; acts.id='m2acts'; acts.hidden=true;
  acts.innerHTML=`<button class="pbtn m2b" id="actPin" type="button"><span class="tx"><b></b><small>Q</small></span></button><button class="pbtn m2b" id="actHide" type="button"><span class="tx"><b></b><small>E</small></span></button>`;
  const row=$('chatfoot').parentNode; row.parentNode.insertBefore(acts,row); /* own row above the BAN footer */
  $('actPin').addEventListener('click',()=>mod2Act('pin'));
  $('actHide').addEventListener('click',()=>mod2Act('hide'));
  const badge=document.createElement('div'); badge.className='badge m2glance'; badge.id='m2glance'; badge.hidden=true;
  $('video').appendChild(badge);
  mod2Dom={plaque,acts,badge}; return mod2Dom;
}
function mod2Plaque(){
  const d=mod2BuildDom(), g=S&&S.m2, m=g&&g.pinned!=null?S.chat.find(x=>x.id===g.pinned):null;
  if(!mod2On()||!m){ d.plaque.hidden=true; return; }
  /* "read" on the plaque means read ALOUD for the pin, not the silent glance before it */
  const txt=`<span class="pl">${esc(T('m2_pinned'))}</span><span class="pb"><b style="color:${nameColor(m.mimic||m.user)}">${esc(m.user)}:</b> ${esc(m.text)}<small>${esc(T(g.pinnedReadAt?'m2_pinDone':'m2_pinWait'))}</small></span>`;
  if(d.plaque._k!==txt){ d.plaque.innerHTML=txt; d.plaque._k=txt; }
  d.plaque.hidden=false;
}
{ const hudOld=hud;
  hud=function(dt){
    hudOld(dt);
    const d=mod2BuildDom(), on=mod2On();
    $('stage').classList.toggle('mod2',on);
    $('stage').classList.toggle('camp',camp());
    d.acts.hidden=!on;
    if(!on){ d.plaque.hidden=true; d.badge.hidden=true; const h=$('chat').querySelector('.chathead .hint'); if(h&&h.textContent!==T('chatHint')) h.textContent=T('chatHint'); return; }
    $('actPin').querySelector('b').textContent=T('m2_pin'); $('actHide').querySelector('b').textContent=T('m2_hide');
    const sel=S.selected!=null?S.chat.find(m=>m.id===S.selected):null, can=!!(sel&&!sel.banned&&sel.st!=='na');
    $('actPin').disabled=!S.running; $('actHide').disabled=!S.running;
    $('actPin').classList.toggle('armed',can); $('actHide').hidden=true;   /* 22.11: no hide button */
    $('chatfoot').textContent = sel ? T('m2_footSel',{user:sel.user,st:T('m2_st_'+(sel.st||'na'))}) : T('m2_foot');
    const hint=$('chat').querySelector('.chathead .hint'); if(hint) hint.textContent=T('m2_hint');
    mod2Plaque();
    const g=S.m2; d.badge.hidden=!(mod2DebugOn && g && g.flash>0); if(!d.badge.hidden) d.badge.textContent=T('m2_glance');
  };
}

/* ---- DEV for the slice playtest (turn MOD2_DEV off before any public build):
   F8 (or Ctrl+Shift+5) - start Friday straight away (ignores unlocks), F9 (or Ctrl+Shift+D) - toggle the "Mia is reading chat" badge.
   F-keys first: on Windows Ctrl+Shift is also the keyboard-layout switch. */
const MOD2_DEV=true;
let mod2DebugOn=MOD2_DEBUG;
function mod2DevFriday(){ const i=NIGHTS.findIndex(n=>n.key==='fri'); ['ovMenu','ovEnd','ovPause'].forEach(id=>{ const el=$(id); if(el) el.hidden=true; }); if(typeof paused!=='undefined'&&paused) setPause(false); start(i,{}); }
window.addEventListener('keydown',e=>{
  if(!MOD2_DEV||e.repeat) return;
  const cs=e.ctrlKey&&e.shiftKey;
  if(e.code==='F8'||cs&&e.code==='Digit5'){ e.preventDefault(); e.stopPropagation(); mod2DevFriday(); }
  else if(e.code==='F9'||cs&&e.code==='KeyD'){ e.preventDefault(); e.stopPropagation(); mod2DebugOn=!mod2DebugOn; }
},true);
