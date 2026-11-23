"use strict";
// ======================= AUDIO (synthesised with WebAudio; swap for files in assets/ later) =======================
const A={ctx:null,master:null,out:null,mus:null,muted:false,noise:null,static:null};
/* volume sliders (0..1), saved in PROG.vol; mute (menu toggle) sits on A.out above both */
/* defaults for a new player (11.11): sounds 70%, music 100% */
const VOL_DEF={mus:1,sfx:.7};
function volOf(k){ const v=PROG&&PROG.vol&&PROG.vol[k]; return typeof v==='number'?clamp(v,0,1):VOL_DEF[k]; }
function applyVol(){ MUS.on=volOf('mus')>0; if(!A.ctx) return; const t=A.ctx.currentTime; A.master.gain.setTargetAtTime(.7*volOf('sfx'),t,.03); A.mus.gain.setTargetAtTime(.7*volOf('mus'),t,.03); A.out.gain.value=A.muted?0:1; MUS.on=volOf('mus')>0; }
function audioInit(){
  if(A.ctx) return;
  try{
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    A.ctx=new AC(); A.out=A.ctx.createGain(); A.out.gain.value=A.muted?0:1; A.out.connect(A.ctx.destination);
    A.master=A.ctx.createGain(); A.master.gain.value=.7*volOf('sfx'); A.master.connect(A.out);
    A.mus=A.ctx.createGain(); A.mus.gain.value=.7*volOf('mus'); A.mus.connect(A.out);
    const len=A.ctx.sampleRate*2, buf=A.ctx.createBuffer(1,len,A.ctx.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1; A.noise=buf;
    ambInit(); if(MIA_VOICE) setTimeout(voxInit,700);   /* perf: decode the voice a moment after the first click, not in it */
  }catch(e){ A.ctx=null; }
}
function setMuted(m){ A.muted=m; if(A.out) A.out.gain.value=m?0:1; }
function tone(f,dur,type='sine',vol=.1,slideTo=null,delay=0){
  if(!A.ctx) return; const t=A.ctx.currentTime+delay;
  const o=A.ctx.createOscillator(); o.type=type; o.frequency.setValueAtTime(f,t); if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
  const g=A.ctx.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(A.master); o.start(t); o.stop(t+dur+.05);
}
function noiseBurst(dur,vol=.2,type='bandpass',freq=1800,q=1,delay=0){
  if(!A.ctx) return; const t=A.ctx.currentTime+delay;
  const s=A.ctx.createBufferSource(); s.buffer=A.noise; const f=A.ctx.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q;
  const g=A.ctx.createGain(); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(f).connect(g).connect(A.master); s.start(t,Math.random()); s.stop(t+dur+.05);
}
const SFX={
  click(){tone(1400,.03,'square',.03); noiseBurst(.03,.05,'highpass',3000)},
  key(){tone(900,.03,'square',.025)},
  ban(){tone(520,.08,'square',.05);tone(300,.12,'square',.05,null,.07);noiseBurst(.08,.15,'lowpass',600,1,.02)},
  wrong(){tone(180,.35,'sawtooth',.07,90)},
  rec(){tone(880,.12,'sine',.08);tone(880,.12,'sine',.08,null,.18)},
  glitch(){noiseBurst(.25,.18,'bandpass',2400,2)},
  cue(z){ // gives his way in away, ~2 s before he shows up
    if(z==='window'){ noiseBurst(.05,.16,'bandpass',2600,5,0); noiseBurst(.05,.14,'bandpass',2400,5,.22); noiseBurst(.05,.12,'bandpass',2500,5,.62); }
    else if(z==='door'){ [0,.26,.52,1.05,1.3].forEach(t=>{ noiseBurst(.025,.13,'bandpass',1900,9,t); noiseBurst(.02,.1,'bandpass',2600,9,t+.045); tone(150,.09,'triangle',.06,95,t+.02); noiseBurst(.06,.05,'lowpass',500,1,t+.03); }); }   /* someone trying the door handle: metal latch rattling, twice */
    else { for(let i=0;i<4;i++) tone(2100+Math.random()*900,.12,'triangle',.022,null,i*.11+Math.random()*.05); noiseBurst(.6,.05,'bandpass',1500,1.2,.05); } },
  sash(){ noiseBurst(.5,.08,'bandpass',900,2); tone(320,.35,'triangle',.03,260,.05); noiseBurst(1.4,.05,'lowpass',700,1,.4); },   // window sash sliding + a gust
  creak(){tone(95,1.1,'sawtooth',.035,55);noiseBurst(.9,.03,'lowpass',500)},
  door(){tone(120,1.4,'sawtooth',.04,70);noiseBurst(1.2,.04,'bandpass',700,3)},
  thud(){tone(70,.4,'sine',.25,40)},
  burn(){noiseBurst(.12,.35,'highpass',3000);tone(60,.3,'sine',.2,30)},
  surge(){ tone(55,.45,'sawtooth',.08,190); tone(110,.4,'square',.025,330,.05); noiseBurst(.35,.06,'bandpass',4200,3); noiseBurst(.05,.2,'highpass',2500,1,.42); tone(150,.08,'sine',.12,60,.42); },   /* power surge: wiring hum swells up, crackles, snaps */
  blinds(){for(let i=0;i<7;i++) noiseBurst(.04,.12,'bandpass',3200,4,i*.05)},
  donate(){[660,880,1320].forEach((f,i)=>tone(f,.35,'sine',.07,null,i*.09))},
  siren(){ if(!A.ctx) return; for(let i=0;i<6;i++){tone(620,.2,'square',.06,900,i*.4);tone(900,.2,'square',.06,620,i*.4+.2);} },
  dog(){ for(let i=0;i<3;i++){ tone(340,.12,'sawtooth',.09,180,i*.32); noiseBurst(.12,.12,'bandpass',900,2,i*.32); } },
  steps(){ for(let i=0;i<6;i++){ tone(60,.12,'sine',.22,40,i*.42); noiseBurst(.06,.08,'lowpass',400,1,i*.42); } },
  knock(){ for(let i=0;i<9;i++){ const dl=i*.28+(i>3?.5:0); tone(55,.18,'sine',.6,35,dl); noiseBurst(.1,.5,'lowpass',500,1,dl); } },
  slam(){ tone(45,.8,'sine',.7,30); noiseBurst(.5,.6,'lowpass',900); },
  heartbeat(){tone(58,.16,'sine',.3,40);tone(52,.2,'sine',.22,36,.22)},
  near(){tone(41,1.6,'sine',.12,38);noiseBurst(1.2,.025,'bandpass',900,6)},
  take(){ if(!A.ctx) return; const t=A.ctx.currentTime; // her scream, cut off; a thud; the chair creaking
    const o=A.ctx.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(760,t+.55); o.frequency.linearRampToValueAtTime(980,t+.75); o.frequency.linearRampToValueAtTime(620,t+1.05);
    const bp=A.ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1300; bp.Q.value=2.5; const g=A.ctx.createGain(); g.gain.setValueAtTime(0,t+.55); g.gain.linearRampToValueAtTime(.16,t+.62); g.gain.setValueAtTime(.16,t+1.02); g.gain.linearRampToValueAtTime(0,t+1.05);
    o.connect(bp).connect(g).connect(A.master); o.start(t+.5); o.stop(t+1.1);
    noiseBurst(.45,.09,'bandpass',2200,1.5,.56); tone(70,.4,'sine',.35,40,1.05); noiseBurst(.25,.25,'lowpass',700,1,1.05);
    for(let i=0;i<4;i++) tone(260-i*12,.22,'triangle',.025,200,1.3+i*.45); },
  scare(){ if(!A.ctx) return; noiseBurst(1.3,.7,'lowpass',5000); tone(110,1.2,'sawtooth',.4,60); tone(233,1,'square',.18,180); },
  staticOn(){ if(!A.ctx||A.static) return; const s=A.ctx.createBufferSource(); s.buffer=A.noise; s.loop=true; const f=A.ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=1400; f.Q.value=.4; const g=A.ctx.createGain(); g.gain.value=.012; s.connect(f).connect(g).connect(A.master); s.start(); A.static={s,g}; },
  /* finale: a low drone that swells while the hand moves to BAN, a heartbeat that speeds up, a gasp, one doorbell, a camera shutter */
  droneOn(){ if(!A.ctx||A.drone) return; const t=A.ctx.currentTime, g=A.ctx.createGain(), f=A.ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.setValueAtTime(120,t); f.frequency.linearRampToValueAtTime(900,t+6);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.16,t+5.5); const os=[55,58.3,82.4].map((fr,i)=>{ const o=A.ctx.createOscillator(); o.type=i===2?'triangle':'sawtooth'; o.frequency.value=fr; o.connect(f); o.start(); return o; });
    f.connect(g).connect(A.master); A.drone={g,os}; },
  droneOff(){ if(!A.drone||!A.ctx) return; const d=A.drone, t=A.ctx.currentTime; A.drone=null; d.g.gain.cancelScheduledValues(t); d.g.gain.setValueAtTime(d.g.gain.value,t); d.g.gain.linearRampToValueAtTime(0,t+.08); d.os.forEach(o=>{ try{o.stop(t+.1);}catch(e){} }); },
  heart(n){ let d=0; for(let i=0;i<n;i++){ tone(52,.13,'sine',.45,34,d); tone(46,.11,'sine',.3,30,d+.2); d+=Math.max(.42,.95-i*.06); } },
  breath(){ noiseBurst(.45,.22,'bandpass',1100,.8,0); noiseBurst(.9,.12,'bandpass',700,.7,.6); noiseBurst(.6,.1,'bandpass',900,.7,1.9); noiseBurst(1.1,.08,'bandpass',650,.7,2.6); },
  doorbell(){ tone(659,1.1,'sine',.3,null,0); tone(1318,.6,'sine',.07,null,0); tone(523,1.6,'sine',.3,null,.55); tone(1046,.8,'sine',.07,null,.55); },   /* 23.11: was .12 - easy to miss under the music */
  shutter(){ noiseBurst(.04,.25,'highpass',3000,1,0); tone(1600,.03,'square',.05,null,0); noiseBurst(.05,.2,'highpass',2500,1,.09); },
  softKnock(){ for(const d of [0,.5,1.0]){ tone(120,.12,'sine',.22,80,d); noiseBurst(.06,.12,'lowpass',700,1,d); } },   /* three calm knocks */
  sirenOn(){ if(!A.ctx||A.siren) return; const t=A.ctx.currentTime, o=A.ctx.createOscillator(), l=A.ctx.createOscillator(), lg=A.ctx.createGain(), f=A.ctx.createBiquadFilter(), g=A.ctx.createGain();
    o.type='triangle'; o.frequency.value=700; l.frequency.value=.55; lg.gain.value=180; l.connect(lg).connect(o.frequency); f.type='lowpass'; f.frequency.value=900;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.025,t+6); o.connect(f).connect(g).connect(A.master); o.start(); l.start(); A.siren={o,l,g,f}; },   /* far away, slowly coming */
  sirenUp(n){ if(!A.siren||!A.ctx) return; const t=A.ctx.currentTime; A.siren.g.gain.cancelScheduledValues(t); A.siren.g.gain.setValueAtTime(A.siren.g.gain.value,t); A.siren.g.gain.linearRampToValueAtTime(.025+.03*n,t+.8); A.siren.f.frequency.setTargetAtTime(900+700*n,t,.3); },
  sirenOff(){ if(!A.siren||!A.ctx) return; const s=A.siren, t=A.ctx.currentTime; A.siren=null; s.g.gain.cancelScheduledValues(t); s.g.gain.setValueAtTime(s.g.gain.value,t); s.g.gain.linearRampToValueAtTime(0,t+.4); try{ s.o.stop(t+.5); s.l.stop(t+.5); }catch(e){} },
  staticOff(){ if(A.static){ try{A.static.s.stop();}catch(e){} A.static=null; } }
};

