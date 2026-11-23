"use strict";
// ======================= GAME LOOP & FLOW (campaign, endless, rewards, ads) =======================
/* 22.11.2026: Steam project - no itch rating prompt; the call sites stay, the prompt is always hidden */
function rateShow(el,on){ if(el) el.hidden=true; }
function update(dt){
  if(!S||!S.running) return;
  if(typeof UI_MOTION!=='undefined'&&UI_MOTION.shift)return;
  if(onboardingTick())return;
  S.t+=dt;
  lightingTick(dt); economyTick(dt); smartHomeTick(dt);
  S.glitch=Math.max(0,S.glitch-dt); S.shake=Math.max(0,S.shake-dt); S.mia.surpriseT=Math.max(0,S.mia.surpriseT-dt);
  tutTick(dt); dayEventsTick(dt); storyTick(dt); if(S.night.key==='mon'&&camp()) monTick(dt); if(S.night.key==='tue'&&camp()) tueTick(dt);
  if(!S.night.noStalker||S.stalkerOn) stalkerTick(dt);   /* S.stalkerOn: a scripted scene lets the stalker system run (tuesday.js) */ if(!S.running||S.guide&&S.guide.active&&S.guide.kind==='red') return;
  chatTick(dt); miaTalkTick(dt);
  panicTick(dt); if(!S.running) return;
  S.vT=(S.vT||0)-dt; if(S.vT<=0){ S.vT=rnd(1.5,3); S.viewers=Math.max(300,S.viewers+Math.round(rnd(-12,14))); }
  const m=S.mia;
  m.lookT-=dt; if(m.lookT<=0){ m.lookT=rnd(1.5,4)*(S.panic>60?.4:1); m.look=Math.random()<.6?0:rnd(-1,1); }
  if((S.st.stage==='window'||S.st.stage==='door') && S.st.p>.45){ m.look=S.st.stage==='window'?-1:1; m.lookT=Math.max(m.lookT,.6); } // she keeps glancing at it
  m.blinkT-=dt; if(m.blinkT<=0){ m.blinkT=rnd(2,5); m.blink=.15; } m.blink=Math.max(0,m.blink-dt);
  if(S.t>=S.len && !S.tut.active){ if(DY().ev.finale) startFinale(); else endGame('win'); }
}

let endlessRun=null;
function resetScreens(){
  if(typeof evidenceClose==='function')evidenceClose(false);
  if(typeof storyClose==='function')storyClose(false);
  FIN.active=false; ['nosignal','playback'].forEach(c=>$('monitor').classList.remove(c));
  ['ovMenu','ovEnd','ovTut','ovPause','ovPhoto','police','epilogue','endcard','archiveWin','playbar','finCard','readDoc','tipToast','desktop','report','flash','mail','fcur'].forEach(id=>$(id).hidden=true);
  $('reflection').classList.remove('show'); $('stage').classList.remove('quake','finban','finauto'); if(S){ S.finReflect=null; S.finLights=null; S.finaleEmpty=false; } SFX.droneOff&&SFX.droneOff(); SFX.sirenOff&&SFX.sirenOff(); $('police').classList.remove('soft'); $('ovPhoto').classList.remove('top'); FIN.wait=false; FIN.q=null; reflCv=null; $('epilogue').classList.remove('slam'); SFX.staticOff();
}
function begin(idx,endN,opts){ TIPS.length=0; hintClear(); $('video').classList.remove('mon-dark');   /* pause → «Как играть» lists this night's tips only */
  const shiftFrom=typeof motionCaptureMenu==='function'?motionCaptureMenu(opts):null;
  STATS.quitSent=false;
  try{ if(opts&&opts.tut) stat('tutorial/start'); else if(endN!=null) stat('endless/start/'+endN); else stat('night/'+NIGHTS[idx].key+'/start/'+(PROG.diff||'normal')); }catch(e){}
  audioInit(); if(A.ctx&&A.ctx.state==='suspended'&&!A.muted) A.ctx.resume();
  resetScreens();
  const tut=!!(opts&&opts.tut);
  S=newState(idx,endN,tut); S.running=true; list.innerHTML=''; nextId=1; highlight(null); hideCallout(); $('floaty').classList.remove('show'); $('caption').hidden=true; $('cueline').hidden=true;
  if(tut){ S.tut.step=-1; S.st.wait=1e9; }
  $('tip').textContent=T('tip0'); S.tipKey=null; banLegend();
  if(!document.documentElement.classList.contains('lvC')) pushMsg('sys','',T('sysStart')).read=true;   /* 23.11: layout C has no «you are now moderating» line */
  onboardingInit(opts);
  const intro=()=>{later(()=>say('force',T('m_hello')),900);dayIntro();pfGameplay(S.running);};
  hud(0);
  if(shiftFrom)motionEnterNight(shiftFrom,intro);else intro();
}
function startNight(idx,opts){
  if((idx||0)===0 && !PROG.tut && PROG.unlocked===0 && !PROG.diffChosen){PROG.diffChosen=true;saveProg();}
  if(!opts && !PROG.diffChosen){ diffPending=idx||0; openMenu('diff'); return; }
  if(!opts && idx>0 && !(PROG.deskSeen&&PROG.deskSeen[NIGHTS[idx-1].key])){ $('ovMenu').hidden=true; showDesktop(NIGHTS[idx-1].key,()=>startNight(idx,{})); return; } endlessRun=null; begin(idx,null,opts); }
