"use strict";
// ======================= PLATFORM: Yandex Games SDK / VK Bridge (VK Games), with a local fallback =======================
const IS_VK = window.MOD_PLATFORM==='vk';
const IS_CG = window.MOD_PLATFORM==='cg';   /* CrazyGames: SDK v3, English by default, no external links */
const NO_ADS = window.MOD_PLATFORM==='itch' || window.MOD_PLATFORM==='gj';   // itch.io / Game Jolt builds: no ads, no leaderboard
const NO_LB = NO_ADS || IS_VK || IS_CG;                   /* the endless leaderboard is Yandex-only */
const PF={ysdk:null, vk:null, cg:null, adblock:false, player:null, ready:false, inAd:false, playing:false, lang:null, onPause:null, onResume:null};
/* VK: vkBridge comes from the CDN script in the vk build, VKWebAppInit is already sent there (must be < 30 s after launch) */
function vkSend(m,p){ return PF.vk ? PF.vk.send(m,p||{}) : Promise.reject(new Error('no vk')); }

async function platformInit(){
  try{
    if(IS_CG){
      for(let i=0;i<30 && !(window.CrazyGames&&window.CrazyGames.SDK);i++) await new Promise(r=>setTimeout(r,100));
      if(window.CrazyGames&&window.CrazyGames.SDK){ PF.cg=window.CrazyGames.SDK; await PF.cg.init(); try{ PF.cg.game.loadingStart(); }catch(e){}
        try{ PF.adblock=!!(await PF.cg.ad.hasAdblock()); }catch(e){} }
      PF.lang='en';   /* CrazyGames wants English by default; a language picked in the game (mod_lang) still wins */
      return;
    }
    if(IS_VK){ for(let i=0;i<25 && !window.vkBridge;i++) await new Promise(r=>setTimeout(r,100)); }   /* the bridge loads async (wait up to 2.5 s) */
    if(IS_VK && window.vkBridge){
      PF.vk=window.vkBridge;
      try{ const q=new URLSearchParams(location.search); PF.lang=q.get('vk_language')||null; }catch(e){}
      try{ PF.vk.subscribe(e=>{ const t=e&&e.detail&&e.detail.type; if(t==='VKWebAppViewHide'){ PF.onPause&&PF.onPause(); } else if(t==='VKWebAppViewRestore'){ PF.onResume&&PF.onResume(); } }); }catch(e){}
      return;
    }
    if(window.YaGames){
      PF.ysdk=await YaGames.init();
      try{ PF.lang=PF.ysdk.environment.i18n.lang; }catch(e){}
      try{ PF.player=await PF.ysdk.getPlayer(); }catch(e){ PF.player=null; }
      try{ PF.ysdk.on('game_api_pause',()=>{ PF.onPause&&PF.onPause(); }); PF.ysdk.on('game_api_resume',()=>{ PF.onResume&&PF.onResume(); }); }catch(e){}
    }
  }catch(e){ PF.ysdk=null; }
}
function pfReady(){ if(PF.ready) return; PF.ready=true; try{ PF.ysdk&&PF.ysdk.features.LoadingAPI.ready(); }catch(e){} try{ PF.cg&&PF.cg.game.loadingStop(); }catch(e){} }
function pfHappy(){ try{ PF.cg&&PF.cg.game.happytime(); }catch(e){} }
function pfGameplay(on){ if(PF.playing===on) return; PF.playing=on; try{ if(PF.ysdk) on?PF.ysdk.features.GameplayAPI.start():PF.ysdk.features.GameplayAPI.stop(); }catch(e){} try{ if(PF.cg) on?PF.cg.game.gameplayStart():PF.cg.game.gameplayStop(); }catch(e){} }

