"use strict";
/* THE MODERATOR — test mode "door v2" (20.11.2026, room v3). Loaded ONLY by review/door_v2/index.html, never by the game.
   The real game runs underneath (same js files); this file swaps just the room picture and the DOOR.
   Room v3 = 1774×887 px, exactly 2:1 like the game camera: it covers the visible camera area (logical x 0..320, y 12..172).
   Door pictures (all cut from the room, see door_geometry.json):
     room_doorhole.png - the original room with the door leaf cut out (the leaf is a perspective quad on the right wall);
     door_leaf.png     - the leaf alone (same quad), from the original room;
     doorway.png       - the dark corridor behind it, taken ONLY inside the leaf area from the AI "open door" picture,
                         shifted −2/+2 px to line up with the original frame (measured on the frame around the door).
   How far the door is open: the SAME rule as js/render.js drawRoom():
       dp = S.st.stage==='door' ? S.st.p : (decoy at the door ? .45 : 0)
   and the leaf narrows towards its hinge like the old drawn leaf: width × (1 − dp·0.8). The handle is on the right,
   so the hinge is on the LEFT edge here (the old drawn door had it on the right).
   The stalker in the doorway is the old drawing, moved into the new doorway. Window, closet, "behind Mia": not drawn here.
   Mia, the desk, the lights and every mechanic are the game's own.
   LIGHT (20.11, step 2): the game cuts its night darkness with a soft hole per lamp at LIGHT[zone] (state.js) and adds a warm
   bloom there (render.js, render()). The radii, strength, heat and protection rules are NOT touched here: the test mode only
   moves the three points (the LIGHT object is mutable), switchable old/new for comparison. */
const DV2={
  src:{w:1774,h:887}, cam:{x:0,y:12,w:320,h:160},
  leafQuad:[[1586,126],[1741,44],[1741,848],[1586,777]],   /* TL, TR, BR, BL in room px; hinge = left edge */
  leafBox:[1586,44,1742,849], doorwayBox:[1583,41,1745,852],
  oldDoor:[246,30,292,140],                                 /* the old drawn door box, logical units (render.js) */
  manual:null, stalker:true, showMissing:false, anim:null, img:{}
};
DV2.k=DV2.cam.w/DV2.src.w;
const dv2L=(x,y)=>[DV2.cam.x+x*DV2.k, DV2.cam.y+y*DV2.k];          /* room px → game logical units */
DV2.q=DV2.leafQuad.map(([x,y])=>dv2L(x,y));
DV2.box=[...dv2L(DV2.leafBox[0],DV2.leafBox[1]),...dv2L(DV2.leafBox[2],DV2.leafBox[3])];
DV2.wbox=[...dv2L(DV2.doorwayBox[0],DV2.doorwayBox[1]),...dv2L(DV2.doorwayBox[2],DV2.doorwayBox[3])];
/* lamp light points. OLD = state.js LIGHT for the old drawn room. NEW = the same zones in room v3 (px → logical via dv2L):
     window: lower middle of the glass; closet: the middle of the wardrobe; door: the middle of the new doorway
     (not the dresser with the cat lamp next to it). */
DV2.lightPx={window:[190,330], closet:[1045,380], door:[1665,470]};
DV2.lightOld=JSON.parse(JSON.stringify(LIGHT));
DV2.lightNew={}; for(const z in DV2.lightPx){ const [x,y]=dv2L(...DV2.lightPx[z]); DV2.lightNew[z]={x:+x.toFixed(1),y:+y.toFixed(1)}; }
DV2.lightSet='new'; DV2.fit='door';
function dv2SetLight(w){ DV2.lightSet=w; const T=w==='new'?DV2.lightNew:DV2.lightOld; for(const z in T){ LIGHT[z].x=T[z].x; LIGHT[z].y=T[z].y; } if(typeof dv2Bulbs==='function') dv2Bulbs(); }
dv2SetLight('new');
const DV2_BASE=window.DV2_BASE||'';   /* review/mia_v2 reuses this file from ../door_v2/ */
for(const n of ['room_doorhole','door_leaf','doorway']){ const i=new Image(); i.onload=()=>DV2.img[n]=i; i.src=DV2_BASE+n+'.png'; }
{ const i=new Image(); i.onload=()=>DV2.img.doorway_lit=i; i.src=DV2_BASE+'doorway_lit_TEST.png'; }