let diffPending=null;
function startTutorial(){ endlessRun=null; begin(0,null,{tut:true}); }
function startEndless(n){ if(n===0) endlessRun={n:0,hc:0}; begin(0,n,{skipTut:true}); }
function start(idx,opts){ if(opts&&opts.endless!=null) startEndless(opts.endless); else if(opts&&opts.tut) startTutorial(); else startNight(idx,opts); } // test hook

let lastEnd=null, pendingReward=null;
function endGame(reason){ $('cueline').hidden=true;
  if(!S.running) return;
  if(S.noDeath && reason!=='win' && reason!=='fired'){ tueSpared(reason); return; }   /* 23.11: the Tuesday scene - a failed defense is a bad scare, not a death (tuesday.js) */
  S.running=false; S.over=true; S.overReason=reason; pfGameplay(false);
  onboardingFinish(reason==='win'?'night-win':'night-lose',reason==='win');
  try{ if(!S.tut.active){ const N=S.night; if(N.endless&&reason!=='win'&&endlessRun) stat('endless/reached/'+Math.min(endlessRun.n,20)); stat(N.endless?'endless/'+(reason==='win'?'win':'lose/'+reason):'night/'+N.key+'/'+(reason==='win'?'win':'lose/'+reason)); } }catch(e){}
  /* Mia remembers last night: one line at the start of the next story night (see miaMemo in story.js) */
  if(reason==='win' && !S.tut.active && !S.night.endless){ const st=S.stats, i=NIGHTS.findIndex(n=>n.key===S.night.key); if(i>=0 && i<NIGHTS.length-1){ PROG.memo={next:NIGHTS[i+1].key,read:st.readStalker||0,wrong:st.wrongBans||0,him:st.himBans||0,don:st.donates||0,panic:Math.round(st.maxPanic||0)}; saveProg(); } }
  const g=S, show=()=>{ if(S===g) showEnd(reason); };
  if(reason==='kill'){ // no jump scare at the player: it happens to Mia, on stream, and the feed dies
    S.scareT=TAKE_LEN; S.taken=true; SFX.take(); $('caption').hidden=true; captionTimer=0;
    STR[LANG].takeChat.forEach((t,i)=>setTimeout(()=>{ if(S===g) pushMsg('normal',genName(),t); },700+i*260));
    setTimeout(()=>{ if(S===g){ $('monitor').classList.add('nosignal'); SFX.staticOn(); } },2500);
    setTimeout(()=>{ if(S===g){ SFX.staticOff(); show(); } },TAKE_LEN*1000+300); }
  else { if(reason!=='win'){ S.glitch=1; SFX.glitch(); } setTimeout(show, reason==='win'?500:900); }
}
function nightBonus(){ return S.night.endless ? 60+20*S.night.n : camp() ? 0 : 100+30*S.idx; }   /* 22.11: no HC from the campaign */
/* 22.11: demo build - after the last demo night: «Demo over» and the store page */
function demoOver(N,win){ return DEMO_BUILD && win && !N.endless && !N.tut && S.idx>=DEMO_NIGHTS-1; }
function showDemoEnd(){
  let o=$('ovDemo');
  if(!o){ o=document.createElement('div'); o.className='overlay'; o.id='ovDemo'; o.hidden=true; $('stage').appendChild(o); }
  const has=!!STEAM_URL, jam=window.TM_JAM===true;   /* 23.11: the Game Off build ends a chapter, not a demo; no store button until there is a store page */
  o.innerHTML=`<div class="paper small pausecard"><h2>${esc(T(jam?'chapEndTitle':'demoEndTitle'))}</h2><p class="sub">${esc(T(jam?'chapEndSub':'demoEndSub'))}</p>
    <div class="btnrow">${jam&&!has?'':`<button class="pbtn" id="demoWish" type="button" ${has?'':'disabled'}><b>${esc(T(has?'demoWish':'demoSoon'))}</b></button>`}
    <button class="pbtn plain" id="demoMenu" type="button"><b>${esc(T('demoMenu'))}</b></button></div></div>`;
  $('ovEnd').hidden=true; o.hidden=false; stat('demo/end',true);
  if($('demoWish')) $('demoWish').onclick=()=>{ if(!has) return; stat('demo/wishlist',true); try{ window.open(STEAM_URL,'_blank','noopener'); }catch(e){} };
  $('demoMenu').onclick=()=>{ o.hidden=true; openMenu('main'); };
}
function showEnd(reason){
  lastEnd=reason; const st=S.stats, N=S.night, win=reason==='win';
  const endlessOver = N.endless && !win;
  const E = endlessOver ? TA('e_endless',{n:endlessRun?endlessRun.n:0}) : TA('e_'+reason);
  $('endTitle').textContent=E[0]; $('endSub').textContent=E[1];
  $('endStats').innerHTML=[[T('st_surv'),clockStr()],...(N.endless||N.tut?[]:[[T('diff'),T('diff_'+(N.diff||'normal'))]]),[T('st_peak'),Math.round(st.maxPanic)+'%'],[T('st_bans'),st.goodBans+' / '+st.wrongBans],[T('trust'),S.trust+'/'+S.maxTrust]]
    .map(([k,v])=>`<div class="stat${/\d/.test(v)?'':' txt'}"><div class="lbl">${esc(k)}</div><div class="sv">${esc(v)}</div></div>`).join('');
  pendingReward={hc:S.hc, bonus:win?nightBonus():0, mult:1, committed:false};
  renderReward(); $('endReward').hidden=camp();   /* 22.11: no HC in the campaign */
  $('endArchive').innerHTML = S.clips.length ? S.clips.slice(-4).map(c=>`<div class="clip">${c.img?`<img src="${c.img}" alt="">`:''}<div>${c.clock} · ${c.val?`<b>+${c.val}</b> · ${esc(c.label)}`:esc(T('clipNothing'))}</div></div>`).join('') : `<div class="note">${esc(T('noClips'))}</div>`;
  if(S.ev.noteRec)$('endArchive').insertAdjacentHTML('beforeend',`<button type="button" class="pbtn evidence-archive" data-read-evidence>${esc(T(N.key==='fri'?'evidence_photo':'evidence_read'))}</button>`);
  if(N.key==='mon' && S.ev.noteRec) $('endArchive').insertAdjacentHTML('beforeend',`<div class="clipnote"><small>${esc(T('noteMonLbl'))}</small>${esc(T('noteMonTxt'))}</div>`);
  if((S.storyLog||[]).length)$('endArchive').insertAdjacentHTML('beforeend',`<button type="button" class="pbtn story-archive" data-read-story>${esc(T('storyRead'))}</button>`);
  $('endWhisper').textContent = win ? (T('wh_'+N.key)!=='wh_'+N.key?T('wh_'+N.key):T('wh_other')) : (T('wh_'+reason)!=='wh_'+reason ? T('wh_'+reason) : T('wh_other'));
  let note = win ? T('n_win') : T('n_'+reason);
  if(S.endStory){ note=S.endStory; $('endWhisper').textContent=''; }   /* 23.11: a scripted night writes its own cause → effect line (tuesday.js) */
  if((N.key==='fri'||N.key==='mon'&&N.ev&&N.ev.note) && !S.ev.noteRec) note+=' '+T('noteMissed');   /* 22.11: the new Monday has no note */
  $('endNote').textContent=note;
  rateShow($('rateItch'), false);   /* 22.11: Steam build - no itch rating prompt */
  $('photoBtn').hidden = !(N.key==='fri' && S.ev.noteRec);
  if(N.key==='fri' && S.ev.noteRec && win && !PROG.photoSeen){ PROG.photoSeen=true; saveProg(); setTimeout(()=>{ if(!$('ovEnd').hidden) $('photoBtn').click(); },1300); }
  $('contBtn').hidden = true;   /* 22.11: Steam build - no «continue the night» (it came from the ad-supported browser builds) */ $('contBtn').disabled=false; { const cb=$('contBtn').querySelector('b'); if(cb) cb.textContent=T('continueAd'); }
  if(IS_CG && PF.adblock) $('endNote').textContent += ' '+T('adBlockNote');
  if(win) pfHappy();
  $('x2Btn').hidden = true;   /* 22.11: no ad-doubled rewards */ $('x2Btn').disabled=false; $('x2Lbl').textContent=T('x2ad');
  const hasNext = win && (N.endless || S.idx<NIGHTS.length-1) && !demoOver(N,win);
  $('nextLbl').textContent = demoOver(N,win) ? T('demoNext') : N.endless ? (win?T('endlessNext'):T('retry')) : hasNext ? T('nextNight',{day:T('dayName_'+NIGHTS[S.idx+1].key)}) : T('retry');
  $('againBtn').hidden = !(win && !N.endless); $('againLbl').textContent=T('again');
  $('ovEnd').hidden=false;
  if(win && !N.endless && !N.tut){ const k=N.key, r=DIFF_RANK[N.diff||'normal']||2; PROG.stars=PROG.stars||{}; if((PROG.stars[k]||0)<r) PROG.stars[k]=r; }
  if(win && !N.endless){ PROG.unlocked=Math.max(PROG.unlocked,Math.min(S.idx+1,NIGHTS.length-1,DEMO_BUILD?DEMO_NIGHTS-1:99)); }
  if(N.endless){ if(win) endlessRun.n++; else { PROG.best=Math.max(PROG.best,endlessRun.n); pfSetScore(PROG.best); } }
  commitReward(); // bank right away (protects against closing the tab); x2 adds the difference later
  // the shop is one tap away; flag it when the bank covers an upgrade, explain it once, suggest it after a loss
  const can=affordUp(), upName=can?TA('up_'+can.id)[0]:'';
  $('shopCan').textContent = can ? T('canBuy',{name:upName}) : ''; $('shopBtn').classList.toggle('pulse',!!can); $('shopBtn').hidden=camp();   /* 22.11: no shop in the campaign */
  $('shopHint').hidden = !(can && !PROG.shopHint); if(can && !PROG.shopHint){ $('shopHint').textContent=T('shopHintFirst'); PROG.shopHint=true; saveProg(); }
  if(can && !win && !N.endless) $('endNote').textContent += ' '+T('loseShop',{name:upName});
}
function renderReward(){
  const r=pendingReward, tot=(r.hc+r.bonus)*r.mult;
  $('endReward').innerHTML=`<div><span>${esc(T('earned'))}</span><b>+${r.hc*r.mult}</b></div>${r.bonus?`<div><span>${esc(T('winBonus'))}</span><b>+${r.bonus*r.mult}</b></div>`:''}<div class="tot"><span class="coin">HC</span><b>+${tot}</b><em>${esc(T('toBank'))} · ${PROG.bank}</em></div>`;
}
function commitReward(){ const r=pendingReward; if(!r||r.committed) return; r.committed=true; PROG.bank+=(r.hc+r.bonus)*r.mult; saveProg(); renderReward(); }
function doubleReward(){
  const r=pendingReward; if(!r||r.mult>1) return;
  pfRewarded(()=>{ PROG.bank+=(r.hc+r.bonus); r.mult=2; saveProg(); renderReward(); $('x2Btn').disabled=true; $('x2Lbl').textContent=T('x2done'); SFX.donate(); },ok=>{ if(!ok){ $('x2Btn').disabled=true; $('x2Lbl').textContent=T('adNA'); } });
}
function continueNight(){
  if(!S||S.continued||lastEnd==='win') return;
  pfRewarded(()=>{
    const r=pendingReward; if(r&&r.committed){ PROG.bank-=(r.hc+r.bonus)*r.mult; saveProg(); } pendingReward=null; // the night goes on, it will be paid at its real end
    if(S.night.endless && endlessRun){ PROG.best=Math.max(PROG.best,endlessRun.n); }
    S.continued=true; S.over=false; S.overReason=null; S.scareT=0; S.taken=false; S.running=true; $('monitor').classList.remove('nosignal'); SFX.staticOff();
    S.panic=Math.min(S.panic,40); S.trust=Math.max(S.trust,1); S.tox=Math.min(S.tox,30); stalkerRetreat('hidden'); S.st.wait=10;
    for(const z of ZONES){ const L=S.lamps[z]; if(!L.burned){ L.heat=Math.min(L.heat,40); L.mode='STABLE'; } }
    $('ovEnd').hidden=true; pfGameplay(true); floaty(T('f_gone'));
  },ok=>{ if(!ok) adFailed('contBtn'); });
}
/* 12.11: on the first nights the sticky note shows which chat icons to ban (troll, spam, his devil) and which to leave alone */
function banLegend(){
  const el=$('banLeg'); if(!el||!S) return; const N=S.night||{}; const on=!N.endless && (N.key==='mon'||N.key==='tue'); el.hidden=!on; if(!on) return;
  const ic=(type,user)=>`<span class="bi">${avatarSVG({type,user})}</span>`;
  el.innerHTML=`<div class="bh">${esc(T('legBan'))}</div><div class="br">${ic('troll','t')}${esc(T('legTroll'))}</div><div class="br">${ic('spam','s')}${esc(T('legSpam'))}</div><div class="br">${ic('stalker','x')}${esc(T('legHim'))}</div>`+
    `<div class="bh ok">${esc(T('legKeep'))}</div><div class="br">${ic('normal','fox_mochi')}${ic('normal','vhs_witch')}${esc(T('legViewers'))}</div>`;
}
function leaveEnd(action){ commitReward();
  if(IS_CG && lastEnd!=='win'){ action&&action(); return; }   /* CrazyGames: after a loss we offer "continue" (rewarded), so no midgame ad on top */
  pfInterstitial(action); }