// ---- ads (sound and gameplay pause while an ad is on screen)
function adOpen(){ PF.inAd=true; pfGameplay(false); if(A.ctx) A.ctx.suspend(); }
function adClose(){ PF.inAd=false; if(A.ctx&&!A.muted) A.ctx.resume(); }
function vkAd(fmt,cb){ /* fmt 'interstitial' | 'reward'; cb(watched) */
  let fired=false; const fin=ok=>{ if(fired) return; fired=true; adClose(); cb(!!ok); };
  vkSend('VKWebAppCheckNativeAds',{ad_format:fmt}).then(r=>{
    if(!r||!r.result){ fired=true; cb(false); return; }
    adOpen(); return vkSend('VKWebAppShowNativeAds',{ad_format:fmt}).then(x=>fin(x&&x.result),()=>fin(false));
  },()=>{ fired=true; cb(false); });
}
function cgAd(kind,cb){ /* kind 'midgame' | 'rewarded'; cb(watched). Mute only once the ad really starts */
  let started=false, fired=false; const fin=ok=>{ if(fired) return; fired=true; if(started) adClose(); cb(!!ok); };
  try{ PF.cg.ad.requestAd(kind,{adStarted:()=>{ started=true; adOpen(); },adFinished:()=>fin(true),adError:()=>fin(false)}); }catch(e){ fin(false); }
}
function pfInterstitial(done){
  if(PF.cg){ cgAd('midgame',()=>{ done&&done(); }); return; }
  if(PF.vk){ vkAd('interstitial',()=>{ done&&done(); }); return; }
  if(!PF.ysdk){ done&&done(); return; }
  let fired=false; const fin=()=>{ if(fired) return; fired=true; adClose(); done&&done(); };
  try{ PF.ysdk.adv.showFullscreenAdv({callbacks:{onOpen:adOpen,onClose:fin,onError:fin}}); }catch(e){ fin(); }
}
function pfRewarded(onReward,done){
  if(PF.cg){ if(PF.adblock){ done&&done(false); return; } cgAd('rewarded',ok=>{ if(ok) onReward&&onReward(); done&&done(ok); }); return; }
  if(PF.vk){ vkAd('reward',ok=>{ if(ok) onReward&&onReward(); done&&done(ok); }); return; }
  if(!PF.ysdk){ // outside Yandex: grant right away so the feature can be tried
    onReward&&onReward(); done&&done(true); return; }
  let got=false, fired=false; const fin=()=>{ if(fired) return; fired=true; adClose(); if(got) onReward&&onReward(); done&&done(got); };
  try{ PF.ysdk.adv.showRewardedVideo({callbacks:{onOpen:adOpen,onRewarded:()=>{got=true;},onClose:fin,onError:fin}}); }catch(e){ fin(); }
}

// ---- saves: cloud (player data) when available, localStorage always as a backup
function pfSave(obj){
  obj.ts=Date.now();
  try{ localStorage.setItem('mod_save',JSON.stringify(obj)); }catch(e){}
  try{ PF.player && PF.player.setData({save:obj},true).catch(()=>{}); }catch(e){}
  try{ PF.cg && PF.cg.data.setItem('mod_save',JSON.stringify(obj)); }catch(e){}
  if(PF.vk){ /* VK Storage: values up to 4096 chars -> chunks save_0..save_N + save_n */
    try{ const s=JSON.stringify(obj), parts=[]; for(let i=0;i<s.length;i+=3500) parts.push(s.slice(i,i+3500));
      parts.forEach((v,i)=>vkSend('VKWebAppStorageSet',{key:'save_'+i,value:v}).catch(()=>{}));
      vkSend('VKWebAppStorageSet',{key:'save_n',value:String(parts.length)}).catch(()=>{}); }catch(e){}
  }
}
async function pfLoad(){
  let local=null, cloud=null;
  try{ local=JSON.parse(localStorage.getItem('mod_save')||'null'); }catch(e){}
  try{ if(PF.player){ const d=await PF.player.getData(['save']); cloud=d&&d.save||null; } }catch(e){}
  try{ if(PF.cg){ const s=PF.cg.data.getItem('mod_save'); if(s) cloud=JSON.parse(s); } }catch(e){}
  try{ if(PF.vk){
    const g=async keys=>{ const r=await vkSend('VKWebAppStorageGet',{keys}); const o={}; for(const k of (r&&r.keys)||[]) o[k.key]=k.value; return o; };
    const n=+((await g(['save_n'])).save_n||0);
    if(n>0 && n<20){ const ks=[...Array(n).keys()].map(i=>'save_'+i), o=await g(ks); const s=ks.map(k=>o[k]||'').join(''); if(s) cloud=JSON.parse(s); }
  } }catch(e){}
  if(local&&cloud) return (cloud.ts||0)>=(local.ts||0)?cloud:local;
  return cloud||local;
}

// ---- leaderboard (endless shift)
const LB_NAME='endless';
async function pfSetScore(v){
  try{ if(PF.ysdk && PF.ysdk.isAvailableMethod && await PF.ysdk.isAvailableMethod('leaderboards.setScore')) await PF.ysdk.leaderboards.setScore(LB_NAME,Math.round(v)); }catch(e){}
}
async function pfTop(){
  try{ if(PF.ysdk){ const r=await PF.ysdk.leaderboards.getEntries(LB_NAME,{quantityTop:7,includeUser:true,quantityAround:1}); return r; } }catch(e){}
  return null;
}