/* the game's own rule for "how open is the door" (render.js drawRoom, DOOR block) */
function dv2DoorOpen(){ const st=S.st, dzd=S.decoy && S.decoy.zone==='door' && st.stage!=='door';
  return { dp: DV2.manual!=null ? DV2.manual : st.stage==='door' ? st.p : dzd ? .45 : 0, decoy: DV2.manual==null && dzd }; }
function dv2QuadPath(c){ c.beginPath(); DV2.q.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)); c.closePath(); }

{ const roomOld=drawRoom;
  drawRoom=function(c){
    const I=DV2.img; if(!I.room_doorhole || !I.door_leaf || !I.doorway) return roomOld(c);
    eyes=[];
    const {dp,decoy}=dv2DoorOpen(), [bx0,by0,bx1,by1]=DV2.box, bw=bx1-bx0, bh=by1-by0;
    c.fillStyle='#0b0910'; c.fillRect(0,0,W,H);
    if(window.DV2_BACK) DV2_BACK(c);   /* hook for review/window_v2: what is seen through the glass (no-op here) */
    /* 1. the corridor behind the leaf (only the leaf area of the AI picture) */
    const [wx0,wy0,wx1,wy1]=DV2.wbox; c.drawImage(DV2.corrFix&&I.doorway_lit?I.doorway_lit:I.doorway,wx0,wy0,wx1-wx0,wy1-wy0);   /* corrFix: TEST ONLY, a dim far light on the back wall behind his head (doorway_lit_TEST.png) */
    if(DV2.showMissing){ c.save(); dv2QuadPath(c); c.clip(); c.strokeStyle='rgba(120,230,160,.8)'; c.lineWidth=.8;
      for(let i=-bh;i<bw;i+=3){ c.beginPath(); c.moveTo(bx0+i,by0); c.lineTo(bx0+i+bh,by1); c.stroke(); } c.restore(); }
    /* 2. the stalker in the doorway. figure() is the game's own drawing and is scaled the same on both axes.
          'door' (default): sized to the doorway like a person standing in it - head just under the lintel, ~0.85-1.0 of its height,
                            centred in the opening; it still grows a little as he comes closer (dp), like the old one.
          'old'           : the old door box mapped onto the new one (too big for this narrow, angled doorway). */
    if(dp>0 && (DV2.stalker || decoy)){
      c.save(); dv2QuadPath(c); c.clip(); let ex,ey,es;
      if(DV2.fit==='door'){ const [tl,tr,br,bl]=DV2.q, cx=(tl[0]+tr[0])/2, top=(tl[1]+tr[1])/2, bot=(bl[1]+br[1])/2, hgt=bot-top;
        const D=DV2.deep?.62:1, S1=(.80+.15*dp)*hgt/119*D, hx=cx+1, hy=top+9*S1/D*(DV2.deep?2.6:1)+(1-dp)*4;   /* figure(): head at its origin, 119·s tall in all; deep = standing further down the corridor */
        if(DV2.backlight){ const g=c.createLinearGradient(0,top,0,bot); g.addColorStop(0,'rgba(70,90,140,.0)'); g.addColorStop(.35,'rgba(90,110,160,.55)'); g.addColorStop(1,'rgba(40,50,80,.25)');
          c.fillStyle=g; c.fillRect(cx-9,top+hgt*.12,18,hgt*.86); }   /* TEST ONLY: a light deep in the corridor, to judge the silhouette against it */
        if(DV2.sprite && !decoy && DV2.deep){
          /* the painted door sprite, standing down the corridor so his silhouette is against the corridor light:
             height (0.52..0.62)·doorway as he comes closer, feet at 0.86 of the doorway, centre shifted towards the corridor window.
             Proportions are the PNG's own. Eyes: where the face is in this PNG (DV2.spriteEye). */
          /* alive (20.11, visual only): a slow sway and breath, feet stay planted; a soft contact shadow on the corridor floor */
          const sway=DV2.alive?Math.sin(S.t*.9)*.18:0, breath=DV2.alive?1+Math.sin(S.t*1.3)*.004:1;
          const sh=(.52+.10*dp)*hgt*breath, sw=sh/breath*DV2.sprite.width/DV2.sprite.height, feet=top+.86*hgt, sx0=cx+DV2.spriteDX-sw/2+sway, sy0=feet-sh;
          if(DV2.alive){ const fx=sx0+.47*sw-sway*.6, g=c.createRadialGradient(fx,feet,0,fx,feet,sw*.62); g.addColorStop(0,'rgba(2,1,4,.8)'); g.addColorStop(.5,'rgba(2,1,4,.45)'); g.addColorStop(1,'rgba(2,1,4,0)');
            c.save(); c.translate(fx,feet); c.scale(1,.2); c.translate(-fx,-feet); c.fillStyle=g; c.fillRect(fx-sw*.62,feet-sw*.62,sw*1.24,sw*1.24); c.restore(); }
          dv2ThreatBox(c,sx0,sy0,sw,sh);
          ex=sx0+DV2.spriteEye.x*sw; ey=sy0+DV2.spriteEye.y*sh;
          /* the game draws the pair at x ± 2.6·s: s is chosen so they land on the face, not on the hood */
          es=DV2.spriteEye.gap*sh/2.6; }
        else { dv2Threat(c,hx,hy,S1,decoy); ex=hx; ey=hy-.5*S1; es=S1; } }
      else { const [ox0,oy0,,oy1]=DV2.oldDoor, [ql,qt]=DV2.q[0], qb=DV2.q[3][1], s1=(qb-qt)/(oy1-oy0);
        const hx=262+dp*4, hy=58-dp*4, s=1+.35*dp;
        c.translate(ql,qt); c.scale(s1,s1); c.translate(-ox0,-oy0);
        if(decoy) shadowCoat(c,hx,hy,s); else if(has('stalker_door')) c.drawImage(IMG.stalker_door,hx-25*s,hy-12*s,50*s,110*s); else figure(c,hx,hy,s);
        ex=ql+(hx-ox0)*s1; ey=qt+(hy-.5-oy0)*s1; es=s*s1; }
      c.restore();
      if(!decoy) eyes.push({x:ex, y:ey, s:es, zone:'door'}); }
    /* 3. the room with the empty doorway */
    c.drawImage(I.room_doorhole,DV2.cam.x,DV2.cam.y,DV2.cam.w,DV2.cam.h);
    dv2LampPatches(c);   /* painted lamps of dead/dim game lamps go out */
    if(window.DV2_FRONT) DV2_FRONT(c);   /* hook for review/window_v2: things on the room side of the window (no-op here) */
    /* 4. the leaf turns on its LEFT hinge: same motion as the old leaf, its visible width × (1 − dp·0.8) */
    const dw=bw*(1-dp*.8);
    if(dw>.3){ const t=DV2.tmp||(DV2.tmp=document.createElement('canvas')), tw=Math.max(1,Math.round(I.door_leaf.width*(1-dp*.8))), th=I.door_leaf.height;
      t.width=tw; t.height=th; const x=t.getContext('2d'); x.clearRect(0,0,tw,th); x.drawImage(I.door_leaf,0,0,tw,th);
      if(dp>0){ x.globalCompositeOperation='source-atop'; x.fillStyle=`rgba(0,0,0,${.5*dp})`; x.fillRect(0,0,tw,th); x.globalCompositeOperation='source-over'; } /* turning away from the room light */
      c.drawImage(t,bx0,by0,dw,bh); }
    if(DV2.lightSet==='new' && BULBS[0].y>-1) dv2Bulbs();
    /* 5. Mia and her desk - the game's own drawing, untouched */
    if(S.mia.awayT<=0 && !S.finaleEmpty) drawMia(c);
    else { drawChair(c); if(S.pullK!=null) drawMiaPulled(c,S.pullK); }
    drawDesk(c);
  };
}