/* a rewarded ad that did not play: never leave a button that does nothing */
function adFailed(btn){ const b=$(btn); if(!b) return; b.disabled=true; const l=b.querySelector('b'); if(l) l.textContent=T('adNA'); }

let paused=false;
function setPause(v){
  if(!S||(!S.running&&!paused)) return; paused=v; S.running=!v; $('ovPause').hidden=!v; if(v) pauseCardOpen(); try{ fsLabels(); }catch(e){} volUI();
  pfGameplay(!v); if(A.ctx){ (v||A.muted)?A.ctx.suspend():A.ctx.resume(); }
}
function quitToMenu(){ statQuit('menu'); if(S&&S.running) S.running=false; paused=false; $('ovPause').hidden=true; if(S&&!S.over&&!S.tut.active){ PROG.bank+=S.hc; saveProg(); } hideCallout(); highlight(null); S.over=true; openMenu('main'); }

// ---- input
$('nextBtn').onclick=()=>leaveEnd(()=>{ const N=S.night, win=lastEnd==='win';
  if(demoOver(N,win)){ if(N.key==='tue'&&camp()) dmTuesday(()=>tueFinale(showDemoEnd,true)); else showDemoEnd(); return; }      /* 22.11: the demo ends after Tuesday; 23.11: after the DMs and the last message */
  if(N.endless) startEndless(win?endlessRun.n:0);
  else if(win && S.idx<NIGHTS.length-1){ const i=S.idx+1, go=()=>showDesktop(N.key,()=>startNight(i,{skipTut:true}));   // your desktop between nights
    if(N.key==='mon' && camp()) dmMonday(go); else if(N.key==='tue' && camp()) dmTuesday(()=>tueFinale(go)); else go(); }   /* 23.11: Mia writes to the mod after Monday (dm.js) */
  else startNight(S.idx,{skipTut:true}); });
