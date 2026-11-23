"use strict";
/* THE MODERATOR — review «typing v1» (21.11.2026): Mia types. Loaded by review/window_v2 and review/closet_v1 after desk-v1,
   mug-v1 and drink-v1. The game and the mia_v2 art are untouched.
   How: her hands are the same pixels in every mia_v2 face picture, so each finger (4 + thumb per hand) was prepared offline
   from mia_v2_calm.png: its distal part lifted toward the knuckle by 1/3, 2/3 and 3/3 of AMAX (16 px of the 1254² picture),
   the keys under the tip restored from mia_v2_chair_empty.png. typing_atlas.png holds these patches (only the changed pixels);
   TYP.F[finger][level] = [atlas x, y, w, h, x in the picture, y in the picture].
   A keystroke = a short lift-and-strike of one finger: level 0 → peak → 0. The wrists, palms, keyboard and body never move.
   Drawn last over the desk pass, at the same moving rect as her body (DSK1.last), with her tone (MTONE).
   Priority: drinking, the phone, away, an attack/pull/take, the scare faces → no typing; strokes in flight are dropped,
   so the hands are in the rest pose (= the picture itself) at once. Blink / talk / breathing do not touch the hands. */
const TYP={ on:true, test:false, auto:false, gapAuto:[1.8,5.5], mode:'poses', amp:2, speed:1, img:null, F:{"L1":[[0,0,67,76,336,1158],[69,0,67,77,336,1157],[138,0,67,77,336,1157]],"L2":[[207,0,68,88,380,1148],[277,0,68,89,380,1147],[347,0,68,89,380,1147]],"L3":[[417,0,67,83,419,1143],[486,0,68,83,418,1143],[556,0,68,84,418,1142]],"L4":[[626,0,68,69,457,1152],[696,0,68,70,457,1151],[766,0,68,70,457,1151]],"LT":[[836,0,46,44,501,1155],[884,0,47,45,500,1154],[933,0,47,45,500,1154]],"R1":[[0,91,78,80,685,1155],[80,91,78,81,685,1154],[160,91,79,81,685,1154]],"R2":[[241,91,66,92,739,1144],[309,91,66,93,739,1143],[377,91,66,94,739,1142]],"R3":[[445,91,65,88,777,1148],[512,91,65,88,777,1148],[579,91,66,88,777,1148]],"R4":[[647,91,68,64,816,1159],[717,91,69,64,816,1159],[788,91,69,65,816,1158]],"RT":[[859,91,63,49,667,1156],[924,91,64,50,667,1155],[0,187,64,50,667,1155]]},
  strokes:[], burst:0, gap:.6, next:0, lastK:null, lastHand:null, lastT:0, holdT:0 };
const TYP_BASE=window.TYP_BASE||'';
{ const i=new Image(); i.onload=()=>TYP.img=i; i.src=TYP_BASE+'typing_atlas.png'; }
/* 21.11 «poses» mode: two hand positions drawn in ChatGPT Images (alt/pose_R.png = her right hand, screen left; pose_L.png = her
   left hand, screen right), only the changed area of the hand + the keys it uncovers, at [x, y, w, h] in the 1254² picture.
   A keystroke on a hand shows that hand's pose for the stroke (short fade in/out); the rhythm and the interruptions are the same. */
TYP.P={"R":[294,1049,255,181],"L":[684,1057,250,169]}; TYP.pimg={};
for(const h of ['R','L']){ const i=new Image(); i.onload=()=>TYP.pimg[h]=i; i.src=TYP_BASE+'alt/pose_'+h+'.png'; }
TYP.HANDS={ L:['L1','L2','L3','L4'], R:['R1','R2','R3','R4'] };
TYP.W={ L1:.13, L2:.25, L3:.31, L4:.31, R1:.31, R2:.31, R3:.25, R4:.13 };     /* index/middle more often than the little finger */
function typRand(a,b){ return a+Math.random()*(b-a); }
function typPick(h){ const f=TYP.HANDS[h]; let s=0; for(const k of f) s+=(k===TYP.lastK?0:TYP.W[k]); let r=Math.random()*s; for(const k of f){ const w=k===TYP.lastK?0:TYP.W[k]; if((r-=w)<=0) return k; } return f[1]; }
/* why she can't type right now (null = she can) */
function typBlock(){ if(!S||!S.running||S.over||S.finaleEmpty) return 'off';
  if(typeof DRK!=='undefined' && DRK.active) return 'drink';
  if(S.mia.awayT>0) return 'away'; if(S.mia.phone) return 'phone';
  if(S.pullK!=null || S.taken || S.scareT>0) return 'attack';
  if(typeof MV2!=='undefined' && /scared|panic|surprised/.test(MV2.curKey||'')) return 'scared';
  if(!(typeof mv2LayersReady==='function' && mv2LayersReady()) || !S.artRect) return 'art';
  return null; }
