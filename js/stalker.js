"use strict";
// ======================= STALKER AI =======================
// Every approach he picks a way in (which ways a night allows: NIGHTS.routes):
//   A: window → door → behind her      B: door → behind her      C: out of the closet → behind her
// ~2 s before he shows up a sound gives the way away: a tap on the glass, a door creak, hangers in the closet.
// Progress inside a stage depends on the lamp of that zone (window / door / closet; behind her = closet lamp).
// Habits (per approach): RED EYES — light only feeds him: dim the lamp, scare him with smart-home noises or the blinds.
//                        DECOY — a shape with no eyes somewhere else; the MOTION sensor on the lamp card never lies.
function pickRoute(){
  const base=DY().routes||{A:1}, h=S.st.hist||(S.st.hist=[]), w={}; let sum=0;
  for(const k in base){ let v=base[k]; if(h[h.length-1]===k) v*=.45; if(h.length>=2 && h[h.length-1]===k && h[h.length-2]===k) v=0; w[k]=v; sum+=v; }
  if(sum<=0){ for(const k in base){ w[k]=base[k]; sum+=base[k]; } }
  let r=Math.random()*sum, pick='A'; for(const k in w){ r-=w[k]; if(r<=0){ pick=k; break; } }
  h.push(pick); if(h.length>4) h.shift(); return pick; }
