"use strict";
/* THE MODERATOR — test mode "Mia v2" (20.11.2026). Loaded ONLY by review/mia_v2/index.html, never by the game.
   Runs on top of the real game + review/door_v2/door-v2.js (room v3, the new door).
   How the game shows Mia (render.js):
     miaExpr()   picks the face from panic, surprise, the voice (talk), a scripted forceFace and the phone call:
                 calm · talk · scared · anxious · panic · surprised · phone · phoneclosed · phonescared;
     drawMiaArt() draws IMG['mia_'+face]; blink = the mia_blink frame; talk = talk/calm frames in turn;
                 gaze frames mia_{calm,talk,scared}_{win,door}; a missing face falls back to mia_calm and gets
                 procedural mouth/sweat/tears drawn at OLD-art pixel spots, plus a headphone star at an old-art spot;
     miaMoRect() breathing, flinch, lean (C1, Friday) move/scale the whole picture; drawDesk() redraws the bottom slice
                 of the picture (y ≥ 163.4) over the desk, so hands and keyboard lie on top of it.
   Here, with "новая Мия" on, drawMiaArt is replaced by a version that:
     - uses the new PNG for every face that has no new art yet (base), never an old pink sprite, never the
       old-art overlays (they would land on the wrong spots of the new picture);
     - keeps the game's choice of face (miaExpr), blink/talk timing and C1 motion untouched; the panel shows which
       face the game asked for and whether its art exists;
     - keeps the picture's own proportions (one scale for both axes). */
const MV2_BASE=window.MV2_BASE||'';   /* review/window_v2 reuses this file from ../mia_v2/ */
const MV2={ fade:true, on:true, img:null, set:{}, dx:0, asked:'', shown:'', force:null, noBlink:false };
/* until a face has its own new art it borrows the closest ready one (not calm): every threat face reads as fear */
/* the game calls the second fear level 'anxious'; the new art for it is named worried */
MV2.alias={ anxious:['worried','scared'], panic:['scared'], surprised:['scared'], phonescared:['panic','scared'] };
/* the new picture: 1254×1254. Fitted like the old art: eyes at y≈112, hands on the keys at y≈162, centred on MIA.x */
MV2.src={ w:1254, h:1254, eyeY:490, handY:1110, cx:627 };
MV2.k=(162-112)/(MV2.src.handY-MV2.src.eyeY);
{ const i=new Image(); i.onload=()=>{ MV2.img=i; MV2.set.calm=i; }; i.src=MV2_BASE+'mia_v2_calm.png'; }
/* faces the game can ask for; a new PNG named mia_v2_<face>.png in this folder is picked up automatically */
MV2.faces=['calm','talk','talk_half','blink','scared','worried','anxious','panic','surprised','phone','phoneclosed','phonescared','calm_win','calm_door','talk_win','talk_door','scared_win','scared_door'];
/* layers (20.11): the chair and the keyboard stand still, only Mia moves (breathing, lean, flinch, panic tremor).
   chair_layer = the original picture where she is not + the empty chair (its ears removed) where she covers it;
   body_mask   = her silhouette (incl. headphone ears, hands); keys_front = the keyboard in front of her, holes for her hands.
   At rest chair + body + keys == the original picture (max diff 1/255); in motion only thin strips of chair show. */
MV2.layers=true; MV2.L={};
for(const n of ['chair_layer','body_mask','keys_front','chair_empty']){ const i=new Image(); i.onload=()=>MV2.L[n]=i; i.src=MV2_BASE+'mia_v2_'+n+'.png'; }
function mv2LayersReady(){ return MV2.layers && MV2.L.chair_layer && MV2.L.body_mask && MV2.L.keys_front; }
for(const f of MV2.faces) if(f!=='calm'){ const i=new Image(); i.onload=()=>MV2.set[f]=i; i.src=MV2_BASE+'mia_v2_'+f+'.png'; }

function mv2Rect(){ const k=MV2.k, w=MV2.src.w*k, h=MV2.src.h*k;
  return [MIA.x+MV2.dx-MV2.src.cx*k, 112-MV2.src.eyeY*k+(MIA.y-113), w, h]; }

