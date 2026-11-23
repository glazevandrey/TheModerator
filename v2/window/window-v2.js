"use strict";
/* THE MODERATOR — test mode "window v2" (20.11.2026, 21.11: approved stack, art pick-up, attacks, scene).
   Loaded ONLY by review/window_v2/index.html (and review/ui_v5), never by the game.
   Runs on top of the real game + ../door_v2/door-v2.js (room v3, door, approved silhouette) + ../mia_v2/mia-v2.js (new Mia)
   + ../mia_v2/demo-v2.js (its DEMO.freeze is no longer used here: «ручной» = WV2.aiOff) + ../rules_v1 (B2, layout A 50/50, rules).
   door-v2 replaces drawRoom() and so the old window block of render.js is not drawn there at all. This file draws the
   window of room v3 through two hooks of door-v2 (no-ops without this file):
     DV2_BACK(c)  - right after the background fill: everything seen THROUGH the glass, back to front:
                    outside → threat (stalker / passer-by / decoy) → phone glow → palms → open-sash air → glass → prints → note → blinds
     DV2_FRONT(c) - right after the room picture: the open sash swung into the room, the hand through the open window.
   The room picture itself is room_winhole.png = room_doorhole.png with the six panes cut out, so the frame, mullions,
   curtains, sill and the plant stay where they are painted (no jump).
   Every rule is the game's own and read from S, never changed here:
     S.st.stage/p/red (stalker.js), S.blinds closed/anim/timer/cd/jammed (lighting.js toggleBlinds/update),
     S.winOpen (days.js hot night, friday.js), S.ev.note/noteFly/noteStay, S.fxPass, S.decoy, lampMode('window'),
     S.fri.slammed (friday.js: the hand in the open window), DY().key for the phone glow.
   ART (21.11): drop a PNG with the right name into this folder and it is used, no code change (WV2.ART below).
   Without it the temporary drawing stays, and the panel says which one is still a stand-in. */
const WV2={ k:320/1774, img:{}, art:{}, hold:null, marks:false, rim:true, prints:null, slamT:0, lastSt:'hidden', lastP:0, scene:null };
const WV2_BASE=window.WV2_BASE||'';
/* room v3 source pixels (1774×887): glass of the six panes, two columns, the centre mullion between them */
WV2.geo={ glass:[66,19,277,489], crop:[54,7,289,501], colL:[66,161], colR:[192,277] };
for(const n of ['room_winhole','window_outside','window_glass_mask','window_sash_erase']){ const i=new Image(); i.onload=()=>WV2.img[n]=i; i.src=WV2_BASE+n+'.png'; }
/* optional art: name → what it replaces. A missing file is fine (404 in the console, the stand-in stays).
   eye: where the eyes are in that PNG (fractions of its own width/height) - measured when the file arrives. */
WV2.ART={
  window_stalker:      { what:'сталкер за стеклом в полный рост', instead:'дверной силуэт без ног', eye:{x:.5,y:.075,gap:.02} },
  window_stalker_palms:{ what:'сталкер по пояс, ладони на стекле', instead:'силуэт + ладони кодом', eye:{x:.5,y:.2,gap:.035} },
  window_blinds:       { what:'слой жалюзи (вырезаю из room_v3_blinds_closed.png)', instead:'планки кодом' },
  window_hand:         { what:'рука в открытом окне (пт), по желанию', instead:'силуэт в левой колонке' },
  window_sash_open:    { what:'слой открытой створки (вырезаю из room_v3_window_open.png)', instead:'створка из полос комнаты' },
};
for(const n in WV2.ART){ const i=new Image(); i.onload=()=>WV2.art[n]=i; i.onerror=()=>{}; i.src=WV2_BASE+n+'.png'; }
const wvX=x=>x*WV2.k, wvY=y=>12+y*WV2.k;
function wv2CropRect(c){ const [x0,y0,x1,y1]=WV2.geo.crop; c.beginPath(); c.rect(wvX(x0),wvY(y0),wvX(x1)-wvX(x0),wvY(y1)-wvY(y0)); c.clip(); }
function wv2Lamp(){ return ({DEAD:0,DIM:.35,STABLE:.6,BOOST:1}[lampMode('window')]||0)*(S.lamps.window.flick||1); }

/* which picture stands for him at the window: own art if it is there, else the approved door silhouette (DV2.sprite) */
function wv2Spr(){ const a=WV2.art.window_stalker; if(a) return { img:a, eye:WV2.ART.window_stalker.eye, fade:0 };
  if(!DV2.sprite) return null; return { img:DV2.sprite, eye:DV2.spriteEye||{x:.444,y:.119,gap:.0111}, fade:((DV2.spriteFade||{})[DV2.spriteName]||0)*1.4 }; }

/* the stalker outside, mapped from the old p→size/height curve onto the right-hand column of the new window
   (the centre mullion is where the old one was: the face stays just right of it, like before).
   far (p 0): ~30 tall, eyes at y≈62, standing in the yard; close (p 1): ~112 tall, eyes at y≈35, face in the glass. */
function wv2Pose(p,t,spr){ spr=spr||wv2Spr(); const h=30+82*Math.pow(p,1.15), w=h*(spr?spr.img.width/spr.img.height:.29);
  const ex=wvX(235)+Math.sin(t*.7)*2*(1-p), ey=62-27*p;
  const E=spr?spr.eye:{x:.5,y:.087,gap:.0198};
  return { h, w, ex, ey, x0:ex-E.x*w, y0:ey-E.y*h, es:E.gap*h/2.6 }; }

/* one sprite drawn on its own canvas: night tint, warm light of the window lamp, a cold rim from the street light behind him
   (21.11: the black silhouette on a dark rainy yard needs an edge to read - visual only), or a flat shadow (decoy/passer-by) */