// ======================= MIA'S STREAM MUSIC (diegetic lo-fi) + HER MUMBLE =======================
// The lo-fi plays *inside her stream*. It warps like chewed tape when he is close, gets quieter as she panics,
// and cuts out completely when he is behind her. Everything is synthesised and goes through A.master,
// so pause / ads / hidden tab silence it together with the rest.
const MUS={src:null,on:true,bus:null,lp:null,next:0,step:0,bar:0,vol:0,wob:0,cut:0};
const BPM=74, BEAT=60/BPM, STEP=BEAT/2;               // 8th-note grid
const midi=n=>440*Math.pow(2,(n-69)/12);
// Fmaj9 – Em7 – Dm9 – Cmaj7 (soft, a bit melancholic)
const CHORDS=[[53,57,60,64,67],[52,55,59,62],[50,53,57,60,64],[48,52,55,59]], ROOTS=[41,40,38,36];
const MELO=[72,74,76,79,81,84];
function musicInit(){
  if(!A.ctx||MUS.bus) return;
  MUS.lp=A.ctx.createBiquadFilter(); MUS.lp.type='lowpass'; MUS.lp.frequency.value=5200; MUS.lp.Q.value=.4;
  MUS.bus=A.ctx.createGain(); MUS.bus.gain.value=0; MUS.lp.connect(MUS.bus).connect(A.mus);
  MUS.next=A.ctx.currentTime+.1;
}
function setVol(k,v){ PROG.vol=Object.assign({},VOL_DEF,PROG.vol||{}); PROG.vol[k]=clamp(Math.round(v*100)/100,0,1); applyVol(); }
function mNote(f,t,dur,vol,type,det){ // one soft keys/bass note
  const o=A.ctx.createOscillator(); o.type=type; o.frequency.value=f; o.detune.value=det;
  const g=A.ctx.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.025); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(MUS.lp); o.start(t); o.stop(t+dur+.05);
}
function mNoise(t,dur,vol,type,freq,q){
  const s=A.ctx.createBufferSource(); s.buffer=A.noise; const f=A.ctx.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q||1;
  const g=A.ctx.createGain(); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(f).connect(g).connect(MUS.lp); s.start(t,Math.random()*1.5); s.stop(t+dur+.05);
}
function mKick(t){ const o=A.ctx.createOscillator(); o.frequency.setValueAtTime(120,t); o.frequency.exponentialRampToValueAtTime(42,t+.18);
  const g=A.ctx.createGain(); g.gain.setValueAtTime(.55,t); g.gain.exponentialRampToValueAtTime(.0001,t+.3); o.connect(g).connect(MUS.lp); o.start(t); o.stop(t+.35); }
function scheduleStep(t){
  const s=MUS.step%16, ch=(MUS.bar%4), det=MUS.wob*Math.sin(t*1.7)*55+(Math.random()-.5)*MUS.wob*30; // tape wobble in cents
  if(s===0){ CHORDS[ch].forEach((n,i)=>{ mNote(midi(n),t+i*.018,BEAT*3.6,.065,'triangle',det); mNote(midi(n)*2,t+i*.018,BEAT*1.4,.012,'sine',det); }); }
  if(s===10 && Math.random()<.6){ CHORDS[ch].slice(1,4).forEach((n,i)=>mNote(midi(n),t+i*.02,BEAT*1.6,.03,'triangle',det)); }
  if(s===0||s===6||(s===10&&Math.random()<.5)) mNote(midi(ROOTS[ch]),t,BEAT*1.8,.16,'sine',det*.5);
  if(s===0||s===7||s===10) mKick(t);
  if(s===4||s===12) mNoise(t,.16,.12,'bandpass',1500,.9);
  if(s%2===0) mNoise(t+(s%4===2?STEP*.18:0),.04,.03,'highpass',7500);           // swung hats
  if(s%4===2 && Math.random()<.35) mNote(midi(MELO[(Math.random()*MELO.length)|0]),t,BEAT*1.2,.028,'sine',det);
  if(Math.random()<.18) mNoise(t+Math.random()*STEP,.012,.06,'highpass',2500);     // vinyl crackle
  MUS.step++; if(MUS.step%16===0) MUS.bar++;
}
/* ======================= MUSIC TRACKS (11.11, author's tracks) =======================
   MUSIC_DATA (js/musicdata.js, tools/music.py): menu + one loop per night. Decoded lazily (only the menu and
   the current night are kept decoded - a decoded minute of stereo is ~20 MB). Loop region = [pad, pad+len].
   If a track is missing, the synthesized music below plays as before. */
