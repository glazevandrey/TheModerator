"use strict";
// ======================= RENDERER: Mia's room, Mia, the stalker, finale footage =======================
// Procedural placeholder art in logical 320×180 units. Any finished art from assets/ replaces its layer (see assets.js).
const feed=document.getElementById('feed'); if(MOBILE){ feed.width=960; feed.height=480; } const ctx=feed.getContext('2d');
const SC=feed.width/W;                       // device px per logical unit (1280/320 = 4)
const dark=document.createElement('canvas'); dark.width=W*SC; dark.height=H*SC; const dctx=dark.getContext('2d'); dctx.setTransform(SC,0,0,SC,0,0);
const noises=[0,1,2,3].map(()=>{const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const id=x.createImageData(W,H);for(let i=0;i<id.data.length;i+=4){const v=Math.random()*255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=Math.random()<.5?255:0;}x.putImageData(id,0,0);return c;});
const stars=[...Array(16)].map(()=>[rnd(22,84),rnd(31,66)]);
const BULBS=[...Array(16)].map((_,i)=>({x:10+i*19.5,y:15+Math.sin(i/15*Math.PI)*6,c:'233,182,94',ph:Math.random()*6}));
const LOOK={hoodie:['#6c7aa6','#454f78'],phones:'#d68ca0'};
function applyLooks(){ LOOK.hoodie=look('hoodie').c; LOOK.phones=look('phones').c; const lc=look('lights').c; BULBS.forEach((b,i)=>b.c=lc[i%3]); if(typeof drawAvatar==='function'&&$('miaAva')) drawAvatar($('miaAva')); }
const MIA={x:142,y:113,s:1.3};
let frame=0, eyes=[];
function rr(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function lg(c,x0,y0,x1,y1,stops){ const g=c.createLinearGradient(x0,y0,x1,y1); stops.forEach(([o,col])=>g.addColorStop(o,col)); return g; }

// ---------- stalker silhouette
function figure(c,x,y,s,alpha=1,tilt=0){
  c.save(); c.globalAlpha=alpha; c.translate(x,y); c.rotate(tilt); c.fillStyle='#070608';
  c.beginPath(); c.ellipse(0,0,7*s,8.6*s,0,0,Math.PI*2); c.fill();
  c.beginPath(); c.moveTo(-4.5*s,6*s); c.quadraticCurveTo(-18*s,10*s,-22*s,40*s); c.lineTo(22*s,40*s); c.quadraticCurveTo(18*s,10*s,4.5*s,6*s); c.closePath(); c.fill();
  c.fillRect(-22*s,40*s,44*s,70*s);
  // faint rim light so the shape reads against the dark
  c.strokeStyle='rgba(150,130,150,.32)'; c.lineWidth=.7; c.beginPath(); c.arc(0,0,7.3*s,Math.PI*1.05,Math.PI*1.95); c.stroke();
  c.beginPath(); c.moveTo(-4.5*s,6*s); c.quadraticCurveTo(-18*s,10*s,-22*s,40*s); c.moveTo(4.5*s,6*s); c.quadraticCurveTo(18*s,10*s,22*s,40*s); c.stroke();
  c.restore();
}
function seated(c,x,y,s){ // silhouette sitting in the armchair
  c.save(); c.fillStyle='#070608'; c.translate(x,y);
  c.beginPath(); c.ellipse(0,0,6*s,7.4*s,0,0,7); c.fill();
  c.beginPath(); c.moveTo(-4*s,5*s); c.quadraticCurveTo(-15*s,8*s,-16*s,30*s); c.lineTo(16*s,30*s); c.quadraticCurveTo(15*s,8*s,4*s,5*s); c.fill();
  c.fillRect(-16*s,28*s,32*s,10*s); c.restore();
}

// ---------- room
function drawRoom(c){
  const st=S.st; eyes=[];
  if(has('room_base')){ c.drawImage(IMG.room_base,0,0,W,H); }
  else {
    // wall with faint wallpaper stripes
    c.fillStyle=lg(c,0,0,0,140,[[0,'#2f2a33'],[1,'#463b40']]); c.fillRect(0,0,W,H);
    c.fillStyle='rgba(255,255,255,.025)'; for(let x=0;x<W;x+=7) c.fillRect(x,20,2.5,118);
    c.fillStyle='#262027'; c.fillRect(0,0,W,19); c.fillStyle='#3b3036'; c.fillRect(0,18,W,2);
    // floor planks
    c.fillStyle=lg(c,0,138,0,180,[[0,'#3a2a22'],[1,'#2a1d17']]); c.fillRect(0,138,W,42);
    c.fillStyle='rgba(0,0,0,.18)'; for(let i=0;i<12;i++){ c.fillRect(i*28+(i%2)*9,140,1,40); } c.fillRect(0,152,W,.6); c.fillRect(0,166,W,.6);
    c.fillStyle='#211816'; c.fillRect(0,136,W,3);
    // rug
    c.fillStyle='#4a2c3f'; c.beginPath(); c.ellipse(150,160,114,13,0,0,7); c.fill();
    c.strokeStyle='rgba(214,140,160,.25)'; c.lineWidth=1; c.beginPath(); c.ellipse(150,160,104,10,0,0,7); c.stroke();
    // fairy-light wire
    c.strokeStyle='#141015'; c.lineWidth=.6; c.beginPath(); BULBS.forEach((b,i)=>i?c.lineTo(b.x,b.y):c.moveTo(b.x,b.y)); c.stroke();
  }

  // WINDOW x18..88, y28..96
  c.save(); rr(c,18,28,70,68,1); c.clip();
  c.fillStyle=lg(c,0,28,0,96,[[0,'#1d2a4a'],[1,'#0b1020']]); c.fillRect(18,28,70,68);
  const mg=c.createRadialGradient(74,38,0,74,38,22); mg.addColorStop(0,'rgba(200,210,230,.35)'); mg.addColorStop(1,'rgba(200,210,230,0)'); c.fillStyle=mg; c.fillRect(50,28,40,30);
  c.fillStyle='#d8dde8'; c.beginPath(); c.arc(74,38,3.2,0,7); c.fill();
  c.fillStyle='#8aa0d0'; for(const [sx,sy] of stars) if(Math.random()>.03) c.fillRect(sx,sy,.8,.8);
  c.strokeStyle='#05060a'; c.lineWidth=1.4; c.beginPath(); c.moveTo(18,52); c.quadraticCurveTo(34,48,44,40); c.moveTo(30,49); c.lineTo(28,40); c.moveTo(40,43); c.lineTo(46,36); c.stroke();
  c.fillStyle='#04050a'; c.beginPath(); c.ellipse(30,99,24,15,0,0,7); c.ellipse(76,101,25,17,0,0,7); c.fill();
  if(st.stage==='window'){
    const p=st.p, s=.55+1.15*p, hx=58+Math.sin(S.t*.7)*2*(1-p), hy=92-38*p;
    if(has('stalker_window')) c.drawImage(IMG.stalker_window,hx-25*s,hy-12*s,50*s,110*s); else figure(c,hx,hy,s);
    eyes.push({x:hx,y:hy-.5*s,s,zone:'window'});
    if(p>.72){ // palms pressed flat against the glass, fingers up, a little fog around them
      const a=Math.min(1,(p-.72)/.12);
      for(const sg of [-1,1]){ const px=hx+sg*13*s, py=hy+11*s;
        c.fillStyle=`rgba(190,205,225,${.10*a})`; c.beginPath(); c.ellipse(px,py-2*s,5.2*s,6.4*s,0,0,7); c.fill();
        c.globalAlpha=a; c.fillStyle='#0b0a0d'; c.beginPath(); c.ellipse(px,py,2.6*s,2.9*s,0,0,7); c.fill();
        for(let f=0;f<4;f++){ const fx=px+(f-1.5)*1.25*s+sg*.2*s, len=(f===0||f===3?3.2:4)*s; c.beginPath(); c.ellipse(fx,py-1.6*s-len/2,.55*s,len/2,(f-1.5)*.12,0,7); c.fill(); }
        c.beginPath(); c.ellipse(px-sg*2.8*s,py-.4*s,.6*s,1.8*s,sg*.9,0,7); c.fill();   // thumb
        c.fillRect(px-1.4*s,py+1.8*s,2.8*s,4*s); c.globalAlpha=1; } }
  }
  else if(S.fxPass>0){   /* scare 8: Monday hook - something passes behind the glass */
    const k=1-S.fxPass/2.4, hx=20+k*66, hy=84; c.save(); c.beginPath(); c.rect(18,28,70,68); c.clip(); figure(c,hx,hy,.8); c.restore(); eyes.push({x:hx,y:hy-.4,s:.8,zone:'window'}); }
  if(S.decoy && S.decoy.zone==='window'){ c.globalAlpha=.85; figure(c,60,76,1.25); c.globalAlpha=1; }   // decoy: same shape, no eyes
  if(S.winOpen){ // the left sash is open: night air, a draught in the curtains
    const sw=Math.sin(S.t*2.6);   // the left sash swung inwards: a dark gap with night air, the frame turned towards us
    c.fillStyle='#05070d'; c.fillRect(19,29,33,32); c.fillStyle='rgba(120,140,190,.10)'; c.fillRect(19,29,33,32);
    c.strokeStyle='rgba(170,190,230,.18)'; c.lineWidth=.5; for(let i=0;i<3;i++){ const yy=36+i*8+sw*1.5; c.beginPath(); c.moveTo(24,yy); c.quadraticCurveTo(34,yy-2,46,yy+1); c.stroke(); }
    c.fillStyle='#4a4048'; c.beginPath(); c.moveTo(18,28); c.lineTo(31,24); c.lineTo(31,63); c.lineTo(18,62); c.closePath(); c.fill();
    c.fillStyle='rgba(90,110,150,.35)'; c.beginPath(); c.moveTo(20,30); c.lineTo(29,27); c.lineTo(29,60); c.lineTo(20,60); c.closePath(); c.fill(); }
  if(S.ev.note){ // Monday / Friday: a sheet of paper taped to the glass
    const mon=S.night&&S.night.key==='mon';   /* Monday: just a handwritten line; Friday: the one with the photo */
    if(has('window_note')&&!mon) c.drawImage(IMG.window_note,26,58,22,28);
    else { c.save(); c.translate(36,72); c.rotate(-.08); c.fillStyle='#d9d2c0'; c.fillRect(-10,-13,20,26); c.fillStyle='rgba(255,255,255,.5)'; c.fillRect(-3,-15,6,3);
      c.strokeStyle='#3a3030'; c.lineWidth=.6; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(-7,-8+i*4); c.lineTo(-7+[13,10,14,8,11][i],-8+i*4+(i%2?.4:-.3)); c.stroke(); }
      if(!mon){ c.fillStyle='#2b2224'; c.beginPath(); c.arc(1,7,3,0,7); c.fill(); c.fillRect(-2,9,6,3); } c.restore(); }
  }
  if(S.blinds.anim>.01){ const hh=68*S.blinds.anim; c.fillStyle='#8a8070'; c.fillRect(18,28,70,hh); c.fillStyle='#5d564b'; for(let y=28;y<28+hh;y+=3.5) c.fillRect(18,y,70,.8); }
  c.restore();
  c.fillStyle='#4a4048'; c.fillRect(15,25,76,3.5); c.fillRect(15,95,76,4); c.fillRect(15,25,3.5,74); c.fillRect(87.5,25,3.5,74); c.fillRect(52,28,2,68); c.fillRect(18,61,70,1.6);
  // curtains
  for(const side of [-1,1]){ const x0=(side<0?8:84)+(S.winOpen&&side<0?Math.sin(S.t*2.3)*2.2+1.5:0); c.fillStyle=lg(c,x0,0,x0+16,0,[[0,'#4a3550'],[.5,'#5e4466'],[1,'#3d2b44']]);
    c.beginPath(); c.moveTo(x0,22); c.lineTo(x0+16,22); c.quadraticCurveTo(x0+12+side*2,70,x0+15,104); c.lineTo(x0+1,104); c.quadraticCurveTo(x0+4,60,x0,22); c.fill();
    c.strokeStyle='rgba(0,0,0,.25)'; c.lineWidth=.6; for(let k=1;k<4;k++){ c.beginPath(); c.moveTo(x0+k*4,23); c.quadraticCurveTo(x0+k*4+side,64,x0+k*4,103); c.stroke(); } }
  c.fillStyle='#2a2028'; c.fillRect(4,20,104,2.5);

  // BED under the window
  c.fillStyle='#3a2a2e'; rr(c,-4,96,98,14,4); c.fill(); c.fillStyle='#2b1f22'; c.fillRect(-4,108,98,3);
  c.fillStyle='#d9cfe0'; rr(c,-2,108,96,10,3); c.fill();
  c.fillStyle='#efe8f2'; rr(c,4,102,26,11,5); c.fill(); c.fillStyle='#e3d4e8'; rr(c,28,103,22,10,5); c.fill();
  c.fillStyle=lg(c,0,114,0,150,[[0,'#5f4f86'],[1,'#3f3460']]); rr(c,-4,114,100,34,6); c.fill();
  c.strokeStyle='rgba(0,0,0,.2)'; c.lineWidth=.8; for(let x=8;x<90;x+=13){ c.beginPath(); c.moveTo(x,116); c.quadraticCurveTo(x+3,130,x-1,146); c.stroke(); }
  c.fillStyle='#c79a72'; c.beginPath(); c.ellipse(44,109,4,4.5,0,0,7); c.fill(); c.beginPath(); c.ellipse(41,104.5,1.6,2,0,0,7); c.ellipse(47,104.5,1.6,2,0,0,7); c.fill(); // plush bear
  /* 11.11: the pink peonies (the moderator ordered them to her door on Aug 3 - see the receipt in the finale).
     From Monday on they are in her room and wilt over the week. Not in the tutorial. FLOWERS = where (variant). */
  { const ORD=['mon','tue','wed','thu','fri','sat','sun','mon2'], k=S.night&&S.night.key, di=ORD.indexOf(k), en=S.night&&S.night.endless;
    if((di>=0||en) && FLOWERS!=='none'){ const w=en?0:di/7; drawPeonies(c,FLOWERS,w,k==='sun'||k==='mon2'); } }
  // nightstand + window lamp (table lamp)
  c.fillStyle='#4a3428'; rr(c,92,114,24,26,2); c.fill(); c.fillStyle='#3a281f'; c.fillRect(94,124,20,1); c.fillStyle='#b99a6a'; c.fillRect(102,119,4,1.4); c.fillRect(102,130,4,1.4);
  c.fillStyle='#2a2326'; c.fillRect(103,102,2,12); c.beginPath(); c.ellipse(104,114,5,1.6,0,0,7); c.fill();
  lampShadeShape(c,104,94,'window');

  // CLOSET x122..186, y24..140 (it opens when it gets behind Mia)
  const dzc = S.decoy && S.decoy.zone==='closet';
  const cp = st.stage==='behind' ? Math.min(1,st.p/.45) : st.stage==='closet' ? Math.min(1,.15+.85*st.p) : dzc ? .55 : 0;
  const gap = 1.2+cp*24;
  c.fillStyle='#3e2e26'; rr(c,120,22,68,118,2); c.fill(); c.fillStyle='#2e221c'; c.fillRect(120,22,68,4);
  c.fillStyle='#030203'; c.fillRect(154,27,gap,110);
  if((st.stage==='behind' && st.p<.45) || st.stage==='closet' || dzc){ c.save(); c.beginPath(); c.rect(154,27,gap,110); c.clip(); const hx=160+cp*5, hy=56; figure(c,hx,hy,1.1+.2*cp); c.restore();
    if(gap>6 && !(dzc && st.stage!=='closet' && st.stage!=='behind')) eyes.push({x:hx,y:hy-.5,s:1.2,zone:st.stage==='closet'?'closet':'behind'}); }
  for(const [x,w] of [[123,31],[154+gap,Math.max(0,31-gap*.5)]]){ if(w<=0) continue; c.fillStyle=lg(c,x,0,x+w,0,[[0,'#56402f'],[1,'#4a3628']]); c.fillRect(x,27,w,110);
    c.strokeStyle='rgba(0,0,0,.3)'; c.lineWidth=.8; c.strokeRect(x+3,32,w-6,46); c.strokeRect(x+3,84,w-6,48); }
  c.fillStyle='#c4a46a'; c.fillRect(150,74,1.6,9); c.fillRect(156.5+gap,74,1.6,9);
  c.fillStyle='#6b5a48'; rr(c,128,13,22,10,1); c.fill(); c.fillStyle='#8a6a5a'; rr(c,152,15,18,8,1); c.fill(); // boxes on top

  // DRESSER + shelf + cat night-light + closet lamp
  c.fillStyle='#4a3428'; rr(c,190,106,40,34,2); c.fill(); c.fillStyle='#3a281f'; for(let i=0;i<3;i++) c.fillRect(192,115+i*8,36,.8);
  c.fillStyle='#b99a6a'; for(let i=0;i<3;i++){ c.fillRect(200,111+i*8,3,1.2); c.fillRect(217,111+i*8,3,1.2); }
  c.fillStyle='#5a4030'; c.fillRect(194,80,34,2.5);
  [['#a85a4e',3.5,11],['#5a7a9a',3,9],['#c9a85a',4,12],['#6f9a80',3,8]].forEach(([col,w,h],i)=>{ c.fillStyle=col; c.fillRect(196+i*4.3,80-h,w,h); });
  c.fillStyle='#a8714f'; c.fillRect(215,76,6,4); c.fillStyle='#5f9a66'; rr(c,216,68,4,9,2); c.fill();
  c.fillStyle='rgba(240,220,180,.6)'; rr(c,222,70,6,10,2); c.fill(); c.fillStyle='#7a6a58'; c.fillRect(222,68.5,6,1.6);
  c.fillStyle='#f3e3c4'; c.beginPath(); c.ellipse(222,102,5,4,0,0,7); c.fill(); c.beginPath(); c.moveTo(218,99.5); c.lineTo(218.5,95.5); c.lineTo(220.5,98.5); c.moveTo(226,99.5); c.lineTo(225.5,95.5); c.lineTo(223.5,98.5); c.fill();
  c.fillStyle='#4a3a32'; c.fillRect(220,101.5,1,1); c.fillRect(223.5,101.5,1,1);
  c.fillStyle='#2a2326'; c.fillRect(201,96,2,10); c.beginPath(); c.ellipse(202,106,5,1.5,0,0,7); c.fill();
  lampShadeShape(c,202,88,'closet');
  if(S.night && (S.night.key==='sun'||S.night.key==='mon2')){ // moving boxes packed on the bed
    for(const [x,y,w,h,t] of [[52,104,22,15,'#c09a68'],[72,107,18,12,'#ad8758'],[56,93,16,11,'#caa676']]){ c.fillStyle=t; c.fillRect(x,y,w,h); c.fillStyle='rgba(0,0,0,.18)'; c.fillRect(x,y+h*.45,w,1.2); c.fillStyle='rgba(230,215,180,.55)'; c.fillRect(x+w*.3,y+2,w*.4,1.2); } }
  // poster + wall clock
  c.fillStyle='#3b2f45'; rr(c,196,32,24,32,1); c.fill(); c.fillStyle='#d68ca0'; c.beginPath(); c.arc(208,44,6,0,7); c.fill(); c.fillStyle='#e9b65e'; c.fillRect(201,54,14,2); c.fillRect(201,58,9,1.5);
  drawWallClock(c,228,40);

  // DOOR x246..292, y30..140 + standing door lamp at x236
  c.fillStyle='#4a3f44'; c.fillRect(242,26,54,114);
  c.fillStyle='#020203'; c.fillRect(246,30,46,110);
  const dzd = S.decoy && S.decoy.zone==='door' && st.stage!=='door';
  const dp = st.stage==='door' ? st.p : dzd ? .45 : 0;
  if(dp>0){ const hx=262+dp*4, hy=58-dp*4, s=1+.35*dp; c.save(); c.beginPath(); c.rect(246,30,46,110); c.clip();
    if(has('stalker_door')) c.drawImage(IMG.stalker_door,hx-25*s,hy-12*s,50*s,110*s); else figure(c,hx,hy,s); c.restore(); if(!dzd) eyes.push({x:hx,y:hy-.5,s,zone:'door'}); }
  const dw=46*(1-dp*.8);
  c.fillStyle=lg(c,292-dw,0,292,0,[[0,'#5a4d55'],[1,'#6a5c64']]); c.fillRect(292-dw,30,dw,110);
  if(dw>12){ c.strokeStyle='rgba(0,0,0,.3)'; c.lineWidth=.8; c.strokeRect(292-dw+4,36,dw-8,40); c.strokeRect(292-dw+4,84,dw-8,50); }
  c.fillStyle='#c9b48a'; c.fillRect(292-dw+3,84,2.4,3.4);
  c.fillStyle='#2a2326'; c.fillRect(235.2,60,1.6,78); c.beginPath(); c.ellipse(236,138,5,1.4,0,0,7); c.fill();
  lampShadeShape(c,236,52,'door');
  /* the last night: moving boxes, taped, a marker scrawl on them */
  if(S.night.ev && S.night.ev.boxes){
    for(const [x,y,w,h] of [[94,118,26,20],[98,102,20,16],[198,120,30,18],[230,124,16,14]]){
      c.fillStyle='#7a5a3a'; c.fillRect(x,y,w,h); c.fillStyle='#8f6c47'; c.fillRect(x,y,w,3);
      c.fillStyle='rgba(225,210,170,.55)'; c.fillRect(x+w/2-1.5,y,3,h); c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(x+w-2,y,2,h);
      c.strokeStyle='rgba(30,20,15,.55)'; c.lineWidth=.6; c.beginPath(); c.moveTo(x+3,y+h*.6); c.lineTo(x+w/2-4,y+h*.55); c.stroke(); }
  }
  // ARMCHAIR in the corner (Wednesday: someone sits in it)
  c.fillStyle='#3d3040'; rr(c,296,96,30,42,6); c.fill(); c.fillStyle='#4a3a4e'; rr(c,300,112,26,16,4); c.fill(); c.fillStyle='#2e2430'; rr(c,294,110,8,26,3); c.fill();
  if(S.ev.chairShow>0){ if(has('stalker_chair')) c.drawImage(IMG.stalker_chair,296,84,30,50); else seated(c,312,100,1); eyes.push({x:312,y:99.5,s:1,zone:'chair'}); }

  // BEHIND MIA (out of the closet)
  if(st.stage==='behind' && st.p>=.45){ const k=(st.p-.45)/.55, hx=170+k*6+Math.sin(S.t*2)*1, hy=70-k*6, s=1.8+.8*k;
    if(has('stalker_behind')) c.drawImage(IMG.stalker_behind,hx-25*s,hy-12*s,50*s,110*s); else figure(c,hx,hy,s,1,-.08*k); eyes.push({x:hx,y:hy-1,s,zone:'behind'}); }

  // Mia, then her desk
  if(S.mia.awayT<=0 && !S.finaleEmpty) drawMia(c);
  else { drawChair(c); if(S.pullK!=null) drawMiaPulled(c,S.pullK); }
  drawDesk(c);
}
function lampShadeShape(c,x,y,z){ const m=lampMode(z), f=S.lamps[z].flick; c.fillStyle= m==='DEAD'?'#1e1a1d' : m==='DIM'?`rgba(170,110,60,${.75*f})` : m==='STABLE'?`rgba(240,190,120,${f})` : `rgba(255,244,220,${f})`; c.beginPath(); c.moveTo(x-7,y+9); c.lineTo(x+7,y+9); c.lineTo(x+4.5,y); c.lineTo(x-4.5,y); c.closePath(); c.fill();
    if(m==='DEAD'){ c.strokeStyle='rgba(183,68,63,.7)'; c.lineWidth=.5; c.beginPath(); c.moveTo(x-3,y+2); c.lineTo(x,y+5); c.lineTo(x+2,y+3); c.stroke(); } }