function wv2Sprite(c,img,x0,y0,w,h,o){ if(!img) return false;
  const pad=2, ox=x0-pad, oy=y0-pad, ow=w+pad*2, oh=h+pad*2, R=SC*2;
  const off=WV2.off||(WV2.off=document.createElement('canvas')); off.width=Math.ceil(ow*R); off.height=Math.ceil(oh*R);
  const x=off.getContext('2d'); x.setTransform(R,0,0,R,-ox*R,-oy*R); x.drawImage(img,x0,y0,w,h);
  x.globalCompositeOperation='source-atop';
  if(o.flat){ x.fillStyle=`rgba(6,5,9,${o.flat})`; x.fillRect(ox,oy,ow,oh); }
  else { x.fillStyle='rgba(12,16,36,.55)'; x.fillRect(ox,oy,ow,oh);   /* outside, at night, in the rain */
    const d=x.createLinearGradient(0,y0,0,y0+h); d.addColorStop(0,'rgba(4,4,8,0)'); d.addColorStop(.36,'rgba(4,4,8,0)'); d.addColorStop(.62,'rgba(4,4,8,.78)'); d.addColorStop(1,'rgba(4,4,8,.9)');
    x.fillStyle=d; x.fillRect(ox,oy,ow,oh);   /* the room light reaches his head and chest, not his legs */
    if(o.warm>0){ const g=x.createLinearGradient(0,y0,0,y0+h*.5); g.addColorStop(0,`rgba(255,190,140,${.14*o.warm})`); g.addColorStop(1,'rgba(255,190,140,0)'); x.fillStyle=g; x.fillRect(ox,oy,ow,oh); } }
  if(o.fade>0){ x.globalCompositeOperation='destination-out'; const f=x.createLinearGradient(0,y0+h*(1-o.fade),0,y0+h);
    f.addColorStop(0,'rgba(0,0,0,0)'); f.addColorStop(1,'rgba(0,0,0,1)'); x.fillStyle=f; x.fillRect(ox,y0+h*(1-o.fade),ow,h*o.fade+pad); }
  if(o.rim>0 && !o.flat){   /* rim: the figure shifted up-left minus the figure itself = a thin edge on the head and shoulders */
    const rc=WV2.rimC||(WV2.rimC=document.createElement('canvas')); rc.width=off.width; rc.height=off.height; const r=rc.getContext('2d');
    r.setTransform(1,0,0,1,0,0); r.clearRect(0,0,rc.width,rc.height); r.globalCompositeOperation='source-over'; r.drawImage(off,0,0);
    r.globalCompositeOperation='source-in'; r.fillStyle='rgb(150,175,235)'; r.fillRect(0,0,rc.width,rc.height);
    r.globalCompositeOperation='destination-out'; const sh=Math.max(1,R*.45*Math.min(1.6,h/40)); r.drawImage(off,sh*.55,sh);
    r.globalCompositeOperation='destination-in'; const g=r.createLinearGradient(0,0,0,rc.height); g.addColorStop(0,'rgba(0,0,0,1)'); g.addColorStop(.45,'rgba(0,0,0,.6)'); g.addColorStop(.75,'rgba(0,0,0,0)'); r.fillStyle=g; r.fillRect(0,0,rc.width,rc.height);
    c.drawImage(off,ox,oy,ow,oh); c.globalAlpha=o.rim; c.drawImage(rc,ox,oy,ow,oh); c.globalAlpha=1; return true; }
  c.drawImage(off,ox,oy,ow,oh); return true; }

/* 22.11: palms at chest height, inside the middle pane of the right column (they used to sit on the transom and read
   as the top pane); a little narrower so both stay inside the pane, not on the mullions */
const WV2_PALM={dx:.2, dy:.78, tilt:.12};   /* tilt: the left palm higher, the right lower (22.11: level palms read wrong) */
/* old procedural palms (render.js), same shapes, scaled to the new figure: they sit ON the glass */
function wv2Palms(c,P,a,fog){ const s=P.w/37*(P.palmK||1);
  for(const sg of [-1,1]){ const px=P.ex+sg*WV2_PALM.dx*P.w, py=P.ey+(WV2_PALM.dy+sg*WV2_PALM.tilt)*P.w;
    c.fillStyle=`rgba(190,205,225,${(fog==null?.24:fog)*a})`; c.beginPath(); c.ellipse(px,py-2*s,5.2*s,6.4*s,0,0,7); c.fill();   /* fog on the glass: brighter than in the old game, so dark palms read on a black figure */
    if(fog!=null&&P.printOnly) continue;
    c.globalAlpha=a; c.fillStyle='#17121a'; c.beginPath(); c.ellipse(px,py,2.6*s,2.9*s,0,0,7); c.fill();
    for(let f=0;f<4;f++){ const fx=px+(f-1.5)*1.25*s+sg*.2*s, len=(f===0||f===3?3.2:4)*s; c.beginPath(); c.ellipse(fx,py-1.6*s-len/2,.55*s,len/2,(f-1.5)*.12,0,7); c.fill(); }
    c.beginPath(); c.ellipse(px-sg*2.8*s,py-.4*s,.6*s,1.8*s,sg*.9,0,7); c.fill();
    c.fillRect(px-1.4*s,py+1.8*s,2.8*s,4*s); c.globalAlpha=1; } }
/* after the knock (he reached the glass on a "window max" night and left): the prints of both palms stay in the fog and melt.
   Visual only - the game has no state for it, so it is kept here (WV2.prints) from the moment he leaves at p≈1. */