$('againBtn').onclick=()=>leaveEnd(()=>startNight(S.idx,{skipTut:true}));
$('menuBtn').onclick=()=>leaveEnd(()=>openMenu('main'));
$('shopBtn').onclick=()=>leaveEnd(()=>openMenu('shop'));
$('contBtn').onclick=continueNight; $('x2Btn').onclick=doubleReward;
$('photoBtn').onclick=()=>{ drawPhoto($('photoCv')); $('ovPhoto').hidden=false; };
$('photoClose').onclick=()=>{ $('ovPhoto').hidden=true; if(FIN.active && FIN.cardWasOpen){ FIN.cardWasOpen=false; $('finCard').hidden=false; } };
$('restartBtn').onclick=()=>{ resetScreens(); openMenu('main'); };
$('resumeBtn').onclick=()=>setPause(false);
/* volume sliders: music / sounds, saved in PROG.vol (save stays v:2) */
function volUI(){ for(const [id,k] of [['volMus','mus'],['volSfx','sfx']]){ const v=Math.round(volOf(k)*100); $(id).value=v; $(id+'N').textContent=v+'%'; $(id).style.setProperty('--v',v+'%'); } }
for(const [id,k] of [['volMus','mus'],['volSfx','sfx']]){ $(id).oninput=e=>{ setVol(k,+e.target.value/100); volUI(); }; $(id).onchange=()=>saveProg(); }
$('quitBtn').onclick=quitToMenu;
/* DEV: skip to 23:59 — the night then ends the normal way (win / desktop / finale). Turn DEV_SKIP off before the public release. */
const DEV_SKIP=false;
$('devSkip').hidden=!DEV_SKIP;
$('devSkip').onclick=()=>{ if(!DEV_SKIP||!S||!S.running||S.tut.active||S.night.endless) return; S.t=Math.max(S.t,S.len-1); S.st.stage='hidden'; S.st.p=0; S.panic=Math.min(S.panic,50); };
$('pauseBtn').onclick=$('pauseBtn2').onclick=()=>{ if(S&&(S.running||paused)) setPause(!paused); };
$('muteBtn').onclick=()=>{ setMuted(!A.muted); $('muteLbl').textContent=T(A.muted?'soundOff':'soundOn'); };
document.querySelectorAll('.lamp').forEach(card=>{ const z=card.id.replace('lamp-',''); card.querySelectorAll('.mk').forEach(b=>b.onclick=()=>setLamp(z,b.dataset.m)); });
$('actBlinds').onclick=toggleBlinds; $('actRec').onclick=rec; $('actBan').onclick=banSelected; $('actDonate').onclick=donate;
$('actDog').onclick=()=>smartHome('dog'); $('actSteps').onclick=()=>smartHome('steps'); $('actAlarm').onclick=()=>smartHome('alarm');
const KEYZ={Digit1:'window',Digit2:'closet',Digit3:'door',Numpad1:'window',Numpad2:'closet',Numpad3:'door'}; // left → right, as in the room
document.addEventListener('keydown',e=>{
  if(!$('readDoc').hidden){if(['Escape','Enter',' '].includes(e.key)){e.preventDefault();readDoc(false);}else if(e.key==='Tab'){e.preventDefault();$('readDoc').querySelector('.rd-in').focus();}return;}
  if(FIN.active && FIN.phase===6 && e.code==='KeyX'){ e.preventDefault(); finSelfBan(); return; }
  if(FIN.active && (e.code==='Space'||e.code==='Enter')){ e.preventDefault(); if(FIN.phase===5 && performance.now()-(FIN.flAt||0)>900){ flashShow(); return; } if(FIN.wait) finNext(); else if(FIN.phase===7 && !$('protoNext').hidden) finEnter(8); return; }
  if(e.key==='Escape'){ if(!$('ovPhoto').hidden){ $('ovPhoto').hidden=true; return; } if(S&&(S.running||paused)) setPause(!paused); return; }
  if(!S||!S.running||e.repeat) return;
  const c=e.code;
  if(KEYZ[c]){ e.preventDefault(); if(!e.shiftKey) toggleBoost(KEYZ[c]); return; }   /* 22.11: Shift = DIM removed */
  if(c==='KeyB') toggleBlinds(); else if(c==='KeyR') rec(); else if(c==='KeyX') banSelected();
  else if(c==='KeyQ'&&typeof mod2Act==='function') mod2Act('pin'); /* 22.11: E (hide) removed */ /* mod2 nights only */
  else if(c==='KeyZ') smartHome('dog'); else if(c==='KeyC') smartHome('steps'); else if(c==='KeyF') smartHome('alarm'); else if(c==='KeyG') donate();
});
document.addEventListener('visibilitychange',()=>{ if(document.hidden){ if(S&&S.running) setPause(true); if(A.ctx) A.ctx.suspend(); } else if(A.ctx && !A.muted && !paused && !PF.inAd) A.ctx.resume(); });
// no context menu, no text selection, no browser scroll / pull-to-refresh
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('selectstart',e=>{ if(!e.target.closest('input')) e.preventDefault(); });
document.addEventListener('touchmove',e=>{ if(!e.target.closest('#chatlist,.paper')) e.preventDefault(); },{passive:false});
PF.onPause=()=>{ if(S&&S.running) setPause(true); if(A.ctx) A.ctx.suspend(); };
PF.onResume=()=>{};