/* ================= step 3 (20.11): light of the room v3 =================
   The game darkens the whole frame with rgba(8,5,10,.85) and cuts soft holes: one per game lamp at LIGHT[zone]
   (radius/strength by lamp mode), Mia's monitor, moonlight through open blinds, a soft top ambient, and the old
   cat night-light at 222,96 (render.js render()). Room v3 already has its own painted light and shadow, so in this
   test mode the darkness is rebuilt here with the SAME rules, plus:
     - the darkness strength is a slider (test values; the game keeps .85);
     - decorative lights (always on, not game zones) are moved to the real lamps of room v3;
     - the old garland bulbs and the old night-light glow are moved/hidden in "new" mode.
   Lamp modes, heat, burning out and protection rules are the game's own: this only reads lampMode() and LIGHT. */
DV2.darkA=.85; DV2.deep=true; DV2.backlight=false; DV2.spriteDX=4; DV2.spriteEye={x:.444,y:.119,gap:.0111};   /* stalker_door_new.png 464×1986: face centre x≈206, skin under the fringe tips y≈236, eyes ±22 px */ DV2.decorOff=false; DV2.alive=true; DV2.marks=false; DV2.rim=true; DV2.sprite=null;
DV2.decorOld=[{n:'луна в окне',x:54,y:62,r:30,a:.2,win:1},{n:'ночник (старый)',x:222,y:96,r:22,a:.4,c:'240,210,150'}];
DV2.decorPx=[ {n:'окно, дождь',px:[165,250],r:30,a:.2,win:1,c:'120,150,230'},
  {n:'кот-ночник',px:[1424,397],r:22,a:.4,c:'250,190,128'},
  {n:'лампа-луна',px:[468,477],r:18,a:.34,c:'250,190,118'},
  {n:'неоновый кот',px:[488,370],r:14,a:.28,c:'250,160,195'},
  {n:'звёзды',px:[551,272],r:26,a:.2,c:'252,206,128'} ];