function wv2Prints(c,dt){ const P=WV2.prints; if(!P) return; P.t-=dt; if(P.t<=0){ WV2.prints=null; return; }
  /* 22.11: a trace on fogged glass, not a hand - pale, soft-edged (blur), smeared downwards, with long drips that keep running */
  const a=Math.min(1,P.t/2), s=P.w/37, run=1-P.t/3.5;
  c.save(); c.filter=`blur(${(.9*s).toFixed(2)}px)`;
  for(const sg of [-1,1]){ const px=P.ex+sg*WV2_PALM.dx*P.w, py=P.ey+(WV2_PALM.dy+sg*WV2_PALM.tilt)*P.w;
    c.fillStyle=`rgba(200,212,232,${.12*a})`; c.beginPath(); c.ellipse(px,py-1.2*s,5*s,7.2*s,0,0,7); c.fill();   /* the fogged patch */
    c.fillStyle=`rgba(222,230,244,${.16*a})`; c.beginPath(); c.ellipse(px,py+.6*s,2.3*s,3.4*s,sg*.08,0,7); c.fill();   /* the palm, smeared down */
    for(let f=0;f<4;f++){ const fx=px+(f-1.5)*1.25*s+sg*.2*s, len=(f===0||f===3?2.6:3.2)*s; c.beginPath(); c.ellipse(fx,py-1.8*s-len/2,.5*s,len/2,(f-1.5)*.12,0,7); c.fill(); } }
  c.filter='none';
  for(const sg of [-1,1]){ const px=P.ex+sg*WV2_PALM.dx*P.w, py=P.ey+(WV2_PALM.dy+sg*WV2_PALM.tilt)*P.w;
    c.fillStyle=`rgba(225,232,245,${.22*a})`;
    for(let d=0;d<3;d++){ const dx=px+(d-1)*1.6*s+sg*.3*s, L=(3+d*1.7+run*7)*s; c.fillRect(dx,py+2.4*s,.3*s,L); c.beginPath(); c.arc(dx+.15*s,py+2.4*s+L,.35*s,0,7); c.fill(); } }
  c.restore(); }

/* the note, old drawing at .6 scale, taped on the left column (old place: lower left half of the window) */
function wv2Note(c){ const E=S.ev; if(!(E.note || E.noteFly>0 || E.noteStay)) return;
  const nx=wvX(113), ny=wvY(285), sc=.6; c.save();
  if(E.noteFly>0){ const p=1-E.noteFly/1.4; c.translate(12*p*sc,65*p*p*sc); c.translate(nx,ny); c.rotate(p*1.1); c.scale(1-p*.2,1-p*.2); c.translate(-nx,-ny); c.globalAlpha=1-p; }
  const mon=S.night&&S.night.key==='mon';
  if(has('window_note')&&!mon) c.drawImage(IMG.window_note,nx-11*sc,ny-14*sc,22*sc,28*sc);
  else { c.translate(nx,ny); c.scale(sc,sc); c.rotate(-.08); c.fillStyle='#d9d2c0'; c.fillRect(-10,-13,20,26); c.fillStyle='rgba(255,255,255,.5)'; c.fillRect(-3,-15,6,3);
    c.strokeStyle='#3a3030'; c.lineWidth=.6; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(-7,-8+i*4); c.lineTo(-7+[13,10,14,8,11][i],-8+i*4+(i%2?.4:-.3)); c.stroke(); }
    if(!mon){ c.fillStyle='#2b2224'; c.beginPath(); c.arc(1,7,3,0,7); c.fill(); c.fillRect(-2,9,6,3); } }
  c.restore(); }

/* blinds. With window_blinds.png (a transparent layer the size of room v3): the layer, shown from the top down to the game's
   S.blinds.anim. Without it - TEMPORARY slats drawn here: fabric slats with a lit upper edge and a shaded lower one, a gap
   of the dark yard between them, two ladder cords, a heavier bottom rail. Behind the frame (the mullions stay in front),
   lit warm by the window lamp. Jammed (blackout night): a crooked strip stuck at the top, a slat twisted out, so the player
   sees WHY the button does nothing. Above the stalker's head at every p. */
function wv2Blinds(c){ const b=S.blinds, [gx0,gy0,gx1,gy1]=WV2.geo.glass, X0=wvX(gx0-4), X1=wvX(gx1+4), Y0=wvY(gy0-4), Hh=wvY(gy1+4)-Y0, W0=X1-X0;
  const wk=wv2Lamp(), down=b.anim>.01?b.anim:0, jam=!down&&b.jammed;
  if(!down && !jam){ c.fillStyle='#2c202d'; c.fillRect(X0,Y0-1.2,W0,1.8); return; }   /* raised: only the head rail */
  const A=WV2.art.window_blinds;
  if(A && down){ const [cx0,cy0,cx1,cy1]=WV2.geo.crop, hh=Hh*down; c.save(); c.beginPath(); c.rect(X0-2,Y0-2,W0+4,hh+2); c.clip();
    c.drawImage(A,0,0,1774,887,0,12,320,887*WV2.k); c.restore(); return; }
  const hh=down?Hh*down:Hh*.2, tilt=jam?-4.2:0, pitch=2.5, n=Math.max(1,Math.floor(hh/pitch));
  const yAt=(y,x)=>y+tilt*(x-X0)/W0;
  const lamp=`rgba(255,190,140,${.14*wk})`;
  for(let i=0;i<n;i++){ const y=Y0+.6+i*pitch, twist=jam&&(i===n-2), th=twist?.7:1.9;
    c.save(); if(twist){ c.translate(X0+W0*.62,yAt(y,X0+W0*.62)); c.rotate(.22); c.translate(-(X0+W0*.62),-yAt(y,X0+W0*.62)); }
    const g=c.createLinearGradient(0,y,0,y+th); g.addColorStop(0,'#7b6377'); g.addColorStop(.35,'#5e4a5d'); g.addColorStop(1,'#3a2c3b');
    c.fillStyle=g; c.beginPath(); c.moveTo(X0,yAt(y,X0)); c.quadraticCurveTo(X0+W0/2,yAt(y,X0+W0/2)+.25,X1,yAt(y,X1)); c.lineTo(X1,yAt(y,X1)+th); c.quadraticCurveTo(X0+W0/2,yAt(y,X0+W0/2)+th+.25,X0,yAt(y,X0)+th); c.closePath(); c.fill();
    if(wk>0){ c.fillStyle=lamp; c.fill(); }
    c.fillStyle='rgba(235,205,225,.10)'; c.fillRect(X0,yAt(y,X0),W0,.25);
    c.restore(); }
  for(const fx of [.28,.72]){ const x=X0+W0*fx; c.strokeStyle='rgba(30,22,32,.85)'; c.lineWidth=.3; c.beginPath(); c.moveTo(x,Y0); c.lineTo(x,yAt(Y0+hh,x)); c.stroke(); }   /* ladder cords */
  const by=Y0+hh; c.fillStyle='#2a1e2b'; c.beginPath(); c.moveTo(X0,yAt(by-1.2,X0)); c.lineTo(X1,yAt(by-1.2,X1)); c.lineTo(X1,yAt(by+.9,X1)); c.lineTo(X0,yAt(by+.9,X0)); c.fill();   /* bottom rail */
  c.fillStyle='#2c202d'; c.fillRect(X0,Y0-1.2,W0,1.8);
  if(down>.97){ c.strokeStyle='rgba(30,22,32,.85)'; c.lineWidth=.3; const x=X0+W0*.9; c.beginPath(); c.moveTo(x,Y0); c.lineTo(x,Y0+Hh*.55); c.stroke(); c.fillStyle='#3a2c3b'; c.fillRect(x-.5,Y0+Hh*.55,1,1.6); }   /* pull cord */
}