const TRK={buf:{},busy:{}};
function trackName(N){
  if(!N) return 'monday';
  if(N.endless) return {blackout:'sunday',raid:'saturday',surge:'tuesday',cold:'thursday'}[N.mod]||(N.idx%2?'wednesday':'monday');
  return {mon:'monday',tue:'tuesday',wed:'wednesday',thu:'thursday',fri:'friday',sat:'saturday',sun:'sunday',mon2:'againmonday'}[N.key]||'monday';
}
function hasTrack(n){ return typeof MUSIC_DATA!=='undefined' && !!MUSIC_DATA[n]; }
function trackGet(n,keep){   /* returns the decoded buffer or null (and starts decoding) */
  if(TRK.buf[n]) return TRK.buf[n];
  if(TRK.busy[n]||!A.ctx||!hasTrack(n)) return null;
  TRK.busy[n]=true;
  try{
    const bin=atob(MUSIC_DATA[n].mp3.split(',')[1]), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
    A.ctx.decodeAudioData(u.buffer,b=>{ TRK.busy[n]=false; for(const k in TRK.buf) if(k!=='menu'&&k!==n&&k!==keep) delete TRK.buf[k]; TRK.buf[n]=b; },()=>{ TRK.busy[n]=false; TRK.buf[n]=null; });
  }catch(e){ TRK.busy[n]=false; }
  return null;
}
function trackPlay(n,dst){
  const d=MUSIC_DATA[n], s=A.ctx.createBufferSource(); s.buffer=TRK.buf[n]; s.loop=true; s.loopStart=d.pad; s.loopEnd=d.pad+d.len;
  s.connect(dst); s.start(A.ctx.currentTime+.02,d.pad); s._n=n; return s;
}
function trackStop(s){ if(!s) return; try{ s.stop(); s.disconnect(); }catch(e){} }

/* ======================= MENU THEME (11.11) =======================
   Not Mia's lo-fi: a slow music-box lullaby over a warm pad, A minor, 60 bpm, no drums.
   Am9 - Fmaj7 - Dm9 - E7sus4>E7. Now and then one music-box note is slightly out of tune (unsettling).
   Plays while the menu is open and no night is running; goes through the Music slider (A.mus). */
const MM={src:null,bus:null,lp:null,next:0,step:0,bar:0,vol:0,force:false};
const MM_BEAT=1, MM_STEP=MM_BEAT/2;
const MM_CH=[[57,60,64,67,71],[53,57,60,64],[50,53,57,60,64],[52,57,59,64]], MM_RT=[45,41,38,40];
/* 16 eighth-notes per bar, 0 = rest; two bars of melody that alternate */
const MM_MEL=[[76,0,0,72,0,74,0,0, 76,0,79,0,0,0,0,0],[77,0,0,76,0,72,0,0, 74,0,0,0,69,0,0,0],
              [74,0,0,72,0,69,0,0, 72,0,74,0,0,0,0,0],[71,0,0,72,0,74,0,0, 68,0,0,0,0,0,0,0]];
function mmInit(){
  if(!A.ctx||MM.bus) return;
  MM.lp=A.ctx.createBiquadFilter(); MM.lp.type='lowpass'; MM.lp.frequency.value=4200; MM.lp.Q.value=.3;
  MM.bus=A.ctx.createGain(); MM.bus.gain.value=0; MM.lp.connect(MM.bus).connect(A.mus);
  MM.next=A.ctx.currentTime+.2;
}
function mmBox(f,t,v,det){ /* music box: sine + a bright 4th partial, quick decay */
  const c=A.ctx, g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.006); g.gain.exponentialRampToValueAtTime(.0001,t+1.6); g.connect(MM.lp);
  const o=c.createOscillator(); o.frequency.value=f; o.detune.value=det; o.connect(g);
  const o2=c.createOscillator(); o2.frequency.value=f*4.02; o2.detune.value=det; const g2=c.createGain(); g2.gain.setValueAtTime(.18,t); g2.gain.exponentialRampToValueAtTime(.0001,t+.35); o2.connect(g2).connect(g);
  o.start(t); o2.start(t); o.stop(t+1.7); o2.stop(t+.4);
}
function mmPad(notes,t,dur){
  const c=A.ctx, f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=900; f.connect(MM.lp);
  const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.05,t+1.2); g.gain.setValueAtTime(.05,t+dur-1); g.gain.linearRampToValueAtTime(0,t+dur+.3); g.connect(f);
  notes.forEach((n,i)=>[-7,7].forEach(d=>{ const o=c.createOscillator(); o.type='triangle'; o.frequency.value=midi(n); o.detune.value=d; o.connect(g); o.start(t); o.stop(t+dur+.4); }));
}
function mmStep(t){
  const s=MM.step%16, ch=MM.bar%4;
  if(s===0){ mmPad(MM_CH[ch].slice(0,4),t,MM_BEAT*8); mNoteMM(midi(MM_RT[ch]),t,MM_BEAT*6,.11); }
  if(s===8) mNoteMM(midi(MM_RT[ch]+7),t,MM_BEAT*3,.05);
  const n=MM_MEL[(MM.bar%4)][s];
  if(n){ const off=Math.random()<.08?(Math.random()<.5?-38:38):0;   /* an out-of-tune note now and then */
    mmBox(midi(n),t,.1,off); if(MM.bar%8>=4 && s===0) mmBox(midi(n-12),t+.01,.035,0); }
  if(ch===3 && s===12) mmBox(midi(68),t,.05,0);                    /* E7: the G# */
  MM.step++; if(MM.step%16===0) MM.bar++;
}
function mNoteMM(f,t,dur,v){ const c=A.ctx, o=c.createOscillator(); o.frequency.value=f; const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.08); g.gain.exponentialRampToValueAtTime(.0001,t+dur); o.connect(g).connect(MM.lp); o.start(t); o.stop(t+dur+.05); }
function menuMusicTick(dt){
  if(!A.ctx) return; mmInit(); if(!MM.bus) return;
  const open=MM.force||(!$('ovMenu').hidden&&!(S&&S.running));
  const want=open&&MUS.on?(menuView==='main'?.42:.3)*(hasTrack('menu')?1.15:1):0;
  if(want && hasTrack('menu') && !MM.src) trackGet('menu');
  MM.vol+=(want-MM.vol)*Math.min(1,dt*(want>MM.vol?.6:2.5));      /* slow fade in, quick fade out when a night starts */
  const now=A.ctx.currentTime; setT(MM.bus.gain,MM.vol,now,.08);
  if(MM.vol<.005){ MM.next=now+.2; MM.step=0; MM.bar=0; if(MM.src&&!want){ trackStop(MM.src); MM.src=null; } return; }
  if(hasTrack('menu')){   /* the author's menu track */
    if(!MM.src){ if(trackGet('menu')) MM.src=trackPlay('menu',MM.lp); }
    return;
  }
  while(MM.next<now+.3){ mmStep(Math.max(MM.next,now)); MM.next+=MM_STEP; }
}
function musicTick(dt){
  if(!A.ctx) return; musicInit(); if(!MUS.bus) return;
  const live=S&&S.running&&!S.over;
  const st=live?S.st:null, behind=st&&st.stage==='behind';
  const near=st?(st.stage==='window'?st.p:st.stage==='door'||st.stage==='closet'?.5+.5*st.p:behind?1:0):0;
  MUS.wob += ((near>.3?Math.min(1,near):0)-MUS.wob)*Math.min(1,dt*1.5);
  const want = (!MUS.on||!live||behind) ? 0 : .45*(1-.65*Math.min(1,S.panic/100))*(1-.55*Math.min(1,near));   /* ducks while he is close, comes back when he leaves */
  MUS.vol += (want-MUS.vol)*Math.min(1,dt*(behind?6:1.2));
  const now=A.ctx.currentTime;
  MUS.bus.gain.setTargetAtTime(MUS.vol,now,.05);
  MUS.lp.frequency.setTargetAtTime(5200-3800*Math.min(1,near),now,.3);              // muffled as he gets close
  if(live){ const tn=trackName(S.night); if(hasTrack(tn)){ const b=trackGet(tn,'menu');
      if(MUS.src&&MUS.src._n!==tn){ trackStop(MUS.src); MUS.src=null; }
      if(b && !MUS.src && MUS.vol>.005) MUS.src=trackPlay(tn,MUS.lp);
      if(MUS.src){ if(MUS.wob>.01) MUS.src.detune.setTargetAtTime(MUS.wob*Math.sin(now*1.7)*45,now,.05); else setT(MUS.src.detune,0,now,.1); }   /* tape wobble when he is close */
      if(MUS.vol<.005 && MUS.src && !want){ trackStop(MUS.src); MUS.src=null; }
      return; } }
  else if(MUS.src && MUS.vol<.005){ trackStop(MUS.src); MUS.src=null; }
  if(MUS.vol<.005){ MUS.next=now+.1; return; }                                       // silent: don't schedule
  while(MUS.next<now+.25){ scheduleStep(Math.max(MUS.next,now)); MUS.next+=STEP; }
}
// Mia's voice: Animal-Crossing-style syllables under her subtitles; calm = lower and slower, scared = higher and faster
/* Mia's voice v4 (10.11): written by another AI from the author's prompt, pasted as is.
   Pitch per mood: basePitch 197 / 211 / 228; softness: softFilter lowpass 3800; articulation: formant weights; tempo: baseDuration. */
