"use strict";
/* THE MODERATOR — test mode "closet v1" (21.11.2026). Loaded ONLY by review/closet_v1/index.html, never by the game.
   Runs on top of the approved stack of review/window_v2 (B2, layout A 50/50, rules + evidence in the pause, new Mia, door, window).
   door-v2 replaces drawRoom(), so the old CLOSET, BEHIND MIA and ARMCHAIR blocks of render.js are not drawn there.
   This file draws them in room v3 through the DV2_FRONT hook (after the room picture, BEFORE Mia and her desk - so she covers
   the lower part of the wardrobe and he stands behind her), chained after the window's own DV2_FRONT.
   Every rule is the game's own and read from S, never changed here:
     S.st.stage 'closet' / 'behind', S.st.p, S.st.red (stalker.js; route C = closet → behind her; behind uses the closet lamp),
     S.decoy {zone:'closet'} (a shape with no eyes), S.ev.chairShow (Wednesday: someone sits in the armchair),
     lamp heat / burn-out / BOOST / DIM / adaptation (lighting.js, stalker.js), smart home freeze/retreat (smart-home.js),
     the take (render.js takeT: behind p=1, then she is pulled away). The eye glow and its lamp rule stay render.js's.
   Opening of the right leaf = the game's own formula (render.js CLOSET):
     cp = behind ? min(1, p/.45) : closet ? min(1, .15+.85p) : decoy ? .55 : 0   (he steps out of it at behind p .45)
   Art: closet_inside.png (cut from room_v3_closet_open.png: what is behind the right leaf), closet_leaf.png (the right leaf
   cut from room_v3.png). Optional art is picked up by name (CL1.ART), like the window. */
const CL1={ k:320/1774, img:{}, art:{}, hold:null, aiHold:false };
const CL1_BASE=window.CL1_BASE||'';
CL1.geo={ inside:[1040,60,1290,745], leaf:[1056,66,1271,737], seam:1056, hinge:1271 };
for(const n of ['closet_inside','closet_leaf']){ const i=new Image(); i.onload=()=>CL1.img[n]=i; i.src=CL1_BASE+n+'.png'; }
CL1.ART={
  stalker_closet:{ what:'он в шкафу, между вешалками (по пояс/в рост, лицом к нам)', instead:'утверждённый силуэт двери' },
  stalker_behind:{ what:'он за спиной Мии: голова и плечи, наклон к ней', instead:'утверждённый силуэт двери, крупно' },
  chair_shadow:  { what:'кто-то сидит (ср): тень без глаз', instead:'силуэт, обрезанный по пояс, на краю кровати' },
};
for(const n in CL1.ART){ const i=new Image(); i.onload=()=>CL1.art[n]=i; i.onerror=()=>{}; i.src=CL1_BASE+n+'.png'; }
const clX=x=>x*CL1.k, clY=y=>12+y*CL1.k;

/* the game's own "how open is the closet" (render.js) */
function cl1Open(){ const st=S.st, dzc=S.decoy && S.decoy.zone==='closet';
  const cp = st.stage==='behind' ? Math.min(1,st.p/.45) : st.stage==='closet' ? Math.min(1,.15+.85*st.p) : dzc ? .55 : 0;
  return { cp, decoy: dzc && st.stage!=='closet' && st.stage!=='behind', inGap: (st.stage==='behind' && st.p<.45) || st.stage==='closet' || dzc }; }
function cl1Spr(name){ const a=CL1.art[name]; if(a) return { img:a, eye:{x:.5,y:.1,gap:.02}, fade:0 };
  if(!DV2.sprite) return null; return { img:DV2.sprite, eye:DV2.spriteEye||{x:.5,y:.087,gap:.0198}, fade:((DV2.spriteFade||{})[DV2.spriteName]||0) }; }
function cl1Lamp(){ return ({DEAD:0,DIM:.35,STABLE:.6,BOOST:1}[lampMode('closet')]||0)*(S.lamps.closet.flick||1); }

/* one figure on its own canvas: the silhouette, the closet lamp's warm light on the head and shoulders (lamp in the room,
   in front of him), a little rim so black does not sink into the black inside; flat = decoy / armchair shadow */