/* painted lamps follow the game lamp of their zone (20.11): room_v3_lamps_off.png is cut into three local patches
   (geometry matches to 1 px, only light differs; the door hole is left out of the patches). DEAD → the painted lamp is off,
   DIM → half, a flickering lamp flickers with it. Which painted lamp belongs to which zone is a choice, in this table. */
DV2.lampZone={'кот-ночник':'door','лампа-луна':'window','неоновый кот':'closet','звёзды':'closet'};
DV2.lampOffBox={"door": [1290, 260, 1610, 887], "window": [370, 380, 575, 575], "closet": [370, 185, 766, 887]}; DV2.decorFollow=true;
for(const z in DV2.lampOffBox){ const i=new Image(); i.onload=()=>DV2.img['off_'+z]=i; i.src=DV2_BASE+'lamp_off_'+z+'.png'; }
function dv2LampOff(z){ if(!DV2.decorFollow || !z || !S) return 0; const L=S.lamps[z], m=lampMode(z);
  if(m==='DEAD') return 1; const base=m==='DIM'?.45:0, f=Math.max(0,Math.min(1,L.flick==null?1:L.flick)); return base+(1-base)*(1-f); }
function dv2LampPatches(c){ if(DV2.lightSet!=='new') return; const k=320/1774;
  for(const z in DV2.lampOffBox){ const a=dv2LampOff(z), I=DV2.img['off_'+z]; if(a<=.01 || !I) continue; const [x0,y0,x1,y1]=DV2.lampOffBox[z];
    c.save(); c.globalAlpha=a; c.drawImage(I,x0*k,12+y0*k,(x1-x0)*k,(y1-y0)*k); c.restore(); } }
DV2.decorNew=DV2.decorPx.map(d=>{ const [x,y]=dv2L(...d.px); return {...d,x:+x.toFixed(1),y:+y.toFixed(1)}; });
DV2.bulbsY=BULBS.map(b=>b.y);
function dv2Decor(){ return DV2.lightSet==='new'?DV2.decorNew:DV2.decorOld; }
const dv2Dark=document.createElement('canvas'); dv2Dark.width=dark.width; dv2Dark.height=dark.height;
const dv2D=dv2Dark.getContext('2d'); dv2D.setTransform(SC,0,0,SC,0,0);
function dv2BuildDark(){
  const d=dv2D; d.globalCompositeOperation='source-over'; d.clearRect(0,0,W,H);
  d.fillStyle=`rgba(8,5,10,${DV2.darkA})`; d.fillRect(0,0,W,H);
  d.globalCompositeOperation='destination-out';
  const hole=(x,y,r,a)=>{ const g=d.createRadialGradient(x,y,0,x,y,r); g.addColorStop(0,`rgba(0,0,0,${a})`); g.addColorStop(.55,`rgba(0,0,0,${a*.6})`); g.addColorStop(1,'rgba(0,0,0,0)'); d.fillStyle=g; d.fillRect(x-r,y-r,r*2,r*2); };
  for(const z of ZONES){ const L=S.lamps[z], m=lampMode(z); if(m==='DEAD') continue; const P=LIGHT[z];           /* the game's rule, unchanged */
    const [r,a] = m==='DIM'?[40,.34]:m==='STABLE'?[68,.74]:[106,.98]; hole(P.x,P.y,r,a*L.flick); }
  if(S.mia.awayT<=0) hole(MIA.x,182,84,.85); else hole(MIA.x,182,60,.5);
  hole(160,16,170,.14);
  if(!DV2.decorOff) for(const q of dv2Decor()){ if(q.win && S.blinds.closed) continue; const off=DV2.lightSet==='new'?dv2LampOff(DV2.lampZone[q.n]):0; if(off<1) hole(q.x,q.y,q.r,q.a*(1-off)); }
}
function dv2DecorBloom(c){ if(DV2.decorOff || DV2.lightSet!=='new') return; c.save(); c.globalCompositeOperation='lighter';
  for(const q of DV2.decorNew){ if(q.win) continue; const on=1-dv2LampOff(DV2.lampZone[q.n]); if(on<=.01) continue; const r=q.r*.55, g=c.createRadialGradient(q.x,q.y,0,q.x,q.y,r); g.addColorStop(0,`rgba(${q.c},${.16*on})`); g.addColorStop(1,`rgba(${q.c},0)`); c.fillStyle=g; c.fillRect(q.x-r,q.y-r,r*2,r*2); }
  c.restore(); }
