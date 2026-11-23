"use strict";
/* THE MODERATOR — review «present v1» (22.11.2026): subtitles in their own strip + a lighter tone of Mia. Loaded by review/window_v2
   after desk-v1 (MTONE). The game is untouched.
   1. Subtitles: #caption sat over the bottom of the picture — exactly where her hands, the keys and the cup move.
      It is moved into a fixed strip UNDER the picture (between the webcam and the stream bar), two lines high, always reserved,
      so the layout never jumps and nothing in the frame is covered. The picture keeps its 2:1 shape (a little smaller).
      The game still writes into the same #caption element; only its place and style change.
   2. Tone «B» (default here): Mia less dark and with her volume back (MTONE brightness .92, saturation .9, contrast 1.03 instead of
      .84/.82/.96 — the low contrast flattened her face), and the CSS scan lines over the webcam at 45 %. The dark room stays.
      Tone «A» = the previous values, for comparison: Ctrl+Shift+M toggles, or ?tone=a in the address. */
const PRS={ tone:/tone=a/i.test(location.search)?'A':'B', toneA:{b:.84,s:.82,c:.96,scan:1}, toneB:{b:.92,s:.9,c:1.03,scan:.45} };
function prsTone(k){ PRS.tone=k; const v=k==='A'?PRS.toneA:PRS.toneB; if(typeof MTONE!=='undefined'){ MTONE.b=v.b; MTONE.s=v.s; MTONE.c=v.c; }
  document.documentElement.style.setProperty('--prs-scan',v.scan); }
function prsBoot(){
  const css=document.createElement('style'); css.textContent=`
  #stage #video .scan{opacity:var(--prs-scan,1)}
  #prsCap{flex:0 0 auto;height:46px;display:flex;align-items:center;justify-content:center;padding:0 14px;background:#0d0a10;border-top:1px solid #2a2230;overflow:hidden}
  #stage#stage#stage #prsCap .caption{position:static;transform:none;left:auto;bottom:auto;max-width:100%;margin:0;padding:0;background:none;box-shadow:none;border:0;
    font:600 16px/1.3 system-ui,"Segoe UI",sans-serif;color:#f3e8d6;text-align:center;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  #stage#stage#stage #prsCap .caption[hidden]{display:none}
  #stage#stage#stage #prsCap .caption.story-key{border:0;color:#f0d9a6}`;
  document.head.appendChild(css);
  const v=document.getElementById('video'), c=document.getElementById('caption'); if(!v||!c) return;
  const strip=document.createElement('div'); strip.id='prsCap'; v.insertAdjacentElement('afterend',strip); strip.appendChild(c);
  prsTone(PRS.tone);
  addEventListener('keydown',e=>{ if(e.ctrlKey&&e.shiftKey&&e.code==='KeyM'){ e.preventDefault(); prsTone(PRS.tone==='A'?'B':'A'); if(typeof floaty==='function') floaty('тон Мии: '+PRS.tone); } });
}
/* 3. Menu music from the start (22.11): the game creates its audio only in start() (a night), so the menu stayed silent until the
   first night. Browsers allow sound only after a gesture: the audio is unlocked by the FIRST click / key / touch anywhere
   (menu music then fades in). In the Electron build it can start with no gesture (autoplay policy in the main process). */
function prsAudioUnlock(){ try{ if(typeof audioInit==='function') audioInit(); if(typeof A!=='undefined'&&A.ctx&&A.ctx.state==='suspended'&&!A.muted) A.ctx.resume(); }catch(e){}
  if(typeof A!=='undefined'&&A.ctx&&A.ctx.state==='running'){ for(const t of ['pointerdown','keydown','touchstart']) removeEventListener(t,prsAudioUnlock,true); } }
for(const t of ['pointerdown','keydown','touchstart']) addEventListener(t,prsAudioUnlock,true);
setTimeout(prsAudioUnlock,800);   /* where autoplay is allowed (Electron, a site with permission) it starts by itself */
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',prsBoot); else prsBoot();
