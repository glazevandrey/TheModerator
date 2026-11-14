"use strict";
// ======================= ART ASSETS =======================
// Drop finished art into assets/ with these names and the game uses it automatically.
// Anything missing falls back to the procedural placeholder drawn in render.js.
// Room layers are 1280×720 (whole room; the camera shows the middle 1280×640 band), Mia/stalker are transparent PNG/WebP.
const ASSET_MANIFEST={
  room_base:   'assets/room/room_base.webp',     // empty room, lamps off, no Mia
  room_light:  'assets/room/room_light.webp',    // optional: warm light pass, drawn additively
  mia_calm:    'assets/mia/mia_calm.png',
  mia_talk:    'assets/mia/mia_talk.png',
  mia_surprised:'assets/mia/mia_surprised.png',
  mia_scared:  'assets/mia/mia_scared.png',
  mia_anxious: 'assets/mia/mia_anxious.png',
  mia_panic:   'assets/mia/mia_panic.png',
  stalker_window:'assets/stalker/stalker_window.png',
  stalker_door:'assets/stalker/stalker_door.png',
  stalker_behind:'assets/stalker/stalker_behind.png',
  stalker_chair:'assets/stalker/stalker_chair.png',
  window_note: 'assets/room/window_note.png'
};
const USE_ASSETS=false;   // flip to true once the files above exist (avoids 404s while they don't)
const IMG={};
function loadAssets(){
  // art embedded into the build by tools/art.py (data URIs) — always available, even in the single-file itch build
  if(typeof ART!=='undefined') for(const [k,src] of Object.entries(ART)){ const im=new Image(); im.onload=()=>{ IMG[k]=im; if(k==='mia_calm' && typeof drawAvatar==='function' && document.getElementById('miaAva')) drawAvatar(document.getElementById('miaAva')); }; im.src=src; }
  if(!USE_ASSETS) return;
  for(const [k,src] of Object.entries(ASSET_MANIFEST)){
    const im=new Image(); im.onload=()=>{ IMG[k]=im; }; im.onerror=()=>{}; im.src=src;
  }
}
function has(k){ return !!IMG[k]; }
loadAssets();