function dv2Marks(c){ if(!DV2.marks) return; c.save(); c.lineWidth=.6; c.font='4px sans-serif';
  const col={window:'#5aaaff',closet:'#ffb450',door:'#78e6a0'};
  for(const z of ZONES){ const m=lampMode(z), P=LIGHT[z], r=m==='DEAD'?0:m==='DIM'?40:m==='STABLE'?68:106;
    c.strokeStyle=col[z]; c.setLineDash([]); c.beginPath(); c.arc(P.x,P.y,3,0,7); c.stroke(); if(r){ c.globalAlpha=.5; c.beginPath(); c.arc(P.x,P.y,r*.55,0,7); c.stroke(); c.globalAlpha=1; }
    c.fillStyle=col[z]; c.fillText('ИГРА '+z+' · '+m,P.x+4,P.y-3); }
  c.strokeStyle='#e0e0ff'; c.setLineDash([1.5,1.5]);
  for(const q of dv2Decor()){ c.beginPath(); c.arc(q.x,q.y,q.r*.55,0,7); c.stroke(); c.fillStyle='#e0e0ff'; c.fillText('декор: '+q.n,q.x+3,q.y+q.r*.55+4); }
  c.restore(); }
/* move the old garland dots off-screen in "new" (room v3 has its own lights), back in "old" */
function dv2Bulbs(){ BULBS.forEach((b,i)=>b.y = DV2.lightSet==='new' ? -50 : DV2.bulbsY[i]); }
/* the old night-light bloom is a fixed gradient at 222,100 inside render(): in "new" it is drawn at the real cat lamp */
{ const cg=ctx.createRadialGradient.bind(ctx); ctx.createRadialGradient=function(x0,y0,r0,x1,y1,r1){
    if(DV2.lightSet==='new' && x0===222 && y0===100){ const q=DV2.decorNew[1]; if(DV2.decorOff || dv2LampOff('door')>.5) return cg(-99,-99,0,-99,-99,1); return cg(q.x,q.y+3,r0,q.x,q.y+3,r1); }
    return cg(x0,y0,r0,x1,y1,r1); }; }

/* the threat in the doorway: drawn on its own canvas so it can be lit and cut cleanly.
   - shape: figure() (the game's own) or a PNG door sprite if one is loaded - same box, proportions kept;
   - rim / fill light from the room side (the room is to the LEFT of this doorway), only as strong as the door lamp:
     DEAD 0 · DIM .35 · STABLE .6 · BOOST 1. This is what makes "light at the door shows the threat" true. */
