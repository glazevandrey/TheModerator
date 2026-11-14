"use strict";
/* ======================= SCARES (11.11, in the main build since 11.11) =======================
   Sampled sounds (js/sfxdata.js, tools/sfx.py, loudness matched to our synth SFX) + scare events.
   SCARES=false turns all of it off (the game sounds and plays exactly as before).
   Budget: a few real scares per night (more later in the week), at least 20 s apart; none in the tutorial / finale.
   1 glass:   at the window he knocks (p .7), and on early nights at the top he slams the glass - Mia screams
   2 slam:    pushed back from the door / closet late (he had got past 70%) - the door bangs shut, lights flicker
   3 bulb:    a lamp burns out - a loud pop and his eyes flash in that dark corner for a moment
   4 face:    sometimes when Stranger_99 writes - the video glitches and a face fills the frame for a few frames
   5 whisper: while he is close, now and then a whisper from his side ("Mia...", "I'm here", "I see you")
   6 fake:    once a night when he is away - a creak / steps outside / a thud upstairs; Mia startles, laughs it off
   7 phone:   from Wednesday, once a night - her phone rings, unknown number, only breathing on the line
   8 hook:    Monday, ~20 s in - something passes behind the window and is gone; chat: "did you see that?" */
const SCARES=true;
const SCR={buf:{},busy:false,budget:0,cool:0,peak:0,peakZone:null,knocked:false,whT:0,whN:0,fakeAt:-1,phoneAt:-1,hookAt:-1,phoneOn:false};
const SC_TXT={
  ru:{fake:['…показалось, наверное','…что это было?','ой. соседи, наверное'],phone1:'ой… кто звонит в такое время? неизвестный номер…',phone2:'алло?.. алло? …кто это?',phone3:'…повесили. там кто-то дышал.',
      hook:['эм… вы видели?','что-то за окном прошло??','мия, окно…','это птица была? ночью??'],slam:'ЧТО ЭТО БЫЛО?!'},
  en:{fake:['…probably nothing','…what was that?','oh. the neighbours, probably'],phone1:'huh… who\'s calling this late? unknown number…',phone2:'hello?.. hello? …who is this?',phone3:'…they hung up. someone was breathing.',
      hook:['uh… did you see that?','something passed the window??','mia, the window…','was that a bird? at night??'],slam:'WHAT WAS THAT?!'}};
