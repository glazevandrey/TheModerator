"use strict";
/* THE MODERATOR — review «drink v1» (21.11.2026): a DRAFT animation of Mia drinking from the cat mug. Loaded by review/window_v2
   and review/closet_v1 after desk-v1.js and mug-v1.js. The game is untouched.
   Frames drink_1..8.png (half resolution of Mia's canvas widened to the left: 1574×1254 → 787×627; Mia at +320 px, exactly
   where the original sits) were built from the author's 8-frame sheet: background cleared, each frame aligned to the original
   Mia (head by features, body by landmarks), and ONLY the right arm + the mug taken from it (frame 8: the closed eyelids);
   everything else is the original still layers (chair, body, keyboard, the empty chair for the keyboard under the lifted hand).
   Frame 1 = the original pose + the game mug; frames 1-3 use the game mug (handle right, like the sheet's 1-3), 4-8 the sheet's
   mug in her hand. drink_i_front.png = what is in front of the desk in that frame (body, arm, mug, keyboard) for desk-v1's pass.
   While the sequence runs the mug on the desk (mug-v1) is hidden: there is one mug on screen.
   Known art issue: in 1-3 the handle is on the right, in 4-8 on the left (see drink_flip_3to4.png) - frames 2-3 need a redraw. */
const DRK={ on:true, img:{}, mask:{}, active:false, t0:0, manualT:null, shown:0 };
const DRK_BASE=window.DRK_BASE||'';
for(let i=1;i<=8;i++){ const a=new Image(); a.onload=()=>DRK.img[i]=a; a.src=DRK_BASE+'drink_'+i+'.png';
  const m=new Image(); m.onload=()=>DRK.mask[i]=m; m.src=DRK_BASE+'drink_'+i+'_front.png'; }
/* forward, a short hold at the lips, back in reverse (ms) */
DRK.seq=[[1,110],[2,150],[3,170],[4,170],[5,150],[6,150],[7,170],[8,950],[7,150],[6,140],[5,140],[4,150],[3,170],[2,140],[1,120]];
DRK.len=DRK.seq.reduce((a,b)=>a+b[1],0);
function drkReady(){ for(let i=1;i<=8;i++) if(!DRK.img[i]||!DRK.mask[i]) return false; return true; }
function drkStart(){ if(!S||!S.running||!drkReady()||S.mia.awayT>0||S.pullK!=null||S.mia.phone||S.taken||S.scareT>0) return false; DRK.active=true; DRK.t0=performance.now(); DRK.el=0; DRK.rew=null; DRK.why=''; DRK.manualT=null; if(typeof MUG!=='undefined') MUG.hide=true; return true; }
function drkStop(){ DRK.active=false; DRK.rew=null; if(typeof MUG!=='undefined') MUG.hide=false; DRK.shown=0; }
/* 21.11: urgent things stop it at once (the cup is back on the desk): away, pull/take, phone, scare, and ambient-v1's danger */
/* 22.11: two kinds of interruption.
   - she leaves the desk / is pulled / the phone / the night ends: the cup is back at once (she is gone or her whole pose changes);
   - a threat or a scare (ambient-v1's ambvUrgent, a scare): a QUICK RETURN through the poses already shown, back to frame 1
     (DRK.retMs per frame, game time), while her scared face and any defence play at the same time — nothing waits for the cup.
   Talking does not interrupt (ambient-v1 only does not START a sip while she talks); a pause freezes the pose. */
