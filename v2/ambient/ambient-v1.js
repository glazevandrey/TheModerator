"use strict";
/* THE MODERATOR — review «ambient v1» (21.11.2026): Mia's everyday animations in the quiet stretches of a real night.
   Loaded LAST by review/window_v2 (after drink-v1, typing-v1, eyes-v1). The game is untouched; only reads its state.
   - typing (typing-v1, «poses» mode): on while she is calm and not speaking; short bursts with pauses (TYP.gapAuto).
   - drinking (drink-v1): once per AMBV.drink[0..1] seconds of CALM game time (default 45–90 s, a starting value for the test).
   Calm = the night runs (not paused, not over), she is at the desk, no phone, no scripted walk, no threat near
     (stalker hidden or far: p ≤ AMBV.pNear, no red eyes, not behind), panic below AMBV.panicMax, a calm face
     (not scared/panic/surprised; no forced anxious/scared/panic reaction face), no take/scare, no finale.
   Urgent things win at once: drink-v1 and typing-v1 drop their animation the same frame (hands/mug back in place).
   Timers count game dt (S.running), so a pause freezes them; a new night (new S) resets everything.
   Also: #fri in the page address starts Friday as in the game (with the pre-show), the debug panels start folded (H / ⚙). */
const AMBV={ on:true, drink:[45,90], pNear:.3, panicMax:60, calmAcc:0, next:0, sid:null, last:'', drinks:0 };
function ambvRnd(a,b){ return a+Math.random()*(b-a); }
function ambvSpeaking(){ return (typeof captionTimer!=='undefined' && captionTimer>0) || (S && S.storyCaptionUntil>S.t); }
/* something that needs her (and the player) right now */
function ambvUrgent(){ if(!S) return false; const st=S.st;
  if(S.scareT>0 || S.taken || S.pullK!=null) return true;
  if(st.stage==='behind' || st.red || (st.stage!=='hidden' && st.p>AMBV.pNear)) return true;
  if(S.panic>AMBV.panicMax) return true;
  if(typeof MV2!=='undefined' && /scared|panic|surprised/.test(MV2.curKey||'')) return true;   /* worried/anxious from a raised panic: she still types; a forced reaction face (below) stops her */
  const ff=S.mia.forceFace; if(ff && S.mia.forceFaceUntil>S.t && !/calm|talk/.test(ff)) return true;
  return false; }
function ambvWhy(){ if(!S||!S.running) return 'стоп'; if(S.mia.awayT>0) return 'отошла'; if(S.mia.phone) return 'телефон'; if(S.fri&&(S.fri.walk||(S.fri.walks&&S.fri.walks.length))) return 'идёт к окну'; if(typeof DRK!=='undefined'&&DRK.active) return 'пьёт'; const st=S.st;
  if(S.scareT>0||S.taken) return 'нападение'; if(st.stage==='behind'||st.red||(st.stage!=='hidden'&&st.p>AMBV.pNear)) return 'угроза '+st.stage; if(S.panic>AMBV.panicMax) return 'паника'; return 'лицо/реакция'; }
function ambvCalm(){ if(!AMBV.on || !S || !S.running || S.over || (typeof paused!=='undefined' && paused)) return false;
  if(typeof FIN!=='undefined' && FIN.active) return false;
  if(S.mia.awayT>0 || S.mia.phone) return false;
  if(S.fri && (S.fri.walk || (S.fri.walks && S.fri.walks.length))) return false;
  if(typeof DRK!=='undefined' && DRK.active) return false;
  return !ambvUrgent(); }
function ambvReset(){ AMBV.sid=S; AMBV.calmAcc=0; AMBV.next=ambvRnd(AMBV.drink[0],AMBV.drink[1]); AMBV.drinks=0;
  if(typeof drkStop==='function') drkStop(); if(typeof TYP!=='undefined'){ TYP.strokes.length=0; TYP.burst=0; TYP.gap=ambvRnd(1,3); TYP.auto=false; } }
function ambvTick(dt){
  if(!S) return; if(AMBV.sid!==S) ambvReset();
  const calm=ambvCalm(), talk=ambvSpeaking();
  if(typeof TYP!=='undefined') TYP.auto = calm && !talk;                       /* typing-v1 drops strokes the moment this goes false */
  AMBV.last = calm ? (talk?'спокойно, говорит':'спокойно') : ambvWhy();
  if(!calm || typeof drkStart!=='function') return;
  AMBV.calmAcc+=dt;
  if(AMBV.calmAcc>=AMBV.next && !talk){
    if(drkStart()){ AMBV.drinks++; AMBV.calmAcc=0; AMBV.next=ambvRnd(AMBV.drink[0],AMBV.drink[1]); }
    else AMBV.calmAcc=AMBV.next-1;                                                /* not now: try again in a second */
  }
}
{ const u0=update; update=function(dt){ const r=u0.apply(this,arguments); try{ if(S && S.running) ambvTick(dt); else if(S && AMBV.sid!==S) ambvReset(); }catch(e){ console.warn(e); } return r; }; }

/* Friday as in the game: the pre-show, the story, both visits, the result. Debug panels folded. */
function ambvStartFriday(){ try{ PROG.tut=true; }catch(e){}
  ['ovMenu','ovEnd','ovPause'].forEach(id=>{ const el=document.getElementById(id); if(el) el.hidden=true; });
  const i=NIGHTS.findIndex(n=>n.key==='fri'); start(i<0?4:i,{});
  setTimeout(()=>{ if(!S) return; try{ if(S.guide&&S.guide.active) onboardingFinish('skip',true); }catch(e){}
    if(typeof DV2!=='undefined'){ DV2.darkA=.75; DV2.manual=null; DV2.stalker=true; }
    if(typeof wv2Mode==='function') wv2Mode(false); },400); }
function ambvBoot(){
  document.body.classList.add('wv2-clean');                                     /* window panel, drink/typing buttons: folded (H or ⚙ opens) */
  const cl=document.getElementById('cl1'); if(cl) cl.classList.remove('open');  /* closet panel closed (K opens) */
  if(/fri/i.test(location.hash)){ let n=0; const go=()=>{ if(typeof NIGHTS!=='undefined' && typeof start==='function' && S){ ambvStartFriday(); } else if(++n<50) setTimeout(go,100); }; setTimeout(go,600); }
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(ambvBoot,50)); else setTimeout(ambvBoot,50);