function typTick(dt){ dt*=TYP.speed;                                   /* speed scales the whole rhythm (strokes, bursts, gaps) */
  const want = TYP.on && (TYP.test || TYP.auto), b=typBlock();
  if(!want || b){ TYP.strokes.length=0; TYP.burst=0; TYP.holdT = b ? .6 : 0; return; }   /* drop everything → rest pose */
  if(TYP.holdT>0){ TYP.holdT-=dt; return; }                                              /* a beat after an interruption */
  for(const s of TYP.strokes) s.t+=dt/s.d; TYP.strokes=TYP.strokes.filter(s=>s.t<1);
  if(TYP.burst<=0){ if(TYP.gap>0){ TYP.gap-=dt; return; } TYP.burst=typRand(.5,1.5); TYP.gap= TYP.test ? typRand(.35,1.6) : typRand(TYP.gapAuto[0],TYP.gapAuto[1]);   /* in the game: short bursts, longer pauses */ TYP.next=0; }
  TYP.burst-=dt; TYP.next-=dt;
  if(TYP.next<=0 && TYP.burst>0){
    let h = TYP.lastHand ? (Math.random()<.62 ? (TYP.lastHand==='L'?'R':'L') : TYP.lastHand) : (Math.random()<.5?'L':'R');
    if(TYP.strokes.some(s=>s.h===h)) h = h==='L'?'R':'L';                                /* one finger per hand at a time */
    if(!TYP.strokes.some(s=>s.h===h)){
      const k = Math.random()<.07 ? (Math.random()<.7?'RT':'LT') : typPick(h);          /* now and then a thumb on the space bar */
      TYP.strokes.push({k, h: k[0], t:0, d:typRand(.085,.14)*(TYP.mode==='poses'?1.6:1), p:k[1]==='T'?1:Math.min(TYP.amp, Math.random()<.25?TYP.amp-1||1:TYP.amp)});
      TYP.lastK=k; TYP.lastHand=k[0]; }
    TYP.next = typRand(.075,.2) * (Math.random()<.12?2.2:1);                 /* uneven rhythm, small hesitations */
  }
}
function typDraw(c){
  if(!TYP.strokes.length || typBlock() || (TYP.mode!=='poses' && !TYP.img)) return;
  const R=DSK1.last||mv2Rect(), s=R[2]/1254, f0=c.filter; c.filter=mtoneF();
  if(TYP.mode==='poses'){ for(const st of TYP.strokes){ const ph = st.h==='L' ? 'R' : 'L', I=TYP.pimg[ph], e=TYP.P[ph]; if(!I) continue;   /* screen-left hand (L*) = her right hand = pose_R */
      const a=Math.min(1,1.8*Math.sin(Math.PI*Math.min(1,st.t))); if(a<=.02) continue; const g0=c.globalAlpha; c.globalAlpha=a;
      c.drawImage(I, R[0]+e[0]*s, R[1]+e[1]*s, e[2]*s, e[3]*s); c.globalAlpha=g0; }
    c.filter=f0; return; }
  for(const st of TYP.strokes){ const v=Math.sin(Math.PI*Math.min(1,st.t)), lv=Math.round(v*st.p); if(lv<1) continue;
    const e=TYP.F[st.k] && TYP.F[st.k][lv-1]; if(!e) continue;
    c.drawImage(TYP.img, e[0],e[1],e[2],e[3], R[0]+e[4]*s, R[1]+e[5]*s, e[2]*s, e[3]*s); }
  c.filter=f0; }
{ const dk=drawDesk; drawDesk=function(c){ const r=dk.apply(this,arguments);
    try{ const now=performance.now(), dt=Math.min(.05,Math.max(0,(now-(TYP.lastT||now))/1000)); TYP.lastT=now;
      if(!(typeof paused!=='undefined' && paused)) typTick(dt); if(DSK1.on) typDraw(c); }catch(e){ console.warn(e); } return r; }; }
/* test switch: button + T */
function typPanel(){ const b=document.createElement('button'); b.type='button'; b.id='typBtn';
  const lab=()=>b.textContent=(TYP.test?'⌨ печать: вкл':'⌨ печать: выкл')+' (T)'; lab();
  b.style.cssText='position:fixed;right:290px;bottom:12px;z-index:100002;font:13px/1 system-ui,sans-serif;padding:7px 11px;border-radius:8px;border:1px solid #6d5a7a;background:#2a2131e6;color:#fff;cursor:pointer;opacity:.7';
  const css=document.createElement('style'); css.textContent='body.wv2-clean #typBtn{display:none}'; document.head.appendChild(css);
  const tg=()=>{ TYP.test=!TYP.test; lab(); }; b.onclick=()=>{ if(typeof paused!=='undefined'&&paused) setPause(false); tg(); }; document.body.appendChild(b);
  const m=document.createElement('button'); m.type='button'; m.id='typMode'; const ml=()=>m.textContent='режим: '+(TYP.mode==='poses'?'позы':'пальцы')+' (Y)'; ml();
  m.style.cssText=b.style.cssText; m.style.right='440px'; css.textContent+=' body.wv2-clean #typMode{display:none}';
  const mt=()=>{ TYP.mode = TYP.mode==='poses' ? 'fingers' : 'poses'; ml(); }; m.onclick=mt; document.body.appendChild(m);
  addEventListener('keydown',e=>{ if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName||'')||e.repeat) return; if(e.code==='KeyT') tg(); else if(e.code==='KeyY') mt(); }); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',typPanel); else typPanel();