function drawWallClock(c,x,y){
  c.fillStyle='#d6c9b7'; c.beginPath(); c.arc(x,y,6,0,7); c.fill(); c.strokeStyle='#3a3030'; c.lineWidth=.8; c.stroke();
  const mins=S?Math.floor(streamMin()):0, a=mins/60*Math.PI*2-Math.PI/2, hA=(23+mins/60)/12*Math.PI*2-Math.PI/2;
  c.strokeStyle='#2a2224'; c.lineWidth=.8; c.beginPath(); c.moveTo(x,y); c.lineTo(x+Math.cos(a)*4.8,y+Math.sin(a)*4.8); c.moveTo(x,y); c.lineTo(x+Math.cos(hA)*3.2,y+Math.sin(hA)*3.2); c.stroke();
}
function drawChair(c){ const {x,y,s}=MIA;
  if(has('mia_calm')){ // the empty chair, matching the drawn one: narrower, a red stripe down the backrest
    const [ax,ay,w,h]=miaArtRect(), cx=MIA.x, k=w/ART_W; c.save(); c.fillStyle='#262131';
    c.beginPath(); c.moveTo(cx-120*k,ay+6*k); c.quadraticCurveTo(cx,ay-12*k,cx+120*k,ay+6*k); c.lineTo(cx+150*k,ay+150*k); c.quadraticCurveTo(cx+185*k,ay+260*k,cx+150*k,ay+440*k); c.lineTo(cx-150*k,ay+440*k); c.quadraticCurveTo(cx-185*k,ay+260*k,cx-150*k,ay+150*k); c.closePath(); c.fill();
    c.fillStyle='#8f3434'; c.fillRect(cx-9*k,ay-4*k,18*k,95*k); c.fillStyle='rgba(255,255,255,.04)'; c.fillRect(cx-110*k,ay+40*k,40*k,330*k); c.restore(); return; }
  c.save(); c.translate(x,y); c.scale(s,s); c.fillStyle='#2b2233'; rr(c,-30,-36,60,30,10); c.fill(); rr(c,-36,-14,72,90,14); c.fill(); c.fillStyle='#3a2e45'; rr(c,-30,-8,60,74,10); c.fill(); c.restore(); }
