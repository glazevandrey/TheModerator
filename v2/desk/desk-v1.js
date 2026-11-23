"use strict";
/* THE MODERATOR — review «desk v1: the lower part of the frame» (21.11.2026). Loaded by review/window_v2 and review/closet_v1
   (before mug-v1.js). The game and mia-v2.js are untouched; this only wraps them.
   What was there (and why the keyboard was cut and the desk did not read):
     - the new Mia picture (mia_v2_<face>.png, 1254²) has her body, hands AND the keyboard painted in; its bottom is at y 173.6,
       the camera ends at y 172 → the front of the keyboard was cut;
     - mia_v2_chair_layer.png (the chair) also carries a thin keyboard bar and two scraps of «desk edge» at its bottom corners;
     - the game's drawDesk paints its own brown desk band from y 164 and then repaints the lower slice of Mia's whole composite
       (chair included) over it - so the chair sides stood in front of the desk, and the desk was a thin strip.
   Now:
     1. Mia (picture + layers + the empty chair) is lifted by DSK1.miaDY (−2.2): the whole keyboard is inside the camera.
     2. drawDesk: after the game's band, a desk plane from DSK1.back (y 161) to the bottom of the frame, a lit far edge;
        everything of the picture below that line is under the desk (the chair, the scraps of the painted desk edge).
     3. On the desk again: the keyboard (cut from Mia's composite by its own rectangle) with a soft contact shadow, then her
        sleeves and hands (her face picture through body_mask, at the same moving rect as in drawMiaArt) - hands over the keys.
        Mia away: the empty chair's keyboard. The sticky note is redrawn on the plane (the game paints it under).
     4. mug-v1.js stands the mug on the same plane (its bottom on the desk, with its shadow). */
/* MTONE (21.11): Mia is a bright painted sprite in a dark room - a little darker and less saturated, so she sits in it.
   Applied to her whole picture (chair, body, keyboard), the empty chair, and the keyboard/hands redrawn on the desk. */
const MTONE={ on:true, b:.84, s:.82, c:.96 };
function mtoneF(){ return MTONE.on ? `brightness(${MTONE.b}) saturate(${MTONE.s}) contrast(${MTONE.c})` : 'none'; }
function mtoneWrap(fn){ return function(c){ const f0=c.filter; c.filter=mtoneF(); try{ return fn.apply(this,arguments); } finally{ c.filter=f0; } }; }
{ const a0=drawMiaArt; drawMiaArt=mtoneWrap(a0); const c0=drawChair; drawChair=mtoneWrap(c0); }
const DSK1={ on:true, miaDY:-2.2, back:161, kb:[140,1166,1114,1254], last:null };   /* kb: the keyboard in the 1254² picture */
{ const r0=mv2Rect; mv2Rect=function(){ const r=r0.apply(this,arguments); if(DSK1.on) r[1]+=DSK1.miaDY; return r; }; }
{ const m0=miaMoRect; miaMoRect=function(r){ const o=m0.apply(this,arguments); DSK1.last=o; return o; }; }

function deskKbRect(){ const [bx,by,bw,bh]=mv2Rect(), s=bw/1254, [a,b,c,d]=DSK1.kb; return [bx+a*s, by+b*s, (c-a)*s, (d-b)*s]; }
function deskPlane(c){ const y0=DSK1.back, y1=CAM_Y+CAM_H+1;
  const g=c.createLinearGradient(0,y0,0,y1); g.addColorStop(0,'#4a3329'); g.addColorStop(.35,'#3b2820'); g.addColorStop(1,'#271a14');
  c.fillStyle=g; c.fillRect(0,y0,W,y1-y0);
  const m=c.createRadialGradient(MIA.x,y0+2,0,MIA.x,y0+2,70); m.addColorStop(0,'rgba(190,150,230,.14)'); m.addColorStop(1,'rgba(190,150,230,0)');   /* monitor light on the desk near her */
  c.fillStyle=m; c.fillRect(0,y0,W,y1-y0);
  c.fillStyle='rgba(0,0,0,.35)'; c.fillRect(0,y0,W,.9);                       /* the gap behind the far edge */
  c.fillStyle='rgba(255,205,190,.20)'; c.fillRect(0,y0+.9,W,.45);             /* the far edge catches the light */
  c.fillStyle='rgba(255,220,200,.04)'; for(let i=0;i<4;i++) c.fillRect(0,y0+3+i*2.6,W,.3);   /* a faint sheen of the laminate */
}
function deskFront(c){
  if(S.finaleEmpty || S.pullK!=null || typeof mv2LayersReady!=='function') return;
  const [kx,ky,kw,kh]=deskKbRect();
  const away = S.mia.awayT>0;
  /* contact shadow under the keyboard's front edge */
  { const cx=kx+kw/2, cy=ky+kh-.4, rx=kw*.52, ry=1.3; c.save(); c.translate(cx,cy); c.scale(1,ry/rx); const g=c.createRadialGradient(0,0,0,0,0,rx);
    g.addColorStop(0,'rgba(6,3,8,.55)'); g.addColorStop(.7,'rgba(6,3,8,.3)'); g.addColorStop(1,'rgba(6,3,8,0)'); c.fillStyle=g; c.beginPath(); c.arc(0,0,rx,0,7); c.fill(); c.restore(); }
  c.save(); c.beginPath(); c.rect(0,DSK1.back,W,30); c.clip(); c.filter=mtoneF();
  if(away){ const E=MV2.L.chair_empty; if(E){ const [bx,by,bw,bh]=mv2Rect(); c.save(); c.beginPath(); c.rect(kx,ky,kw,kh+2); c.clip(); c.drawImage(E,bx,by,bw,bh); c.restore(); } }
  else if(typeof drinkFront==='function' && drinkFront(c)){}   /* drink-v1: the frame's own front part (arm, mug, keyboard) */
  else if(S.artRect && mv2LayersReady()){
    const A=S.artRect; c.save(); c.beginPath(); c.rect(kx,ky,kw,kh+2); c.clip(); c.drawImage(A[4],A[0],A[1],A[2],A[3]); c.restore();   /* the keyboard */
    const img=MV2.curImg||MV2.img, R=DSK1.last||mv2Rect(), M=MV2.L.body_mask;
    if(img && M){ const [x,y,w,h]=R, Rr=SC, t=DSK1.t||(DSK1.t=document.createElement('canvas')), pw=Math.ceil(w*Rr), ph=Math.ceil(h*Rr);
      if(t.width!==pw||t.height!==ph){ t.width=pw; t.height=ph; } const q=t.getContext('2d');
      q.setTransform(1,0,0,1,0,0); q.globalCompositeOperation='source-over'; q.clearRect(0,0,pw,ph); q.drawImage(img,0,0,pw,ph);
      q.globalCompositeOperation='destination-in'; q.drawImage(M,0,0,pw,ph); q.globalCompositeOperation='source-over';
      c.drawImage(t,x,y,w,h); }   /* her sleeves and hands, over the keys and the desk */
  }
  c.restore();
}
function deskNote(c){ c.fillStyle='#e9d27a'; c.save(); c.translate(236,170); c.rotate(.12); c.fillRect(-7,-6,14,12); c.restore(); }   /* the game's sticky note, back on top of the desk */
{ const dk=drawDesk; drawDesk=function(c){ const r=dk.apply(this,arguments); if(!DSK1.on||!S) return r;
    try{ deskPlane(c); deskFront(c); deskNote(c); }catch(e){ console.warn(e); } return r; }; }
