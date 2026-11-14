"use strict";
// ======================= MIA PANIC SYSTEM (0–100, with inertia) =======================
function addPanic(v,opt){
  if(!S) return; const force=opt&&opt.force;
  if(v>0 && !force){ if(S.focus>0) v*=.3; v*=S.night.pmul; if(S.panic>85) v*=.6; }
  S.panic=clamp(S.panic+v,0,100);
  if(v>=6) S.mia.surpriseT=Math.max(S.mia.surpriseT,1.2);
}
function panicTick(dt){
  const st=S.st, d=dprog(); let g=0;
  // darkness, glare
  for(const z of ZONES){ const m=lampMode(z); g+= m==='DEAD'?.3 : m==='DIM'?.18 : m==='BOOST'?.08 : 0; }
  // proximity of the stalker
  if(st.stage==='window' && st.p>.5) g+=.45;
  if(st.stage==='door') g+=.25+.35*st.p;
  if(st.stage==='closet') g+=.2+.35*st.p;
  if(st.stage==='behind' && !S.tut.active) g+=1.6+1.6*st.p;
  if(S.mia.awayT>0) g+=.2;
  if(g>0) addPanic(g*dt*(1+.3*d)*(DY().mod==='cold'?1.25:1));
  // panic fades on its own whenever nothing is close; darkness and closed blinds slow that down
  const threat = st.stage==='door' || st.stage==='closet' || st.stage==='behind' || (st.stage==='window' && st.p>.4);
  if(!threat && S.mia.awayT<=0){
    const dark=ZONES.filter(z=>['DIM','DEAD'].includes(lampMode(z))).length;
    let dec=S.night.calm*(dark?.45:1)*(S.blinds.closed?.7:1);
    S.panic=Math.max(0,S.panic-dec*dt);
  }
  S.stats.maxPanic=Math.max(S.stats.maxPanic,S.panic);
  if(S.panic>50) say('p50',T('m_p50'),30);
  if(S.panic>78) say('p78',T('m_p78'),25);
  if(st.stage==='behind' && st.p>.4 && !S.tut.active) say('bnear',T('m_behindNear'),20);
  /* heartbeat moved to tenseTick() in audio.js (driven by his distance and her panic) */
  if(S.panic>=100) endGame('panic');
}