function wv2Back(c){ const I=WV2.img; if(!I.room_winhole || !I.window_outside) return;
  if(DV2.img.room_doorhole!==I.room_winhole) DV2.img.room_doorhole=I.room_winhole;   /* the room with both holes */
  const st=S.st, t=S.t, [cx0,cy0,cx1,cy1]=WV2.geo.crop, dt=Math.min(.1,Math.max(0,t-(WV2.t0??t))); WV2.t0=t;
  /* he reached the glass and left (Monday: knock, glass slam): leave the prints - visual only */
  if(WV2.lastSt==='window' && WV2.lastP>.93 && st.stage!=='window' && WV2.lastPose) WV2.prints={ t:3.5, ex:WV2.lastPose.ex, ey:WV2.lastPose.ey, w:WV2.lastPose.w };
  WV2.lastSt=st.stage; WV2.lastP=st.p;
  /* Friday: the hand through the open window (friday.js sets S.fri.slammed once) */
  const sl=!!(S.fri&&S.fri.slammed); if(sl&&!WV2.slSeen){ WV2.slamT=1.6; } WV2.slSeen=sl; if(WV2.slamT>0) WV2.slamT-=dt;
  c.save(); wv2CropRect(c);
  c.drawImage(I.window_outside,wvX(cx0),wvY(cy0),wvX(cx1)-wvX(cx0),wvY(cy1)-wvY(cy0));
  const wk=wv2Lamp(), spr=wv2Spr();
  /* the stalker at the window: render.js WINDOW block, same conditions */
  const handNow=WV2.slamT>0 && S.winOpen;   /* during the hand he is drawn once, leaning into the open column (wv2Front) */
  if(st.stage==='window' && !handNow){ const p=st.p, pa=WV2.art.window_stalker_palms, usePalmArt=pa&&p>.72, P=wv2Pose(p,t,spr); WV2.lastPose=P;
    /* 23.11: stepping back (st.leaving) he also fades, so he does not pop out at the smallest size */
    const la=st.leaving?Math.max(0,Math.min(1,p/.3)):1; if(la<1){ c.save(); c.globalAlpha=la; }
    const drawn = usePalmArt ? (()=>{ const E=WV2.ART.window_stalker_palms.eye, h=P.h*.62, w=h*pa.width/pa.height;
        return wv2Sprite(c,pa,P.ex-E.x*w,P.ey-E.y*h,w,h,{warm:wk,rim:WV2.rim?.45:0}); })()
      : wv2Sprite(c,spr&&spr.img,P.x0,P.y0,P.w,P.h,{warm:wk*(.35+.65*p),fade:spr?spr.fade:0,rim:WV2.rim?.5:0});
    if(drawn){
      eyes.push({x:P.ex,y:P.ey,s:P.es,zone:'window'});
      if(!S.tut.active&&['fri','sat','sun','mon2'].includes(DY().key)&&p>.45&&p<.72){   /* the phone in his hand (old rule, new spot) */
        const hx=P.x0+.70*P.w, hy=P.y0+.55*P.h, s=P.w/37; c.fillStyle='#11141b'; c.fillRect(hx,hy,3*s,5*s); c.fillStyle='rgba(131,155,180,.5)'; c.fillRect(hx+.4*s,hy+.5*s,2.2*s,3.7*s); }
      if(p>.72 && !usePalmArt) wv2Palms(c,P,Math.min(1,(p-.72)/.12)); }
    if(la<1) c.restore(); }
  else if(S.fxPass>0){ const k=1-S.fxPass/2.4, h=34, w=h*(spr?spr.img.width/spr.img.height:.29), E=spr?spr.eye:{x:.5,y:.087,gap:.0198}, ex=wvX(40)+k*(wvX(300)-wvX(40)), ey=62;
    if(wv2Sprite(c,spr&&spr.img,ex-E.x*w,ey-E.y*h,w,h,{flat:.92,fade:spr?spr.fade:0})) eyes.push({x:ex,y:ey,s:E.gap*h/2.6,zone:'window'}); }
  if(S.decoy && S.decoy.zone==='window'){ const P=wv2Pose(.5,0,spr); c.globalAlpha=.85; wv2Sprite(c,spr&&spr.img,P.x0,P.y0,P.w,P.h,{flat:.95,fade:spr?spr.fade:0}); c.globalAlpha=1; }   /* same shape, no eyes */
  if(S.winOpen){ const [l0,l1]=WV2.geo.colL, sw=Math.sin(t*2.6);   /* no glass in the left column: cold air */
    c.fillStyle='rgba(120,140,190,.10)'; c.fillRect(wvX(l0),wvY(19),wvX(l1)-wvX(l0),wvY(489)-wvY(19));
    c.strokeStyle='rgba(170,190,230,.20)'; c.lineWidth=.4; for(let i=0;i<4;i++){ const yy=wvY(90+i*95)+sw*1.2; c.beginPath(); c.moveTo(wvX(l0)+2,yy); c.quadraticCurveTo(wvX(113),yy-1.5,wvX(l1)-2,yy+.8); c.stroke(); } }
  /* glass: a faint cool sheen; the brighter the window lamp, the more the glass mirrors the room (old BOOST: eyes .14) */
  { const [gx0,gy0,gx1,gy1]=WV2.geo.glass, g=c.createLinearGradient(wvX(gx0),wvY(gy0),wvX(gx1),wvY(gy1));
    const a=.03+.06*wk; g.addColorStop(0,`rgba(190,180,230,${a})`); g.addColorStop(.5,'rgba(190,180,230,0)'); g.addColorStop(1,`rgba(255,200,170,${a*.8})`);
    c.fillStyle=g; if(S.winOpen){ c.fillRect(wvX(WV2.geo.colR[0]),wvY(gy0),wvX(gx1)-wvX(WV2.geo.colR[0]),wvY(gy1)-wvY(gy0)); } else c.fillRect(wvX(gx0),wvY(gy0),wvX(gx1)-wvX(gx0),wvY(gy1)-wvY(gy0)); }
  wv2Prints(c,dt);
  wv2Note(c);
  wv2Blinds(c);
  c.restore(); }