function dv2Threat(c,hx,hy,S1,decoy){
  const top=hy-8.6*S1, h=119*S1, sp=DV2.sprite, w=sp? h*sp.width/sp.height : (decoy? 46*S1*1.3 : 44*S1);
  const pad=3, ox=hx-w/2-pad, oy=top-pad, ow=w+pad*2, oh=h+pad*2, R=SC*2;
  const o=DV2.off||(DV2.off=document.createElement('canvas')); o.width=Math.ceil(ow*R); o.height=Math.ceil(oh*R);
  const x=o.getContext('2d'); x.setTransform(R,0,0,R,-ox*R,-oy*R);
  const shape=()=>{ if(sp) x.drawImage(sp,hx-w/2,top,w,h); else if(decoy) shadowCoat(x,hx,hy,S1*1.3); else figure(x,hx,hy,S1); };
  const k=DV2.rim ? ({DEAD:0,DIM:.35,STABLE:.6,BOOST:1}[lampMode('door')]||0)*(S.lamps.door.flick||1) : 0;
  if(k>0){ x.save(); x.translate(-1.1,0); shape(); x.globalCompositeOperation='source-in'; x.fillStyle=`rgba(255,200,150,${.7*k})`; x.fillRect(ox,oy,ow,oh); x.restore(); }
  x.save(); x.globalCompositeOperation='source-over'; shape(); x.restore();
  if(k>0){ x.save(); x.globalCompositeOperation='source-atop'; const g=x.createLinearGradient(hx-w/2,0,hx+w/2,0);
    g.addColorStop(0,`rgba(230,170,120,${.30*k})`); g.addColorStop(.6,`rgba(230,170,120,${.06*k})`); g.addColorStop(1,'rgba(230,170,120,0)');
    x.fillStyle=g; x.fillRect(ox,oy,ow,oh); x.restore(); }
  c.drawImage(o,ox,oy,ow,oh);
}
function dv2ThreatBox(c,x0,y0,w,h){
  const pad=3, ox=x0-pad, oy=y0-pad, ow=w+pad*2, oh=h+pad*2, R=SC*2, sp=DV2.sprite;
  const o=DV2.off||(DV2.off=document.createElement('canvas')); o.width=Math.ceil(ow*R); o.height=Math.ceil(oh*R);
  const x=o.getContext('2d'); x.setTransform(R,0,0,R,-ox*R,-oy*R);
  const k=DV2.rim ? ({DEAD:0,DIM:.35,STABLE:.6,BOOST:1}[lampMode('door')]||0)*(S.lamps.door.flick||1) : 0;
  if(k>0){ x.save(); x.translate(-.8,0); x.drawImage(sp,x0,y0,w,h); x.globalCompositeOperation='source-in'; x.fillStyle=`rgba(255,200,150,${.32*k})`; x.fillRect(ox,oy,ow,oh); x.restore(); }   /* a painted sprite needs less than the flat figure */
  if(DV2.alive) x.filter='blur(1px)';   /* soft edges like the painted room (offscreen is 2× the feed) */
  x.drawImage(sp,x0,y0,w,h); x.filter='none';
  if(DV2.alive){ x.save(); x.globalCompositeOperation='source-atop'; const d=x.createLinearGradient(0,y0,0,y0+h);
    d.addColorStop(0,'rgba(5,4,8,0)'); d.addColorStop(.45,'rgba(5,4,8,0)'); d.addColorStop(1,`rgba(5,4,8,${.55-.25*k})`); x.fillStyle=d; x.fillRect(ox,oy,ow,oh); x.restore(); }   /* the lamp is in the room: his legs, further from it, stay darker */
  if(k>0){ x.save(); x.globalCompositeOperation='source-atop'; const g=x.createLinearGradient(x0,0,x0+w,0);
    g.addColorStop(0,`rgba(230,170,120,${.10*k})`); g.addColorStop(.6,`rgba(230,170,120,${.02*k})`); g.addColorStop(1,'rgba(230,170,120,0)'); x.fillStyle=g; x.fillRect(ox,oy,ow,oh); x.restore(); }
  const fade=DV2.spriteFade[DV2.spriteName]||0;
  if(fade>0){ x.save(); x.globalCompositeOperation='destination-out'; const f=x.createLinearGradient(0,y0+h*(1-fade),0,y0+h);
    f.addColorStop(0,'rgba(0,0,0,0)'); f.addColorStop(1,'rgba(0,0,0,1)'); x.fillStyle=f; x.fillRect(ox,y0+h*(1-fade),ow,h*fade+pad); x.restore(); }
  c.drawImage(o,ox,oy,ow,oh);
}
/* a PNG for the door threat: review/door_v2/stalker_door_new.png if it exists, or one picked in the panel */
/* door sprites to compare (20.11): 'silhouette' = stalker_door_silhouette.png (black, no face, default since 21.11), 'shadow' = stalker_door_shadow.png (hooded), 'painted' = stalker_door_new.png
   (the earlier one), 'figure' = the game's own drawn figure. Each painted sprite has its own eye point on its face. */
