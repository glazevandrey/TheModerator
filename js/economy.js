"use strict";
// ======================= REC (Highlight Moment) → HypeCoins, donations =======================
function rec(){
  if(!S.running||S.rec.active>0||S.rec.cd>0) return;
  S.rec.active=2.4; SFX.rec(); S.glitch=.35; SFX.glitch(); addPanic(4); S.stats.recs++;
  say('rec',T('m_rec'),12);
}
function recValue(){
  /* reward 30–250 HC: further along the path and darker = riskier = more */
  const st=S.st; const out=[];
  if(st.stage!=='hidden' && st.p>.08){
    const base={window:.25,door:.55,closet:.6,behind:.85}[st.stage];
    const dark={DEAD:1,DIM:1,STABLE:.7,BOOST:.4}[lampMode(STAGE_LAMP[st.stage])];
    const risk=clamp((base+.15*st.p)*dark,0,1);
    out.push({val:Math.round((30+220*risk)/10)*10, label:T('zl_'+st.stage), kind:st.stage});
  }
  if(S.ev.chairShow>0) out.push({val:160,label:T('zl_chair'),kind:'chair'});
  if(S.ev.note && !S.blinds.closed) out.push({val:140,label:T('zl_note'),kind:'note'});
  out.sort((a,b)=>b.val-a.val);
  return out;
}
function finishRec(){
  const found=recValue(); const best=found[0]||{val:0,label:'',kind:''}; best.val=Math.round(best.val*(1+.25*upLv('lens'))/10)*10;
  const capturedNote=found.some(f=>f.kind==='note')&&!S.ev.noteRec;
  S.hc+=best.val; if(best.val) S.viewers+=Math.round(best.val/4);
  let img=''; try{ const th=document.createElement('canvas'); th.width=320; th.height=160; th.getContext('2d').drawImage(feed,0,0,320,160); img=th.toDataURL('image/jpeg',.8); }catch(e){}
  const clip={img,val:best.val,label:best.label,kind:found.some(f=>f.kind==='note')?'note':best.kind,clock:clockStr(),night:S.night.key};
  S.clips.push(clip); if(capturedNote)evidenceCaptured(); ARCHIVE.push(clip); if(ARCHIVE.length>24) ARCHIVE.shift();
  pushMsg('sys','',best.val?T('clipSaved',{v:best.val,label:best.label}):T('clipNone')).read=true;
  S.rec.cd=CD.rec; S.rec.flash=.6;
  if(best.val&&!capturedNote) tip('recdone',T('tipRec'));
}
function economyTick(dt){
  S.ev.noteFly=Math.max(0,(S.ev.noteFly||0)-dt);
  if(S.rec.active>0){ S.rec.active-=dt; if(S.rec.active<=0){ S.rec.active=0; finishRec(); } }
  else S.rec.cd=Math.max(0,S.rec.cd-dt);
  S.rec.flash=Math.max(0,(S.rec.flash||0)-dt);
  S.donate.cd=Math.max(0,S.donate.cd-dt); S.focus=Math.max(0,S.focus-dt);
  if(S.t>70 && S.hc>=donateCost()) tip('donate',T('tipDonate'));
  // the stream itself earns: subs and tips trickle in while she is on air
  const inc=S.night.inc||0; if(inc>0){ S.hcf+=inc*dt*(S.tox>TOX.half?.5:1); if(S.hcf>=1){ const k=Math.floor(S.hcf); S.hcf-=k; S.hc+=k; } }
  // comeback: once per night a real viewer donates when Mia is about to break
  if(S.night.rescue && !S.rescued && S.panic>=82 && !S.tut.active){ S.rescued=true; S.panic=Math.max(0,S.panic-24); S.focus=6; SFX.donate();
    pushMsg('donation',viewerName(),T('rescueMsg')).read=true; say('force',T('m_rescue')); floaty(T('f_rescue')); }
}
function donateCost(){ const c=(S&&S.night&&S.night.cost)||COST.donate; return upLv('calm')?Math.max(80,c-30):c; }
function donate(){
  if(!S.running||S.hc<donateCost()||S.donate.cd>0) return;
  const cost=donateCost(); S.hc-=cost; S.stats.donates++; S.donate.cd=CD.donate; S.focus=8; S.panic=Math.max(0,S.panic-(upLv('calm')?35:26)); SFX.donate();
  pushMsg('donation','modbot',T('donationMsg',{v:cost})).read=true;
  say('force',T('m_donate'));
}