// ---- loop
// The simulation ticks every frame; the picture (canvas + HUD) is redrawn at 30 fps while something moves
// (a webcam feed, after all) and at 8 fps when idle — menu, pause, end screen. Keeps laptops quiet.
let last=performance.now(), drawAcc=0, hudAcc=0, audAcc=0;
function loop(now){
  const dt=Math.min(.05,(now-last)/1000); last=now;
  if(S){ update(dt); if(S.scareT>0) S.scareT-=dt; finaleTick(dt); musicTick(dt); murmurTick(dt); }
  menuMusicTick(dt);
  if(S && SCR.sid!==S){ SCR.sid=S; scareReset(); }   /* new night -> new scare budget */
  scareTick(dt);
  audAcc+=dt; if(audAcc>=.05){ ambTick(audAcc); tenseTick(audAcc); lampHumTick(audAcc); audAcc=0; }   /* perf 11.11: ambience / tension / lamp hum at 20 Hz */
  menuSceneTick(dt);
  const menuL=menuLiveOn(), live = S && (S.running || FIN.active || S.scareT>0);
  drawAcc+=dt; hudAcc+=dt;
  if(drawAcc >= (live?1/30:menuL?1/12:1/8)-.004){   /* the live menu: 12 fps is plenty for blinking */
    if(S && !menuL){ hud(hudAcc); hudAcc=0;
      const sh=S.shake>0?S.shake*10:0, tr=sh?`translate(${(Math.random()-.5)*sh}px,${(Math.random()-.5)*sh}px)`:''; const v=$('video'); if(v.style.transform!==tr) v.style.transform=tr; }
    render(); menuDraw(); drawAcc=0;
  }
  requestAnimationFrame(loop);
}
// ---- boot
(async function boot(){
  document.body.appendChild($('rotate'));
  fitStage();
  await platformInit();
  if(PF.lang){ LANG = PF.lang==='ru'||['be','kk','uk','uz'].includes(PF.lang) ? 'ru' : 'en'; }
  try{ const sv=localStorage.getItem('mod_lang'); if(sv) LANG=sv; }catch(e){}
  const saved=await pfLoad(); if(saved && saved.v===2) PROG=Object.assign(freshProg(),saved);
  /* old music toggle (localStorage mod_music) -> music slider at 0 */
  try{ if(!PROG.vol && localStorage.getItem('mod_music')==='0') PROG.vol={mus:0,sfx:VOL_DEF.sfx}; }catch(e){}
  applyVol(); volUI();
  try{ statsInit(); }catch(e){}
  S=newState(0); applyLooks(); applyLang(); drawAvatar($('miaAva'));
  openMenu('main');
  requestAnimationFrame(loop);
  pfReady();
  const bt=$('boot'); if(bt){ try{ __bp(1); }catch(e){} bt.classList.add('off'); setTimeout(()=>bt.remove(),500); }
})();
window.__mod={get S(){return S;},startTutorial,tutNextClick,TUT,get PROG(){return PROG;},update,start,startNight,startEndless,setLamp,toggleBoost,toggleBlinds,smartHome,donate,rec,ban,banSelected,endGame,adaptAt,startFinale,FIN,finNext,continueNight,doubleReward,openMenu};