function drkInstant(){ return !S||S.mia.awayT>0||S.pullK!=null||S.over||S.mia.phone||S.taken; }
function drkThreat(){ return (S&&S.scareT>0)||(typeof ambvUrgent==='function'&&ambvUrgent()); }
DRK.retMs=45;
function drkFrame(){ if(!DRK.active) return 0;
  if(drkInstant()){ DRK.why=S&&S.mia.awayT>0?'ушла':S&&S.mia.phone?'телефон':S&&(S.pullK!=null||S.taken)?'нападение':'конец'; drkStop(); return 0; }
  if(DRK.rew){ const k=Math.floor(DRK.rew.el/DRK.retMs); if(k>=DRK.rew.fr.length){ drkStop(); return 0; } return DRK.rew.fr[k]; }
  if(DRK.manualT==null && drkThreat() && DRK.shown){ const fr=[]; for(let f=DRK.shown-1; f>=1; f--) fr.push(f);
    DRK.why='угроза: быстро поставила'; if(!fr.length){ drkStop(); return 0; } DRK.rew={fr,el:0}; return fr[0]; }
  const t=DRK.manualT!=null?DRK.manualT:(DRK.el||0);   /* 21.11: game time (stops in pause), counted in the update hook below */ let acc=0; for(const [f,d] of DRK.seq){ acc+=d; if(t<acc) return f; }
  drkStop(); return 0; }
/* her canvas widened by 320 px to the left, on the same rect as mia-v2 (incl. desk-v1's lift) */
function drkRect(){ const [bx,by,bw,bh]=mv2Rect(), s=bw/1254; return [bx-320*s, by, 1574*s, bh]; }
function drkTone(c){ c.filter = typeof mtoneF==='function' ? mtoneF() : 'none'; }
{ const a0=drawMiaArt; drawMiaArt=function(c){ const f=drkFrame(); if(!f) return a0.apply(this,arguments);
    const r=drkRect(), f0=c.filter; drkTone(c); c.drawImage(DRK.img[f],r[0],r[1],r[2],r[3]); c.filter=f0; S.artRect=[r[0],r[1],r[2],r[3],DRK.img[f]]; DRK.shown=f; }; }
/* desk-v1 calls this for the part in front of the desk; true = done (the regular keyboard/hands pass is skipped) */
function drinkFront(c){ const f=DRK.active?DRK.shown:0; if(!f) return false;
  const r=drkRect(), I=DRK.img[f], M=DRK.mask[f], t=DRK.t||(DRK.t=document.createElement('canvas'));
  if(t.width!==I.width||t.height!==I.height){ t.width=I.width; t.height=I.height; }
  const q=t.getContext('2d'); q.globalCompositeOperation='source-over'; q.clearRect(0,0,t.width,t.height); q.drawImage(I,0,0);
  q.globalCompositeOperation='destination-in'; q.drawImage(M,0,0); q.globalCompositeOperation='source-over';
  const f0=c.filter; drkTone(c); c.drawImage(t,r[0],r[1],r[2],r[3]); c.filter=f0; return true; }
/* test button + J */
function drkPanel(){ const b=document.createElement('button'); b.type='button'; b.id='drkBtn'; b.textContent='☕ глоток (J)'; b.title='черновая анимация питья';
  b.style.cssText='position:fixed;right:150px;bottom:12px;z-index:100002;font:13px/1 system-ui,sans-serif;padding:7px 11px;border-radius:8px;border:1px solid #6d5a7a;background:#2a2131e6;color:#fff;cursor:pointer;opacity:.7';
  const css=document.createElement('style'); css.textContent='body.wv2-clean #drkBtn{display:none}'; document.head.appendChild(css);
  b.onclick=()=>{ if(typeof paused!=='undefined'&&paused) setPause(false); drkStart(); }; document.body.appendChild(b);
  addEventListener('keydown',e=>{ if(e.code==='KeyJ'&&!e.repeat&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName||'')) drkStart(); }); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',drkPanel); else drkPanel();
/* 21.11: the clock of the sequence runs on the game's update (dt), so a pause freezes it */
{ const u0=update; update=function(dt){ const r=u0.apply(this,arguments); if(DRK.active && S && S.running){ DRK.el=(DRK.el||0)+dt*1000; if(DRK.rew) DRK.rew.el+=dt*1000; if(drkInstant()) drkFrame(); }   /* 22.11: away = her picture is not drawn, so stop here too (the cup must be on the desk while she is gone) */ return r; }; }