function enterStage(stage,p){
  const st=S.st; st.stage=stage; st.p=p; st.boostT=0; st.backed=false; st.lit=0;
  if(stage==='window'){ SFX.creak(); tip('first',T('tipFirst')); }
  if(stage==='door'){ SFX.door(); floaty(T('f_door')); }
  if(stage==='closet'){ SFX.door(); floaty(T('f_closet')); tip('closet',T('tipCloset')); }
  if(stage==='behind'){ SFX.near(); SFX.thud(); S.shake=.4; floaty(T('f_behind')); addPanic(8); }
  if(st.red && stage!=='behind'){ tip('red',T('tipRed')); if(typeof redLessonStart==='function')redLessonStart(); }
  if(S.decoy && S.decoy.zone===stage) S.decoy=null;
  if(!S.tut.active && Math.random()<.45) later(()=>{ if(S.st.stage===stage) stalkerSay(stalkerPool(stage)||stalkerPool('general')); }, rnd(1500,4000));
}
function beginApproach(){
  S.fxPass=0;const st=S.st, d=DY(), key=st.next||pickRoute(); st.route=ROUTES[key]; st.next=null; st.cued=false;
  st.red = !S.tut.active && Math.random()<(d.red||0); st.litSaid=false;
  if(key==='B') tip('routeB',T('tipRouteB'));
  enterStage(st.route[0],.05);
  if(!S.tut.active && Math.random()<(d.decoy||0)){ // a shape somewhere else, with no eyes
    const zs=['window','door','closet'].filter(z=>z!==st.route[0] && !(z==='window'&&S.blinds.closed));
    if(zs.length) S.decoy={zone:pick(zs),t:rnd(9,14),lit:0};
  }
}
function decoyTick(dt){
  const dc=S.decoy; if(!dc) return;
  dc.t-=dt; if(dc.t<=0 || S.st.stage===dc.zone){ S.decoy=null; return; }
  if(lampMode(dc.zone)==='BOOST'){ dc.lit+=dt; if(dc.lit>.6){ S.decoy=null; floaty(T('f_decoy')); tip('decoy',T('tipDecoy')); } }
}
function stalkerRetreat(to){
  const st=S.st, d=dprog(), r=st.route||ROUTES.A, i=r.indexOf(st.stage);
  if(to==='hidden' || i<=0){
    st.stage='hidden'; st.p=0; st.boostT=0; st.backed=false; st.red=false; st.cued=false; st.next=null; S.decoy=null;
    st.wait=rnd(8,14)*(1-.4*d)*DY().waitMul*(DY().press&&d>DY().press.at?DY().press.wait:1); return;
  }
  st.stage=r[i-1]; st.p=.45; st.boostT=0; st.backed=false;
}
/* the sound cue before he shows up: easy gives more time; the lamp card of that zone flashes (easy/normal); the caption explains it only on easy, on the first night each zone's cue is heard */
function cueLead(){ return S.night.diff==='easy'?3.6:2.2; }
function showCue(z){
  SFX.cue(z); const d=S.night.diff||'normal'; if(d==='hard') return;
  S.cueZ=z; S.cueT=cueLead()+.6; S.cueN=(S.cueN||0)+1;
  if(hintOk('cue_'+z)){ const el=$('cueline'); el.innerHTML=esc(T('cue_'+z))+'<b>'+esc(T('cue_sub',{z:T('cz_'+z)}))+'</b>'; el.hidden=false; el.style.animation='none'; void el.offsetWidth; el.style.animation=''; }
}
function stalkerTick(dt){
  const st=S.st, d=dprog();
  if(st.frozenT>0) st.frozenT-=dt;
  if(S.cueT>0){ S.cueT-=dt; if(S.cueT<=0){ S.cueZ=null; $('cueline').hidden=true; } }
  decoyTick(dt);
  if(st.stage==='hidden'){
    if(S.tut.active) return;
    st.wait-=dt;
    if(!st.cued && st.wait<=cueLead()){ st.next=pickRoute(); st.cued=true; showCue(ROUTES[st.next][0]); }
    if(st.wait<=0){ if(S.blinds.closed && ROUTES[st.next||'A'][0]==='window'){ st.wait=1.5; return; } beginApproach(); }
    return;
  }
  const z=STAGE_LAMP[st.stage], m=lampMode(z), L=S.lamps[z];
  const red = st.red && st.stage!=='behind';
  const base = st.aggr * DY().aggr * (1+.6*d) * (st.stage==='behind'?(DY().bm||1.5):1)
             * (DY().press&&d>DY().press.at?DY().press.rate:1) * (st.stage==='window'&&S.blinds.jammed?.7:1) * (st.stage==='window'&&S.winOpen?1.6:1) * (st.stage==='closet'?.85:1);
  let rate;
  if(red){ // the light feeds him
    rate = {DEAD:.13,DIM:.03,STABLE:.065,BOOST:.17}[m] * base;
    if(m==='BOOST'){ st.lit+=dt; if(st.lit>.5 && !st.litSaid){ st.litSaid=true; floaty(T('f_redLight')); S.glitch=.2; } }
  } else if(m==='BOOST'){
    st.boostT+=dt; rate = st.boostT<.4 ? 0 : -.12;
    if(st.boostT>adaptAt() && !S.tut.active){   // it adapts to the light and lunges
      st.p+=.28; st.boostT=0; S.glitch=.3; SFX.thud(); S.shake=.25; floaty(T('f_lunge'));
      stalkerSay(stalkerPool('lunge')); tip('adapt',T('tipAdapt'));
    }
    if(rate<0 && !st.backed){ st.backed=true; floaty(T('f_back')); }
  } else {
    if(L.rel>.8) st.boostT=0;
    rate = {DEAD:.15,DIM:.11,STABLE:.055}[m] * base;
  }
  if(st.frozenT>0 && rate>0) rate=0;
  if(st.stage==='window' && S.blinds.closed && rate>0) rate=0;   // waits behind the shut blinds
  if(S.mia.awayT>0 && st.stage==='behind' && rate>0) rate=0;
  if(st.frozenAt!=null && rate>0){ rate=.14; if(st.p>=st.frozenAt) rate=0; }
  const prev=st.p; st.p+=rate*dt;
  if(prev<.6 && st.p>=.6) SFX.near();
  if(st.p<=0){ const was=st.stage; stalkerRetreat(); floaty(T(was==='behind'||(st.route||ROUTES.A).indexOf(was)>0?'f_step':'f_gone')); return; }
  if(st.p>=1){
    if(st.stage===DY().max && st.stage!=='behind'){ // early nights: it only gets this far, scares her and leaves
      const w=st.stage; S.glitch=.4; if(!(w==='window'&&scareGlassSlam())) SFX.thud(); S.shake=Math.max(S.shake||0,.35); addPanic(w==='window'?28:34); S.mia.surpriseT=2; floaty(T(w==='window'?'f_knock':'f_peek'));
      say('force',T(w==='window'?'m_knock':'m_peek')); stalkerRetreat('hidden'); tip('max',T('tipMax')); return; }
    if(st.stage==='behind'){ endGame('kill'); return; }
    const r=st.route||ROUTES.A, nx=r[r.indexOf(st.stage)+1];
    enterStage(nx, st.stage==='closet' ? .2 : .05);   // out of the closet he is already a little closer behind her
  }
}