DV2.sprites={}; DV2.spriteKey='silhouette';
DV2.spriteEyes={ painted:{x:.444,y:.119,gap:.0111},    /* 464×1986: face under the fringe, y≈236, eyes ±22 px */
                 shadow:{x:.294,y:.094,gap:.0131},     /* 459×2130: the dark hood opening, centre x≈135, eyes y≈200, ±28 px */
                 silhouette:{x:.503,y:.087,gap:.0198} };   /* 556×1915 (21.11, black, no face): middle of the head x≈280, y≈167, ±38 px */
/* a sprite whose figure is cut by the picture's bottom edge (no feet) dissolves into the dark over this part of its height */
DV2.spriteFade={ silhouette:.16 };
function dv2ApplySprite(){ const want=DV2.spriteKey; if(want==='figure'){ DV2.sprite=null; return; }
  const k=DV2.sprites[want]?want:Object.keys(DV2.sprites)[0]; DV2.sprite=k?DV2.sprites[k]:null; if(k) DV2.spriteEye=DV2.spriteEyes[k]; DV2.spriteName=k||''; }
function dv2UseSprite(k){ DV2.spriteKey=k; dv2ApplySprite(); }   /* the choice stays even if that file loads later */
for(const [k,f] of [['painted','stalker_door_new.png'],['shadow','stalker_door_shadow.png'],['silhouette','stalker_door_silhouette.png']]){ const i=new Image();
  i.onload=()=>{ DV2.sprites[k]=i; dv2ApplySprite(); }; i.src=DV2_BASE+f; }

/* test-only switch: hide the game's night darkness to judge the art itself.
   The darkness is cut by lamps at the OLD lamp positions (state.js LIGHT), which do not match the new room yet. */
{ const di=ctx.drawImage.bind(ctx); ctx.drawImage=function(img,...a){
    if(img!==dark) return di(img,...a);
    if(!DV2.noDark){ dv2BuildDark(); di(dv2Dark,...a); }
    dv2DecorBloom(ctx); dv2Marks(ctx); }; }