function drawDesk(c){
  c.fillStyle=lg(c,0,165,0,180,[[0,'#3a2a20'],[1,'#22170f']]); c.fillRect(0,165,W,15); c.fillStyle='#5a4232'; c.fillRect(0,164,W,1.4);
  const artMia = has('mia_calm') && S.mia.awayT<=0 && !S.finaleEmpty && S.artRect;
  if(!artMia){ c.fillStyle='#1d1a22'; rr(c,108,160,70,9,2); c.fill();
  c.fillStyle='#3d3747'; for(let r=0;r<2;r++) for(let i=0;i<12;i++) c.fillRect(111+i*5.4,162+r*3.2,3.6,2); }
  if(artMia){ const [x,y,w,h,img]=S.artRect; c.save(); c.beginPath(); c.rect(x,163.4,w,20); c.clip(); c.drawImage(img,x,y,w,h); c.restore(); }
  else if(S.mia.awayT<=0 && !S.finaleEmpty){
    // her hands on the keys, attached to the sleeves (they follow her: breathing, flinching, being pulled away)
    const hx=MIA.x+S.mia.look*1.6, hy=MIA.y+Math.sin(S.t*1.6)*.7+51, typing=S.panic<78 && !S.over;
    const tb=k=>typing?Math.max(0,Math.sin(S.t*13+k))*.8:0;
    c.fillStyle=LOOK.hoodie[0]; c.beginPath(); c.ellipse(hx-15,hy+.5,5.5,4,-.25,0,7); c.ellipse(hx+15,hy+.5,5.5,4,.25,0,7); c.fill();
    c.fillStyle='#f0c8b0'; c.beginPath(); c.ellipse(hx-9.5,hy-.5-tb(0),3.9,2.8,.15,0,7); c.ellipse(hx+9.5,hy-.5-tb(2.1),3.9,2.8,-.15,0,7); c.fill();
    c.fillStyle='rgba(120,70,60,.35)'; c.fillRect(hx-11.5,hy-1-tb(0),.6,1.6); c.fillRect(hx+11,hy-1-tb(2.1),.6,1.6);
  }
  // microphone on a boom arm
  c.strokeStyle='#121014'; c.lineWidth=2.2; c.beginPath(); c.moveTo(214,170); c.lineTo(206,142); c.lineTo(186,128); c.stroke();
  c.fillStyle='#24212a'; rr(c,176,118,14,20,6); c.fill(); c.fillStyle='#3d3946'; for(let y=121;y<134;y+=2.6) c.fillRect(178,y,10,.9);
  c.fillStyle='#121014'; c.fillRect(180,137,6,4);
  // a can and a sticky note on the desk edge
  c.fillStyle='#b7443f'; rr(c,78,156,8,12,1.5); c.fill(); c.fillStyle='#d6c9b7'; c.fillRect(78,159,8,2);
  c.fillStyle='#e9d27a'; c.save(); c.translate(236,170); c.rotate(.12); c.fillRect(-7,-6,14,12); c.restore();
}