/* the open sash, room side. With window_sash_open.png (a transparent layer of room v3 size: the sash swung in + the outside
   seen through the free left column) it is just drawn. Without it - TEMPORARY: the closed left sash is painted into the room
   picture, so its column is covered with the outside view first, then the sash itself, cut from the room picture
   (its panes already empty), is turned on its left hinge into the room. */
function wv2Front(c){ const I=WV2.img; if(!I.room_winhole) return;
  if(S.winOpen){ const A=WV2.art.window_sash_open;
    if(A) c.drawImage(A,0,0,1774,887,0,12,320,887*WV2.k);
    else wv2SashTemp(c,I); }
  /* Friday: a hand through the open window. TEMPORARY: his silhouette leaning into the free left column, one palm on the sill,
     ~1.6 s, the same moment friday.js plays the knock + slam; no art for it yet (optional, see ART_NEEDED). */
  if(WV2.slamT>0 && S.st.stage==='window' && WV2.art.window_hand){ const A=WV2.art.window_hand, k=Math.min(1,WV2.slamT/.35), [l0,l1]=WV2.geo.colL, w=wvX(l1)-wvX(l0)+10, h=w*A.height/A.width;
    wv2Sprite(c,A,wvX(l0)-4,wvY(470)-h*.8+4*(1-k),w,h,{warm:wv2Lamp(),rim:.4}); return; }
  if(WV2.slamT>0 && S.st.stage==='window'){ const spr=wv2Spr(); if(!spr) return; const k=Math.min(1,WV2.slamT/.35), [l0,l1]=WV2.geo.colL;
    c.save(); c.beginPath(); c.rect(wvX(l0-8),wvY(15),wvX(l1+8)-wvX(l0-8),wvY(495)-wvY(15)); c.clip();
    const h=118, w=h*spr.img.width/spr.img.height, ex=wvX((l0+l1)/2)+2, ey=33+3*(1-k);
    wv2Sprite(c,spr.img,ex-spr.eye.x*w,ey-spr.eye.y*h,w,h,{warm:wv2Lamp(),fade:spr.fade,rim:.4});
    eyes.push({x:ex,y:ey,s:spr.eye.gap*h/2.6,zone:'window'});
    wv2Palms(c,{ex:ex+3,ey:wvY(470)-.30*w-2,w:w*.9},k,0); c.restore(); }
}
function wv2SashTemp(c,I){
  const [l0,l1]=WV2.geo.colL, sx0=l0-6, sx1=l1+4, sy0=12, sy1=496, [cx0,cy0,cx1,cy1]=WV2.geo.crop;
  if(I.window_sash_erase){   /* outside view through window_sash_erase.png: the sash bars go, the plant and the curtain stay */
    const R=SC*2, cw=cx1-cx0, ch=cy1-cy0, o=WV2.er||(WV2.er=document.createElement('canvas')); o.width=Math.ceil(cw*WV2.k*R); o.height=Math.ceil(ch*WV2.k*R);
    const x=o.getContext('2d'); x.globalCompositeOperation='source-over'; x.drawImage(I.window_outside,0,0,o.width,o.height);
    x.fillStyle='rgba(120,140,190,.10)'; x.fillRect(0,0,o.width,o.height);
    x.globalCompositeOperation='destination-in'; x.drawImage(I.window_sash_erase,0,0,o.width,o.height);
    c.drawImage(o,wvX(cx0),wvY(cy0),cw*WV2.k,ch*WV2.k); }
  const N=24, open=.62+Math.sin(S.t*2.3)*.03, W0=(sx1-sx0)*(1-open), hx=wvX(sx0);
  for(let i=0;i<N;i++){ const u0=i/N, u1=(i+1)/N, grow=1+.16*u0, ys=(sy1-sy0)*grow, yo=sy0-(ys-(sy1-sy0))/2;
    c.drawImage(I.room_winhole, sx0+(sx1-sx0)*u0, sy0, (sx1-sx0)/N+.6, sy1-sy0,
      hx-W0*WV2.k*u1, wvY(yo), W0*WV2.k/N+.15, ys*WV2.k); }
  /* its glass: a faint reflection of the room, and the free edge catching the lamp light.
     Strips run from the hinge to the LEFT: the camera sees the window from the right, so the free edge, coming towards us,
     lands left of the hinge (like the old sash) */
  const gx1=hx, gx0=hx-W0*WV2.k, ty0=wvY(sy0+12), ty1=wvY(sy1-12), grow=.16*WV2.k*(sy1-sy0)/2;
  c.fillStyle='rgba(150,140,200,.16)'; c.beginPath(); c.moveTo(gx1,ty0); c.lineTo(gx0,ty0-grow); c.lineTo(gx0,ty1+grow); c.lineTo(gx1,ty1); c.closePath(); c.fill();
  c.strokeStyle='rgba(230,190,220,.35)'; c.lineWidth=.35; c.beginPath(); c.moveTo(gx0+.2,ty0-grow-1.5); c.lineTo(gx0+.2,ty1+grow+1.5); c.stroke(); }