function cl1Figure(c,img,x0,y0,w,h,o){ if(!img) return;
  const pad=2, ox=x0-pad, oy=y0-pad, ow=w+pad*2, oh=h+pad*2, R=SC*2;
  const off=CL1.off||(CL1.off=document.createElement('canvas')); off.width=Math.ceil(ow*R); off.height=Math.ceil(oh*R);
  const x=off.getContext('2d'); x.setTransform(R,0,0,R,-ox*R,-oy*R); x.clearRect(ox,oy,ow,oh); x.drawImage(img,x0,y0,w,h);
  x.globalCompositeOperation='source-atop';
  if(o.flat){ x.fillStyle=`rgba(6,5,9,${o.flat})`; x.fillRect(ox,oy,ow,oh); }
  else { x.fillStyle='rgba(10,6,14,.55)'; x.fillRect(ox,oy,ow,oh);
    if(o.warm>0){ const g=x.createLinearGradient(0,y0,0,y0+h*.45); g.addColorStop(0,`rgba(255,170,150,${.16*o.warm})`); g.addColorStop(1,'rgba(255,170,150,0)'); x.fillStyle=g; x.fillRect(ox,oy,ow,oh); } }
  if(o.fade>0){ x.globalCompositeOperation='destination-out'; const f=x.createLinearGradient(0,y0+h*(1-o.fade),0,y0+h); f.addColorStop(0,'rgba(0,0,0,0)'); f.addColorStop(1,'rgba(0,0,0,1)'); x.fillStyle=f; x.fillRect(ox,y0+h*(1-o.fade),ow,h*o.fade+pad); }
  if(o.rim>0 && !o.flat){ const rc=CL1.rimC||(CL1.rimC=document.createElement('canvas')); rc.width=off.width; rc.height=off.height; const r=rc.getContext('2d');
    r.setTransform(1,0,0,1,0,0); r.clearRect(0,0,rc.width,rc.height); r.globalCompositeOperation='source-over'; r.drawImage(off,0,0);
    r.globalCompositeOperation='source-in'; r.fillStyle=o.rimCol||'rgb(235,160,190)'; r.fillRect(0,0,rc.width,rc.height);
    r.globalCompositeOperation='destination-out'; const sh=Math.max(1,R*.5*Math.min(1.6,h/40)); r.drawImage(off,-sh*.7,sh*.6);
    r.globalCompositeOperation='destination-in'; const g=r.createLinearGradient(0,0,0,rc.height); g.addColorStop(0,'rgba(0,0,0,1)'); g.addColorStop(.35,'rgba(0,0,0,.5)'); g.addColorStop(.6,'rgba(0,0,0,0)'); r.fillStyle=g; r.fillRect(0,0,rc.width,rc.height);
    c.drawImage(off,ox,oy,ow,oh); c.globalAlpha=o.rim; c.drawImage(rc,ox,oy,ow,oh); c.globalAlpha=1; return; }
  c.drawImage(off,ox,oy,ow,oh); }

/* CLOSET: the right leaf turns on its RIGHT hinge (same motion as the old gap growing from the seam): its visible width ×(1−.8·cp).
   What it uncovers: the inside (hanging clothes, shelves), dark; he stands just right of the seam, among the clothes. */
