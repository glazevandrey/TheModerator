"use strict";
// ======================= LIGHTING GRID: three lamps × DIM / STABLE / BOOST, heat, burnout, blinds =======================
function setLamp(z,mode){
  const L=S.lamps[z]; if(!S.running||L.burned||!MODES.includes(mode)||L.mode===mode) return;
  if(mode==='BOOST' && !S.tut.active){ for(const o of ZONES){ const O=S.lamps[o]; if(o!==z && O.mode==='BOOST' && !O.burned){ O.mode='STABLE'; relayClick('STABLE',o); if(hintOk('breaker')) floaty(T('f_breaker')); tip('breaker',T('tipBreaker')); } } }
  L.mode=mode; relayClick(mode,z);
  /* BRIGHT at the window while he stands there: the light flares the whole screen, like hitting a phone camera */
  if(mode==='BOOST' && z==='window' && S.st.stage==='window' && !S.tut.active){ const st=$('stage'); st.classList.remove('flare'); void st.offsetWidth; st.classList.add('flare'); }
  if(mode==='BOOST') say('boost',T('m_boost'),25);
  if(mode==='DIM'){ say('dim',T('m_dim'),25); tip('dim',T('tipDim')); }
}
function toggleBoost(z){ const L=S.lamps[z]; setLamp(z, L.mode==='BOOST'?'STABLE':'BOOST'); }
function toggleDim(z){ const L=S.lamps[z]; setLamp(z, L.mode==='DIM'?'STABLE':'DIM'); }

function lightingTick(dt){
  for(const z of ZONES){
    const L=S.lamps[z]; if(L.burned){ L.flick=0; continue; }
    const r = L.mode==='BOOST'?HEAT.boost*(1-.15*upLv('cool'))*(1+.35*dprog())*(S.night.heat||1) : L.mode==='STABLE'?HEAT.stable : HEAT.dim;
    L.heat=clamp(L.heat+r*dt,0,S.tut.active?95:100);
    if(L.mode==='BOOST') L.rel=0; else L.rel+=dt;
    L.flick = L.heat>80 ? (Math.random()<.25?rnd(.2,.6):1) : 1;
    if(L.heat>80 && !L.warned){ L.warned=true; say('flick',T('m_flick',{z:T('zat_'+z)}),20); tip('heat',T('tipHeat')); }
    if(L.heat<70) L.warned=false;
    /* window lamp on BRIGHT is getting hot while he is at the window: point at the blinds (on easy every time, otherwise once) */
    if(z==='window' && L.mode==='BOOST' && L.heat>60 && S.st.stage==='window' && !S.blinds.closed && S.blinds.cd<=0 && !S.blinds.jammed && !S.tut.active && !S.blindsHinted){
      S.blindsHinted=true; if(S.night.diff==='easy') S.tipsDone.blindsHeat=0; tip('blindsHeat',T('tipBlindsHeat')); if(hintOk('blinds')) floaty(T('blindsOpen')+(MOBILE?'!':' ▸ B')); }
    if(z==='window' && L.heat<40) S.blindsHinted=false;
    if(L.heat>=100){ L.burned=true; if(!scareBulb(z)) SFX.burn(); S.glitch=.25; addPanic(6); say('force',T('m_burn',{z:T('zat_'+z)})); tip('light',T('tipLight')); }
  }
  const b=S.blinds; b.cd=Math.max(0,b.cd-dt);
  if(b.closed){ b.timer-=dt; if(b.timer<=0){ b.closed=false; SFX.blinds(); say('reopen',T('m_reopen'),10); } }
  b.anim += ((b.closed?1:0)-b.anim)*Math.min(1,dt*8);
}
function toggleBlinds(){
  const b=S.blinds; if(!S.running) return;
  if(b.closed){ b.closed=false; SFX.blinds(); return; }
  if(b.jammed){ floaty(T('jammed')); SFX.wrong(); return; }
  if(b.cd>0) return;
  b.closed=true; b.timer=8+3*upLv('blinds'); b.cd=CD.blinds; SFX.blinds(); addPanic(3);
  if(S.winOpen){ S.winOpen=false; floaty(T('f_winClosed')); }
  if(S.decoy && S.decoy.zone==='window') S.decoy=null;
  if(S.st.stage==='window' && S.st.p>.5 && !S.tut.active){ // too late: he only lets go of the frame, and waits behind the blinds
    S.st.p=.05; S.st.boostT=0; S.st.aggr=Math.min(2.4,S.st.aggr+.05); SFX.thud(); floaty(T('f_frame')); tip('frame',T('tipFrame'));
  } else if(S.st.stage==='window'){
    stalkerRetreat('hidden'); S.st.aggr=Math.min(2.4,S.st.aggr+.05); SFX.thud(); floaty(T('f_gone'));
    later(()=>stalkerSay(C().STALKER.blinds),1800);
  } else say('blinds',T('m_blinds'),10);
}
