"use strict";
/* THE MODERATOR — review «desk v1: the mug» (21.11.2026). Loaded by review/window_v2 and review/closet_v1. The game is untouched.
   The game's drawDesk (render.js) paints «a can» by code at the desk edge: rr(c,78,156,8,12,1.5) red + a pale label fillRect(78,159,8,2).
   Here: that can is not drawn; instead the author's mug (mug_cat.png, transparent, handle to the right) is a separate object
   standing on the desk, left of the keyboard (screen left = Mia's right hand), within reach of her right hand.
   Scale from her hand and the keyboard in the new art (≈0.5 cm per scene unit): a 9.5 cm mug ≈ 18.5 units tall.
   The contact shadow is tied to MUG.x / MUG.y (the point where its bottom stands on the desk): move the mug, the shadow follows.
   Drawn after the desk and the lower slice of Mia (her hands, the keyboard), so it stands in front of the desk line;
   the room darkness and the monitor light are applied to it by the game like to everything else. */
const MUG={ on:true, x:88.5, y:168.2, h:18.5, img:null };   /* 21.11: bottom on the desk plane of desk-v1.js, at the depth of the keyboard */
const MUG_BASE=window.MUG_BASE||'';
{ const i=new Image(); i.onload=()=>MUG.img=i; i.src=MUG_BASE+'mug_cat_left.png'; }   /* 21.11: mirrored, handle on the viewer's left = Mia's right hand (agreed with the drink frames) */
/* the image: 370×360, body centre at .365 of the width, body width .70 of the width, bottom of the body at the last row */
MUG.geo={ cx:.635, bw:.70 };   /* mirrored file: the body centre is at 1-.365 of the width, so MUG.x / the shadow stay on the same spot */

/* no can: the game's rr() for exactly that rectangle leaves an empty path, so the following fill() paints nothing */
{ const rr0=rr; rr=function(c,x,y,w,h,r){ if(MUG.on && x===78 && y===156 && w===8 && h===12){ c.beginPath(); return; } return rr0.apply(this,arguments); }; }
/* and its pale label strip (only inside drawDesk) */
function mugNoLabel(c){ return new Proxy(c,{ get(t,k){ const v=t[k]; if(typeof v!=='function') return v;
    if(k==='fillRect') return function(x,y,w,h){ if(MUG.on && x===78 && y===159 && w===8 && h===2) return; return v.apply(t,arguments); };
    return v.bind(t); }, set(t,k,v){ t[k]=v; return true; } }); }

function mugDraw(c){ if(!MUG.on||!MUG.img||MUG.hide) return;   /* hide: drink-v1 has the mug in its frames */ const I=MUG.img, h=MUG.h, w=h*I.width/I.height, x0=MUG.x-MUG.geo.cx*w, y0=MUG.y-h;
  /* contact shadow on the desk, under its bottom (monitor light from the front: the shadow sits a little behind) */
  const rx=w*MUG.geo.bw*.62, ry=1.5, sy=MUG.y-.5;
  c.save(); c.translate(MUG.x,sy); c.scale(1,ry/rx); const g=c.createRadialGradient(0,0,0,0,0,rx); g.addColorStop(0,'rgba(8,4,10,.62)'); g.addColorStop(.6,'rgba(8,4,10,.35)'); g.addColorStop(1,'rgba(8,4,10,0)');
  c.fillStyle=g; c.beginPath(); c.arc(0,0,rx,0,7); c.fill(); c.restore();
  { const f0=c.filter; if(typeof mtoneF==='function') c.filter=mtoneF(); c.drawImage(I,x0,y0,w,h); c.filter=f0; }   /* same tone as Mia (desk-v1 MTONE) */
}
{ const dk=drawDesk; drawDesk=function(c){ const r=dk(MUG.on?mugNoLabel(c):c); try{ mugDraw(c); }catch(e){ console.warn(e); } return r; }; }