function mumbleSynth(n, quiet) {
    if (typeof A === "undefined" || !A.ctx || !A.master) return;

    const ctx = A.ctx;
    const panicValue = typeof S !== "undefined" && S ? Number(S.panic) : 0;
    const panic = Math.max(0, Math.min(100, Number.isFinite(panicValue) ? panicValue : 0));
    const count = Math.max(3, Math.min(14, Math.round(Number(n) || 3)));
    const rand = (a, b) => a + Math.random() * (b - a);

    const calm = panic <= 40;
    const medium = panic > 40 && panic < 75;
    const scared = panic >= 75;

    const basePitch = (scared ? 228 : medium ? 211 : 197) + rand(-3, 3);
    const baseDuration = (scared ? 0.155 : medium ? 0.178 : 0.205) * (quiet ? 0.86 : 1);
    const gap = (scared ? 0.008 : 0.014) * (quiet ? 0.85 : 1);
    const peak = quiet ? 0.048 : scared ? 0.084 : medium ? 0.076 : 0.070;

    const hasSigh = medium && !!A.noise && Math.random() < 0.20;
    const hasLaugh = calm && !quiet && Math.random() < 0.15;

    const t0 = ctx.currentTime + 0.025;
    const voiceStart = t0 + (hasSigh ? 0.205 : 0.025);

    /* main voiced source */
    const voice = ctx.createOscillator();
    voice.type = "sawtooth";
    voice.frequency.setValueAtTime(basePitch, t0);

    /* soft high cut */
    const softFilter = ctx.createBiquadFilter();
    softFilter.type = "lowpass";
    softFilter.frequency.value = 3800;
    softFilter.Q.value = 0.55;

    /* phrase envelope */
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0, t0);

    /* formants: three vocal tract resonances */
    const vowels = [
        [650, 1250, 2650],
        [510, 1850, 2750],
        [370, 2200, 3000],
        [470, 900, 2450],
        [350, 850, 2200]
    ];

    const weights = [0.9, 0.5, 0.18];
    const formants = [];

    const initialVowel = vowels[Math.floor(Math.random() * vowels.length)];

    for (let i = 0; i < 3; i++) {
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(initialVowel[i], t0);
        filter.Q.value = [2.0, 3.0, 3.5][i];

        const gain = ctx.createGain();
        gain.gain.value = weights[i];

        voice.connect(filter);
        filter.connect(gain);
        gain.connect(softFilter);

        formants.push({ filter, gain });
    }

    softFilter.connect(voiceGain);
    voiceGain.connect(A.master);

    /* slight tremble when scared */
    const vibrato = ctx.createOscillator();
    vibrato.type = "sine";
    vibrato.frequency.value = scared ? 5.4 : 4.8;

    const vibratoGain = ctx.createGain();
    vibratoGain.gain.value = (scared ? 2.6 : medium ? 1.4 : 0.55) * (quiet ? 0.75 : 1);

    vibrato.connect(vibratoGain);
    vibratoGain.connect(voice.frequency);

    /* breath and consonants */
    let noiseSource = null;
    let noiseGain = null;
    let noiseHP = null;
    let noiseLP = null;

    if (A.noise) {
        noiseSource = ctx.createBufferSource();
        noiseSource.buffer = A.noise;
        noiseSource.loop = true;

        noiseHP = ctx.createBiquadFilter();
        noiseHP.type = "highpass";
        noiseHP.frequency.value = 650;

        noiseLP = ctx.createBiquadFilter();
        noiseLP.type = "lowpass";
        noiseLP.frequency.value = 4500;

        noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, t0);

        noiseSource.connect(noiseHP);
        noiseHP.connect(noiseLP);
        noiseLP.connect(noiseGain);
        noiseGain.connect(A.master);

        noiseSource.start(t0);
    }

    /* soft sigh before the phrase */
    if (hasSigh && noiseGain) {
        noiseGain.gain.setValueAtTime(0, t0);
        noiseGain.gain.linearRampToValueAtTime(quiet ? 0.005 : 0.009, t0 + 0.075);
        noiseGain.gain.linearRampToValueAtTime(0, t0 + 0.19);
    }

    voice.start(t0);
    vibrato.start(t0);

    /* syllables */
    let cursor = voiceStart;
    let endTime = voiceStart;

    for (let i = 0; i < count; i++) {
        const duration = baseDuration * rand(0.92, 1.08);
        const t = cursor;
        const attack = Math.min(0.018, duration * 0.18);

        voiceGain.gain.setValueAtTime(0, t);
        voiceGain.gain.linearRampToValueAtTime(peak, t + attack);
        voiceGain.gain.linearRampToValueAtTime(peak * 0.86, t + duration * 0.58);
        voiceGain.gain.linearRampToValueAtTime(0, t + duration);

        const pitch = basePitch + rand(-5, 5);

        voice.frequency.setTargetAtTime(pitch, t, 0.025);
        voice.frequency.setTargetAtTime(pitch + rand(1, 4), t + duration * 0.33, 0.035);
        voice.frequency.setTargetAtTime(pitch - rand(0, 3), t + duration * 0.70, 0.04);

        const vowel = vowels[Math.floor(Math.random() * vowels.length)];

        for (let k = 0; k < 3; k++) {
            formants[k].filter.frequency.setTargetAtTime(vowel[k], t, 0.045);
        }

        if (noiseGain) {
            noiseGain.gain.setValueAtTime(0, t);
            noiseGain.gain.linearRampToValueAtTime(quiet ? 0.0025 : 0.004, t + 0.012);
            noiseGain.gain.linearRampToValueAtTime(0, t + 0.05);
        }

        endTime = t + duration;
        cursor = endTime + gap;
    }

    /* sometimes two short soft laugh pulses */
    if (hasLaugh) {
        const laughStart = endTime + 0.085;

        for (let i = 0; i < 2; i++) {
            const t = laughStart + i * 0.105;
            const duration = 0.075;

            voiceGain.gain.setValueAtTime(0, t);
            voiceGain.gain.linearRampToValueAtTime(peak * 0.24, t + 0.018);
            voiceGain.gain.linearRampToValueAtTime(0, t + duration);

            voice.frequency.setTargetAtTime(basePitch + (i === 0 ? 13 : 7), t, 0.02);

            const laughVowel = vowels[i === 0 ? 1 : 3];

            for (let k = 0; k < 3; k++) {
                formants[k].filter.frequency.setTargetAtTime(laughVowel[k], t, 0.025);
            }

            if (noiseGain) {
                noiseGain.gain.setValueAtTime(0, t);
                noiseGain.gain.linearRampToValueAtTime(0.002, t + 0.012);
                noiseGain.gain.linearRampToValueAtTime(0, t + 0.04);
            }

            endTime = t + duration;
        }
    }

    /* stop sources, free connections */
    const stopAt = endTime + 0.06;

    voice.onended = () => {
        voice.disconnect();
        vibrato.disconnect();
        vibratoGain.disconnect();
        softFilter.disconnect();
        voiceGain.disconnect();

        for (const node of formants) {
            node.filter.disconnect();
            node.gain.disconnect();
        }
    };

    if (noiseSource) {
        noiseSource.onended = () => {
            noiseSource.disconnect();
            noiseHP.disconnect();
            noiseLP.disconnect();
            noiseGain.disconnect();
        };

        noiseSource.stop(stopAt);
    }

    voice.stop(stopAt);
    vibrato.stop(stopAt);
}
/* ======================= MIA'S VOICE FROM A REAL RECORDING =======================
   VOX_DATA (js/vox.js, made by tools/vox.py): per set (calm / worried / scared / laugh / sigh) an mp3 of
   syllables glued with gaps + their [start, dur]. Decoded once at audioInit. mumble() plays n random syllables
   back to back, sped up a little (Animal Crossing): calm = gentle, scared = faster and higher with a tremble.
   Sets that are not recorded yet fall back to calm played faster; no data at all -> mumbleSynth(). */