window.DV2_BACK=wv2Back; window.DV2_FRONT=wv2Front;

/* ---------------- test panel (bottom left). Two modes, like the showcase:
   «ручной» - only the stalker AI is paused (WV2.aiOff, own wrapper below); buttons hold his state. The Friday script, Mia's reactions
              (the photo sent to her, lines, faces), panic and scares keep running (21.11: DEMO.freeze paused them too, the reaction got stuck);
   «как в игре» - nothing paused; lamps (1/Shift+1), blinds (B), chat work as in the game. */
function wv2HoldSt(p){ clearInterval(WV2.hold); WV2.hold=null; WV2.p=p; if(p==null) return;
  WV2.hold=setInterval(()=>{ if(!S) return; const st=S.st; if(st.stage!=='window') st.stage='window'; st.p=WV2.p; st.wait=999; },40); }
{ const t0=stalkerTick; stalkerTick=function(){ if(WV2.aiOff) return; return t0.apply(this,arguments); }; }
function wv2Mode(manual){ WV2.aiOff=manual; if(typeof DEMO!=='undefined'){ DEMO.freeze=false; DEMO.cur=null; }
  if(!manual){ wv2HoldSt(null); DV2.manual=null; DV2.stalker=true; if(S.st.stage==='hidden') S.st.wait=Math.min(S.st.wait,6); }
  document.querySelectorAll('#wv2 [data-mode]').forEach(b=>b.classList.toggle('on',(b.dataset.mode==='manual')===manual)); }
function wv2Manual(){ if(!WV2.aiOff) wv2Mode(true); }
function wv2Lamp1(m){ const L=S.lamps.window; if(m==='DEAD'){ L.burned=true; L.flick=0; return; } L.burned=false; L.heat=0; L.flick=1; if(L.mode!==m) setLamp('window',m); }   /* setLamp: the game's own (BOOST at the window flares the screen) */
function wv2Night(idx){ wv2SceneStop(); wv2HoldSt(null); try{ PROG.tut=true; PROG.redEyesLesson=1; PROG.fblSeen=true; }catch(e){}
  start(idx,{}); setTimeout(()=>{ if(!S) return;
    try{ if(S.guide&&S.guide.active) onboardingFinish('skip',true); }catch(e){}
    try{ if(idx===4){ FRS(); friPreEnd(); } }catch(e){}
    DV2.darkA=.75; DV2.manual=null; DV2.stalker=true; wv2Mode(false); },400); }

/* the window scene (~46 s): every step is the game's own call or state, only the stalker's p is driven by the script
   (the AI is paused so it cannot take over). Mia reacts by herself (her gaze, faces, lines). */
const WV2_SCENE=[
  [0,  'тихо: лампа окна STABLE, жалюзи подняты', ()=>{ wv2HoldSt(null); S.st.stage='hidden'; S.st.p=0; S.st.wait=999; S.st.red=false; S.blinds.closed=false; S.blinds.cd=0; S.winOpen=false; wv2Lamp1('STABLE'); }],
  [3,  'звук-подсказка: стук по стеклу (showCue)', ()=>{ try{ showCue('window'); }catch(e){} }],
  [5.5,'он во дворе: enterStage(window) — скрип, p 0.05', ()=>{ enterStage('window',.05); }],
  [6,  'подходит (p → 0.45)', null, [6,15,.05,.45]],
  [15, 'телефон в руке (пт–пн, p 0.45–0.72)', null, [15,22,.45,.78]],
  [22, 'у стекла: ладони (p > 0.72)', null],
  [24, 'жалюзи — кнопка игры: «поздно», отпускает раму и ждёт (p → 0.05)', ()=>{ wv2HoldSt(null); S.blinds.cd=0; toggleBlinds(); }],
  [25, 'ждёт за жалюзи (по правилу игры не двигается)', ()=>{ WV2.p=S.st.p; wv2HoldSt(S.st.p); }],
  [34, 'жалюзи поднимаются по таймеру игры — он ещё там', ()=>{ if(S.blinds.closed){ S.blinds.timer=0; } }],
  [36, 'лампа окна BOOST — вспышка, отступает', ()=>{ wv2Lamp1('BOOST'); }, null],
  [36.5,'',null,[36.5,41,.05,0]],
  [41, 'ушёл (stalkerRetreat)', ()=>{ WV2.scene.ramp=null; wv2HoldSt(null); stalkerRetreat('hidden'); S.st.wait=999; }],
  [43, 'лампа STABLE, конец', ()=>{ wv2Lamp1('STABLE'); }],
  [46, null, ()=>wv2SceneStop()],
];
function wv2SceneStart(){ if(!S||!S.running) return; wv2Mode(true); WV2.prints=null; WV2.scene={t0:S.t, i:0, ramp:null}; wv2SceneLabel('▶ сцена окна идёт'); }
function wv2SceneStop(){ WV2.scene=null; wv2SceneLabel(''); }
function wv2SceneLabel(t){ const e=document.getElementById('wv2Scene'); if(e) e.textContent=t; }
function wv2SceneTick(){ const sc=WV2.scene; if(!sc||!S) return; const t=S.t-sc.t0;
  while(sc.i<WV2_SCENE.length && t>=WV2_SCENE[sc.i][0]){ const [,lbl,fn,ramp]=WV2_SCENE[sc.i]; sc.i++; if(lbl) wv2SceneLabel(Math.round(WV2_SCENE[sc.i-1][0])+' с · '+lbl); if(ramp) sc.ramp=ramp; if(fn) fn(); if(!WV2.scene) return; }
  if(sc.ramp){ const [a,b,p0,p1]=sc.ramp; if(t<=b){ const k=Math.max(0,(t-a)/(b-a)); wv2HoldSt(null); S.st.stage='window'; S.st.p=p0+(p1-p0)*k; S.st.wait=999; } else { wv2HoldSt(p1); sc.ramp=null; } } }

