"use strict";
// ======================= PLATFORM: Steam / desktop build — local only =======================
/* 22.11.2026: every portal SDK is gone from the Steam project (Yandex Games, VK Bridge, CrazyGames, ads, leaderboards,
   cloud saves). No network calls. The function names stay so the game code does not change:
   saves go to localStorage, ads and leaderboards are no-ops. The old file is in archives/backup_2026-11-22_before_rules/. */
const IS_VK=false, IS_CG=false;
const NO_ADS=true;                     /* no ads anywhere */
const NO_LB=true;                      /* no online leaderboard: the endless shift shows your own best */
const PF={adblock:false, ready:false, inAd:false, playing:false, lang:null, onPause:null, onResume:null};

async function platformInit(){}
function pfReady(){ PF.ready=true; }
function pfHappy(){}
function pfGameplay(on){ PF.playing=on; }
function pfInterstitial(done){ done&&done(); }
function pfRewarded(onReward,done){ onReward&&onReward(); done&&done(true); }

// ---- saves: localStorage (the Electron build keeps it in the app's user data folder)
function pfSave(obj){ obj.ts=Date.now(); try{ localStorage.setItem('mod_save',JSON.stringify(obj)); }catch(e){} }
async function pfLoad(){ try{ return JSON.parse(localStorage.getItem('mod_save')||'null'); }catch(e){ return null; } }

// ---- leaderboard: none
async function pfSetScore(v){}
async function pfTop(){ return null; }