// ---------- Mia (anime streamer, cat-ear headphones, six moods)
// sticky expressions: thresholds with a margin on the way down, and a new face holds for at least 0.45 s
function miaExpr(){
  const m=S.mia, p=S.panic, UP=[40,65,85], DOWN=[34,59,79];
  let lv=m.exLv||0; while(lv<3 && p>UP[lv]) lv++; while(lv>0 && p<DOWN[lv-1]) lv--; m.exLv=lv;
  let want = m.surpriseT>0 ? 'surprised' : lv===3 ? 'panic' : lv===2 ? 'anxious' : lv===1 ? 'scared' : mouthOpen() ? 'talk' : 'calm';   /* mouth follows the voice syllables (audio.js MOUTH) */
  if(m.phone && IMG.mia_phoneclosed){ /* scare.js phone call: she holds the phone to her ear */
    want = m.phone==='scared'||lv>=2 ? 'phonescared' : m.phone==='open'&&mouthOpen() ? 'phone' : 'phoneclosed';
    m.ex=want; m.exT=S.t; return want; }
  const calmish=e=>e==='calm'||e==='talk';
  if(m.ex && want!==m.ex && !(calmish(want)&&calmish(m.ex)) && want!=='surprised' && S.t-(m.exT||0)<.45) want=m.ex;
  if(want!==m.ex){ m.ex=want; m.exT=S.t; }
  return want;
}
function drawMia(c){
  const ex=miaExpr(), key='mia_'+ex;
  const m=S.mia, p=S.panic, jx=(ex==='anxious'||ex==='panic')?(Math.random()-.5)*(p-60)/14:0, br=Math.sin(S.t*1.6)*.7;
  if(has('mia_calm')){ drawMiaArt(c,ex,jx,br); return; }
  c.save(); c.translate(MIA.x+jx+m.look*1.6, MIA.y+br); c.scale(MIA.s,MIA.s);
  // chair
  c.fillStyle='#2b2233'; rr(c,-30,-36,60,30,10); c.fill(); rr(c,-36,-14,72,90,14); c.fill(); c.fillStyle='#3a2e45'; rr(c,-30,-8,60,74,10); c.fill();
  c.fillStyle='#b7443f'; c.fillRect(-30,-24,60,2);
  // long hair behind
  c.fillStyle='#a85582'; c.beginPath(); c.moveTo(-24,-4); c.quadraticCurveTo(-31,30,-26,44); c.lineTo(26,44); c.quadraticCurveTo(31,30,24,-4); c.closePath(); c.fill();
  // hoodie (faded blue-grey)
  c.fillStyle=lg(c,0,18,0,64,[[0,LOOK.hoodie[0]],[1,LOOK.hoodie[1]]]); c.beginPath(); c.moveTo(-42,70); c.quadraticCurveTo(-40,28,-13,20); c.lineTo(13,20); c.quadraticCurveTo(40,28,42,70); c.closePath(); c.fill();
  c.fillStyle=LOOK.hoodie[0]; c.globalAlpha=.85; c.beginPath(); c.ellipse(0,22,15,5,0,0,7); c.fill(); c.globalAlpha=1;
  // sleeves: from the shoulders, bent at the elbow, forearms reaching the keyboard (hands are drawn with the desk, over the keys)
  c.save(); c.lineCap='round'; c.lineJoin='round';
  for(const [col,w] of [[LOOK.hoodie[1],12],[LOOK.hoodie[0],8.5]]){ c.strokeStyle=col; c.lineWidth=w; for(const s of [-1,1]){ c.beginPath(); c.moveTo(s*33,32); c.quadraticCurveTo(s*30,48,s*10,39); c.stroke(); } }
  c.restore();
  c.strokeStyle='#d6c9b7'; c.lineWidth=.9; c.beginPath(); c.moveTo(-5,25); c.lineTo(-6,40); c.moveTo(5,25); c.lineTo(6,38); c.stroke();
  // neck + hair volume + face
  c.fillStyle='#e2b39c'; c.fillRect(-5,11,10,11);
  c.fillStyle='#c96a9a'; c.beginPath(); c.ellipse(0,-2,23.5,24,0,0,7); c.fill();
  c.fillStyle='#f3d2bf'; c.beginPath(); c.moveTo(-15,-4); c.quadraticCurveTo(-15.5,11,0,17); c.quadraticCurveTo(15.5,11,15,-4); c.quadraticCurveTo(0,-16,-15,-4); c.fill();
  c.fillStyle='rgba(235,110,130,.32)'; c.beginPath(); c.ellipse(-9,7.5,3.4,1.8,0,0,7); c.ellipse(9,7.5,3.4,1.8,0,0,7); c.fill();
  // eyes
  const ey=2, wide={calm:4.3,talk:4.3,surprised:5.3,scared:4.6,anxious:4.9,panic:5.6}[ex], ir={calm:2.7,talk:2.7,surprised:1.9,scared:2.2,anxious:2,panic:1.4}[ex];
  const lk=m.look*1.1+(S.st.stage==='behind'?.9:0)+(ex==='anxious'?Math.sin(S.t*9)*.8:0);
  for(const sx of [-6.5,6.5]){
    const x=sx;
    if(m.blink>0 && ex!=='panic' && ex!=='surprised'){ c.strokeStyle='#3b2340'; c.lineWidth=1.3; c.beginPath(); c.moveTo(x-3.6,ey+.4); c.quadraticCurveTo(x,ey+2.2,x+3.6,ey+.4); c.stroke(); continue; }
    c.fillStyle='#fffaf4'; c.beginPath(); c.ellipse(x,ey,3.8,wide,0,0,7); c.fill();
    c.fillStyle=lg(c,0,ey-3,0,ey+3,[[0,'#3a2050'],[1,'#8f62c0']]); c.beginPath(); c.ellipse(x+lk,ey+.4,ir,ir*1.28,0,0,7); c.fill();
    c.fillStyle='#1c0f24'; c.beginPath(); c.arc(x+lk,ey+.7,ir*.45,0,7); c.fill();
    c.fillStyle='#fff'; c.beginPath(); c.arc(x+lk-.9,ey-1,.85,0,7); c.fill();
    c.strokeStyle='#2a1630'; c.lineWidth=1.4; c.beginPath(); c.moveTo(x-4.1,ey-2.4); c.quadraticCurveTo(x,ey-wide-.8,x+4.3,ey-2.2); c.stroke();
  }
  // brows
  c.strokeStyle='#8e3e69'; c.lineWidth=1.1; c.beginPath();
  if(ex==='surprised'){ c.moveTo(-10.5,ey-10); c.quadraticCurveTo(-6.5,ey-12,-3,ey-10.4); c.moveTo(10.5,ey-10); c.quadraticCurveTo(6.5,ey-12,3,ey-10.4); }
  else if(ex==='scared'||ex==='anxious'||ex==='panic'){ c.moveTo(-10.5,ey-7); c.lineTo(-3,ey-9.8); c.moveTo(10.5,ey-7); c.lineTo(3,ey-9.8); }
  else { c.moveTo(-10.5,ey-8.4); c.lineTo(-3,ey-8.6); c.moveTo(10.5,ey-8.4); c.lineTo(3,ey-8.6); }
  c.stroke();
  // mouth
  const talkOpen = ex==='talk' && Math.floor(S.t*8)%2===0;
  c.fillStyle='#7a2a3a'; c.strokeStyle='#8a4050'; c.lineWidth=1;
  if(ex==='panic'){ c.beginPath(); c.ellipse(0,12,3.2,3.6,0,0,7); c.fill(); c.fillStyle='#d6798a'; c.beginPath(); c.ellipse(0,14,2,1.2,0,0,7); c.fill(); }
  else if(ex==='surprised'){ c.beginPath(); c.ellipse(0,12,1.9,2.3,0,0,7); c.fill(); }
  else if(ex==='anxious'){ c.beginPath(); c.ellipse(0,12,2.2,1.3,0,0,7); c.fill(); }
  else if(ex==='scared'){ c.beginPath(); c.moveTo(-3,12); c.quadraticCurveTo(-1.5,11,0,12); c.quadraticCurveTo(1.5,13,3,12); c.stroke(); }
  else if(talkOpen){ c.beginPath(); c.ellipse(0,12,2.4,1.8,0,0,7); c.fill(); }
  else { c.beginPath(); c.moveTo(-3,11); c.quadraticCurveTo(0,13.6,3,11); c.stroke(); }
  // bangs, side locks, shine
  c.fillStyle='#dc7fac'; c.beginPath(); c.moveTo(-20,2); c.quadraticCurveTo(-21,-23,0,-24); c.quadraticCurveTo(21,-23,20,2);
  c.lineTo(15,-5); c.lineTo(11,-1); c.lineTo(7,-7); c.lineTo(2,-2); c.lineTo(-3,-8); c.lineTo(-8,-2); c.lineTo(-12,-7); c.lineTo(-16,-1); c.closePath(); c.fill();
  c.fillStyle='#c96a9a'; c.beginPath(); c.moveTo(-20,-3); c.quadraticCurveTo(-23,16,-17,27); c.lineTo(-14,8); c.closePath(); c.moveTo(20,-3); c.quadraticCurveTo(23,16,17,27); c.lineTo(14,8); c.closePath(); c.fill();
  c.strokeStyle='rgba(255,240,245,.35)'; c.lineWidth=1.2; c.beginPath(); c.arc(-4,-8,12,Math.PI*1.2,Math.PI*1.45); c.stroke();
  // cat-ear headphones
  for(const sgn of [-1,1]){ c.fillStyle='#2a2530'; c.beginPath(); c.moveTo(sgn*10,-21); c.lineTo(sgn*21,-33); c.lineTo(sgn*22,-17); c.closePath(); c.fill();
    c.fillStyle=LOOK.phones; c.beginPath(); c.moveTo(sgn*12.5,-21.5); c.lineTo(sgn*19.5,-29); c.lineTo(sgn*20,-19.5); c.closePath(); c.fill(); }
  c.strokeStyle='#2a2530'; c.lineWidth=3.4; c.beginPath(); c.arc(0,-3,24,Math.PI*1.08,Math.PI*1.92); c.stroke();
  c.fillStyle='#2a2530'; rr(c,-28,-7,9,16,3.5); c.fill(); rr(c,19,-7,9,16,3.5); c.fill();
  c.fillStyle=LOOK.phones; rr(c,-26.5,-4,5.5,10,2.5); c.fill(); rr(c,21,-4,5.5,10,2.5); c.fill();
  c.fillStyle='rgba(233,182,94,.9)'; c.beginPath(); c.arc(-23.7,5.4,.8,0,7); c.fill();
  // star hair clip
  c.fillStyle='#e9b65e'; c.beginPath(); for(let i=0;i<10;i++){ const r=i%2?1.2:2.8, a=-Math.PI/2+i*Math.PI/5; c.lineTo(12+Math.cos(a)*r,-14+Math.sin(a)*r); } c.closePath(); c.fill();
  // sweat / tears
  if(ex==='anxious'||ex==='panic'){ c.fillStyle='rgba(180,210,235,.85)'; c.beginPath(); c.moveTo(15,-6); c.quadraticCurveTo(17.5,-1,15,0); c.quadraticCurveTo(12.6,-1,15,-6); c.fill(); }
  if(ex==='panic'){ c.fillStyle='rgba(180,210,235,.7)'; c.fillRect(-7.5,5,1,4+Math.sin(S.t*5)*1.5); c.fillRect(6,5,1,4+Math.cos(S.t*5)*1.5); }
  c.restore();
}

