"use strict";
/* ======================= ANONYMOUS PLAY STATS (itch build only, 11.11) =======================
   GoatCounter (no cookies, no personal data): each event is one GET to https://<STATS_SITE>.goatcounter.com/count
   as an "event" path, e.g. /night/tue/win, /night/fri/lose/panic, /finale/end, /time/15min.
   Off when STATS_SITE is empty, outside the itch build, or on file:// / localhost (dev). Yandex build: never. */
const STATS_SITE='themoderator-game';   /* <- the GoatCounter code, e.g. 'themoderator' for themoderator.goatcounter.com */
const STATS={on:false,sent:{},t0:0,min:0};
/* developer opt-out: 5 quick clicks on the red REC dot of the logo toggles stats for this browser (remembered).
   When off, the dot turns grey - only the dev knows what it means. */
function statsMine(){ try{ return localStorage.getItem('mod_nostats')==='1'; }catch(e){ return false; } }
function statsAllowed(){ return !!STATS_SITE && (window.MOD_PLATFORM==='itch'||window.MOD_PLATFORM==='vk'||window.MOD_PLATFORM==='gj') && /^https?:$/.test(location.protocol) && !/^(localhost|127\.)/.test(location.hostname) && !statsMine(); }
let nostatClicks=[];
document.addEventListener('click',e=>{
  if(!e.target.closest||!e.target.closest('.logoO')) return;
  const now=Date.now(); nostatClicks=nostatClicks.filter(t=>now-t<2500); nostatClicks.push(now);
  if(nostatClicks.length<5) return; nostatClicks=[];
  const off=!statsMine(); try{ off?localStorage.setItem('mod_nostats','1'):localStorage.removeItem('mod_nostats'); }catch(e){}
  STATS.on=statsAllowed(); document.body.classList.toggle('nostat',off);
},true);
function statsInit(){
  document.body.classList.toggle('nostat',statsMine());
  STATS.on = statsAllowed();
  STATS.t0=Date.now();
  stat('open/'+(MOBILE?'mobile':'pc')+'/'+(LANG||'en'),true);
  stat(PROG&&PROG.unlocked>0?'player/returning':'player/new',true);
  addEventListener('pagehide',()=>statQuit('closed'));
  setInterval(()=>{ const m=(Date.now()-STATS.t0)/60000; for(const k of [5,15,30,60]) if(m>=k && STATS.min<k){ STATS.min=k; stat('time/'+k+'min',true); } },30000);
}
/* once=true: count only once per page session (opens, milestones) */
/* where the player left an unfinished run: tab closed / page left, or "Menu" from pause.
   night: progress through the night in quarters (p0 / p25 / p50 / p75); tutorial: step; finale: phase. Once per run. */
function statQuit(how){
  try{
    if(!S||STATS.quitSent) return;
    let where=null;
    if(typeof FIN!=='undefined' && FIN.active) where='finale/phase'+FIN.phase;
    else if(S.running||paused){ const q=Math.min(75,Math.floor(Math.min(.999,S.t/S.len)*4)*25);
      where = S.tut&&S.tut.active ? 'tutorial/step'+S.tut.step : S.night.endless ? 'endless/n'+(endlessRun?endlessRun.n:0)+'/p'+q : 'night/'+S.night.key+'/p'+q; }
    if(!where) return;
    if(S.guide&&S.guide.active)stat('onboarding/mon/quit/'+S.guide.phase);
    STATS.quitSent=true; stat('quit/'+how+'/'+where);
  }catch(e){}
}
function stat(path,once){
  try{
    if(!STATS.on) return; if(once){ if(STATS.sent[path]) return; STATS.sent[path]=1; }
    if(window.MOD_PLATFORM==='vk') path='vk/'+path; else if(window.MOD_PLATFORM==='gj') path='gj/'+path;   /* VK Games players are counted apart: vk/night/mon/win ... */
    const u='https://'+STATS_SITE+'.goatcounter.com/count?e=true&p='+encodeURIComponent('/'+path)+'&t='+encodeURIComponent(path)+'&rnd='+Math.random().toString(36).slice(2);
    if(navigator.sendBeacon && navigator.sendBeacon(u)) return;
    const img=new Image(); img.src=u;
  }catch(e){}
}
