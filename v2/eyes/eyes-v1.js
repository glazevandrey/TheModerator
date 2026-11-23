"use strict";
/* THE MODERATOR — review «eyes v1» (21.11.2026; v2 the same day: no pixel read-back, works from file://).
   Loaded by review/window_v2 and review/closet_v1 after door/window/closet.
   The game (render.js) draws the eye glow LAST, over the whole frame, as two little rectangles: so the eyes shine through
   the blinds, the note, the window frame, the closet leaf, the door leaf and Mia's head.
   Here (visual only, every rule stays the game's):
     - round eyes with a soft glow; brightness by the lamp of the zone exactly as render.js
       (DEAD .75 / DIM .6 / STABLE .4 / BOOST .14, behind = the closet lamp, red = S.st.red at his stage);
     - occlusion WITHOUT reading pixels: when an eye is pushed during drawRoom, it is drawn at once into its own layer
       (a canvas the size of the feed). Every canvas call drawRoom makes after that is repeated into that layer as
       'destination-out' - so whatever is drawn over the eye (room picture with the frame and curtains, blinds, note, palms,
       closet leaf, door leaf, Mia, the desk) erases it there. After the frame the layers are laid over the picture
       (after the night darkness, where the game puts its eyes). v1 read the mask back with getImageData: opened as
       file://, the images taint the canvas and that call throws - the menu stopped drawing. This version never reads.
   The scare eyes (S.fxEyes / fxFace, pushed after the room) are untouched and drawn by the game. */
const EYV={ on:true, pool:[], active:[], list:[], dbg:false };
function eyvLayer(){ let o=EYV.pool.pop(); if(!o){ const cv=document.createElement('canvas'); o={ cv, x:cv.getContext('2d') }; }
  if(o.cv.width!==feed.width||o.cv.height!==feed.height){ o.cv.width=feed.width; o.cv.height=feed.height; }
  const x=o.x; x.setTransform(1,0,0,1,0,0); x.globalAlpha=1; x.globalCompositeOperation='source-over'; x.clearRect(0,0,o.cv.width,o.cv.height); return o; }
const EYV_QUERY=new Set(['createLinearGradient','createRadialGradient','createConicGradient','createPattern','createImageData','getImageData','measureText','isPointInPath','isPointInStroke','getTransform','getLineDash','getContextAttributes']);
const EYV_SKIP=new Set(['clearRect','putImageData']);   /* never wipe an eye layer */
/* a context that draws on the real one and repeats every call into the eye layers as an eraser */
function eyvProxy(c){ return new Proxy(c,{
  get(t,k){ const v=t[k]; if(typeof v!=='function') return v; if(EYV_QUERY.has(k)) return v.bind(t);
    return function(...a){ const r=v.apply(t,a);
      if(EYV.active.length && !EYV_SKIP.has(k)) for(const o of EYV.active){ const x=o.x; x.globalCompositeOperation='destination-out'; try{ x[k].apply(x,a); }catch(e){} }
      return r; }; },
  set(t,k,v){ t[k]=v; if(k!=='globalCompositeOperation') for(const o of EYV.active){ try{ o.x[k]=v; }catch(e){} } return true; } }); }
/* the eye's two points, as render.js places its two rectangles */
function eyvPts(e){ const dx=2.6*e.s, ew=Math.max(1.2,1.5*e.s), eh=e.s>1.3?1.6:1; return [[e.x-dx-.6+ew/2,e.y+eh/2],[e.x+dx-.6+ew/2,e.y+eh/2]]; }
function eyvGlyph(x,e){
  const m = e.zone==='chair'?'DIM' : e.zone==='behind'?lampMode('closet') : lampMode(e.zone);
  const a = e.fx ? .95 : ({DEAD:.75,DIM:.6,STABLE:.4,BOOST:.14}[m]??.4);
  const red = S.st.red && e.zone===S.st.stage && e.zone!=='behind';
  const col = red ? '240,64,52' : '236,236,220', A = red ? Math.max(a,.7) : a;
  const ew=Math.max(1.2,1.5*e.s), r=Math.max(.5,.42*ew);
  for(const [px,py] of eyvPts(e)){
    const g=x.createRadialGradient(px,py,0,px,py,r*3.2); g.addColorStop(0,`rgba(${col},${.32*A})`); g.addColorStop(1,`rgba(${col},0)`);
    x.fillStyle=g; x.beginPath(); x.arc(px,py,r*3.2,0,7); x.fill();
    x.fillStyle=`rgba(${col},${A})`; x.beginPath(); x.arc(px,py,r,0,7); x.fill(); } }

{ const dr0=drawRoom; drawRoom=function(c){
    if(!EYV.on || c!==ctx){ EYV.T=null; return dr0(c); }
    EYV.T=c.getTransform(); EYV.active.length=0; EYV.done=[];
    const r=dr0(eyvProxy(c));
    EYV.list=EYV.active.slice(); EYV.active.length=0; EYV.T=null;
    eyes.length=0;   /* the game's own loop draws nothing for these; the layers are laid on after the frame (below) */
    return r; }; }
/* door-v2 makes a fresh eyes array right before DV2_BACK: watch its pushes from there */
{ const b0=window.DV2_BACK; window.DV2_BACK=function(c){ if(EYV.on && EYV.T){ const arr=eyes;
      arr.push=function(...es){ for(const e of es){ if(e && !e.fx && S && !S.over){ const o=eyvLayer(), x=o.x, T=c.getTransform();
            x.setTransform(EYV.T); x.globalCompositeOperation='source-over'; eyvGlyph(x,e);   /* eyes live in the base frame */
            x.setTransform(T); x.globalAlpha=c.globalAlpha; x.lineWidth=c.lineWidth; EYV.active.push(o); } } return Array.prototype.push.apply(this,es); }; }
    if(b0) return b0(c); }; }

function eyvDraw(){ if(!EYV.on||!EYV.list.length) return; const c=ctx;
  if(S && !S.over){ c.save(); c.setTransform(1,0,0,1,0,0); c.globalAlpha=1; c.globalCompositeOperation='source-over'; for(const o of EYV.list) c.drawImage(o.cv,0,0); c.restore(); }
  for(const o of EYV.list) EYV.pool.push(o); EYV.list=[]; }
{ const r0=render; render=function(){ const out=r0.apply(this,arguments); try{ eyvDraw(); }catch(e){ console.warn(e); } return out; }; }