// ---------- full frame
function render(){
  frame++;
  if(!S) return;
  ctx.setTransform(SC,0,0,SC,0,-CAM_Y*SC);
  if(S.finaleEmpty){ renderFinaleFrame(); return; }
  const tk=takeT(); let restore=null;
  if(tk>=0){ const st=S.st;
    if(tk<1.05){ st.stage='behind'; st.p=1; const k=tk<.55?0:Math.min(1,(tk-.55)/.45); S.panic=100; S.mia.surpriseT=1;
      if(has('mia_calm')){ if(k>0){ S.pullK=k*k; S.finaleEmpty=true; } } else { restore={x:MIA.x,y:MIA.y}; MIA.x+=12*k; MIA.y-=34*k*k; } }
    else { st.stage='hidden'; st.p=0; S.finaleEmpty=true; const r=Math.max(0,1-(tk-1.05)/2)*Math.sin(tk*9)*3; restore={x:MIA.x,y:MIA.y}; MIA.x+=r; }
    if(tk>.85&&tk<1.2){ S.shake=.5; S.glitch=.2; } }
  drawRoom(ctx); if(tk>=1.05 || S.pullK!=null) S.finaleEmpty=false; S.pullK=null;
  if(tk>=0 && tk>.15 && (has('mia_calm') ? tk<.55 : tk<1.05)) drawHands(ctx,0,has('mia_calm')?-7:0);
  if(restore){ MIA.x=restore.x; MIA.y=restore.y; }
  // darkness, cut by the lamps, the monitor glow and the moon
  dctx.globalCompositeOperation='source-over'; dctx.clearRect(0,0,W,H);
  dctx.fillStyle='rgba(8,5,10,0.85)'; dctx.fillRect(0,0,W,H);
  dctx.globalCompositeOperation='destination-out';
  const hole=(x,y,r,a)=>{ const g=dctx.createRadialGradient(x,y,0,x,y,r); g.addColorStop(0,`rgba(0,0,0,${a})`); g.addColorStop(.55,`rgba(0,0,0,${a*.6})`); g.addColorStop(1,'rgba(0,0,0,0)'); dctx.fillStyle=g; dctx.fillRect(x-r,y-r,r*2,r*2); };
  for(const z of ZONES){ const L=S.lamps[z], m=lampMode(z); if(m==='DEAD') continue; const P=LIGHT[z];
    const [r,a] = m==='DIM'?[40,.34]:m==='STABLE'?[68,.74]:[106,.98]; hole(P.x,P.y,r,a*L.flick); }
  if(S.mia.awayT<=0) hole(MIA.x,182,84,.85); else hole(MIA.x,182,60,.5);
  if(!S.blinds.closed) hole(54,62,30,.2);
  hole(160,16,170,.14); hole(222,96,22,.4);
  ctx.drawImage(dark,0,0,W,H);
  // warm bloom from the lamps, cold glow from Mia's monitor
  ctx.globalCompositeOperation='lighter';
  for(const z of ZONES){ const m=lampMode(z), f=S.lamps[z].flick; if(m==='DEAD') continue; const P=LIGHT[z];
    const a=(m==='DIM'?.03:m==='STABLE'?.07:.16)*f, r=m==='BOOST'?92:62;
    const g=ctx.createRadialGradient(P.x,P.y-8,0,P.x,P.y-8,r); g.addColorStop(0,`rgba(233,170,94,${a})`); g.addColorStop(1,'rgba(233,170,94,0)'); ctx.fillStyle=g; ctx.fillRect(P.x-r,P.y-8-r,r*2,r*2); }
  { const g=ctx.createRadialGradient(MIA.x,182,0,MIA.x,182,90); g.addColorStop(0,'rgba(100,124,170,.12)'); g.addColorStop(1,'rgba(100,124,170,0)'); ctx.fillStyle=g; ctx.fillRect(MIA.x-90,92,180,90); }
  for(const b of BULBS){ const a=.78+.20*Math.sin(S.t*2+b.ph); const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,8); g.addColorStop(0,`rgba(${b.c},${.32*a})`); g.addColorStop(1,`rgba(${b.c},0)`); ctx.fillStyle=g; ctx.fillRect(b.x-8,b.y-8,16,16);
    ctx.fillStyle=`rgba(${b.c},${.9*a})`; ctx.beginPath(); ctx.arc(b.x,b.y+1.4,1.2,0,7); ctx.fill(); }
  { const g=ctx.createRadialGradient(222,100,0,222,100,16); g.addColorStop(0,'rgba(240,210,150,.35)'); g.addColorStop(1,'rgba(240,210,150,0)'); ctx.fillStyle=g; ctx.fillRect(206,84,32,32); }
  ctx.globalCompositeOperation='source-over';
  /* scares: eyes flash in a corner that just went dark; a face fills the frame for a few frames; white flash */
  if(S.fxEyes){ const P={window:[58,70,1.5],closet:[160,56,1.7],door:[264,56,1.8]}[S.fxEyes.zone]; if(P) eyes.push({x:P[0],y:P[1],s:P[2],zone:S.fxEyes.zone,fx:1}); }
  if(S.fxFace>0){ ctx.save(); ctx.globalAlpha=.92; figure(ctx,160,62,3.6); ctx.restore(); eyes.push({x:160,y:60,s:3.6,zone:'behind',fx:1}); }
  // eyes catch the light
  if(!S.over) for(const e of eyes){
    const m = e.zone==='chair'?'DIM' : e.zone==='behind'?lampMode('closet') : lampMode(e.zone);
    const a = e.fx ? .95 : {DEAD:.75,DIM:.6,STABLE:.4,BOOST:.14}[m]; const dx=2.6*e.s, ew=Math.max(1.2,1.5*e.s), eh=e.s>1.3?1.6:1;
    const red = S.st.red && e.zone===S.st.stage && e.zone!=='behind';
    ctx.fillStyle = red ? `rgba(240,64,52,${Math.max(a,.7)})` : `rgba(236,236,220,${a})`; ctx.fillRect(e.x-dx-.6,e.y,ew,eh); ctx.fillRect(e.x+dx-.6,e.y,ew,eh);
  }
  if(S.fxFlash>0){ ctx.fillStyle=`rgba(255,250,240,${Math.min(.7,S.fxFlash*2.6)})`; ctx.fillRect(0,0,W,H); }
  if(S.alarmT>0 && Math.sin(S.t*16)>0){ ctx.fillStyle='rgba(183,68,63,.2)'; ctx.fillRect(0,0,W,H); }
  if(S.rec.flash>0){ ctx.fillStyle=`rgba(255,250,235,${S.rec.flash*.5})`; ctx.fillRect(0,0,W,H); }
  // film noise, glitches
  ctx.globalAlpha=.039+(S.glitch>0?.14:0)+(S.st.stage==='behind'?.06:0); ctx.drawImage(noises[frame%4],0,0); ctx.globalAlpha=1;
  if(S.glitch>0){ ctx.save(); ctx.setTransform(1,0,0,1,0,0); for(let i=0;i<5;i++){ const y=(Math.random()*feed.height)|0, h=(8+Math.random()*48)|0, dx=((Math.random()-.5)*90)|0; ctx.drawImage(feed,0,y,feed.width,h,dx,y,feed.width,h);} ctx.fillStyle='rgba(183,68,63,.12)'; ctx.fillRect(0,(Math.random()*feed.height)|0,feed.width,10); ctx.restore(); }

}
// ---------- he takes her: hands on her shoulders, she is pulled out of frame, the chair keeps rocking
const TAKE_LEN=3.4;
function takeT(){ return S&&S.taken ? TAKE_LEN-Math.max(0,S.scareT) : -1; }
function drawHands(c,dx,dy){ c.fillStyle='#070608';
  for(const sgn of [-1,1]){ const x=MIA.x+sgn*31+dx, y=MIA.y+29+dy; c.beginPath(); c.ellipse(x,y,9,6,sgn*.5,0,7); c.fill();
    for(let f=0;f<4;f++){ c.beginPath(); c.ellipse(x-sgn*(2+f*3.5),y+5+f*.6,1.6,5,sgn*.2,0,7); c.fill(); } } }
// ---------- the streamer's avatar for the channel header
function drawAvatar(cv){
  const c=cv.getContext('2d'); const k=cv.width/40; c.setTransform(k,0,0,k,0,0);
  c.fillStyle='#3a2e45'; c.fillRect(0,0,40,40);
  const saved=S; S=S||newState(0);
  const m0={...S.mia}; S.mia.blink=0; S.mia.look=0; S.mia.surpriseT=0;
  c.save(); c.translate(20,27); c.scale(.62,.62); c.translate(-MIA.x,-MIA.y);
  const keep=MIA.s; drawMiaHeadOnly(c); MIA.s=keep; c.restore(); S.mia=m0; S=saved;
}
// ---------- drawn Mia (tools/art.py): 80% of the slot, desk line of the picture on the desk; missing emotions get overlays
const ART_SCALE=.8, ART_W=624;
function miaArtRect(){ const w=156*ART_SCALE, h=128*ART_SCALE, dl=(typeof ART_META!=='undefined'?ART_META.deskY:.88); return [MIA.x-w/2, 164-dl*h+(MIA.y-113), w, h]; }
const SKIN=new Map();
function skinOf(img){ if(SKIN.has(img)) return SKIN.get(img); let col='rgb(176,160,158)';
  try{ const cv=document.createElement('canvas'); cv.width=img.naturalWidth; cv.height=img.naturalHeight; const x=cv.getContext('2d'); x.drawImage(img,0,0);
    const k=img.naturalWidth/ART_W, d=x.getImageData(Math.round(312*k)-3,Math.round(178*k)-3,6,6).data; let r=0,g=0,b=0; for(let i=0;i<d.length;i+=4){ r+=d[i]; g+=d[i+1]; b+=d[i+2]; } const n=d.length/4; col=`rgb(${r/n|0},${g/n|0},${b/n|0})`; }catch(e){}
  SKIN.set(img,col); return col; }
const CUT=new Map();
function cutOf(img){ if(CUT.has(img)) return CUT.get(img); const w=img.naturalWidth,h=img.naturalHeight,cv=document.createElement('canvas'); cv.width=w; cv.height=h; const x=cv.getContext('2d');
  x.drawImage(img,0,0); x.globalCompositeOperation='destination-in'; x.save(); x.translate(w*.5,h*.6); x.scale(1,1.25);
  const g=x.createRadialGradient(0,0,0,0,0,w*.36); g.addColorStop(0,'#000'); g.addColorStop(.82,'#000'); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.fillRect(-w,-h,w*2,h*2); x.restore();
  CUT.set(img,cv); return cv; }
function drawMiaPulled(c,k){ // k: 0 → 1 while she is dragged out of frame
  const img=IMG.mia_panic||IMG.mia_calm, cut=cutOf(img); const [x,y,w,h]=miaArtRect(), ss=1-.32*k;
  c.save(); c.translate(x+w/2+20*k, y+h*.6-36*k); c.rotate(-.28*k); c.scale(ss,ss); c.globalAlpha=1-.25*k;
  c.drawImage(cut,-w/2,-h*.6,w,h); c.globalAlpha=1;
  const q=w/ART_W; c.fillStyle='#070608'; for(const sx of [175,450]){ const hx=-w/2+sx*q, hy=-h*.6+300*q; c.beginPath(); c.ellipse(hx,hy,9,6,0,0,7); c.fill(); for(let f=0;f<4;f++){ c.beginPath(); c.ellipse(hx+(f-1.5)*3.4,hy+5,1.6,5,0,0,7); c.fill(); } }
  c.restore(); }