function scT(){ return SC_TXT[LANG]||SC_TXT.en; }
function scareLoad(){
  if(!SCARES||SCR.busy||typeof SFX_DATA==='undefined'||!A.ctx) return; SCR.busy=true;
  for(const n in SFX_DATA){ try{ const bin=atob(SFX_DATA[n].mp3.split(',')[1]), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
    A.ctx.decodeAudioData(u.buffer,b=>{ SCR.buf[n]=b; },()=>{}); }catch(e){} }
}
/* play a sample: vol on top of its matched gain, pan -1..1 */
function sp(n,vol,pan,rate){
  if(!A.ctx||!SCR.buf[n]) return 0;
  const c=A.ctx, s=c.createBufferSource(); s.buffer=SCR.buf[n]; if(rate) s.playbackRate.value=rate;
  const g=c.createGain(); g.gain.value=(SFX_DATA[n].gain||1)*(vol==null?1:vol);
  const p=ambPan(pan||0); s.connect(g).connect(p).connect(A.master); s.start(); return SCR.buf[n].duration/(rate||1);
}
const ZPAN2={window:-.6,closet:.1,door:.6,behind:0};
function scareOk(){ return SCARES && S && S.running && !S.tut.active && !(typeof FIN!=='undefined'&&FIN.active) && SCR.budget>0 && SCR.cool<=0 && !SCR.phoneOn; }
function scareUse(){ SCR.budget--; SCR.cool=20; }
function scareReset(){
  if(!SCARES||!S) return; scareLoad();
  const N=S.night||{}, ORD=['mon','tue','wed','thu','fri','sat','sun','mon2'], i=ORD.indexOf(N.key);
  SCR.budget = S.tut.active ? 0 : N.endless ? 4 : [2,2,3,3,4,4,4,3][i]||2;
  SCR.cool=12; SCR.peak=0; SCR.peakZone=null; SCR.knocked=false; SCR.whT=rnd(18,30); SCR.whN=0; SCR.phoneOn=false;
  SCR.fakeAt = rnd(.3,.65); SCR.phoneAt = (i>=2||N.endless) && Math.random()<.85 ? rnd(.35,.8) : -1; SCR.hookAt = N.key==='mon' ? 9 : -1;
  S.fxEyes=null; S.fxFace=0; S.fxPass=0; S.mia.phone=null; SCR.tutHook=false;
}
function miaGasp(){ sp('mia_gasp',1,0); S.mia.surpriseT=Math.max(S.mia.surpriseT||0,1.2); }
/* 1 glass: called from stalker.js */
function scareKnock(){ if(!SCARES||SCR.knocked) return; SCR.knocked=true; sp('glass_knock',1,-.6); }
function scareGlassSlam(){ if(!SCARES) return false; sp('glass_slam',1,-.5); later(()=>sp('mia_scream',.9,0),120); S.shake=.7; S.glitch=.5; S.fxFlash=.25; memeSay('scare',.6,1800,true); stat('scare/glass'); return true; }
/* 3 bulb: called from lighting.js when a lamp burns out */
function scareBulb(z){
  if(!SCARES) return false; sp('bulb_pop',1,ZPAN2[z]||0); S.glitch=.35; S.shake=.25;
  if(S.st.stage!==z) S.fxEyes={zone:z,t:1.3};
  memeSay('scare',.35,1600,true);
  return true;
}
/* 4 face: called from chat.js on a Stranger_99 message */
function scareFace(){
  if(!scareOk()||Math.random()>.35) return; scareUse();
  setTimeout(()=>{ if(!S||!S.running) return; sp('glitch_hit',1,0); S.fxFace=.22; S.glitch=.7; S.shake=.3; later(miaGasp,300); addPanic(5); stat('scare/face'); },rnd(700,1600));
}
function scareTick(dt){
  if(!SCARES||!S) return;
  if(typeof UI_MOTION!=='undefined'&&UI_MOTION.shift)return;
  if(S.fxEyes){ S.fxEyes.t-=dt; if(S.fxEyes.t<=0) S.fxEyes=null; }
  if(S.fxFace>0) S.fxFace-=dt; if(S.fxPass>0) S.fxPass-=dt; if(S.fxFlash>0) S.fxFlash-=dt;
  if(S.guide&&S.guide.active)return;
  /* tutorial hook (12.11): ~14 s in, something passes behind her window; nobody explains it */
  if(S.running && S.tut.active && !SCR.tutHook && S.t>=14 && S.st.stage==='hidden'){ SCR.tutHook=true; S.fxPass=2.4; sp('steps_outside',.7,-.7);
    later(()=>pushMsg('normal',genName(),pick(scT().hook)),1500); later(()=>pushMsg('normal',genName(),pick(scT().hook)),3000); stat('scare/tuthook'); }
  if(!S.running||S.tut.active||(typeof FIN!=='undefined'&&FIN.active)) return;
  if(!Object.keys(SCR.buf).length) scareLoad();
  SCR.cool-=dt;
  const st=S.st, prog=S.t/S.len;
  /* 2 slam: remember how far he got in door / closet; if he is pushed back from there after 70% - bang */
  if(st.stage==='door'||st.stage==='closet'){ if(st.p>SCR.peak){ SCR.peak=st.p; SCR.peakZone=st.stage; } }
  else if(SCR.peakZone){
    if(SCR.peak>.7 && st.stage==='hidden' && scareOk()){ scareUse(); const z=SCR.peakZone; sp('door_slam',1,ZPAN2[z]); S.glitch=.3; S.shake=.35;
      for(const k of ['window','closet','door']) S.lamps[k].flick=.3; later(miaGasp,150); addPanic(6); floaty(scT().slam); memeSay('scare',.6,1700,true); stat('scare/slam'); }
    if(st.stage!=='behind'){ SCR.peak=0; SCR.peakZone=null; }
  }
  if(st.stage==='window'){ if(st.p>=.7) scareKnock(); } else if(st.stage==='hidden') SCR.knocked=false;
  /* 5 whisper while he is close */
  if(st.stage!=='hidden' && st.p>.65 && SCR.whN<3){ SCR.whT-=dt;
    if(SCR.whT<=0){ SCR.whT=rnd(25,45); SCR.whN++; const w=pick(['mia','here','see']), ln=LANG==='ru'?'ru':'en'; sp('wh_'+w+'_'+ln,1,ZPAN2[st.stage]||0); stat('scare/whisper',true); } }
  /* 8 Monday hook */
  if(SCR.hookAt>0 && S.t>=SCR.hookAt){ SCR.hookAt=-1; if(st.stage==='hidden'){ S.fxPass=2.4; sp('steps_outside',.7,-.7);
    later(()=>pushMsg('normal',genName(),pick(scT().hook)),1600); later(()=>pushMsg('normal',genName(),pick(scT().hook)),3200); stat('scare/hook'); } }
  /* 6 fake-out */
  if(SCR.fakeAt>0 && prog>=SCR.fakeAt && st.stage==='hidden' && scareOk()){ SCR.fakeAt=-1; scareUse();
    const k=pick(['creak','steps_outside','thud']); sp(k,1,k==='creak'?.6:k==='steps_outside'?-.7:0); later(miaGasp,k==='thud'?100:900);
    S.mia.look=k==='creak'?1:k==='steps_outside'?-1:0; addPanic(4);
    later(()=>{ sp('mia_laugh',1,0); say('force',pick(scT().fake),0); S.mia.look=0; memeSay('scare',.5,1500); },2400); stat('scare/fake/'+k); }
  /* 7 phone */
  if(SCR.phoneAt>0 && prog>=SCR.phoneAt && st.stage==='hidden' && scareOk()){ SCR.phoneAt=-1; scareUse(); SCR.phoneOn=true;
    const d1=sp('phone_ring',1,.2)||4.5; say('force',scT().phone1,0); memeSay('phone',.9,1400,true); memeSay('phone',.5,(d1+1.5)*1000,true);
    /* sprites: picks up (mouth closed) -> "hello?" (lip sync) -> listens to the breathing -> scared -> puts it down */
    later(()=>{ S.mia.phone='closed'; },(d1-.4)*1000);
    later(()=>{ S.mia.phone='open'; say('force',scT().phone2,0); sp('phone_breath',1,.15); },(d1+.3)*1000);
    later(()=>{ S.mia.phone='closed'; },(d1+2.6)*1000);
    later(()=>{ S.mia.phone='scared'; miaGasp(); addPanic(10); say('force',scT().phone3,0); SCR.phoneOn=false; SCR.cool=20; },(d1+5.6)*1000);
    later(()=>{ S.mia.phone=null; },(d1+8.4)*1000);
    setTimeout(()=>{ SCR.phoneOn=false; },(d1+7)*1000); stat('scare/phone'); }
}
