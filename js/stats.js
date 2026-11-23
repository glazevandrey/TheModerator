"use strict";
/* ======================= PLAY STATS: off in the Steam project (22.11.2026) =======================
   The itch build counted anonymous events through GoatCounter (a network request per event). The Steam build sends nothing.
   The calls stay as no-ops so the game code does not change. Old file: archives/backup_2026-11-22_before_rules/js/stats.js */
const STATS={on:false,sent:{},t0:0,min:0,quitSent:false};
function statsInit(){ STATS.t0=Date.now(); }
function statQuit(how){}
function stat(path,once){}