function drawMiaArt(c,ex,jx,br){
  const own=IMG['mia_'+ex]; let img=own||IMG.mia_calm;
  if(S.mia.blink>0 && IMG.mia_blink && (ex==='calm'||ex==='talk')) img=IMG.mia_blink; /* real closed-eyes frame */
  else if(ex==='talk' && own && Math.floor(S.t*7)%3===2) img=IMG.mia_calm; /* lips move while she talks (eyes are identical in both frames) */
  const trem = ex==='panic' ? Math.sin(S.t*29)*.22+Math.sin(S.t*17)*.12 : 0;  /* a fine shiver, no random jumps */
  const [x,y,w,h]=miaArtRect();
  c.drawImage(img,x,y,w,h); if(trem) c.drawImage(cutOf(img),x+trem,y,w,h); S.artRect=[x,y,w,h,img];
  const k=w/ART_W, P=(px,py)=>[x+px*k,y+py*k];
  if(own) return;
  const mouth=(rx,ry)=>{ const [mx,my]=P(312,247); c.fillStyle='#5e2230'; c.beginPath(); c.ellipse(mx,my,rx*k,ry*k,0,0,7); c.fill(); c.fillStyle='#b8606e'; c.beginPath(); c.ellipse(mx,my+ry*.45*k,rx*.55*k,ry*.3*k,0,0,7); c.fill(); };
  const sweat=()=>{ const [sx,sy]=P(398,166); c.fillStyle='rgba(185,215,240,.9)'; c.beginPath(); c.moveTo(sx,sy-8*k); c.quadraticCurveTo(sx+6*k,sy+3*k,sx,sy+5*k); c.quadraticCurveTo(sx-6*k,sy+3*k,sx,sy-8*k); c.fill(); };
  if(ex==='talk' && Math.floor(S.t*8)%2===0) mouth(7,5);
  else if(ex==='surprised') mouth(5,7);
  else if(ex==='scared') { mouth(4,3); }
  else if(ex==='anxious'){ mouth(4.5,3.5); sweat(); }
  else if(ex==='panic'){ mouth(8,10); sweat(); c.fillStyle='rgba(185,215,240,.75)'; for(const tx of [258,366]){ const [a,b]=P(tx,205); c.fillRect(a,b,2.2*k,(22+Math.sin(S.t*5+tx)*6)*k); } }
}
function drawMiaHeadOnly(c){ const old=S.panic; S.panic=0; c.save(); c.beginPath(); c.rect(MIA.x-40,MIA.y-60,80,80); c.clip(); drawMia(c); c.restore(); S.panic=old; }

// ---------- Friday: the photo inside the note (the player's own back)
function drawPhoto(cv){
  if(has('mia_calm')&&has('chair_back')){ drawPhotoBack(cv); return; }
  const c=cv.getContext('2d'); const w=cv.width,h=cv.height; c.setTransform(w/320,0,0,h/200,0,0);
  c.fillStyle='#0d0b0c'; c.fillRect(0,0,320,200);
  // the monitor on the far side, showing the stream
  c.fillStyle='#1c191b'; rr(c,70,30,180,112,10); c.fill(); c.fillStyle='#2a2629'; rr(c,78,38,164,94,4); c.fill();
  c.fillStyle='#3d3640'; c.fillRect(82,42,104,58); c.fillStyle='#e0a0b8'; c.beginPath(); c.arc(130,74,9,0,7); c.fill(); c.fillStyle='#5f6c98'; c.fillRect(118,82,24,16);
  c.fillStyle='#2f2a2e'; c.fillRect(190,42,48,86); c.fillStyle='#4a4246'; for(let i=0;i<7;i++) c.fillRect(194,48+i*10,30+((i*7)%10),3);
  c.fillStyle='#352f33'; c.fillRect(82,104,104,26);
  // lamp glow on the right, mug on the left
  const g=c.createRadialGradient(290,40,0,290,40,140); g.addColorStop(0,'rgba(233,170,94,.45)'); g.addColorStop(1,'rgba(233,170,94,0)'); c.fillStyle=g; c.fillRect(150,0,170,200);
  c.fillStyle='#2a2224'; c.beginPath(); c.moveTo(270,30); c.lineTo(300,20); c.lineTo(310,44); c.closePath(); c.fill();
  c.fillStyle='#4a3a34'; rr(c,26,128,26,30,4); c.fill(); c.strokeStyle='#4a3a34'; c.lineWidth=4; c.beginPath(); c.arc(54,142,7,-1.2,1.2); c.stroke();
  // the back of a head with headphones, shoulders in the foreground
  c.fillStyle='#8a4a6a'; c.beginPath(); c.ellipse(160,150,36,40,0,0,7); c.fill(); c.fillStyle='#6e3a56'; c.beginPath(); c.moveTo(126,150); c.quadraticCurveTo(122,190,132,200); c.lineTo(188,200); c.quadraticCurveTo(198,190,194,150); c.fill();   // pink hair, from behind
  c.fillStyle='#4a5480';
  c.beginPath(); c.moveTo(70,200); c.quadraticCurveTo(80,170,128,168); c.lineTo(192,168); c.quadraticCurveTo(240,170,250,200); c.fill();
  c.strokeStyle='#26222a'; c.lineWidth=7; c.beginPath(); c.arc(160,152,38,Math.PI*1.1,Math.PI*1.9); c.stroke();
  c.fillStyle='#26222a'; rr(c,116,140,12,26,5); c.fill(); rr(c,192,140,12,26,5); c.fill();
  c.fillStyle='rgba(233,170,94,.18)'; c.beginPath(); c.ellipse(186,140,8,24,.2,0,7); c.fill();
  c.save(); c.translate(160,152); c.scale(1.5,1.5); catPhones(c,.75); c.restore();
  // her garland along the top, and the window frame you are looking through, from outside
  for(let i=0;i<14;i++){ const x=14+i*22, y=14+Math.sin(i/13*Math.PI)*8, col=look('lights').c[i%3]; c.fillStyle=`rgba(${col},.25)`; c.beginPath(); c.arc(x,y,6,0,7); c.fill(); c.fillStyle=`rgba(${col},.9)`; c.beginPath(); c.arc(x,y,1.8,0,7); c.fill(); }
  c.fillStyle='rgba(70,90,130,.16)'; c.fillRect(0,0,320,200);
  c.fillStyle='#0a0b10'; c.fillRect(0,0,320,8); c.fillRect(0,192,320,8); c.fillRect(0,0,8,200); c.fillRect(312,0,8,200); c.fillRect(258,0,9,200); c.fillRect(0,64,320,7);
  c.fillStyle='rgba(180,200,230,.06)'; c.beginPath(); c.moveTo(20,200); c.lineTo(90,0); c.lineTo(120,0); c.lineTo(50,200); c.fill();
  c.globalAlpha=.22; c.drawImage(noises[0],0,0,320,200); c.globalAlpha=1;
  const v=c.createRadialGradient(160,100,60,160,100,200); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.7)'); c.fillStyle=v; c.fillRect(0,0,320,200);
}

/* the photo from the note, with the drawn art: taken from outside through her window, from behind.
   Her chair back, the crown of her pink head and the cat-ear headphones above it; beyond her, the monitor shows her own stream. */