{ const artOld=drawMiaArt;
  drawMiaArt=function(c,ex,jx,br){
    if(!MV2.on || !MV2.img) return artOld(c,ex,jx,br);
    /* the same frame choice as render.js, but only from the new set */
    let want=MV2.force||ex;
    if(!MV2.force && !MV2.noBlink && S.mia.blink>0 && (ex==='calm'||ex==='talk')) want='blink';
    else if(ex==='talk' && !MV2.force){ const ph=Math.floor(S.t*12)%4; want = (ph===0||ph===3) && MV2.set.talk_half ? 'talk_half' : 'talk'; }   /* closed → half → open → half while a syllable sounds */
    const g=(S.mia.gaze && S.t<(S.mia.gazeUntil||0)) ? S.mia.gaze : (typeof miaAutoGaze==='function'?miaAutoGaze():null);
    if(g && (want==='calm'||want==='talk'||want==='scared') && MV2.set[want+'_'+g]) want=want+'_'+g;
    const alt=MV2.set[want] ? want : MV2.set[want.split('_')[0]] ? want.split('_')[0] : ((MV2.alias[want]||[]).find(f=>MV2.set[f])||null);
    const img=alt?MV2.set[alt]:MV2.img;
    MV2.asked=want; MV2.shown=alt ? (alt===want||alt===(MV2.alias[want]||[])[0]&&want==='anxious' ? alt : alt+' (замена)') : 'calm (база)';
    const trem = ex==='panic' ? Math.sin(S.t*29)*.22+Math.sin(S.t*17)*.12 : 0;
    const [x,y,w,h]=miaMoRect(mv2Rect());
    /* soft switch: all faces share one body, only the face differs, so the old frame fades out under the new one.
       blink stays quick, the talking mouth very quick, emotions ~150 ms. MV2.fade=false → hard cut, as before. */
    const key=alt||'calm', now=performance.now();
    if(key!==MV2.curKey){ const calmish=k=>/^(calm|talk)/.test(k);
      MV2.prevImg=MV2.curImg; MV2.fadeMs = (key==='blink'||MV2.curKey==='blink') ? 45 : (calmish(key)&&calmish(MV2.curKey||'calm')) ? 35 : 150;
      MV2.curKey=key; MV2.curImg=img; MV2.swT=now; }
    const k=MV2.fade===false||!MV2.prevImg ? 1 : Math.min(1,(now-MV2.swT)/MV2.fadeMs);
    if(mv2LayersReady()){
      /* compose on one canvas: still chair → moving Mia → still keyboard; the game's drawDesk() redraws its lower strip */
      /* the composite canvas has the feed's own resolution (SC) and sits on whole feed pixels: copying it is 1:1, no extra blur */
      const [bx,by,bw,bh]=mv2Rect(), m=4, R=SC, ox=Math.floor((bx-m)*R)/R, oy=Math.floor((by-m)*R)/R, pw=Math.ceil((bw+2*m)*R), ph=Math.ceil((bh+2*m)*R), ow=pw/R, oh=ph/R;
      const o=MV2.comp||(MV2.comp=document.createElement('canvas')); if(o.width!==pw||o.height!==ph){ o.width=pw; o.height=ph; }
      const q=o.getContext('2d'); q.setTransform(1,0,0,1,0,0); q.clearRect(0,0,o.width,o.height); q.setTransform(R,0,0,R,-ox*R,-oy*R);
      q.drawImage(MV2.L.chair_layer,bx,by,bw,bh);
      /* body: the face picture and the mask are both scaled from <img> straight into a feed-size canvas, then multiplied -
         so inside her silhouette the pixels are exactly what the game would draw without layers */
      const t=MV2.tmp||(MV2.tmp=document.createElement('canvas')); if(t.width!==pw||t.height!==ph){ t.width=pw; t.height=ph; }
      const tq=t.getContext('2d');
      const body=(im,alpha)=>{ tq.setTransform(1,0,0,1,0,0); tq.globalCompositeOperation='source-over'; tq.clearRect(0,0,pw,ph);
        tq.setTransform(R,0,0,R,-ox*R,-oy*R); tq.drawImage(im,x+trem,y,w,h); tq.globalCompositeOperation='destination-in'; tq.drawImage(MV2.L.body_mask,x+trem,y,w,h);
        tq.globalCompositeOperation='source-over'; q.save(); q.setTransform(1,0,0,1,0,0); q.globalAlpha=alpha; q.drawImage(t,0,0); q.restore(); };
      if(k<1){ body(MV2.prevImg,1); body(img,k); } else body(img,1);
      q.drawImage(MV2.L.keys_front,bx,by,bw,bh);
      c.drawImage(o,ox,oy,ow,oh); S.artRect=[ox,oy,ow,oh,o]; return; }
    if(k<1){ c.drawImage(MV2.prevImg,x+trem,y,w,h); c.save(); c.globalAlpha=k; c.drawImage(img,x+trem,y,w,h); c.restore(); }
    else c.drawImage(img,x+trem,y,w,h);
    S.artRect=[x+trem,y,w,h,img];
  };
}

