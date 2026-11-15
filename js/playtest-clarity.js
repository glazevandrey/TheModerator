"use strict";
/* First red-eyes lesson, readable window evidence, and distinct action sounds. */
Object.assign(STR.ru,{
  tipRed:'КРАСНЫЕ ГЛАЗА: ЯРЧЕ ускоряет. ТЕМНЕЕ замедляет. Отгоняй умным домом, у окна помогут жалюзи.',
  red_title:'НОВАЯ УГРОЗА · КРАСНЫЕ ГЛАЗА',red_intro:'У него красные глаза. Правило изменилось: ЯРЧЕ ускоряет его. ТЕМНЕЕ замедляет, но не прогоняет. Сейчас попробуем другой способ защиты.',
  red_dim:'Нажми ТЕМНЕЕ у выделенной лампы. Это замедлит его. У обычного сталкера правило прежнее: его отталкивает ЯРЧЕ.',
  red_sound:'Теперь нажми выделенную кнопку умного дома. ЛАЙ задерживает его на 6 секунд, ШАГИ отбрасывают на один этап, ТРЕВОГА прогоняет совсем. Звуки могут напугать Мию — следи за паникой.',
  red_done:'Запомни: красные глаза — ТЕМНЕЕ и умный дом. У окна помогают и ЖАЛЮЗИ, пока он не подошёл вплотную. Если устройства перезаряжаются, не ускоряй его ярким светом.',
  red_step:'КРАСНЫЕ ГЛАЗА · {n}/3',red_resume:'Вернуться к эфиру',
  evidence_new:'ЗАПИСКА НА ОКНЕ',evidence_hint:'Открой жалюзи → ЗАПИСАТЬ МОМЕНТ → прочитай здесь.',
  evidence_read:'Прочитать записку',evidence_photo:'Рассмотреть снимок',evidence_saved:'Записка снята · читай в заметках справа',evidence_title:'ЗАПИСКА СО СТЕКЛА',evidence_caption:'Сохранено с камеры. Записка доступна и в итогах этой ночи.',evidence_close:'Вернуться',
  tipNoteMon:'Открой жалюзи → ЗАПИСАТЬ МОМЕНТ → прочитай здесь.',
  sound_dog:'ЛАЙ · он замрёт на 6 секунд',sound_steps:'ШАГИ · он отступит',sound_police:'тук · тук · тук'
});
Object.assign(STR.en,{
  tipRed:'RED EYES: BRIGHT speeds him up. DIM slows him down. Use smart-home sounds, or BLINDS at the window.',
  red_title:'NEW THREAT · RED EYES',red_intro:'His eyes are red. This time, BRIGHT makes him faster. DIM slows him down, but will not drive him away. Let’s try another way to stop him.',
  red_dim:'Press DIM on the highlighted lamp to slow him down. The usual rule still applies to the ordinary stalker: BRIGHT pushes him back.',
  red_sound:'Now press the highlighted smart-home button. DOG BARK freezes him for 6 seconds. FOOTSTEPS push him back one stage. ALARM drives him away completely. Sounds can frighten Mia, so watch her panic.',
  red_done:'Red eyes mean DIM and smart-home sounds. BLINDS also help at the window, before he gets too close. While devices recharge, avoid speeding him up with bright light.',
  red_step:'RED EYES · {n}/3',red_resume:'Back to the stream',
  evidence_new:'NOTE ON THE WINDOW',evidence_hint:'Blinds open → HIGHLIGHT MOMENT → read the note here.',
  evidence_read:'Read the note',evidence_photo:'Inspect the photo',evidence_saved:'Note recorded · open it in MOD NOTES',evidence_title:'NOTE FROM THE WINDOW',evidence_caption:'Saved from the webcam. You can also open it in this night’s results.',evidence_close:'Back',
  tipNoteMon:'Blinds open → HIGHLIGHT MOMENT → read the note here.',
  sound_dog:'DOG BARK · freezes him for 6 seconds',sound_steps:'FOOTSTEPS · pushes him back',sound_police:'knock · knock · knock'
});
function redLessonStart(){
  if(!S||S.tut.active||S.night.endless||!S.st.red||S.st.stage==='behind'||PROG.redEyesLesson===1||S.guide&&S.guide.active)return;
  onboardingClear();S.guide={active:true,kind:'red',phase:'redIntro',zone:STAGE_LAMP[S.st.stage],pendingTip:null};stat('lesson/red/start');
}
function redLessonSound(){
  const g=S.guide;g.phase='redSound';g.action=['steps','dog','alarm'].find(k=>S.sh[k]<=0);
  if(!g.action){g.phase='redDone';return;}g.before=S.sh[g.action];stat('lesson/red/step/sound');
}
const clarityGuideTick=onboardingTick;
onboardingTick=function(){
  const g=S&&S.guide;if(!g||g.kind!=='red'||!g.active)return clarityGuideTick();
  if(g.phase==='redDim'&&(S.lamps[g.zone].burned||S.lamps[g.zone].mode==='DIM'))redLessonSound();
  if(g.phase==='redSound'&&S.sh[g.action]>g.before){g.phase='redDone';stat('lesson/red/step/done');}
  return true;
};
const clarityGuideFinish=onboardingFinish;
onboardingFinish=function(reason,remember){
  const g=S&&S.guide;if(!g||g.kind!=='red')return clarityGuideFinish(reason,remember);
  if(!g.active)return;g.active=false;onboardingClear();
  if(reason==='done'||reason==='skip'){PROG.redEyesLesson=1;saveProg();stat('lesson/red/'+reason);}
  if(g.pendingTip)tip(g.pendingTip.id,g.pendingTip.text);
};
const clarityGuideTarget=onboardingCurrentTarget;
onboardingCurrentTarget=function(){
  const g=S&&S.guide;if(!g||g.kind!=='red')return clarityGuideTarget();
  if(g.phase==='redIntro')return $('video');
  if(g.phase==='redDim')return $('lamp-'+g.zone).querySelector('[data-m="DIM"]');
  if(g.phase==='redSound')return $({dog:'actDog',steps:'actSteps',alarm:'actAlarm'}[g.action]);return null;
};
const clarityGuideNext=$('guideNext').onclick;
$('guideNext').onclick=()=>{
  const g=S&&S.guide;if(!g||g.kind!=='red')return clarityGuideNext();
  if(g.phase==='redIntro'){g.phase='redDim';stat('lesson/red/step/dim');if(S.lamps[g.zone].burned)redLessonSound();}
  else if(g.phase==='redDone')onboardingFinish('done',true);hud(0);
};
const clarityGuideHud=onboardingHud;
onboardingHud=function(){
  const g=S&&S.guide;if(!g||g.kind!=='red')return clarityGuideHud();
  if(!g.active||!S.running||paused){onboardingClear();return;}
  onboardingLayout();guideCard.hidden=false;$('stage').classList.add('guide-active');
  const keys={redIntro:'red_intro',redDim:'red_dim',redSound:'red_sound',redDone:'red_done'};
  $('guideStep').textContent=g.phase==='redIntro'?T('red_title'):T('red_step',{n:{redDim:1,redSound:2,redDone:3}[g.phase]});
  $('guideText').textContent=T(keys[g.phase]);$('guideStatus').textContent=T('g_hold');$('guideSkip').textContent=T('g_skip');
  $('guideNext').hidden=!['redIntro','redDone'].includes(g.phase);$('guideNext').textContent=T(g.phase==='redDone'?'red_resume':'g_next');
  const target=onboardingCurrentTarget();onboardingTarget(target);onboardingPlace(target);
};
/* Evidence is read in an explicit paused viewer; capture itself never interrupts play. */
const evidenceButton=document.createElement('button');evidenceButton.type='button';evidenceButton.id='evidenceButton';evidenceButton.hidden=true;$('glassnote').insertBefore(evidenceButton,$('banLeg'));
const evidenceViewer=document.createElement('section');evidenceViewer.id='evidenceViewer';evidenceViewer.className='overlay';evidenceViewer.hidden=true;evidenceViewer.setAttribute('role','dialog');evidenceViewer.setAttribute('aria-modal','true');evidenceViewer.setAttribute('aria-labelledby','evidenceTitle');
evidenceViewer.innerHTML='<div class="paper"><h2 id="evidenceTitle"></h2><blockquote id="evidenceText"></blockquote><canvas id="evidencePhoto" width="640" height="400" hidden></canvas><p id="evidenceCaption"></p><button type="button" class="pbtn" id="evidenceClose"></button></div>';$('stage').append(evidenceViewer);
let evidenceWasRunning=false,evidenceFocus=null;
function evidenceLanguage(){
  evidenceButton.textContent=T(S&&S.night.key==='fri'?'evidence_photo':'evidence_read');$('evidenceTitle').textContent=T('evidence_title');$('evidenceText').textContent=T('noteMonTxt');$('evidenceCaption').textContent=T('evidence_caption');$('evidenceClose').textContent=T('evidence_close');
}
function evidenceOpen(){
  if(!S||!S.ev.noteRec||S.guide&&S.guide.active||FIN.active||!evidenceViewer.hidden)return;
  evidenceFocus=document.activeElement;evidenceWasRunning=S.running;if(evidenceWasRunning){setPause(true);$('ovPause').hidden=true;}
  const photo=S.night.key==='fri';$('evidencePhoto').hidden=!photo;$('evidenceText').hidden=photo;if(photo)drawPhoto($('evidencePhoto'));
  evidenceLanguage();evidenceViewer.hidden=false;$('evidenceClose').focus();stat('evidence/read/'+S.night.key);
}
function evidenceClose(resume=true){
  if(evidenceViewer.hidden)return;evidenceViewer.hidden=true;const go=evidenceWasRunning;evidenceWasRunning=false;
  if(go&&resume&&S&&!S.over)setPause(false);else if(go&&!resume)paused=false;if(evidenceFocus&&evidenceFocus.isConnected)evidenceFocus.focus({preventScroll:true});
}
evidenceButton.onclick=evidenceOpen;$('evidenceClose').onclick=()=>evidenceClose();
document.addEventListener('click',e=>{if(e.target.closest('[data-read-evidence]'))evidenceOpen();});
document.addEventListener('keydown',e=>{
  if(evidenceViewer.hidden)return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();evidenceClose();return;}
  if(e.key==='Tab'){e.preventDefault();$('evidenceClose').focus();}
  if(!e.target.closest('#evidenceViewer')){e.preventDefault();e.stopImmediatePropagation();}
},true);
function evidenceAppeared(){
  tip('windowEvidence',T('evidence_hint'));floaty(T('evidence_new'));stat('evidence/appear/'+S.night.key);
}
function evidenceCaptured(){
  S.ev.noteRec=true;S.ev.noteFly=1.4;S.ev.note=false;floaty(T('evidence_saved'));tip('evidenceCaptured',T('evidence_caption'));stat('evidence/capture/'+S.night.key);
}
const clarityHud=hud;
hud=function(dt){clarityHud(dt);if(!S)return;evidenceButton.hidden=!S.ev.noteRec;evidenceButton.disabled=!!(S.guide&&S.guide.active);evidenceLanguage();};
const clarityLang=applyLang;
applyLang=function(){clarityLang();evidenceLanguage();};
/* Distinct, cached PCM cues. No downloads, and the user's sound/mute settings still apply. */
const claritySounds={};
function clarityAudio(kind){
  if(!A.ctx||A.muted||volOf('sfx')===0)return;
  const ctx=A.ctx,key=kind+ctx.sampleRate;
  if(!claritySounds[key]){
    const duration={dog:1.35,steps:2.9,police:1.65}[kind],b=ctx.createBuffer(2,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate);
    let seed=1987;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
    for(let ch=0;ch<2;ch++){
      const d=b.getChannelData(ch);let low=0,phase=0;
      for(let i=0;i<d.length;i++){
        const t=i/ctx.sampleRate,n=random();low+=.18*(n-low);let value=0;
        if(kind==='dog'){
          for(const at of [0,.24,.73]){const u=t-at;if(u<0||u>.25)continue;
            const envelope=Math.min(1,u/.012)*Math.exp(-u*16),f=155-160*u;
            phase=2*Math.PI*(155*u-80*u*u);
            const voiced=Math.sin(phase)*.45+Math.sin(phase*3)*.24+Math.sin(phase*5)*.17+Math.sin(phase*7)*.08;
            value+=envelope*(voiced*(.8+.2*Math.sin(u*65))+low*.6)*.65;
          }
        }else if(kind==='steps'){
          for(let j=0;j<7;j++){const u=t-j*.4;if(u<0||u>.31)continue;const pan=-.65+j*.19,balance=ch===0?(1-pan)/2:(1+pan)/2;
            const heel=Math.exp(-u*48)*Math.sin(2*Math.PI*105*u)*.20;
            const sole=Math.exp(-Math.max(0,u-.045)*24)*(u>.045?1:0)*low*.65;
            const scuff=Math.sin(Math.min(1,u/.3)*Math.PI)*low*.20;
            value+=(heel+sole+scuff)*balance;
          }
        }else for(const at of [0,.47,.94]){const u=t-at;if(u>=0&&u<.25)value+=(Math.sin(u*2*Math.PI*235)*.34+Math.sin(u*2*Math.PI*510)*.14+low*.45)*Math.exp(-u*27)*Math.min(1,u/.003);}
        d[i]=Math.tanh(value*1.45)*.8;
      }
    }claritySounds[key]=b;
  }
  const source=ctx.createBufferSource();source.buffer=claritySounds[key];source.connect(A.master);source.start();source.onended=()=>source.disconnect();
  A.cueUntil=ctx.currentTime+source.buffer.duration+.35;
}
SFX.dog=()=>{clarityAudio('dog');if(S&&S.running)floaty(T('sound_dog'));};
SFX.steps=()=>{clarityAudio('steps');if(S&&S.running)floaty(T('sound_steps'));};
SFX.softKnock=()=>clarityAudio('police');
const clarityMusicTick=musicTick;
musicTick=function(dt){clarityMusicTick(dt);if(A.ctx&&MUS.bus&&A.ctx.currentTime<(A.cueUntil||0))MUS.bus.gain.setTargetAtTime(MUS.vol*.22,A.ctx.currentTime,.035);};