/* ---------------- demo panel */
function dv2Panel(){
  const p=document.createElement('div'); p.id='dv2';
  p.innerHTML=`<b>Тест: дверь v2 (комната v3)</b>
  <button type="button" id="dv2Start">Начать пятницу</button>
  <label><input type="radio" name="dv2m" value="game" checked> дверью управляет игра (сталкер)</label>
  <label><input type="radio" name="dv2m" value="manual"> вручную</label>
  <label>открыта: <input type="range" id="dv2P" min="0" max="1" step="0.01" value="0"> <span id="dv2V">0.00</span></label>
  <div><button type="button" id="dv2Open">Открыть</button> <button type="button" id="dv2Close">Закрыть</button></div>
  <label><input type="checkbox" id="dv2S" checked> сталкер в проёме</label>
  <label><input type="checkbox" id="dv2M"> показать вставку проёма</label>
  <label><input type="checkbox" id="dv2D"> без игрового затемнения</label>
  <label>свет: <select id="dv2L"><option value="new">новые координаты</option><option value="old">старые координаты</option></select></label>
  <label>сталкер: <select id="dv2F"><option value="door">по проёму</option><option value="old">старый масштаб</option></select></label>
  <label>затемнение: <input type="range" id="dv2A" min="0" max="0.95" step="0.01" value="0.85"> <span id="dv2AV">85%</span></label>
  <div><button type="button" data-a="0.45">45%</button> <button type="button" data-a="0.6">60%</button> <button type="button" data-a="0.75">75% (рекомендовано)</button> <button type="button" data-a="0.85">85% (игра)</button></div>
  <label><input type="checkbox" id="dv2Dec"> выключить декоративный свет</label>
  <label><input type="checkbox" id="dv2Mk"> показать источники света</label>
  <label><input type="checkbox" id="dv2Rim" checked> свет лампы на фигуре (контур)</label>
  <label><input type="checkbox" id="dv2Deep" checked> он глубже в коридоре</label>
  <label>сталкер в двери: <select id="dv2Spr"><option value="silhouette">силуэт (21.11)</option><option value="shadow">тень в капюшоне</option><option value="painted">рисованный (прежний)</option><option value="figure">фигура из игры</option></select></label>
  <label><input type="checkbox" id="dv2Follow" checked> нарисованные лампы гаснут с игровыми</label>
  <label><input type="checkbox" id="dv2Alive" checked> живой: тень, мягкие края, покачивание</label>
  <label><input type="checkbox" id="dv2Back"> тест: свет в глубине коридора</label>
  <label><input type="checkbox" id="dv2Corr"> тест: светлее дальняя стена коридора (doorway_lit_TEST)</label>
  <label>PNG сталкера для двери: <input type="file" id="dv2Png" accept="image/png"></label>
  <button type="button" id="dv2PngOff">вернуть старую фигуру</button>
  <button type="button" id="dv2All">все лампы выкл</button>
  <label>лампа двери: <select id="dv2Lamp"><option>STABLE</option><option>BOOST</option><option>DIM</option><option value="DEAD">выкл (DEAD)</option></select></label>
  <small>Окно, шкаф и «за спиной» в этом режиме не рисуются.</small>`;
  document.body.appendChild(p);
  const $$=id=>document.getElementById(id), setP=v=>{ DV2.manual=+v; $$('dv2P').value=v; $$('dv2V').textContent=(+v).toFixed(2); };
  $$('dv2Start').onclick=()=>{ try{ PROG.redEyesLesson=1; PROG.fblSeen=true; }catch(e){} start(4,{}); setTimeout(()=>{ try{ FRS(); friPreEnd(); }catch(e){} },400); };
  document.querySelectorAll('[name=dv2m]').forEach(r=>r.onchange=()=>{ if(r.value==='game'&&r.checked){ DV2.manual=null; DV2.anim=null; } else if(r.checked) setP($$('dv2P').value); });
  $$('dv2P').oninput=e=>{ document.querySelector('[name=dv2m][value=manual]').checked=true; DV2.anim=null; setP(e.target.value); };
  const anim=to=>{ document.querySelector('[name=dv2m][value=manual]').checked=true; const from=DV2.manual||0, t0=performance.now();
    DV2.anim=to; const step=now=>{ if(DV2.anim!==to) return; const k=Math.min(1,(now-t0)/1400), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; setP(from+(to-from)*e); if(k<1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  $$('dv2Open').onclick=()=>anim(1); $$('dv2Close').onclick=()=>anim(0);
  $$('dv2S').onchange=e=>DV2.stalker=e.target.checked;
  $$('dv2M').onchange=e=>DV2.showMissing=e.target.checked;
  $$('dv2D').onchange=e=>DV2.noDark=e.target.checked;
  $$('dv2L').onchange=e=>dv2SetLight(e.target.value);
  const setA=v=>{ DV2.darkA=+v; $$('dv2A').value=v; $$('dv2AV').textContent=Math.round(v*100)+'%'; };
  $$('dv2A').oninput=e=>setA(e.target.value); document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>setA(b.dataset.a));
  $$('dv2Dec').onchange=e=>DV2.decorOff=e.target.checked;
  $$('dv2Mk').onchange=e=>DV2.marks=e.target.checked;
  $$('dv2Rim').onchange=e=>DV2.rim=e.target.checked;
  $$('dv2Deep').onchange=e=>DV2.deep=e.target.checked;
  $$('dv2Corr').onchange=e=>DV2.corrFix=e.target.checked;
  $$('dv2Alive').onchange=e=>DV2.alive=e.target.checked;
  $$('dv2Follow').onchange=e=>DV2.decorFollow=e.target.checked;
  $$('dv2Spr').onchange=e=>dv2UseSprite(e.target.value);
  $$('dv2Back').onchange=e=>DV2.backlight=e.target.checked;
  $$('dv2Png').onchange=e=>{ const f=e.target.files[0]; if(!f) return; const i=new Image(); i.onload=()=>{ DV2.sprite=i; DV2.spriteName=f.name; }; i.src=URL.createObjectURL(f); };
  $$('dv2PngOff').onclick=()=>{ DV2.sprite=null; };
  $$('dv2All').onclick=()=>{ try{ for(const z of ZONES) S.lamps[z].burned=true; }catch(err){} };   /* test only: every game lamp burned out */
  $$('dv2F').onchange=e=>DV2.fit=e.target.value;
  $$('dv2Lamp').onchange=e=>{ try{ const L=S.lamps.door; if(e.target.value==='DEAD'){ L.burned=true; } else { L.burned=false; L.mode=e.target.value; L.heat=0; } }catch(err){} };   /* test only: sets the lamp state directly, the rules are the game's */
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',dv2Panel); else dv2Panel();