const VOX={};
/* lip sync: syllables Mia is saying right now, in audio time; render.js opens her mouth inside them */
const MOUTH={segs:[],last:-99};
function mouthOpen(){
  if(A.ctx && A.ctx.currentTime-MOUTH.last<8){ const t=A.ctx.currentTime; for(const [a,b] of MOUTH.segs) if(t>=a&&t<b) return true; return false; }
  return captionTimer>0 && (S.t*8)%1<.55;   /* no audio yet: just flap while the caption is up */
}
function voxInit(){
  if(typeof VOX_DATA==='undefined') return;   /* js/vox.js is not in the build while MIA_VOICE=false */
  for(const k in VOX_DATA){
    try{
      const bin=atob(VOX_DATA[k].mp3.split(',')[1]), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
      A.ctx.decodeAudioData(u.buffer,buf=>{
        /* mp3 encoder delay: find where the first syllable really starts and shift all offsets by that */
        const d=buf.getChannelData(0), g=VOX_DATA[k].g; let i=0; while(i<d.length && Math.abs(d[i])<.02) i++;
        const shift=Math.max(-.02,Math.min(.12,i/buf.sampleRate-.004-g[0][0]));
        VOX[k]={buf,g:g.map(([s,l])=>[Math.max(0,s+shift),l]),last:-1};
      },()=>{});
    }catch(e){}
  }
}
function miaSniff(t,quiet){ /* thu, Mia has a cold: a quick sniff through a stuffy nose */
  const c=A.ctx, n=c.createBufferSource(); n.buffer=A.noise; const f=c.createBiquadFilter(); f.type='bandpass'; f.Q.value=1.4;
  f.frequency.setValueAtTime(900,t); f.frequency.linearRampToValueAtTime(1700,t+.22);
  const g=c.createGain(), v=quiet?.05:.09; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.16); g.gain.linearRampToValueAtTime(0,t+.26);
  n.connect(f).connect(g).connect(A.master); n.start(t,Math.random()); n.stop(t+.3);
}
function voxPick(set){ const v=VOX[set]; let i=(Math.random()*v.g.length)|0; if(i===v.last) i=(i+1)%v.g.length; v.last=i; return v.g[i]; }
function voxPlay(set,t,rate,maxOut,vol,trem){ /* one syllable; returns its length on output */
  const c=A.ctx, v=VOX[set], [off,len]=voxPick(set), take=Math.min(len,maxOut*rate), out=take/rate;
  const s=c.createBufferSource(); s.buffer=v.buf; s.playbackRate.value=rate;
  if(trem){ const l=c.createOscillator(); l.frequency.value=7+3*Math.random(); const lg=c.createGain(); lg.gain.value=trem; l.connect(lg).connect(s.playbackRate); l.start(t); l.stop(t+out+.05); }
  const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.008);
  g.gain.setValueAtTime(vol,t+Math.max(.01,out-.03)); g.gain.linearRampToValueAtTime(0,t+out);
  let dst=A.master;
  if(set!=='sigh'&&set!=='laugh'){
    MOUTH.segs.push([t+.01,t+out*.62]); if(MOUTH.segs.length>40) MOUTH.segs.splice(0,MOUTH.segs.length-40); MOUTH.last=t;
    if(S&&S.night&&S.night.mod==='cold'){ const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2200; lp.connect(A.master); dst=lp; }   /* stuffy nose */
  }
  s.connect(g).connect(dst); s.start(t,off,take+.01); s.stop(t+out+.03);
  return out;
}
/* v7 (11.11, author's pick "variant 4"): soft murmured phrases (ElevenLabs), played as random 0.35-0.7 s pieces
   of real phrases - sounds like quiet talking you can't make out. Calm x1.0, worried x1.12, scared x1.25 (+ tremble).
   The mouth flaps on a ~7/s rhythm while a piece plays. */
function voxPiece(t,rate,want,vol,trem){
  const c=A.ctx, v=VOX.phr; let tot=0; for(const g of v.g) tot+=g[1];
  let r=Math.random()*tot, gi=0; while(gi<v.g.length-1 && r>v.g[gi][1]){ r-=v.g[gi][1]; gi++; }   /* longer phrases more often */
  const [off,len]=v.g[gi], take=Math.min(len,want), st=off+Math.random()*Math.max(0,len-take), out=take/rate;
  const s=c.createBufferSource(); s.buffer=v.buf; s.playbackRate.value=rate;
  if(trem){ const l=c.createOscillator(); l.frequency.value=7+3*Math.random(); const lg=c.createGain(); lg.gain.value=trem; l.connect(lg).connect(s.playbackRate); l.start(t); l.stop(t+out+.05); }
  const g=c.createGain(), fi=Math.min(.03,out*.2), fo=Math.min(.07,out*.3);
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+fi); g.gain.setValueAtTime(vol,t+out-fo); g.gain.linearRampToValueAtTime(0,t+out);
  let dst=A.master;
  if(S&&S.night&&S.night.mod==='cold'){ const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2200; lp.connect(A.master); dst=lp; }
  s.connect(g).connect(dst); s.start(t,st,take+.01); s.stop(t+out+.03);
  for(let q=t+.02;q<t+out-.05;q+=.14+Math.random()*.04){ MOUTH.segs.push([q,q+.085]); } if(MOUTH.segs.length>60) MOUTH.segs.splice(0,MOUTH.segs.length-60); MOUTH.last=t;
  return out;
}
/* v8 (11.11, author's pick "v4_B Animal Crossing"): soft separate syllables (ElevenLabs "Nataly"),
   random order, sped up x1.3 and cut short (0.15 s each) - calm; worried x1.43 / 0.135 s; scared x1.59 / 0.12 s + tremble.
   Pitch wobbles +-4% per syllable and sinks ~6% towards the end of a line; now and then a short pause like between words. */