function drawPhotoBack(cv){
  const c=cv.getContext('2d'), w=cv.width, h=cv.height, mia=IMG.mia_calm, chair=IMG.chair_back; c.setTransform(w/320,0,0,h/200,0,0);
  c.fillStyle='#1c1820'; c.fillRect(0,0,320,200); c.fillStyle='#1d1920'; c.fillRect(0,126,320,74);
  const lg=c.createRadialGradient(292,46,0,292,46,150); lg.addColorStop(0,'rgba(233,170,94,.38)'); lg.addColorStop(1,'rgba(233,170,94,0)'); c.fillStyle=lg; c.fillRect(140,0,180,200);
  c.fillStyle='#2a2224'; c.beginPath(); c.moveTo(276,34); c.lineTo(304,22); c.lineTo(312,44); c.closePath(); c.fill();
  /* desk and the monitor with her stream on it */
  const mx=160, mw=96, mh=58, my=56, sx=mx-mw/2, sy=my;
  c.fillStyle='#2b2327'; c.fillRect(mx-120,my+mh+12,240,10); c.fillStyle='#211b1f'; c.fillRect(mx-120,my+mh+22,240,40);
  c.fillStyle='#121014'; c.fillRect(mx-6,my+mh,12,14); c.fillStyle='#0d0c10'; c.fillRect(sx-4,sy-4,mw+8,mh+8);
  c.fillStyle='#2a2531'; c.fillRect(sx,sy,mw,mh);
  { const vw=mw*.66, vh=vw*mia.height/mia.width; c.save(); c.beginPath(); c.rect(sx,sy,mw*.68,mh); c.clip(); c.globalAlpha=.9; c.drawImage(mia,sx-2,sy+mh-vh+2,vw+4,vh); c.restore(); }
  c.fillStyle='#1c1a22'; c.fillRect(sx+mw*.68,sy,mw*.32,mh); c.fillStyle='rgba(200,190,210,.35)'; for(let i=0;i<7;i++) c.fillRect(sx+mw*.71,sy+5+i*(mh-8)/7,mw*.24*(.5+((i*7)%5)/10),2);
  c.fillStyle='#b7443f'; c.fillRect(sx+3,sy+3,9,4);
  const mg=c.createRadialGradient(mx,my+mh/2,4,mx,my+mh/2,120); mg.addColorStop(0,'rgba(150,175,235,.28)'); mg.addColorStop(1,'rgba(150,175,235,0)'); c.fillStyle=mg; c.fillRect(0,0,320,200);
  /* her head from behind, above the chair back */
  const ch=150, cw=ch*chair.width/chair.height, cx=160, cy=88;
  c.save(); c.translate(cx,cy-3); c.scale(1.2,1.2);
  for(const sg of [-1,1]){ c.fillStyle='#2a2530'; c.beginPath(); c.moveTo(sg*7,-15); c.lineTo(sg*16,-29); c.lineTo(sg*18,-11); c.closePath(); c.fill(); }
  const hg=c.createLinearGradient(0,-20,0,16); hg.addColorStop(0,'#e08fb8'); hg.addColorStop(1,'#a85a84'); c.fillStyle=hg; c.beginPath(); c.ellipse(0,0,17,19,0,0,7); c.fill();
  c.strokeStyle='rgba(120,50,90,.45)'; c.lineWidth=1.1; for(const x of [-9,-4,2,7,11]){ c.beginPath(); c.moveTo(x*.4,-17); c.quadraticCurveTo(x,-4,x*1.1,16); c.stroke(); }
  c.strokeStyle='rgba(255,200,225,.35)'; c.lineWidth=1.2; c.beginPath(); c.ellipse(0,0,16,18,0,Math.PI*1.2,Math.PI*1.6); c.stroke();   /* a little sheen from the monitor */
  c.strokeStyle='#2a2530'; c.lineWidth=4; c.beginPath(); c.arc(0,1,18,Math.PI*1.07,Math.PI*1.93); c.stroke();
  c.fillStyle='#2a2530'; c.fillRect(-21,-2,6,13); c.fillRect(15,-2,6,13); c.fillStyle='#d68ca0'; c.fillRect(-20,1,2,7); c.fillRect(18,1,2,7);
  c.restore();
  { const o=document.createElement('canvas'); o.width=chair.width; o.height=chair.height; const oc=o.getContext('2d'); oc.drawImage(chair,0,0);
    oc.globalCompositeOperation='source-atop'; oc.fillStyle='rgba(12,10,20,.35)'; oc.fillRect(0,0,o.width,o.height); c.drawImage(o,cx-cw/2,cy,cw,ch); }
  /* garland, the window frame you look through from outside, glare, grain, vignette */
  for(let i=0;i<14;i++){ const x=14+i*22, y=14+Math.sin(i/13*Math.PI)*8, col=look('lights').c[i%3]; c.fillStyle=`rgba(${col},.22)`; c.beginPath(); c.arc(x,y,6,0,7); c.fill(); c.fillStyle=`rgba(${col},.85)`; c.beginPath(); c.arc(x,y,2,0,7); c.fill(); }
  c.fillStyle='rgba(70,90,130,.14)'; c.fillRect(0,0,320,200);
  c.fillStyle='#08090d'; c.fillRect(0,0,320,8); c.fillRect(0,192,320,8); c.fillRect(0,0,8,200); c.fillRect(312,0,8,200); c.fillRect(258,0,9,200); c.fillRect(0,40,320,6);
  c.fillStyle='rgba(180,200,230,.06)'; c.beginPath(); c.moveTo(20,200); c.lineTo(90,0); c.lineTo(120,0); c.lineTo(50,200); c.fill();
  c.globalAlpha=.1; c.drawImage(noises[0],0,0,320,200); c.globalAlpha=1;
  const vg=c.createRadialGradient(160,100,60,160,100,200); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.7)'); c.fillStyle=vg; c.fillRect(0,0,320,200);
}
// ---------- finale footage LAST_STREAM.mp4 (11.08): Mia at her desk, he comes his usual way, she runs,
// he sits down in her chair and puts on her headphones
let finClock=0; const FIN_LEN=14;
function catPhones(c,a){ // Mia's cat-ear headphones in local head space (head ≈ r24 at 0,-2)
  c.save(); c.globalAlpha=a;
  for(const sgn of [-1,1]){ c.fillStyle='#2a2530'; c.beginPath(); c.moveTo(sgn*10,-21); c.lineTo(sgn*21,-33); c.lineTo(sgn*22,-17); c.closePath(); c.fill();
    c.fillStyle=LOOK.phones; c.beginPath(); c.moveTo(sgn*12.5,-21.5); c.lineTo(sgn*19.5,-29); c.lineTo(sgn*20,-19.5); c.closePath(); c.fill(); }
  c.strokeStyle='#2a2530'; c.lineWidth=3.4; c.beginPath(); c.arc(0,-3,24,Math.PI*1.08,Math.PI*1.92); c.stroke();
  c.fillStyle='#2a2530'; rr(c,-28,-7,9,16,3.5); c.fill(); rr(c,19,-7,9,16,3.5); c.fill();
  c.fillStyle=LOOK.phones; rr(c,-26.5,-4,5.5,10,2.5); c.fill(); rr(c,21,-4,5.5,10,2.5); c.fill();
  c.restore();
}
function renderFinaleFrame(){
  if(S.finReflect!=null){ renderReflection(); return; }
  // LAST_STREAM.mp4, 11.08: Mia at her desk, a shape at the window, she notices… the feed dies, and comes back on an empty room
  const t=finClock, st=S.st;
  if(t>=2 && t<8.6){ st.stage='window'; st.p=Math.min(.85,(t-2)/5); st.red=false; } else { st.stage='hidden'; st.p=0; }
  const miaHere = t<8.6, cut = t>=8.6 && t<10.6;
  const realPanic=S.panic; S.panic = t<4.5?6 : t<6.5?55 : 92; if(t>4.5&&t<4.7) S.mia.surpriseT=1.2; S.mia.look = t>4.5 ? -1 : 0; S.mia.ex=null; S.mia.exLv=0; captionTimer=0; MOUTH.segs.length=0;   /* the clock is stopped: no sticky faces, no talking */
  S.finaleEmpty=!miaHere; drawRoom(ctx); S.finaleEmpty=true; S.panic=realPanic;
  dctx.globalCompositeOperation='source-over'; dctx.clearRect(0,0,W,H); dctx.fillStyle='rgba(6,4,8,0.72)'; dctx.fillRect(0,0,W,H);
  dctx.globalCompositeOperation='destination-out';
  const g=dctx.createRadialGradient(MIA.x,182,0,MIA.x,182,95); g.addColorStop(0,'rgba(0,0,0,.85)'); g.addColorStop(1,'rgba(0,0,0,0)'); dctx.fillStyle=g; dctx.fillRect(0,0,W,H);
  const g2=dctx.createRadialGradient(60,70,0,60,70,70); g2.addColorStop(0,'rgba(0,0,0,.5)'); g2.addColorStop(1,'rgba(0,0,0,0)'); dctx.fillStyle=g2; dctx.fillRect(0,0,W,H);
  ctx.drawImage(dark,0,0,W,H);
  for(const e of eyes){ ctx.fillStyle='rgba(236,236,220,.6)'; const dx=2.6*e.s; ctx.fillRect(e.x-dx-.6,e.y,1.5*e.s,1.2); ctx.fillRect(e.x+dx-.6,e.y,1.5*e.s,1.2); }
  if(cut){ ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.fillStyle='#000'; ctx.fillRect(0,0,feed.width,feed.height); ctx.globalAlpha=.5; ctx.drawImage(noises[frame%4],0,0,feed.width,feed.height); ctx.restore(); return; }
  const tear = t>8.1 && t<8.6;
  ctx.globalAlpha=.12+(tear?.4:0)+(t>10.6?.06:0); ctx.drawImage(noises[frame%4],0,0); ctx.globalAlpha=1;
  if(tear || Math.random()<.03){ ctx.save(); ctx.setTransform(1,0,0,1,0,0); const y=(Math.random()*feed.height)|0; ctx.drawImage(feed,0,y,feed.width,60,(Math.random()-.5)*140,y,feed.width,60); ctx.restore(); }
}
// ---------- the monitor goes dark: in the black glass, the room behind you (hers, mirrored) and you, in her headphones
let reflCv=null;
function renderReflection(){
  const k=Math.min(1,(FIN.t-S.finReflect)/2.5);
  if(!reflCv){ reflCv=document.createElement('canvas'); reflCv.width=feed.width; reflCv.height=feed.height; const r=reflCv.getContext('2d'); r.setTransform(SC,0,0,SC,0,0);
    // a cramped dark room: bare walls covered in printed frames of her stream, a desk lamp, a mug, a mattress in the corner
    r.fillStyle='#16141a'; r.fillRect(0,0,W,H); r.fillStyle='#0f0e12'; r.fillRect(0,128,W,52);
    const col=['#c96a9a','#6c7aa6','#e9b65e','#8f62c0'];
    for(let i=0;i<34;i++){ const x=8+(i*37)%300+((i*13)%7), y=8+((i*29)%96), w=18+(i%3)*4, h=12+(i%2)*3, a=(i%5-2)*.05;
      r.save(); r.translate(x,y); r.rotate(a); r.fillStyle='#d8d2c6'; r.fillRect(0,0,w,h); r.fillStyle='#2a2430'; r.fillRect(1.5,1.5,w-3,h-3);
      r.fillStyle=col[i%4]; r.beginPath(); r.arc(w/2,h/2-.5,2.6,0,7); r.fill(); r.fillStyle='#6c7aa6'; r.fillRect(w/2-3,h/2+1.6,6,3); r.fillStyle='rgba(183,68,63,.9)'; r.fillRect(w-5,1.6,3,1.4); r.restore(); }
    r.fillStyle='#24202a'; r.fillRect(8,118,70,22); r.fillStyle='#2e2a34'; r.fillRect(8,116,70,4);         // mattress on the floor
    r.fillStyle='#2a2326'; r.fillRect(250,96,3,30); r.fillStyle='rgba(240,200,140,.85)'; r.beginPath(); r.moveTo(242,96); r.lineTo(262,96); r.lineTo(256,86); r.lineTo(248,86); r.closePath(); r.fill();   // desk lamp
    const lg2=r.createRadialGradient(252,100,0,252,100,70); lg2.addColorStop(0,'rgba(240,190,120,.25)'); lg2.addColorStop(1,'rgba(240,190,120,0)'); r.fillStyle=lg2; r.fillRect(180,30,140,140);
    r.fillStyle='#3a2f2a'; r.fillRect(40,150,240,30);   // your desk
    r.fillStyle='#4a3a34'; r.fillRect(250,136,12,15); r.strokeStyle='#4a3a34'; r.lineWidth=2.5; r.beginPath(); r.arc(264,143,4,-1.2,1.2); r.stroke();   // mug
    // her cat-ear headphones lying on your desk
    r.fillStyle='rgba(240,190,120,.10)'; r.beginPath(); r.ellipse(212,136,30,8,0,0,7); r.fill(); r.save(); r.translate(212,140); r.scale(1.25,.85); catPhones(r,1); r.restore();   // in the lamp light, by the mug
    r.setTransform(-1,0,0,1,reflCv.width,0); r.drawImage(reflCv,0,0); }   // mirrored, as in glass
  ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.fillStyle='#030304'; ctx.fillRect(0,0,feed.width,feed.height);
  ctx.globalAlpha=.5*k; ctx.drawImage(reflCv,0,0); ctx.globalAlpha=1;
  ctx.setTransform(SC,0,0,SC,0,0);
  // you, close to the glass: a solid dark silhouette (messy hair, neck, shoulders) against a faint glow of the wall behind
  ctx.globalAlpha=k;
  { const h=ctx.createRadialGradient(166,108,10,166,108,120); h.addColorStop(0,'rgba(150,140,155,.20)'); h.addColorStop(1,'rgba(150,140,155,0)'); ctx.fillStyle=h; ctx.fillRect(0,0,W,H); }
  ctx.save(); ctx.translate(166,112); ctx.scale(1.7,1.7); ctx.fillStyle='#070608';
  ctx.beginPath(); ctx.ellipse(0,-2,14.5,17.5,0,0,7); ctx.fill();                                   // head
  for(const [x,y,r] of [[-9,-14,7],[-2,-17,7.5],[6,-16,7],[11,-11,5.5],[-12,-9,5]]){ ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); }   // uneven hair, round (no points that read as ears)
  ctx.fillRect(-6,12,12,10);                                                                         // neck
  ctx.beginPath(); ctx.moveTo(-64,60); ctx.quadraticCurveTo(-58,24,-16,19); ctx.lineTo(16,19); ctx.quadraticCurveTo(58,24,64,60); ctx.closePath(); ctx.fill();   // shoulders
  ctx.fillStyle=`rgba(230,225,215,${.35*k})`; ctx.fillRect(-6.5,-1,2.2,1.1); ctx.fillRect(4.3,-1,2.2,1.1);   // the eyes catch the screen
  ctx.restore(); ctx.globalAlpha=1;
  const gl=ctx.createLinearGradient(0,0,W,H); gl.addColorStop(0,'rgba(255,255,255,0)'); gl.addColorStop(.42,'rgba(255,255,255,.05)'); gl.addColorStop(.5,'rgba(255,255,255,0)'); ctx.fillStyle=gl; ctx.fillRect(0,0,W,H);
  const v=ctx.createRadialGradient(160,90,50,160,90,190); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.75)'); ctx.fillStyle=v; ctx.fillRect(0,0,W,H);
  if(S.finLights!=null && FIN.t>S.finLights){ /* police lights outside: blue and red crawling over the wall behind you, no sound */
    const lt=FIN.t-S.finLights, a=Math.min(1,lt/1.5), ph=lt*2.6;
    ctx.globalCompositeOperation='screen';
    for(const [col,off] of [['70,110,255',0],['255,50,50',Math.PI]]){ const s=(Math.sin(ph+off)+1)/2, x=40+s*240; const g=ctx.createRadialGradient(x,60,0,x,60,120); g.addColorStop(0,`rgba(${col},${.5*a*(.4+.6*s)})`); g.addColorStop(1,`rgba(${col},0)`); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); }
    ctx.globalCompositeOperation='source-over'; }
  ctx.globalAlpha=.06; ctx.drawImage(noises[frame%4],0,0); ctx.globalAlpha=1;
  ctx.restore();
}