function wv2Panel(){
  const css=document.createElement('style');
  css.textContent=`#wv2{position:fixed;left:12px;bottom:12px;z-index:100001;background:#151019f2;color:#eee6f4;border:1px solid #5b4a66;border-radius:10px;padding:10px 12px;font:13px/1.45 system-ui,sans-serif;display:flex;flex-direction:column;gap:5px;max-width:560px}
  #wv2 .row{display:flex;flex-wrap:wrap;gap:4px;align-items:center}#wv2 .hd{display:flex;justify-content:space-between;gap:8px;align-items:center}
  #wv2 button{font:inherit;padding:2px 7px;border-radius:6px;border:1px solid #6d5a7a;background:#2a2131;color:#fff;cursor:pointer}#wv2 button.on{background:#6d4a86}#wv2 button.big{padding:6px 10px;background:#6d4a86}
  #wv2St,#wv2Art{font-size:12px;opacity:.88;border-top:1px solid #3a2f44;padding-top:5px}#wv2Scene{font-size:12px;color:#f0c6dc;min-height:1em}
  #wv2.min > :not(.hd){display:none}#wv2Gear{position:fixed;left:10px;bottom:10px;z-index:100001;display:none;font:13px system-ui;padding:2px 8px;border-radius:6px;border:1px solid #6d5a7a;background:#2a2131;color:#fff;opacity:.3}
  body.wv2-clean #wv2{display:none}body.wv2-clean #wv2Gear{display:block}`;
  document.head.appendChild(css);
  const B=(a,t,ttl)=>`<button type="button" data-w="${a}"${ttl?` title="${ttl}"`:''}>${t}</button>`;
  const p=document.createElement('div'); p.id='wv2';
  p.innerHTML=`<div class="hd"><b id="wv2T" style="cursor:pointer">Окно v2 · тест ▾</b><button type="button" id="wv2Hide" title="H">скрыть панель (H)</button></div>
  <div class="row">ночь: ${B('n0','▶ Пн','макс. «окно»: доходит до стекла, стучит и уходит; записка; прохожий')}${B('n1','▶ Вт','жаркая ночь: створка может быть открыта, он ходит к окну и двери сам')}${B('n4','▶ Пт','сюжетная: телефон в руке, записка с фото, рука в открытом окне, атака вслепую')}</div>
  <div class="row">режим: <button type="button" data-mode="manual">ручной (стоит только ИИ сталкера)</button><button type="button" data-mode="game" class="on">как в игре</button></div>
  <div class="row">${B('scene','▶ сцена окна 46 с')}${B('sceneStop','■ стоп')} <span id="wv2Scene"></span></div>
  <div class="row">лампа окна: ${B('lDEAD','выкл')}${B('lDIM','DIM')}${B('lSTABLE','STABLE')}${B('lBOOST','BOOST')} · затемнение ${B('d60','60')}${B('d75','75')}${B('d85','85')}</div>
  <div class="row">жалюзи: ${B('bToggle','кнопка игры (B)')}${B('bCd','сбросить перезарядку')}${B('bJam','заело вкл/выкл')}</div>
  <div class="row">сталкер: ${B('pGame','по игре')}${B('pNone','нет')}${B('pFar','далеко')}${B('pMid','ближе')}${B('pNear','телефон')}${B('pAtk','ладони')}${B('red','красные глаза')}${B('pass','прошёл мимо')}${B('decoy','обманка')}</div>
  <div class="row">нападения: ${B('hit','удар по стеклу','Пн: p→1 — игра сама играет стук/удар, паника, он уходит; на стекле остаются следы ладоней')}${B('hand','рука в открытом окне','Пт: условие friday.js — открытая створка и он у окна (p>0.4). Здесь — та же картинка и звук')}${B('blind','атака вслепую (пт)','fblStart: камера и датчики гаснут, он идёт к окну')}</div>
  <div class="row">створка: ${B('sOpen','открыть')}${B('sClose','закрыть')} · записка: ${B('note','вкл/выкл')}${B('noteFly','улетает')}</div>
  <div class="row"><label><input type="checkbox" id="wv2Rim" checked> контур от уличного света</label><label><input type="checkbox" id="wv2Mk"> стёкла и точка лампы</label></div>
  <div id="wv2St"></div><div id="wv2Art"></div>`;
  document.body.appendChild(p);
  const g=document.createElement('button'); g.id='wv2Gear'; g.type='button'; g.textContent='⚙ окно'; document.body.appendChild(g);
  const clean=on=>document.body.classList.toggle('wv2-clean',on);
  document.getElementById('wv2Hide').onclick=()=>clean(true); g.onclick=()=>clean(false);
  addEventListener('keydown',e=>{ if(/^[hHрР]$/.test(e.key) && !/INPUT|TEXTAREA/.test(e.target.tagName||'')) clean(!document.body.classList.contains('wv2-clean')); });
  document.getElementById('wv2T').onclick=()=>p.classList.toggle('min');
  const R={
    n0:()=>wv2Night(0), n1:()=>wv2Night(1), n4:()=>wv2Night(4),
    scene:wv2SceneStart, sceneStop:wv2SceneStop,
    lDIM:()=>wv2Lamp1('DIM'), lSTABLE:()=>wv2Lamp1('STABLE'), lBOOST:()=>wv2Lamp1('BOOST'), lDEAD:()=>wv2Lamp1('DEAD'),
    d60:()=>DV2.darkA=.6, d75:()=>DV2.darkA=.75, d85:()=>DV2.darkA=.85,
    bToggle:()=>{ if(WV2.hold){ WV2.p=null; clearInterval(WV2.hold); WV2.hold=null; } toggleBlinds(); if(S.st.stage==='window'&&WV2.aiOff) wv2HoldSt(S.st.p); }, bCd:()=>{ S.blinds.cd=0; }, bJam:()=>{ S.blinds.jammed=!S.blinds.jammed; },
    sOpen:()=>{ S.winOpen=true; try{ SFX.sash(); }catch(e){} }, sClose:()=>{ S.winOpen=false; try{ SFX.sash(); }catch(e){} },
    pGame:()=>wv2Mode(false), pNone:()=>{ wv2Manual(); wv2HoldSt(null); S.st.stage='hidden'; S.st.p=0; S.st.wait=999; },
    pFar:()=>{ wv2Manual(); wv2HoldSt(.12); }, pMid:()=>{ wv2Manual(); wv2HoldSt(.35); }, pNear:()=>{ wv2Manual(); wv2HoldSt(.58); }, pAtk:()=>{ wv2Manual(); wv2HoldSt(.9); },
    red:()=>{ S.st.red=!S.st.red; }, pass:()=>{ wv2Manual(); wv2HoldSt(null); S.st.stage='hidden'; S.st.wait=999; S.fxPass=2.4; },
    decoy:()=>{ wv2Manual(); wv2HoldSt(null); if(S.st.stage==='window') S.st.stage='hidden'; S.st.wait=999; S.decoy = S.decoy ? null : {zone:'window', t:12, lit:0}; },   /* game shape: stalker.js; BOOST burns it off in .6 s */
    /* the knock: the game's own p≥1 branch of stalkerTick runs it (only where DY().max is 'window' - Monday); elsewhere he goes on to the door */
    hit:()=>{ wv2HoldSt(null); WV2.aiOff=false; S.blinds.closed=false; if(S.st.stage!=='window') enterStage('window',.97); S.st.p=.97;
      if(lampMode('window')==='BOOST') wv2Lamp1('STABLE'); setTimeout(()=>{ if(S.st.stage!=='window'&&document.querySelector('#wv2 [data-mode=manual].on')){ WV2.aiOff=true; S.st.wait=999; } },2500); },
    /* the hand: friday.js plays it inside its attack only; here the same sound/shake + the picture, panic is not touched */
    hand:()=>{ wv2Manual(); S.winOpen=true; wv2HoldSt(.5); WV2.slamT=1.6; try{ SFX.knock(); SFX.slam(); }catch(e){} S.shake=.6; S.glitch=.3; },
    blind:()=>{ if(!S.night||S.night.key!=='fri'){ floaty('атака вслепую — только в пятницу (▶ Пт)'); return; } window.FBL_FORCE='window'; wv2SceneStop(); wv2Mode(false); S.winOpen=false; S.blinds.closed=false; S.decoy=null;
      S.st.stage='hidden'; S.st.p=0; S.st.wait=999; try{ const F=FRS(); F.bl=null; fblStart(); }catch(e){ console.warn(e); }
      setTimeout(()=>{ if(S&&S.st.stage==='hidden'){ S.st.next='A'; beginApproach(); } },2500); },   /* the Friday script holds his wait: here he is sent by the game's own beginApproach (route A = window first) */   /* he walks to the window by the AI (route A), the camera is already dead */
    note:()=>{ S.ev.noteStay=!S.ev.noteStay; S.ev.noteFly=0; }, noteFly:()=>{ S.ev.noteStay=false; S.ev.note=false; S.ev.noteFly=1.4; },
  };
  p.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{ const a=b.dataset.w; if(/^n\d/.test(a)) return R[a](); if(!S||S.over) return; if(paused) setPause(false); R[a](); });   /* a test button press also resumes a paused night */
  p.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{ if(S&&S.running){ wv2SceneStop(); wv2Mode(b.dataset.mode==='manual'); } });
  document.getElementById('wv2Mk').onchange=e=>WV2.marks=e.target.checked;
  document.getElementById('wv2Rim').onchange=e=>WV2.rim=e.target.checked;
  setInterval(wv2SceneTick,40);
  setInterval(()=>{ const art=Object.keys(WV2.ART).map(n=>`${WV2.art[n]?'✅':'⬜'} ${n}.png — ${WV2.art[n]?'арт':'заглушка: '+WV2.ART[n].instead}`).join('<br>');
    document.getElementById('wv2Art').innerHTML=art;
    if(!S){ document.getElementById('wv2St').textContent='нажми ▶ Пн / Вт / Пт'; return; } const b=S.blinds, st=S.st;
    document.getElementById('wv2St').innerHTML=
      `ночь <b>${S.night?S.night.key:'—'}</b> (макс. ${S.night?DY().max:'—'}) · ${WV2.aiOff?'<b style="color:#f0c6dc">ручной: ИИ сталкера стоит</b>':'игра'} · жалюзи: <b>${b.closed?'закрыты '+Math.ceil(b.timer)+' с':b.jammed?'ЗАЕЛИ':'открыты'}</b>${b.cd>0?' · перезарядка '+Math.ceil(b.cd)+' с':''} · створка: <b>${S.winOpen?'открыта':'закрыта'}</b><br>`+
      `сталкер: <b>${st.stage}</b> p=${st.p.toFixed(2)}${st.red?' · красные':''}${WV2.hold?' (держу)':''}${S.decoy?' · обманка у '+S.decoy.zone:''} · лампа окна: <b>${lampMode('window')}</b> нагрев ${Math.round(S.lamps.window.heat)} · темнота ${Math.round(DV2.darkA*100)}% · паника ${Math.round(S.panic)}`; },250);
}
/* marks: glass outline + the game lamp point of the window */
{ const r=render; render=function(){ r.apply(this,arguments); if(!WV2.marks||!S) return; const c=ctx; c.save(); c.strokeStyle='#5aaaff'; c.lineWidth=.4;
    const [gx0,gy0,gx1,gy1]=WV2.geo.glass; c.strokeRect(wvX(gx0),wvY(gy0),wvX(gx1)-wvX(gx0),wvY(gy1)-wvY(gy0));
    for(const x of [WV2.geo.colL[1],WV2.geo.colR[0]]){ c.beginPath(); c.moveTo(wvX(x),wvY(gy0)); c.lineTo(wvX(x),wvY(gy1)); c.stroke(); }
    c.beginPath(); c.arc(LIGHT.window.x,LIGHT.window.y,2,0,7); c.stroke(); c.restore(); }; }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wv2Panel); else wv2Panel();