/* Mia away (checks a noise, Friday walks): the generated empty chair (with its own ears) instead of the old drawn one */
{ const chOld=drawChair; drawChair=function(c){ const E=MV2.L.chair_empty; if(!MV2.on || !E) return chOld(c); const [bx,by,bw,bh]=mv2Rect(); c.drawImage(E,bx,by,bw,bh); }; }
{ const dkOld=drawDesk; drawDesk=function(c){ dkOld(c); const E=MV2.L.chair_empty;
    if(MV2.on && E && S && (S.mia.awayT>0 || S.finaleEmpty)){ const [bx,by,bw,bh]=mv2Rect(); c.save(); c.beginPath(); c.rect(bx,159.5,bw,30); c.clip(); c.drawImage(E,bx,by,bw,bh); c.restore(); } }; }   /* keyboard over the desk, covers the old drawn one */
/* ---------------- test panel (left side; the door panel stays on the right) */
function mv2Hold(v){ clearInterval(MV2.h); clearInterval(MV2.q); MV2.force=null; S.mia.forceFace=null; const end=Date.now()+3000;
  MV2.h=setInterval(()=>{ S.panic=Math.max(S.panic,v); if(Date.now()>end) clearInterval(MV2.h); },50); }
function mv2Panel(){
  const p=document.createElement('div'); p.id='mv2';
  p.innerHTML=`<b>Тест: новая Мия</b>
  <label><input type="checkbox" id="mv2On" checked> новая Мия (выкл = старая)</label>
  <label>сдвиг по x: <input type="range" id="mv2X" min="-40" max="40" step="1" value="0"> <span id="mv2XV">0</span></label>
  <div class="row"><button type="button" data-r="calm">спокойная</button><button type="button" data-r="pin">прочла закреп</button><button type="button" data-r="danger">опасность</button><button type="button" data-r="panic">паника</button></div>
  <div class="row"><button type="button" data-r="doorOpen">дверь открыта</button><button type="button" data-r="stalker">он в двери</button><button type="button" data-r="phone">звонок</button></div>
  <div class="row">держать: <button type="button" data-f="">как в игре</button><button type="button" data-f="calm">calm</button><button type="button" data-f="blink">blink</button><button type="button" data-f="talk">talk</button><button type="button" data-f="scared">scared</button><button type="button" data-f="worried">worried</button><button type="button" data-f="surprised">surprised</button><button type="button" data-f="panic">panic</button></div>
  <div class="row">игра: <button type="button" data-r="lv1">страх 50</button><button type="button" data-r="lv2">тревога 70</button><button type="button" data-r="lv3">паника 90</button><button type="button" data-r="lv0">успокоить</button></div>
  <label><input type="checkbox" id="mv2Bl" checked> автоморгание (логика игры: раз в 2–5 с)</label>
  <div class="row"><button type="button" data-r="blink">Моргнуть</button><button type="button" data-r="blinkSlow">медленно (0.6 с)</button><button type="button" data-r="talkTest">тест разговора</button><button type="button" data-r="scare">внезапный испуг</button></div>
  <div class="row">быстро ↔: <button type="button" data-q="blink">calm↔blink</button><button type="button" data-q="talk">calm↔talk</button><button type="button" data-q="scared">calm↔scared</button><button type="button" data-q="worried">calm↔worried</button><button type="button" data-q="surprised">calm↔surprised</button><button type="button" data-q="panic">calm↔panic</button></div>
  <div class="row"><button type="button" data-r="lightN">свет: обычный 60%</button><button type="button" data-r="lightT">тревожный 85%</button></div>
  <div id="mv2St"></div>
  <div id="mv2Miss"></div>`;
  document.body.appendChild(p);
  const $$=id=>document.getElementById(id);
  $$('mv2On').onchange=e=>MV2.on=e.target.checked;
  $$('mv2X').oninput=e=>{ MV2.dx=+e.target.value; $$('mv2XV').textContent=e.target.value; };
  const R={
    calm:()=>{ S.panic=0; S.mia.forceFace=null; S.mia.surpriseT=0; S.mia.phone=null; if(typeof DV2!=='undefined'){ DV2.manual=0; } },
    pin:()=>{ S.panic=0; try{ friFace('talk',3); miaLean(0,1.2,1.8); mod2Say('mv2pin','котики — это святое. мяу в ответ'); }catch(e){} },
    danger:()=>{ try{ friFace('scared',3.5); miaFlinch(1); miaLean(-2,0,2.8,'win'); }catch(e){} S.panic=Math.max(S.panic,45); },
    panic:()=>{ S.panic=90; try{ miaFlinch(1.6); }catch(e){} },
    doorOpen:()=>{ DV2.stalker=false; DV2.manual=1; },
    stalker:()=>{ DV2.stalker=true; DV2.manual=.8; },
    phone:()=>{ S.mia.phone=S.mia.phone?null:'open'; },
    blink:()=>{ S.mia.blink=.15; },        /* the game's own blink length (game.js: every 2-5 s, 0.15 s) */
    blinkSlow:()=>{ S.mia.blink=.6; },
    talkTest:()=>{ MV2.force=null; S.panic=0; S.mia.forceFace=null; S.mia.lineT=-1e9; say('force','ну вот, теперь я разговариваю новым ртом. скажите, не дёргается? вроде ничего не прыгает.',0); },
    scare:()=>{ MV2.force=null; S.mia.surpriseT=1.2; S.panic=Math.max(S.panic,48); try{ miaFlinch(1.4); }catch(e){} },
    /* real game levels: miaExpr() turns S.panic into scared 40+ · anxious 65+ · panic 85+ (with its own hysteresis) */
    /* the game lets panic fall fast without a threat, so the level is held for 3 s */
    lv1:()=>mv2Hold(50), lv2:()=>mv2Hold(70),
    lv3:()=>{ mv2Hold(90); try{ miaFlinch(1.6); }catch(e){} },
    lv0:()=>{ clearInterval(MV2.h); MV2.force=null; S.panic=0; S.mia.surpriseT=0; },
    lightN:()=>{ DV2.darkA=.6; for(const z of ZONES){ S.lamps[z].burned=false; S.lamps[z].mode='STABLE'; } },
    lightT:()=>{ DV2.darkA=.85; S.lamps.door.mode='DIM'; },
  };
  p.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>R[b.dataset.r]());
  p.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{ clearInterval(MV2.q); MV2.force=b.dataset.f||null; });
  /* stress test: flip calm <-> face 4 times a second for 4 s; any jump or seam shows up at once */
  p.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{ clearInterval(MV2.q); let n=0;
    MV2.q=setInterval(()=>{ MV2.force = n%2 ? b.dataset.q : 'calm'; if(++n>16){ clearInterval(MV2.q); MV2.force=null; } },250); });
  $$('mv2Bl').onchange=e=>MV2.noBlink=!e.target.checked;
  setInterval(()=>{
    if(!S) return;
    const ready=f=>!!MV2.set[f], miss=MV2.faces.filter(f=>!ready(f));
    $$('mv2St').innerHTML=(MV2.force?'<span class="warn">держу вручную</span> · ':'')+`игра просит: <b>${MV2.asked||'—'}</b> → показано: <b>${MV2.on?MV2.shown:'старая Мия'}</b>`+
      (MV2.on && MV2.asked && !ready(MV2.asked) ? ' <span class="warn">спрайт ещё не готов</span>' : '');
    $$('mv2Miss').textContent='нет арта: '+miss.join(', ');
  },250);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mv2Panel); else mv2Panel();