/* ---- pink peonies (see drawRoom). mode: bed | door | dresser | sill ; w: 0 fresh .. 1 dried */
let FLOWERS='sill';   /* author's pick 11.11 */
function drawPeonies(c,mode,w,boxes){
  const mix=(a,b)=>a.map((v,i)=>Math.round(v+(b[i]-v)*w)), rgb=a=>`rgb(${a[0]},${a[1]},${a[2]})`;
  const pet=rgb(mix([255,166,203],[170,128,138])), pet2=rgb(mix([236,112,162],[136,98,108])), leaf=rgb(mix([86,140,92],[112,108,70])), sz=1-.18*w;
  const bloom=(x,y,r)=>{ c.fillStyle=pet; c.beginPath(); c.arc(x,y,r*sz,0,7); c.fill(); c.fillStyle=pet2; c.beginPath(); c.arc(x+.4,y+.3,r*sz*.55,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.25)'; c.beginPath(); c.arc(x-.8,y-.8,r*sz*.35,0,7); c.fill(); };
  const petals=(pts)=>{ if(w<.28) return; c.fillStyle=pet; for(const [x,y] of pts.slice(0,1+Math.floor(w*4))){ c.beginPath(); c.ellipse(x,y,1.2,.7,.4,0,7); c.fill(); } };
  const vase=(x,y,s)=>{   /* glass jar standing at (x,y) = bottom centre; droops when wilting */
    c.save(); c.translate(x,y); c.scale(s,s);
    c.strokeStyle=leaf; c.lineWidth=.7; const dr=w*3;
    for(const [dx,h] of [[-3,15],[0,17],[3,14.5],[-1,12.5]]){ c.beginPath(); c.moveTo(dx*.4,-7); c.quadraticCurveTo(dx,-h*.6,dx+dr*Math.sign(dx||1),-h+dr); c.stroke(); }
    c.fillStyle=leaf; c.beginPath(); c.ellipse(-3.5,-10,2.6,1.1,-.6,0,7); c.ellipse(3.8,-9.5,2.6,1.1,.6,0,7); c.fill();
    for(const [dx,h,r] of [[-3,15,2.7],[0,17,3],[3,14.5,2.6],[-1,12.5,2.3]]) bloom(dx+dr*Math.sign(dx||1),-h+dr,r);
    c.fillStyle='rgba(190,215,235,.38)'; rr(c,-4,-8,8,8,1.6); c.fill();                       /* glass */
    c.fillStyle='rgba(150,185,210,.35)'; c.fillRect(-3.4,-4.5,6.8,4); c.fillStyle='rgba(255,255,255,.35)'; c.fillRect(-3,-7.4,.8,6.5);
    c.restore(); };
  if(mode==='bed'){
    const bx=boxes?30:68;
    c.save(); c.translate(bx,123); c.rotate(-.1); c.scale(1.35,1.35);
    c.fillStyle='#e8d9c4'; c.beginPath(); c.moveTo(-6,-5); c.lineTo(15,-1.2); c.lineTo(15,1.2); c.lineTo(-6,5); c.closePath(); c.fill();
    c.fillStyle='rgba(0,0,0,.12)'; c.beginPath(); c.moveTo(-6,0); c.lineTo(15,.4); c.lineTo(15,1.2); c.lineTo(-6,5); c.closePath(); c.fill();
    c.strokeStyle='#d96b8e'; c.lineWidth=1; c.beginPath(); c.moveTo(9,-2.2); c.lineTo(9,2.2); c.stroke();
    c.strokeStyle=leaf; c.lineWidth=.6; for(const y of [-.6,0,.6]){ c.beginPath(); c.moveTo(15,y*.6); c.lineTo(19,y*1.3); c.stroke(); }
    c.fillStyle=leaf; c.beginPath(); c.ellipse(-7,-4.5,3,1.3,-.5,0,7); c.ellipse(-7.5,4.2,3,1.3,.5,0,7); c.fill();
    for(const [x,y,r] of [[-9,-2.6,3],[-9.5,2.4,2.8],[-12.5,0,3.1],[-6.5,0,2.6]]) bloom(x,y,r);
    c.restore(); petals([[bx-18,129],[bx-12,127.5],[bx-22,126.5],[bx-8,130]]);
  } else if(mode==='door'){ vase(252,141,1.15); petals([[243,141.6],[262,141.6],[247,142.2],[266,141.8]]);   /* left on the floor by the door, where they were delivered */
  } else if(mode==='dresser'){ vase(213,106,1.05); petals([[195,105.6],[228,105.6],[198,105.6],[208,105.6]]);
  } else if(mode==='sill'){   /* author's pick: a lush bouquet in a pretty vase on the windowsill, right in front of him */
    c.save(); c.translate(80,98); c.scale(1.25,1.25); const dr=w*3.2;
    /* stems + leaves */
    c.strokeStyle=leaf; c.lineWidth=.7;
    const B=[[-6,15,2.6],[-3,19,3],[0,21,3.3],[3.5,18.5,3],[6.5,15,2.6],[-1.5,15.5,2.7],[2,13,2.4],[-4.5,11.5,2.1],[5,11,2.1]];
    for(const [dx,h] of B){ c.beginPath(); c.moveTo(dx*.25,-10); c.quadraticCurveTo(dx*.7,-h*.7,dx+dr*Math.sign(dx||1),-h+dr); c.stroke(); }
    c.fillStyle=leaf; for(const [x,y,a] of [[-6,-12,-.7],[6.5,-12.5,.7],[-3.5,-16,-.4],[4,-17,.5],[0,-11.5,0]]){ c.beginPath(); c.ellipse(x+dr*Math.sign(x||1)*.5,y+dr*.5,3,1.2,a+w*.6*Math.sign(x||1),0,7); c.fill(); }
    for(const [dx,h,r] of B) bloom(dx+dr*Math.sign(dx||1),-h+dr,r);
    c.fillStyle=pet2; for(const [x,y] of [[-8,-9],[8.5,-8.5]]){ c.beginPath(); c.ellipse(x+dr*Math.sign(x),y+dr,1.1,1.6,0,0,7); c.fill(); }   /* buds */
    /* vase: cream ceramic, round belly, pink band, gold rim */
    c.fillStyle='#f1e6dc'; c.beginPath(); c.moveTo(-2.6,-10); c.lineTo(2.6,-10); c.quadraticCurveTo(2.4,-7.5,4.6,-5.5); c.quadraticCurveTo(7,-2.5,4,0); c.lineTo(-4,0); c.quadraticCurveTo(-7,-2.5,-4.6,-5.5); c.quadraticCurveTo(-2.4,-7.5,-2.6,-10); c.fill();
    c.fillStyle='rgba(0,0,0,.14)'; c.beginPath(); c.moveTo(1.5,-7); c.quadraticCurveTo(6.5,-3.5,4,0); c.lineTo(1.5,0); c.fill();
    c.fillStyle='#e58fb1'; c.beginPath(); c.ellipse(0,-3.6,5.6,1.2,0,0,7); c.fill();
    c.fillStyle='#d9b45e'; c.fillRect(-2.9,-10.6,5.8,1); c.fillRect(-3.8,-.4,7.6,.8);
    c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(-3,-4.8,.7,1.8,.3,0,7); c.fill();
    c.restore(); petals([[64,97.6],[95,97.6],[68,97.6],[98,97.6]]); }
}
