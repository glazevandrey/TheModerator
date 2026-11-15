"use strict";
/* Explicit, action-gated lessons inside the real Monday campaign night. */
Object.assign(STR.ru,{
  g_step:'ОБУЧЕНИЕ · {n}/6',g_skip:'Пропустить обучение',g_next:'Начать',g_resume:'Продолжить эфир',g_title:'ПЕРВАЯ СМЕНА · ОБУЧЕНИЕ',g_finished:'ОСНОВЫ ОСВОЕНЫ',
  g_intro:'Ты модерируешь стрим Мии. Продержи эфир до 00:00: убирай троллей, следи за окном и не дай ей запаниковать. Сейчас попробуем всё по шагам.',
  g_select:'Красная сердитая аватарка — тролль. Нажми на выделенное сообщение. Обычных зрителей банить нельзя: потеряешь доверие.',
  g_ban:'Теперь нажми БАН справа от сообщения. Кнопка также появляется при наведении. За тролля получишь 10 HC.',
  g_light:'Кто-то у окна. Нажми ЯРЧЕ под ОКНОМ или клавишу 1 — свет оттолкнёт его.',
  g_push:'Смотри на полоску ДВИЖЕНИЕ: яркий свет заставляет его отступать. Подожди, пока она опустеет.',
  g_cool:'Он отступил. Нажми НОРМА или снова 1, чтобы лампа не перегрелась. Во время смены клавиши 1, 2, 3 включают ЯРЧЕ у окна, шкафа и двери. Shift + цифра включает ТЕМНЕЕ.',
  g_clip:'Он снова в кадре. Нажми ЗАПИСАТЬ МОМЕНТ: за клип получишь HC — монеты для донатов.',
  g_recording:'Идёт запись. Дождись конца — монеты начислятся за то, что попало в кадр.',
  g_blinds:'Теперь нажми ЖАЛЮЗИ. Они закроют окно и прогонят его, пока он ещё не подошёл вплотную. После этого им нужно время на восстановление.',
  g_save:'Для доната нужно {v} HC. Подожди немного: монеты приходят и за время в эфире. Следи за золотой полоской под балансом.',
  g_donate:'Нажми ДОНАТ. Он снижает ПАНИКУ и ненадолго удерживает Мию у камеры. Дальше используй его, когда ей страшно.',
  g_done:'Теперь ты умеешь банить троллей, отгонять его светом и жалюзи, записывать клипы и донатить. Держи эфир до 00:00. Если он вернётся — следи за ОКНОМ.',
  g_hold:'Время приостановлено. Выполни действие, чтобы продолжить.',g_live:'Эфир идёт — наблюдай за результатом.',
  g_first:'Первая ночь с обучением',g_replay:'Первая ночь с обучением',tutTile:'Справка',tutGo:'Подробная тренировка'
});
Object.assign(STR.en,{
  g_step:'TUTORIAL · {n}/6',g_skip:'Skip tutorial',g_next:'Start',g_resume:'Back to the stream',g_title:'FIRST SHIFT · TUTORIAL',g_finished:'YOU KNOW THE BASICS',
  g_intro:'You’re moderating Mia’s stream. Keep it going until midnight: deal with trolls, watch the window and keep her panic under control. Let’s try it one step at a time.',
  g_select:'The red angry face marks a troll. Click the highlighted message. Leave regular viewers alone — banning them costs you trust.',
  g_ban:'Now press BAN on the right of the message. You can also reveal it by hovering over a message. Banning a troll earns you 10 HC.',
  g_light:'Someone’s at the window. Click BRIGHT under WINDOW or press 1 to push him back.',
  g_push:'Watch the MOTION bar shrink as the light pushes him back. Wait until it empties.',
  g_cool:'He’s backed off. Click NORMAL or press 1 again to prevent overheating. During a shift, 1, 2 and 3 brighten the window, closet and door lamps. Hold Shift with the number to dim one.',
  g_clip:'He’s on camera again. Press HIGHLIGHT MOMENT to record a clip. Clips earn HC, which you can spend on donations.',
  g_recording:'Recording. Wait for it to finish — you’ll earn HC for what you caught on camera.',
  g_blinds:'Press BLINDS to close the window and drive him away. This works while he’s still at a distance. The blinds need time to recharge afterwards.',
  g_save:'A donation costs {v} HC. Give it a moment: you also earn coins while the stream is running. Watch the gold bar below your balance.',
  g_donate:'Press DONATE. It lowers PANIC and keeps Mia at the camera for a while. After this, save it for when she needs it.',
  g_done:'You’ve tried banning trolls, using the light and blinds, recording clips and donating. Now keep the stream going until midnight. Watch the WINDOW if he comes back.',
  g_hold:'Time is paused. Follow the highlighted step to continue.',g_live:'The stream is running — watch what happens.',
  g_first:'First night with tutorial',g_replay:'First night with tutorial',tutTile:'Help',tutGo:'Full practice session'
});
const guideCard=document.createElement('section');guideCard.id='guideCard';guideCard.className='callout guide-card';guideCard.hidden=true;
guideCard.setAttribute('role','region');guideCard.setAttribute('aria-labelledby','guideStep');
guideCard.innerHTML='<div class="cstep" id="guideStep"></div><div class="ct" id="guideText"></div><div class="ck" id="guideStatus"></div><div class="cbtns"><button type="button" class="cnext" id="guideNext"></button><button type="button" class="cskip" id="guideSkip"></button></div>';
$('screen').append(guideCard);
for(const id of ['guideShade','guideSpot','guideArrow']){const e=document.createElement('div');e.id=id;e.hidden=true;e.setAttribute('aria-hidden','true');$('screen').append(e);}
let guideHighlight=null;
function onboardingLayout(){if(guideCard.parentNode!==$('screen'))$('screen').append(guideCard);}
function onboardingTarget(el){if(guideHighlight===el)return;if(guideHighlight)guideHighlight.classList.remove('guide-target');guideHighlight=el;if(el)el.classList.add('guide-target');}
function onboardingClear(){onboardingTarget(null);for(const id of ['guideCard','guideShade','guideSpot','guideArrow'])$(id).hidden=true;list.querySelectorAll('.guide-ban-row').forEach(e=>e.classList.remove('guide-ban-row'));$('stage').classList.remove('guide-active');$('tip2').hidden=false;}
function onboardingInit(opts){
  onboardingClear();const wanted=opts&&opts.guide||PROG.unlocked===0&&PROG.onboardMon!==2;
  if(!wanted||opts&&(opts.skipTut||opts.skipGuide)||S.tut.active||S.night.endless||S.night.key!=='mon')return;
  S.guide={active:true,phase:'intro',msgId:null,clips:S.clips.length,donations:S.stats.donates,pendingTip:null};stat('onboarding/mon/start');stat('onboarding/mon/step/intro');
}
function onboardingSet(phase){
  const g=S.guide;if(!g||!g.active||g.phase===phase)return;g.phase=phase;onboardingTarget(null);stat('onboarding/mon/step/'+phase);
  if(phase==='ban')g.msgId=pushMsg('troll','xX_h4ter_Xx',T('t1msg')).id;
  if(phase==='light'||phase==='clip'){
    /* A real window encounter, held while the player reads. No later-night threats. */
    showCue('window');S.st.route=ROUTES.A;S.st.red=false;enterStage('window',phase==='clip'?.35:.3);
  }
}
function onboardingFinish(reason,remember){
  const g=S&&S.guide;if(!g||!g.active)return;g.active=false;onboardingClear();banLegend();
  if(remember){PROG.tut=true;PROG.onboardMon=2;saveProg();}stat('onboarding/mon/'+reason);
  if(g.pendingTip){const key=tipKeyOf(g.pendingTip.text);tip(g.pendingTip.id,key?T(key):g.pendingTip.text);}
}
$('guideSkip').onclick=()=>onboardingFinish('skip',true);
$('guideNext').onclick=()=>{if(!S||!S.guide||!S.guide.active)return;if(S.guide.phase==='intro')onboardingSet('ban');else if(S.guide.phase==='done')onboardingFinish('done',true);hud(0);};
function onboardingTick(){
  const g=S.guide;if(!g||!g.active)return false;
  switch(g.phase){
    case 'intro':return S.t>=4.5;
    case 'ban':if(S.chat.some(m=>m.id===g.msgId&&m.banned))onboardingSet('light');return true;
    case 'light':if(S.lamps.window.mode==='BOOST')onboardingSet('repel');else return true;return false;
    case 'repel':if(S.st.stage==='hidden'){onboardingSet('cool');return true;}return false;
    case 'cool':if(S.lamps.window.mode==='STABLE')onboardingSet('clip');return true;
    case 'clip':if(S.rec.active>0)onboardingSet('recording');else return true;return false;
    case 'recording':if(S.rec.active>0)return false;onboardingSet(S.clips.slice(g.clips).some(c=>c.val>0)?'blinds':'clip');return true;
    case 'blinds':if(S.blinds.closed&&S.st.stage==='hidden')onboardingSet('donate');return true;
    case 'donate':if(S.stats.donates>g.donations){onboardingSet('done');return true;}return S.hc>=donateCost();
    case 'done':return true;
  }
  return false;
}
function onboardingCurrentTarget(){
  const g=S.guide;if(!g||!g.active)return null;
  if(g.phase==='ban'){const row=list.querySelector('[data-id="'+g.msgId+'"]');return S.selected===g.msgId&&row?row.querySelector('.msgban'):row;}
  if(g.phase==='light')return $('lamp-window').querySelector('[data-m="BOOST"]');
  if(g.phase==='repel')return $('lamp-window').querySelector('.prox');
  if(g.phase==='cool')return $('lamp-window').querySelector('[data-m="STABLE"]');
  if(g.phase==='clip'||g.phase==='recording')return $('actRec');
  if(g.phase==='blinds')return $('actBlinds');
  if(g.phase==='donate')return S.hc>=donateCost()?$('actDonate'):$('hcval');
  return null;
}
function onboardingPlace(target){
  const screen=$('screen'),base=screen.getBoundingClientRect(),k=screen.offsetWidth/base.width;
  const area=target?(S.guide.phase==='ban'||$('stage').classList.contains('phone-ui')?$('video'):$('chat')).getBoundingClientRect():base;
  const width=Math.min(MOBILE?510:620,area.width*k-24);guideCard.style.width=width+'px';
  const x=(area.left-base.left)*k+(area.width*k-width)/2;
  guideCard.style.left=Math.max(8,x)+'px';
  guideCard.style.top=Math.max(8,target?(area.bottom-base.top)*k-guideCard.offsetHeight-14:(screen.offsetHeight-guideCard.offsetHeight)/2)+'px';
  $('guideShade').hidden=!!target;$('guideSpot').hidden=!target;$('guideArrow').hidden=!target;
  if(!target)return;
  const r=target.getBoundingClientRect(),tx=(r.left-base.left)*k-7,ty=(r.top-base.top)*k-7,tw=r.width*k+14,th=r.height*k+14;
  Object.assign($('guideSpot').style,{left:tx+'px',top:ty+'px',width:tw+'px',height:th+'px'});
  const c=guideCard.getBoundingClientRect(),cx=(c.left+c.width/2-base.left)*k,cy=(c.top+c.height/2-base.top)*k,ex=tx+tw/2,ey=ty+th/2,dx=ex-cx,dy=ey-cy;
  const f=Math.min(Math.abs(c.width*k/2/(dx||.001)),Math.abs(c.height*k/2/(dy||.001))),end=Math.min(Math.abs(tw/2/(dx||.001)),Math.abs(th/2/(dy||.001)));
  const sx=cx+dx*f,sy=cy+dy*f,len=Math.max(0,Math.hypot(dx,dy)*(1-f-end)-10);
  Object.assign($('guideArrow').style,{left:sx+'px',top:sy+'px',width:len+'px',transform:'rotate('+Math.atan2(dy,dx)+'rad)'});
}
function onboardingHud(){
  const g=S&&S.guide;if(!g||!g.active||!S.running||paused||S.t<4.5){onboardingClear();return;}
  onboardingLayout();guideCard.hidden=false;$('stage').classList.add('guide-active');
  const phase=g.phase,rank={ban:1,light:2,repel:2,cool:3,clip:4,recording:4,blinds:5,donate:6};
  const key=phase==='ban'?(S.selected===g.msgId?'g_ban':'g_select'):phase==='repel'?'g_push':phase==='donate'?(S.hc>=donateCost()?'g_donate':'g_save'):'g_'+phase;
  const texts={guideStep:phase==='intro'?T('g_title'):phase==='done'?T('g_finished'):T('g_step',{n:rank[phase]}),guideText:T(key,{v:donateCost()}),guideStatus:T(phase==='repel'||phase==='recording'||phase==='donate'&&S.hc<donateCost()?'g_live':'g_hold'),guideSkip:T('g_skip'),guideNext:T(phase==='intro'?'g_next':'g_resume')};
  for(const id in texts)if($(id).textContent!==texts[id])$(id).textContent=texts[id];
  $('guideNext').hidden=phase!=='intro'&&phase!=='done';
  const row=list.querySelector('[data-id="'+g.msgId+'"]');list.querySelectorAll('.guide-ban-row').forEach(e=>e.classList.remove('guide-ban-row'));
  if(phase==='ban'&&row){row.classList.add('guide-ban-row');const r=row.getBoundingClientRect(),a=list.getBoundingClientRect(),k=list.offsetHeight/a.height;if(r.bottom>a.bottom)list.scrollTop+=(r.bottom-a.bottom)*k+4;else if(r.top<a.top)list.scrollTop-=(a.top-r.top)*k+4;}
  const target=onboardingCurrentTarget();onboardingTarget(target);onboardingPlace(target);
}
/* Unrelated controls cannot accidentally spend resources during a held lesson. */
document.addEventListener('click',e=>{
  if(!S||!S.guide||!S.guide.active||!S.running||paused||S.t<4.5)return;
  if(e.target.closest('#guideCard,#pauseBtn,#pauseBtn2,#muteBtn,.langsw,.fsbtn'))return;
  const target=onboardingCurrentTarget();if(target&&target.contains(e.target))return;
  e.preventDefault();e.stopImmediatePropagation();
},true);
document.addEventListener('keydown',e=>{
  if(!S||!S.guide||!S.guide.active||!S.running||paused||S.t<4.5)return;
  if(e.key==='Escape'||e.key==='Tab'||e.target.closest('#guideCard,.langsw'))return;
  if((e.key==='Enter'||e.key===' ')&&['intro','done','redIntro','redDone'].includes(S.guide.phase)){e.preventDefault();$('guideNext').click();return;}
  if(S.guide.kind==='red'){
    const g=S.guide,z={window:'Digit1',closet:'Digit2',door:'Digit3'}[g.zone];
    if(g.phase==='redDim'&&e.shiftKey&&(e.code===z||e.code==='Numpad'+z.slice(-1))&&S.lamps[g.zone].mode!=='DIM')return;
    if(g.phase==='redSound'&&e.code==={dog:'KeyZ',steps:'KeyC',alarm:'KeyF'}[g.action])return;
    e.preventDefault();e.stopImmediatePropagation();return;
  }
  const allowed={ban:'KeyX',light:'Digit1',cool:'Digit1',clip:'KeyR',blinds:'KeyB',donate:'KeyG'}[S.guide.phase];if((allowed===e.code||allowed==='Digit1'&&e.code==='Numpad1')&&!e.shiftKey)return;
  e.preventDefault();e.stopImmediatePropagation();
},true);