function mumbleNat(n,quiet){
  const p=(S&&S.panic)||0, k=Math.min(1,p/85), cold=S&&S.night&&S.night.mod==='cold';
  const mood=p>=75?1.22:p>40?1.1:1, rate0=1.3*mood*(cold?.94:1), outLen=.15/(p>=75?1.25:p>40?1.11:1);
  const vol=(quiet?.17:.3)*.8, trem=k>.6?.035*k:0, cnt=Math.max(2,Math.min(14,n|0));
  let t=A.ctx.currentTime+.03;
  if(cold && Math.random()<(quiet?.2:.35)){ miaSniff(t,quiet); t+=.32; }
  for(let i=0;i<cnt;i++){
    const r=rate0*(.96+Math.random()*.08)*(1-.06*i/cnt);
    t+=voxPlay('nat',t,r,outLen,vol*(.9+Math.random()*.2),trem)+.012+(Math.random()<.12?.06:0);
  }
}
function mumblePhr(n,quiet){
  const p=(S&&S.panic)||0, k=Math.min(1,p/85), cold=S&&S.night&&S.night.mod==='cold';
  const rate=(p>=75?1.25:p>40?1.12:1)*(cold?.94:1), vol=quiet?.17:.3, trem=k>.6?.035*k:0;
  const dur=Math.max(.45,Math.min(2.4,n*.13))*(quiet?.75:1);
  let t=A.ctx.currentTime+.03, end=t+dur;
  if(VOX.sigh && p>=35 && p<80 && Math.random()<.2){ t+=voxPlay('sigh',t,1,1.2,vol*.7,0)+.05; end=t+dur; }
  else if(cold && Math.random()<(quiet?.2:.35)){ miaSniff(t,quiet); t+=.32; end=t+dur; }
  while(t<end-.15){ t+=voxPiece(t,rate*(.97+Math.random()*.06),.35+Math.random()*.35,vol*(.9+Math.random()*.2),trem)+.05+Math.random()*.05; }
}
/* 11.11: Mia's voice switched off by the author - subtitles only; the mouth still flaps while a caption is up (mouthOpen fallback). Set true to bring it back (and put js/vox.js back into index.html). */
const MIA_VOICE=true;   /* back on 11.11 with the Nataly syllables (v4_B) */
function mumble(n,quiet){
  if(!MIA_VOICE||!A.ctx) return;
  if(VOX.nat){ mumbleNat(n,quiet); return; }
  if(VOX.phr){ mumblePhr(n,quiet); return; }
  if(!VOX.calm){ mumbleSynth(n,quiet); return; }
  const p=(S&&S.panic)||0, k=Math.min(1,p/85);
  const set=p>=75&&VOX.scared?'scared':p>40&&VOX.worried?'worried':'calm', own=set!=='calm';
  /* calm set standing in for worried/scared: play it faster and higher */
  const cold=S&&S.night&&S.night.mod==='cold';
  const rate0=(own?1.15:1.18+.32*k)*(cold?.93:1), maxOut=.17-.05*k, vol=quiet?.16:.3, trem=k>.6?.04*k:0;
  let t=A.ctx.currentTime+.03;
  if(VOX.sigh && p>=35 && p<80 && Math.random()<.2){ t+=voxPlay('sigh',t,1,1.2,vol*.7,0)+.05; }
  else if(cold && Math.random()<(quiet?.2:.35)){ miaSniff(t,quiet); t+=.32; }
  const cnt=Math.max(2,Math.min(14,n|0));
  for(let i=0;i<cnt;i++){
    const r=rate0*(1+(Math.random()-.5)*.1)*(1-.05*i/cnt);    /* phrase sinks a little at the end */
    t+=voxPlay(set,t,r,maxOut,vol*(.85+Math.random()*.3),trem)*.9+(Math.random()<.12?.07:.005);
  }
  if(VOX.laugh && p<30 && Math.random()<(quiet?.1:.15)) voxPlay('laugh',t+.08,1.05,.8,vol*.8,0);
}
let murmurT=8;
function murmurTick(dt){ // she chats with her viewers between lines
  if(!S||!S.running||S.tut.active||S.mia.awayT>0||S.panic>60||captionTimer>0) return;
  murmurT-=dt; if(murmurT<=0){ murmurT=rnd(7,14); mumble(3+((Math.random()*4)|0),true); }
}

/* ======================= NIGHT AMBIENCE (always under the night) =======================
   room hum (mains + fridge-ish), wind behind the window (gusts), a distant car now and then,
   rain on the glass on fri / sun (and a blackout endless night). Blackout night: the power
   drops for a few seconds now and then - the hum cuts to dead silence, then comes back.
   Window is on the left of the room, so outside sounds are panned left.
   Everything goes through A.master: pause / ads / hidden tab silence it with the rest. */