function cl1Closet(c){ const I=CL1.img; if(!I.closet_inside||!I.closet_leaf) return; const {cp,decoy,inGap}=cl1Open(); if(cp<=0) return;
  const [lx0,ly0,lx1,ly1]=CL1.geo.leaf, bw=lx1-lx0, rev=bw*.8*cp, X0=clX(lx0), Y0=clY(ly0), Y1=clY(ly1), RX=clX(lx0+rev);
  const [ix0,iy0,ix1,iy1]=CL1.geo.inside;
  c.save(); c.beginPath(); c.rect(X0,Y0,RX-X0,Y1-Y0); c.clip();
  c.drawImage(I.closet_inside,clX(ix0),clY(iy0),clX(ix1)-clX(ix0),clY(iy1)-clY(iy0));
  c.fillStyle='rgba(6,3,9,.55)'; c.fillRect(X0,Y0,RX-X0,Y1-Y0);   /* inside a closed wardrobe at night: much darker than the open-closet picture */
  const sg=c.createLinearGradient(RX-8,0,RX,0); sg.addColorStop(0,'rgba(0,0,0,0)'); sg.addColorStop(1,'rgba(0,0,0,.55)'); c.fillStyle=sg; c.fillRect(RX-8,Y0,8,Y1-Y0);   /* the leaf's shadow */
  if(inGap){ const sp=cl1Spr('stalker_closet');
    if(sp){ const H=clY(ly1)-clY(ly0), h=H*(1.0+.12*cp), w=h*sp.img.width/sp.img.height, ex=clX(CL1.geo.seam+34+30*cp), ey=Y0+H*.13-2*cp;
      cl1Figure(c,sp.img,ex-sp.eye.x*w,ey-sp.eye.y*h,w,h,decoy?{flat:.93,fade:sp.fade}:{warm:cl1Lamp(),fade:sp.fade,rim:.35});
      /* the game pushes the eyes only once the gap is wide enough to see a face (old: gap > 6 units of 31) */
      if(cp>.2 && !decoy) eyes.push({x:ex,y:ey,s:sp.eye.gap*h/2.6,zone:S.st.stage==='closet'?'closet':'behind'}); } }
  c.restore();
  /* the leaf itself, narrowing towards its hinge, darker as it turns away from the room light */
  const lw=clX(lx1)-RX; if(lw>.3){ c.drawImage(I.closet_leaf,0,0,I.closet_leaf.width,I.closet_leaf.height,RX,Y0,lw,Y1-Y0);
    c.fillStyle=`rgba(0,0,0,${.45*cp})`; c.fillRect(RX,Y0,lw,Y1-Y0);
    c.fillStyle='rgba(235,170,200,.18)'; c.fillRect(RX,Y0,.35,Y1-Y0); }   /* its free edge catches the lamp */
}

/* BEHIND MIA (render.js: stage 'behind', p ≥ .45): he has stepped out of the wardrobe and stands behind her chair, to her right,
   growing closer (k 0→1). Drawn before Mia, so she covers his body; only the head and shoulders show over her. */
function cl1Behind(c){ const st=S.st; if(st.stage!=='behind' || st.p<.45) return; const sp=cl1Spr('stalker_behind'); if(!sp) return;
  const k=(st.p-.45)/.55, h=230+110*k, w=h*sp.img.width/sp.img.height, ex=196+5*k+Math.sin(S.t*2)*.8, ey=50-7*k;
  c.save(); c.translate(ex,ey); c.rotate(-.07*k); c.translate(-ex,-ey);
  cl1Figure(c,sp.img,ex-sp.eye.x*w,ey-sp.eye.y*h,w,h,{warm:cl1Lamp()*.8,fade:0,rim:.45});
  c.restore(); eyes.push({x:ex,y:ey,s:sp.eye.gap*h/2.6,zone:'behind'}); }

/* WEDNESDAY: someone sits in the armchair (days.js chairShow, 4.5 s, BOOST on the closet lamp clears it). Room v3 has no
   armchair: TEMPORARY - the silhouette cut at the waist, sitting on the foot of the bed, flat shadow, no eyes (like the old one). */
function cl1Chair(c){ if(!(S.ev.chairShow>0)) return; const A=CL1.art.chair_shadow;
  c.save(); c.globalAlpha=Math.max(0,Math.min(1,S.ev.chairShow/.6));   /* fades out as the game's timer runs down */
  if(A){ c.drawImage(A,clX(330),clY(420),clX(200),clX(200)*A.height/A.width); c.restore(); return; }
  const sp=cl1Spr(); if(sp){ const h=150, w=h*sp.img.width/sp.img.height, x0=clX(470)-w/2, y0=clY(455);
    c.beginPath(); c.rect(x0-4,y0-2,w+8,h*.42); c.clip(); cl1Figure(c,sp.img,x0,y0,w,h,{flat:.9}); }
  c.restore(); }

{ const prev=window.DV2_FRONT; window.DV2_FRONT=function(c){ if(prev) prev(c); if(!S) return; cl1Chair(c); cl1Closet(c); cl1Behind(c); }; }