const AMB={open:0,cr:[],crK:0,bus:null,hum:null,wind:null,rain:null,drops:null,vol:0,gust:0,gustT:0,gustTo:.4,carT:14,dropAcc:0,rainOn:false,cutT:0,cutNext:0,cutOn:false,key:null};
function ambPan(v){ if(A.ctx.createStereoPanner){ const p=A.ctx.createStereoPanner(); p.pan.value=v; return p; } return A.ctx.createGain(); }
function ambLoop(){ const s=A.ctx.createBufferSource(); s.buffer=A.noise; s.loop=true; s.start(0,Math.random()*1.5); return s; }
function ambInit(){
  const c=A.ctx; AMB.bus=c.createGain(); AMB.bus.gain.value=0; AMB.bus.connect(A.master);
  /* room hum: low rumble + 50/100 Hz mains */
  AMB.hum=c.createGain(); AMB.hum.gain.value=1; AMB.hum.connect(AMB.bus);
  const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=260; const ng=c.createGain(); ng.gain.value=.05; ambLoop().connect(lp).connect(ng).connect(AMB.hum);
  [[50,.012],[100,.006],[150,.0022]].forEach(([f,v])=>{ const o=c.createOscillator(); o.frequency.value=f; const g=c.createGain(); g.gain.value=v; o.connect(g).connect(AMB.hum); o.start(); });
  /* wind: band-passed noise, frequency and level follow the gusts */
  const out=ambPan(-.45); out.connect(AMB.bus);
  const wf=c.createBiquadFilter(); wf.type='bandpass'; wf.frequency.value=260; wf.Q.value=1.6;
  const wg=c.createGain(); wg.gain.value=0; ambLoop().connect(wf).connect(wg).connect(out);
  const wh=c.createBiquadFilter(); wh.type='bandpass'; wh.frequency.value=1300; wh.Q.value=6;   /* thin whistle in the frame */
  const whg=c.createGain(); whg.gain.value=0; ambLoop().connect(wh).connect(whg).connect(out);
  AMB.wind={f:wf,g:wg,wh,whg,out};
  /* rain: steady hiss on the glass + a soft low wash; drops are scheduled in ambTick */
  const rh=c.createBiquadFilter(); rh.type='highpass'; rh.frequency.value=1400; const rl=c.createBiquadFilter(); rl.type='lowpass'; rl.frequency.value=6500;
  const rb=c.createGain(); rb.gain.value=.8; rb.connect(out);   /* rain bus: -20% (author, 10.11) */
  const rg=c.createGain(); rg.gain.value=0; ambLoop().connect(rh).connect(rl).connect(rg).connect(rb);
  const rw=c.createBiquadFilter(); rw.type='lowpass'; rw.frequency.value=700; const rwg=c.createGain(); rwg.gain.value=0; ambLoop().connect(rw).connect(rwg).connect(rb);
  AMB.rain={g:rg,wg:rwg,bus:rb};
  ambRainLoop();
}
function ambDrop(t,c,dst){ /* one drop on the glass */
  c=c||A.ctx; dst=dst||AMB.rain.bus; const s=c.createBufferSource(); s.buffer=A.noise; const f=c.createBiquadFilter(); f.type='bandpass'; f.frequency.value=2200+Math.random()*3800; f.Q.value=3+Math.random()*5;
  const g=c.createGain(), v=.005+Math.random()*.018; g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+.02+Math.random()*.03);
  s.connect(f).connect(g).connect(dst); s.start(t,Math.random()*1.8); s.stop(t+.08);
}
function ambDrip(t,c,dst){ /* water dripping off the sill / gutter: short tonal plink - the sound that says "rain" */
  c=c||A.ctx; dst=dst||AMB.rain.bus; const o=c.createOscillator(), f=1400+Math.random()*1800; o.frequency.setValueAtTime(f,t); o.frequency.exponentialRampToValueAtTime(f*.55,t+.05);
  const g=c.createGain(), v=.008+Math.random()*.014; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.003); g.gain.exponentialRampToValueAtTime(.0001,t+.07+Math.random()*.05);
  o.connect(g).connect(dst); o.start(t); o.stop(t+.14);
}
function ambTap(t,c,dst){ /* heavier drop hitting the metal sill */
  c=c||A.ctx; dst=dst||AMB.rain.bus; const s=c.createBufferSource(); s.buffer=A.noise; const f=c.createBiquadFilter(); f.type='bandpass'; f.frequency.value=700+Math.random()*700; f.Q.value=8;
  const g=c.createGain(); g.gain.setValueAtTime(.03+Math.random()*.03,t); g.gain.exponentialRampToValueAtTime(.0001,t+.04);
  s.connect(f).connect(g).connect(dst); s.start(t,Math.random()*1.8); s.stop(t+.06);
}
/* perf (11.11): drops / drips / taps are rendered once into a 6 s loop instead of ~50 new nodes a second */
function ambRainLoop(){
  const OC=window.OfflineAudioContext||window.webkitOfflineAudioContext; if(!OC) return;
  const sr=A.ctx.sampleRate, L=6, oc=new OC(1,sr*L,sr), out=oc.createGain(); out.connect(oc.destination);
  for(let t=.02;t<L-.1;t+=1/40*(.5+Math.random())) ambDrop(t,oc,out);
  for(let t=.1;t<L-.2;t+=1/2.2*(.4+Math.random()*1.2)) ambDrip(t,oc,out);
  for(let t=.2;t<L-.1;t+=1/1.4*(.4+Math.random()*1.2)) ambTap(t,oc,out);
  const done=buf=>{ const s=A.ctx.createBufferSource(); s.buffer=buf; s.loop=true; AMB.rainTex=A.ctx.createGain(); AMB.rainTex.gain.value=0; s.connect(AMB.rainTex).connect(AMB.rain.bus); s.start(); };
  try{ const pr=oc.startRendering(); if(pr&&pr.then) pr.then(done); else oc.oncomplete=e=>done(e.renderedBuffer); }catch(e){}
}
/* perf: only touch an AudioParam when the value really changed (was ~600 automation events a second) */
function setT(p,v,now,tc){ if(p._v!==undefined && Math.abs(p._v-v)<=Math.max(1e-5,Math.abs(v)*.01)) return; p._v=v; p.setTargetAtTime(v,now,tc); }
function ambCar(k){ k=k||1; /* a car passing far away: engine rumble + tyre hiss swell and fade, left to right */
  const c=A.ctx, t=c.currentTime, d=5+Math.random()*3, peak=.35+Math.random()*.25, p=ambPan(-.7);
  if(p.pan) p.pan.linearRampToValueAtTime(.5,t+d);
  const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(peak*k,t+d*.5); g.gain.linearRampToValueAtTime(0,t+d); g.connect(p).connect(AMB.bus);
  const s=c.createBufferSource(); s.buffer=A.noise; s.loop=true; const f=c.createBiquadFilter(); f.type='lowpass'; f.Q.value=.7;
  f.frequency.setValueAtTime(220,t); f.frequency.linearRampToValueAtTime(650,t+d*.5); f.frequency.linearRampToValueAtTime(240,t+d);
  const ng=c.createGain(); ng.gain.value=.09; s.connect(f).connect(ng).connect(g); s.start(t,Math.random()); s.stop(t+d+.1);
  const o=c.createOscillator(); o.type='sawtooth'; const of=c.createBiquadFilter(); of.type='lowpass'; of.frequency.value=120;
  o.frequency.setValueAtTime(46,t); o.frequency.linearRampToValueAtTime(52,t+d*.5); o.frequency.linearRampToValueAtTime(40,t+d);
  const og=c.createGain(); og.gain.value=.03; o.connect(of).connect(og).connect(g); o.start(t); o.stop(t+d+.1);
}
function nightRain(N){ N=N||{}; return N.key==='fri'||N.key==='sun'||(!!N.endless&&N.mod==='blackout'); }
function ambCrickets(dt,now,k){
  /* 3 crickets in different spots; each chirps 3-4 short 4-5 kHz pulses every ~0.9 s */
  if(!AMB.cr.length) for(let i=0;i<3;i++) AMB.cr.push({f:4100+Math.random()*700,pan:-.8+i*.5+Math.random()*.2,per:.8+Math.random()*.35,t:Math.random()*2,on:Math.random()<.8});
  for(const c of AMB.cr){
    c.t-=dt; if(c.t>0) continue; c.t=c.per*(.95+Math.random()*.1);
    if(Math.random()<.02) c.on=!c.on; if(!c.on) continue;   /* now and then one goes quiet or starts again */
    const ctx=A.ctx, p=ambPan(c.pan); p.connect(AMB.bus); const o=ctx.createOscillator(); o.frequency.value=c.f; const g=ctx.createGain(); g.gain.value=0;
    const n=3+(Math.random()<.5?1:0), v=.0035*k;
    for(let i=0;i<n;i++){ const t=now+.02+i*.032; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.004); g.gain.linearRampToValueAtTime(0,t+.018); }
    o.connect(g).connect(p); o.start(now); o.stop(now+.04+n*.032);
  }
}
function ambTick(dt){
  if(!A.ctx||!AMB.bus) return;
  const c=A.ctx, now=c.currentTime, menu=typeof menuLiveOn==='function'&&menuLiveOn(), live=(S&&S.running&&!S.over)||menu;   /* the live menu has the night outside too */
  const N=S&&S.night||{}, key=N.key;
  if(key!==AMB.key){ AMB.key=key; AMB.cutT=0; AMB.cutOn=N.mod==='blackout'; AMB.cutNext=20+Math.random()*20; AMB.carT=8+Math.random()*12; }
  AMB.rainOn = nightRain(N);
  /* window open: the street gets louder and brighter */
  AMB.open += ((live&&S.winOpen?1:0)-AMB.open)*Math.min(1,dt*1.5);
  const openK=1+1.3*AMB.open, windK=AMB.rainOn?1.35:N.hot?.35:1;
  /* menu / desk / end screens: only a faint room tone; night: full */
  const want = menu?.75:live?1:((typeof FIN!=='undefined'&&FIN.active)?0:.3);
  AMB.vol += (want-AMB.vol)*Math.min(1,dt*(live?.8:2));
  setT(AMB.bus.gain,AMB.vol,now,.1);
  /* blackout: the power drops for 3-5 s, hum cuts dead, everything outside goes thin */
  let hum=1, outside=1;
  if(live && !menu && AMB.cutOn){
    if(AMB.cutT>0){ AMB.cutT-=dt; hum=0; outside=.25; if(AMB.cutT<=0){ AMB.cutNext=35+Math.random()*30; S.glitch=Math.max(S.glitch||0,.15); noiseBurst(.05,.12,'bandpass',900,2); } }
    else { AMB.cutNext-=dt; if(AMB.cutNext<=0){ AMB.cutT=3+Math.random()*2; hum=0; outside=.25; S.glitch=Math.max(S.glitch||0,.2); noiseBurst(.04,.15,'highpass',2500,1); } }
  }
  if(hum===0){ if(AMB.hum.gain._v!==0){ AMB.hum.gain.cancelScheduledValues(now); AMB.hum.gain.setValueAtTime(0,now); AMB.hum.gain._v=0; } } else setT(AMB.hum.gain,1,now,.15);
  /* gusts: random walk toward a new target every few seconds */
  AMB.gustT-=dt; if(AMB.gustT<=0){ AMB.gustT=2+Math.random()*5; AMB.gustTo=Math.random()<.25?.8+Math.random()*.2:.15+Math.random()*.45; }
  AMB.gust+=(AMB.gustTo-AMB.gust)*Math.min(1,dt*.6);
  const w=AMB.wind, g=AMB.gust, rainK=AMB.rainOn?1:0;
  setT(w.g.gain,(.01+.055*g*g)*outside*windK*openK,now,.3);   /* v2 11.11: quieter, mostly between gusts it is almost gone (read as rain) */
  setT(w.f.frequency,180+340*g,now,.4);
  setT(w.whg.gain,(g>.75?(g-.75)*.12:0)*outside*windK*(1-.8*AMB.open),now,.5);   /* the frame only whistles when it is shut */
  setT(w.wh.frequency,1100+400*g,now,.6);
  setT(AMB.rain.g.gain,.014*rainK*outside*(.85+.3*g)*openK,now,.5);
  setT(AMB.rain.wg.gain,.05*rainK*outside*openK,now,.5);
  if(AMB.rainTex) setT(AMB.rainTex.gain,rainK*outside*openK*(.8+.35*g),now,.4);
  if(!live) return;
  /* drops on the glass (fallback if the rain loop is not rendered yet) */
  if(!AMB.rainTex && rainK){ AMB.dropAcc+=dt*(30+20*g); while(AMB.dropAcc>=1){ AMB.dropAcc-=1; ambDrop(now+Math.random()*.1); } }
  /* distant car (rarer in the rain, never during a power cut) */
  AMB.carT-=dt; if(AMB.carT<=0){ AMB.carT=(rainK?35:24)+Math.random()*30; if(AMB.cutT<=0) ambCar(openK); }
  /* August crickets: dry nights only, louder on hot nights and with the window open */
  if(!rainK) ambCrickets(dt,now,(N.hot?1.5:1)*openK*outside);
}

/* ======================= ADAPTIVE TENSION =======================
   danger = how close he is (same scale as the music: window p, door/closet .5+, behind 1).
   - low drone: two detuned saws + a sub sine, fades in from danger .25, opens its filter as he gets closer;
     behind her a dissonant upper tone joins in;
   - heartbeat: from danger .5 or panic 70+, faster the worse it gets (1.05 s -> .42 s between beats);
   - ringing in the ears: thin wavering high tone when panic > 60.
   Everything fades out when the night is not running (pause suspends the context anyway). */
const TEN={bus:null,dr:null,lp:null,hi:null,ring:null,ringG:null,d:0,hb:0,ringV:0};
function tenseInit(){
  const c=A.ctx; TEN.bus=c.createGain(); TEN.bus.gain.value=0; TEN.bus.connect(A.master);
  TEN.lp=c.createBiquadFilter(); TEN.lp.type='lowpass'; TEN.lp.frequency.value=140; TEN.lp.Q.value=2; TEN.lp.connect(TEN.bus);
  [[41.2,'sawtooth',.25],[41.9,'sawtooth',.25],[55,'sine',.35]].forEach(([f,ty,v])=>{ const o=c.createOscillator(); o.type=ty; o.frequency.value=f; const g=c.createGain(); g.gain.value=v; o.connect(g).connect(TEN.lp); o.start(); });
  const lfo=c.createOscillator(); lfo.frequency.value=.13; const lg=c.createGain(); lg.gain.value=40; lfo.connect(lg).connect(TEN.lp.frequency); lfo.start();
  /* dissonant upper layer (a tritone above), only behind her */
  const o2=c.createOscillator(); o2.type='triangle'; o2.frequency.value=116.5; TEN.hi=c.createGain(); TEN.hi.gain.value=0; o2.connect(TEN.hi).connect(TEN.lp); o2.start();
  /* tinnitus */
  const r=c.createOscillator(); r.frequency.value=6200; const rl=c.createOscillator(); rl.frequency.value=.7; const rlg=c.createGain(); rlg.gain.value=40; rl.connect(rlg).connect(r.frequency); rl.start();
  TEN.ringG=c.createGain(); TEN.ringG.gain.value=0; r.connect(TEN.ringG).connect(A.master); r.start();
}
function tenseTick(dt){
  if(!A.ctx) return; if(!TEN.bus) tenseInit();
  const now=A.ctx.currentTime, live=S&&S.running&&!S.over;
  const st=live?S.st:null, behind=st&&st.stage==='behind';
  const near=st?(st.stage==='window'?st.p:st.stage==='door'||st.stage==='closet'?.5+.5*st.p:behind?1:0):0;
  TEN.d += (near-TEN.d)*Math.min(1,dt*(near>TEN.d?1.6:.7));      /* rises fast, falls slower */
  const d=TEN.d, dv=Math.max(0,(d-.25)/.75);
  setT(TEN.bus.gain,live?.16*dv*dv+.03*dv:0,now,.2);
  setT(TEN.lp.frequency,140+420*dv,now,.4);
  setT(TEN.hi.gain,behind?.12:0,now,.6);
  /* heartbeat */
  const pan=live?Math.min(1,S.panic/100):0, hbK=Math.max(d>=.5?(d-.5)/.5:-1, pan>=.7?(pan-.7)/.3:-1);
  if(live && hbK>=0){ TEN.hb-=dt; if(TEN.hb<=0){ TEN.hb=1.05-.63*Math.min(1,hbK); const v=.6+.4*Math.min(1,hbK); tone(56,.15,'sine',.3*v,38); tone(50,.18,'sine',.22*v,34,.2); } }
  else TEN.hb=Math.min(TEN.hb,.3);
  /* ringing in the ears */
  const rv=live&&pan>.6?Math.min(1,(pan-.6)/.4):0; TEN.ringV+=(rv-TEN.ringV)*Math.min(1,dt*.8);
  setT(TEN.ringG.gain,.006*TEN.ringV,now,.3);
}

/* ======================= INTERFACE SOUNDS =======================
   chatBlip: soft tick per new chat message (troll/spam rougher, Stranger_99 a dull low knock), max ~7 per second;
   relayClick: mechanical relay clack when a lamp changes mode (BRIGHT harder, DIM softer), panned to the lamp;
   lamp hum: each lamp on BRIGHT buzzes (mains 100 Hz harmonics), louder and rougher as it heats up. */
const ZPAN={window:-.55,closet:0,door:.55};
let blipLast=0;
function chatBlip(type){
  if(!A.ctx) return; const t=A.ctx.currentTime;
  if(type!=='stalker' && t-blipLast<.14) return; blipLast=t;
  if(type==='stalker'){ tone(150,.22,'sine',.12,70); noiseBurst(.12,.05,'lowpass',260,1); return; }
  if(type==='troll'||type==='spam'){ tone(260,.05,'square',.018,180); noiseBurst(.04,.03,'bandpass',900,2); return; }
  tone(1650+Math.random()*200,.045,'sine',.022,1250);
}
function relayClick(mode,z){
  if(!A.ctx) return; const c=A.ctx, t=c.currentTime, p=ambPan(ZPAN[z]||0); p.connect(A.master);
  const k=mode==='BOOST'?1:mode==='DIM'?.55:.8;
  const s=c.createBufferSource(); s.buffer=A.noise; const f=c.createBiquadFilter(); f.type='bandpass'; f.frequency.value=2600; f.Q.value=2.5;
  const g=c.createGain(); g.gain.setValueAtTime(.16*k,t); g.gain.exponentialRampToValueAtTime(.0001,t+.025); s.connect(f).connect(g).connect(p); s.start(t,Math.random()); s.stop(t+.05);
  const o=c.createOscillator(); o.frequency.setValueAtTime(140,t); o.frequency.exponentialRampToValueAtTime(70,t+.05);
  const og=c.createGain(); og.gain.setValueAtTime(.14*k,t); og.gain.exponentialRampToValueAtTime(.0001,t+.07); o.connect(og).connect(p); o.start(t); o.stop(t+.09);
  /* second contact a few ms later - sounds like a real relay */
  const s2=c.createBufferSource(); s2.buffer=A.noise; const g2=c.createGain(); g2.gain.setValueAtTime(.06*k,t+.018); g2.gain.exponentialRampToValueAtTime(.0001,t+.035);
  const f2=c.createBiquadFilter(); f2.type='highpass'; f2.frequency.value=3500; s2.connect(f2).connect(g2).connect(p); s2.start(t+.018,Math.random()); s2.stop(t+.05);
}
const LH={};
function lampHumTick(dt){
  if(!A.ctx) return; const c=A.ctx, now=c.currentTime, live=S&&S.running&&!S.over;
  for(const z of ['window','closet','door']){
    let h=LH[z];
    if(!h){ const o=c.createOscillator(); o.type='sawtooth'; o.frequency.value=100; const f=c.createBiquadFilter(); f.type='bandpass'; f.frequency.value=400; f.Q.value=1.2;
      const g=c.createGain(); g.gain.value=0; const p=ambPan(ZPAN[z]); o.connect(f).connect(g).connect(p).connect(A.master); o.start(); h=LH[z]={o,f,g,v:0}; }
    const L=live&&S.lamps&&S.lamps[z], on=L&&L.mode==='BOOST'&&!L.burned, heat=L?Math.min(1,(L.heat||0)/100):0;
    const want=on?.010+.03*heat*heat:0; h.v+=(want-h.v)*Math.min(1,dt*(on?5:8));
    if(!on && h.v<1e-4){ if(h.v!==0){ h.v=0; setT(h.g.gain,0,now,.03); } continue; }   /* perf: idle lamps cost nothing */
    setT(h.g.gain,h.v*(1+.25*Math.sin(now*37+heat*9)*heat),now,.03);   /* rattles when hot */
    setT(h.f.frequency,380+900*heat,now,.2);
  }
}