/* ---------------- test panel (bottom right). Shares the window panel's modes: «ручной» = only the stalker AI stands (WV2.aiOff). */
function cl1HoldSt(stage,p){ clearInterval(CL1.hold); CL1.hold=null; if(stage==null) return;
  if(typeof wv2HoldSt==='function') wv2HoldSt(null); if(typeof wv2Mode==='function' && !WV2.aiOff) wv2Mode(true);
  CL1.hold=setInterval(()=>{ if(!S) return; const st=S.st; st.stage=stage; st.p=p; st.wait=999; },40); }
function cl1LampSet(m){ const L=S.lamps.closet; if(m==='DEAD'){ L.burned=true; L.flick=0; return; } L.burned=false; L.heat=0; L.flick=1; if(L.mode!==m) setLamp('closet',m); }
function cl1Panel(){
  const css=document.createElement('style');
  css.textContent=`#cl1{position:fixed;right:12px;bottom:12px;z-index:100001;background:#151019f2;color:#eee6f4;border:1px solid #5b4a66;border-radius:10px;padding:10px 12px;font:13px/1.45 system-ui,sans-serif;display:flex;flex-direction:column;gap:5px;max-width:520px}
  #cl1 .row{display:flex;flex-wrap:wrap;gap:4px;align-items:center}#cl1 button{font:inherit;padding:2px 7px;border-radius:6px;border:1px solid #6d5a7a;background:#2a2131;color:#fff;cursor:pointer}
  #cl1St,#cl1Art{font-size:12px;opacity:.88;border-top:1px solid #3a2f44;padding-top:5px}#cl1.min > :not(b){display:none}body.wv2-clean #cl1{display:none}
  #cl1:not(.open){display:none}#cl1{bottom:48px}#cl1Btn{position:fixed;right:12px;bottom:12px;z-index:100002;font:13px/1 system-ui,sans-serif;padding:7px 11px;border-radius:8px;border:1px solid #6d5a7a;background:#2a2131e6;color:#fff;cursor:pointer;opacity:.55}#cl1Btn:hover,#cl1Btn.on{opacity:1}#cl1Btn.on{background:#6d4a86}body.wv2-clean #cl1Btn{display:none}`;
  document.head.appendChild(css);
  const B=(a,t,ttl)=>`<button type="button" data-c="${a}"${ttl?` title="${ttl}"`:''}>${t}</button>`;
  const p=document.createElement('div'); p.id='cl1';
  p.innerHTML=`<b id="cl1T" style="cursor:pointer">Шкаф v1 · тест ▾</b>
  <div class="row">ночь: ${B('n3','▶ Чт','шкаф впервые: маршрут C 20%')}${B('n2','▶ Ср','кресло: кто-то сидит')}${B('n4','▶ Пт','маршрут C 30%, свет в шкафу гаснет на прощании')} ${B('nextC','▶ заход из шкафа сейчас','игра: beginApproach по маршруту C — сразу в шкаф, дальше ведёт ИИ')}</div>
  <div class="row">в шкафу: ${B('c0','нет')}${B('c1','щель (p .1)')}${B('c5','p .5')}${B('c9','p .9')}${B('dec','обманка')}${B('red','красные глаза')}</div>
  <div class="row">за спиной: ${B('b2','выходит (p .3)')}${B('b5','за креслом (p .55)')}${B('b9','вплотную (p .95)')}${B('take','нападение (конец ночи)','behind p .97 → игра сама: endGame kill, её утаскивают')}</div>
  <div class="row">лампа шкафа: ${B('lDEAD','выкл')}${B('lDIM','DIM')}${B('lSTABLE','STABLE')}${B('lBOOST','BOOST')}${B('heat','нагрев 85','перегрев: мерцание с 80, сгорает в 100')}</div>
  <div class="row">${B('free','отпустить (ИИ ведёт сам)')}${B('chair','кресло (ср)')}${B('dog','лай (Z)')}${B('steps','шаги (C)')}</div>
  <div id="cl1St"></div><div id="cl1Art"></div>`;
  document.body.appendChild(p);
  document.getElementById('cl1T').onclick=()=>p.classList.toggle('min');
  /* 21.11: the panel is called by a button (bottom right) or the K key; hidden by default, the choice is remembered */
  const btn=document.createElement('button'); btn.type='button'; btn.id='cl1Btn'; btn.title='панель шкафа (K)'; document.body.appendChild(btn);
  const show=on=>{ p.classList.toggle('open',on); btn.classList.toggle('on',on); btn.textContent=on?'✕ шкаф (K)':'🛠 шкаф (K)'; try{ localStorage.setItem('cl1_open',on?'1':'0'); }catch(e){} };
  btn.onclick=()=>show(!p.classList.contains('open'));
  addEventListener('keydown',e=>{ if(e.code==='KeyK' && !e.repeat && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName||'')) show(!p.classList.contains('open')); });
  let was=false; try{ was=localStorage.getItem('cl1_open')==='1'; }catch(e){} show(was);
  const night=i=>{ if(typeof wv2Night==='function') wv2Night(i); else start(i,{}); };
  const R={
    n3:()=>night(3), n2:()=>night(2), n4:()=>night(4),
    nextC:()=>{ cl1HoldSt(null); if(typeof wv2Mode==='function') wv2Mode(false); const st=S.st; S.decoy=null; st.stage='hidden'; st.p=0; st.next='C'; st.cued=true;
      try{ SFX.cue('closet'); }catch(e){} beginApproach(); },   /* right now: the game's own beginApproach with route C → enterStage('closet') (creak, «ШКАФ ПРИОТКРЫЛСЯ»), then the AI drives him */
    c0:()=>{ cl1HoldSt('hidden',0); S.decoy=null; }, c1:()=>cl1HoldSt('closet',.1), c5:()=>cl1HoldSt('closet',.5), c9:()=>cl1HoldSt('closet',.9),
    dec:()=>{ cl1HoldSt('hidden',0); S.decoy = S.decoy&&S.decoy.zone==='closet' ? null : {zone:'closet',t:12,lit:0}; }, red:()=>{ S.st.red=!S.st.red; },
    b2:()=>cl1HoldSt('behind',.3), b5:()=>cl1HoldSt('behind',.55), b9:()=>cl1HoldSt('behind',.95),
    take:()=>{ cl1HoldSt(null); if(typeof wv2Mode==='function') wv2Mode(false); S.st.stage='behind'; S.st.p=.97; cl1LampSet('STABLE'); },
    lDEAD:()=>cl1LampSet('DEAD'), lDIM:()=>cl1LampSet('DIM'), lSTABLE:()=>cl1LampSet('STABLE'), lBOOST:()=>cl1LampSet('BOOST'),
    heat:()=>{ const L=S.lamps.closet; L.burned=false; L.heat=85; },
    free:()=>{ cl1HoldSt(null); if(typeof wv2Mode==='function') wv2Mode(false); },
    chair:()=>{ if(!S.night.ev||!S.night.ev.chair){ floaty('кресло — только в среду (▶ Ср)'); return; } S.ev.chairT=0; },   /* days.js fires it itself on its next tick: 4.5 s, sound, her line */
    dog:()=>{ try{ smartHome('dog'); }catch(e){} }, steps:()=>{ try{ smartHome('steps'); }catch(e){} },
  };
  p.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ const a=b.dataset.c; if(/^n\d/.test(a)) return R[a](); if(!S||S.over) return; if(paused) setPause(false); R[a](); });   /* a test button press also resumes a paused night */
  setInterval(()=>{ document.getElementById('cl1Art').innerHTML=Object.keys(CL1.ART).map(n=>`${CL1.art[n]?'✅':'⬜'} ${n}.png — ${CL1.art[n]?'арт':'заглушка: '+CL1.ART[n].instead}`).join('<br>');
    if(!S) return; const st=S.st, L=S.lamps.closet, o=cl1Open();
    document.getElementById('cl1St').innerHTML=`сталкер: <b>${st.stage}</b> p=${st.p.toFixed(2)}${st.red?' · красные':''}${CL1.hold?' (держу)':''} · шкаф открыт <b>${Math.round(o.cp*100)}%</b>${S.decoy&&S.decoy.zone==='closet'?' · обманка':''}<br>`+
      `лампа шкафа: <b>${lampMode('closet')}</b> нагрев ${Math.round(L.heat)}${L.burned?' · СГОРЕЛА':''} · маршрут: ${st.route?st.route.join('→'):'—'}${st.next?' · след. '+st.next:''} · ждёт ${st.stage==='hidden'?Math.max(0,st.wait).toFixed(1)+' с':'—'}`; },250);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',cl1Panel); else cl1Panel();
