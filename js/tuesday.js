"use strict";
/* THE MODERATOR — the new Tuesday (demo, 23.11.2026). The full hybrid loop in one night:
     opening (depends on the Monday DM) · a music question (show) · the cat
     the anomaly: a crackle, the window lamp goes out, chat: «у фонаря кто-то стоит», a figure far in the yard
       → check it: BRIGHT + «Записать»; the clip of the yard has one detail to find (his phone shows her stream)
     the social clue: a viewer knows the courier asked if she lives alone - she never said that on stream
     the decision about the warning: show it to Mia / ban it / leave it
     the defense: the stalker system runs for one scene (window → heat → he switches to the door), at most ~75 s / 2 retreats;
       Mia warned → she lowers the blinds herself; warning banned → «а почему жалюзи закрылись?»; nothing → she went to look
       a failed defense is a bad scare and a cut stream, never a death (S.noDeath, game.js endGame → tueSpared)
     the consequence (Mia's line + the end screen line) · the DM with one agreement · the last message · «6 дней».
   Kept in PROG.tue for the next nights. */

Object.assign(STR.ru,{
  tue_openTruth:'модер, я всё думаю про вчерашнее… кто там мог стоять? гостевой доступ оставила — вдруг пригодится',
  tue_openLie:'вчера модер сказал, что мне показалось. ну и хорошо. пионы, кстати, ещё стоят',
  tue_openQuiet:'вчера что-то было у окна… модер так и не ответил. ладно, работаем',
  tue_musicAsk:'чат, что поставить фоном? модер, покажи мне, что выбрали', tue_musicSelf:'ладно, поставлю дождик', tue_taskMusic:'Покажи Мие, что выбрал чат',
  tue_cat:'{cat} опять смотрит на меня с полки. как будто что-то знает',
  tue_warn:'у фонаря кто-то стоит. уже минут пять', tue_calmMsg:'не пугай её, там соседи вечно курят',
  tue_howYard:'Кто-то во дворе. Включи ЯРКИЙ у окна и запиши момент — «Записать» (R).', tue_taskYard:'Проверь двор', tue_taskYardS:'нажми «Записать» (R), пока он там', tue_clipSaved:'Снимок двора сохранён — открой клипы внизу справа на видео',
  tue_lampOut:'ой… свет у окна погас. опять скачок?',
  tue_courier:'а курьер из «Пиона» тебя ещё спрашивал, одна ли ты живёшь? 🙂',
  tue_courierRead:'…откуда ты это знаешь? я об этом не говорила',
  tue_taskDecide:'Решай, что узнает Мия',
  tue_shownWhat:'что?.. кто-то у фонаря? модер, что мне делать?', tue_shownBlinds:'закрываю жалюзи. и отсяду от окна', tue_askLbl:'Ответить Мие', tue_askBlinds:'Закрой жалюзи', tue_askAway:'Отойди от окна', tue_doBlinds:'сейчас…', tue_doAway:'хорошо, отхожу', tue_awayBadge:'отошла от окна', tue_modNick:'модер',
  tue_selfLook:'чат пишет, у фонаря кто-то… пойду гляну', tue_atWindow:'Мия у окна',
  tue_whyBlinds:'а почему жалюзи закрылись? это ты, модер?', tue_help:'жалюзи! опускаю!',
  tue_howDef:'Он идёт к окну. ЯРКИЙ отгоняет — но лампа греется.', tue_taskDef:'Защити Мию',
  tue_spared:'…', tue_cut:'эфир прерван',
  tue_endShown:'спасибо, модер. если бы не ты, я бы так и сидела у окна', tue_endBanned:'странный вечер. ладно… я спать',
  tue_endNone:'я его видела. у окна. кто-то правда там был', tue_endFail:'я… я не могу. всё, эфир всё',
  tue_bye:'спокойной ночи, чат. модер… останься на связи',
  tue_sumShown:'Ты показал Мие предупреждение → она закрыла жалюзи → не подошла к окну.',
  tue_sumBanned:'Ты забанил предупреждение → Мия осталась у окна → она не поняла, что происходит.',
  tue_sumNone:'Ты промолчал → Мия пошла проверять окно сама → он подошёл к ней ближе всего.',
  tue_sumFail:'Защита не удалась: Мия сильно испугалась, эфир оборвался.',
  tue_sumFound:'На записи ты нашёл телефон у него в руке — с её эфиром.',
  tue_clipHint:'Нажми на снимок, чтобы приблизить. Присмотрись к нему.', tue_clipFound:'У него в руке телефон. На экране — её эфир. Он смотрит NyanBun прямо сейчас.',
  tue_whisper:'она тебя слушается. мне это пригодится', tue_dmNew:'новое личное сообщение', tue_dmOpen:'Открыть', tue_dmSub:'личное сообщение', tue_demoEnd:'Конец демоверсии', tue_chapEnd:'Глава 1 завершена'
});
Object.assign(STR.en,{
  tue_openTruth:'mod, i keep thinking about last night… who could have been standing there? i left your guest access on — just in case',
  tue_openLie:'mod said i imagined it last night. good. the peonies are still here, btw',
  tue_openQuiet:'something happened at the window last night… mod never answered. okay, let\'s go',
  tue_musicAsk:'chat, what should i put on in the background? mod, show me what they picked', tue_musicSelf:'okay, rain sounds it is', tue_taskMusic:'Show Mia what chat picked',
  tue_cat:'{cat} is staring at me from the shelf again. like he knows something',
  tue_warn:'someone is standing by the streetlight. five minutes already', tue_calmMsg:'don\'t scare her, the neighbours always smoke there',
  tue_howYard:'Someone is in the yard. Turn the window lamp BRIGHT and record the moment — «Record» (R).', tue_taskYard:'Check the yard', tue_taskYardS:'press «Record» (R) while he is there', tue_clipSaved:'Yard frame saved — open the clips, bottom right of the video',
  tue_lampOut:'oh… the window light went out. another surge?',
  tue_courier:'did the Peony delivery guy ask you again if you live alone? 🙂',
  tue_courierRead:'…how do you know that? i never said that',
  tue_taskDecide:'Decide what Mia learns',
  tue_shownWhat:'what?.. someone by the streetlight? mod, what do i do?', tue_shownBlinds:'closing the blinds. and moving away from the window', tue_askLbl:'Answer Mia', tue_askBlinds:'Close the blinds', tue_askAway:'Step away from the window', tue_doBlinds:'okay…', tue_doAway:'okay, moving away', tue_awayBadge:'away from the window', tue_modNick:'mod',
  tue_selfLook:'chat says someone is by the streetlight… let me look', tue_atWindow:'Mia is at the window',
  tue_whyBlinds:'why did the blinds close? was that you, mod?', tue_help:'blinds! lowering them!',
  tue_howDef:'He is coming to the window. BRIGHT drives him back — but the lamp heats up.', tue_taskDef:'Protect Mia',
  tue_spared:'…', tue_cut:'stream interrupted',
  tue_endShown:'thank you, mod. without you i\'d still be sitting by that window', tue_endBanned:'weird evening. okay… going to bed',
  tue_endNone:'i saw him. at the window. someone really was there', tue_endFail:'i… i can\'t. that\'s it, stream\'s over',
  tue_bye:'good night, chat. mod… stay in touch',
  tue_sumShown:'You showed Mia the warning → she closed the blinds → she stayed away from the window.',
  tue_sumBanned:'You banned the warning → Mia stayed by the window → she did not understand what was going on.',
  tue_sumNone:'You stayed silent → Mia went to check the window herself → he got closer to her than ever.',
  tue_sumFail:'The defense failed: Mia got badly scared, the stream cut off.',
  tue_sumFound:'In the recording you found the phone in his hand — with her stream on it.',
  tue_clipHint:'Click the picture to zoom in. Look at him closely.', tue_clipFound:'A phone in his hand. On the screen — her stream. He is watching NyanBun right now.',
  tue_whisper:'she listens to you. that will be useful to me', tue_dmNew:'new private message', tue_dmOpen:'Open', tue_dmSub:'private message', tue_demoEnd:'End of the demo', tue_chapEnd:'Chapter 1 complete'
});
const TUE_MUSIC=[
  {u:'sleepy_otter', ru:'лоу-фай!', en:'lo-fi!', rr:'лоу-фай, классика. ставлю', re:'lo-fi, a classic. putting it on'},
  {u:'noodle_owl', ru:'звуки дождя', en:'rain sounds', rr:'дождь… за окном и так дождь, ну ладно', re:'rain… it\'s raining outside anyway, but okay'},
  {u:'vhs_witch', ru:'саундтрек из старых игр', en:'old game soundtracks', rr:'о, ностальгия. хороший выбор', re:'oh, nostalgia. good pick'} ];

function tueSave(k,v){ PROG.tue=PROG.tue||{}; PROG.tue[k]=v; try{ saveProg(); }catch(e){} }
function tueTask(){ const T2=S&&S.tue; if(!T2) return null;
  if(T2.music&&!T2.music.done) return {t:T('tue_taskMusic'), s:''};
  if(T2.def&&!T2.def.done) return {t:T('tue_taskDef'), s:''};
  if(T2.anom&&!T2.decided) return T2.clip?{t:T('tue_taskDecide'), s:''}:{t:T('tue_taskYard'), s:T('tue_taskYardS'), rec:1};   /* 23.11: the yard task says how (record), the button pulses */
  return null; }

/* the yard frame: a recording made while the figure stands in the yard becomes the author's picture with one detail */
function tueClip(c){ const T2=S&&S.tue; if(!T2||!T2.anom||T2.def||S.night.key!=='tue') return;
  c.img=(window.DEMO_ART||'v2/demo/')+'clip_tue.jpg'; c.kind='yard'; c.label=T('zl_window'); T2.clip=true; hintClear();
  later(()=>{ if(S&&S.running) floaty(T('tue_clipSaved')); },300); }
const TUE_PHONE=[.585,.46,.67,.57];   /* the phone in his hands, in fractions of the picture */
function tueClipClick(img,ev){ const r=img.getBoundingClientRect(), x=(ev.clientX-r.left)/r.width, y=(ev.clientY-r.top)/r.height;
  const zoomed=img.classList.contains('zoom');
  if(!zoomed){ img.style.transformOrigin=`${(x*100).toFixed(1)}% ${(y*100).toFixed(1)}%`; img.classList.add('zoom'); }
  else { const ox=parseFloat(img.style.transformOrigin)/100, oy=parseFloat(img.style.transformOrigin.split(' ')[1])/100;
    const rx=ox+(x-ox)/2.6, ry=oy+(y-oy)/2.6;   /* the click inside the zoomed picture, back in picture fractions */
    const [a,b,c,d]=TUE_PHONE; if(rx>=a&&rx<=c&&ry>=b&&ry<=d){ S.tue.found=true; tueSave('found',true); const p=img.closest('.cv-big').querySelector('.cv-find'); if(p){ p.textContent=T('tue_clipFound'); p.classList.add('ok'); } SFX.click&&SFX.click(); }
    else img.classList.remove('zoom'); } }

/* Mia's figure is not at the window - she «goes to look» (empty chair with a badge) */
function tueOpen(){ const c=PROG.mon&&PROG.mon.dm; mod2Say('tueOpen',T(c==='truth'?'tue_openTruth':c==='lie'?'tue_openLie':'tue_openQuiet')); }

function tueAnomaly(){ const A={at:S.t, phase:'crack'}; S.glitch=.25; SFX.surge&&SFX.surge(); S.lamps.window.flick=.3; return A; }
function tueAnomalyTick(A){ const T2=S.tue, st=S.st; if(!A) return;
  if(A.phase==='crack' && S.t-A.at>2){ A.phase='out'; S.lamps.window.outT=5; S.lamps.window.mode='STABLE'; SFX.burn&&SFX.burn(); mod2Say('tueLampOut',T('tue_lampOut'));
    st.stage='window'; st.p=.1; st.red=false;   /* far, in the yard under the streetlight */
    later(()=>{ if(!S) return; const w=pushMsg('normal','quiet_reader',T('tue_warn')); w.warn='window'; T2.warnId=w.id; w.waitPin=1; w.st='waitpin'; mod2Sync(w); T2.warnFreeAt=S.t+16;   /* 16 s to decide before she reads it herself */
      w.onRead=(x,aloud)=>{ if(!aloud){ T2.readSelf=true; return; } if(T2.shown) return; T2.shown=true;   /* shown: she reacts now, not at the defense */
        later(()=>{ if(!S) return; mod2Say('tueShown',T('tue_shownWhat')); T2.ask='pending'; later(()=>{ if(S&&T2.ask==='pending') tueAskShow(T2); },1200); },1300); };   /* 23.11: she asks - the player answers (no timer) */
      later(()=>{ if(S) pushMsg('normal','sleepy_otter',T('tue_calmMsg')); },2600);
      hintAt(T('tue_howYard'),()=>$('lamp-window').querySelector('[data-m="BOOST"]')||$('lamp-window'),{ttl:12,now:true}); },1800);
    A.courierAt=S.t+16; }
  if(A.phase==='out'){ if(!T2.def && (st.stage!=='window'||st.p>.12)){ st.stage='window'; st.p=.1; }
    if(T2.warnFreeAt && S.t>T2.warnFreeAt){ T2.warnFreeAt=0; const w=S.chat.find(x=>x.id===T2.warnId); if(w&&w.waitPin){ w.waitPin=0; if(w.st==='waitpin'){ w.st='feed'; w.feedAt=S.t; } mod2Sync(w); } }   /* he just stands there until the defense */
    if(A.courierAt && S.t>A.courierAt){ A.courierAt=0; const m=pushMsg('normal','night_owl_77',T('tue_courier')); T2.courierId=m.id;
      m.onRead=()=>{ if(T2.courierRead) return; T2.courierRead=true; addPanic(5); later(()=>{ if(S) mod2Say('tueCourier',T('tue_courierRead')); },900); }; } } }

/* who decided what about the warning (at the start of the defense) */
function tueDecision(T2){ const w=S.chat.find(x=>x.id===T2.warnId);
  return T2.shown||(S.m2&&S.m2.pinned===T2.warnId)?'shown':(w&&w.banned)?'banned':'none'; }

function tueDefense(T2){ const D={at:S.t, retreats:0, last:'hidden', done:false};
  T2.decided=tueDecision(T2); tueSave('decided',T2.decided);
  if(T2.decided==='shown'){ /* she already reacted when she read it; in the defense she helps with the blinds (tueDefenseTick) */ }
  else if(T2.decided==='none'){ mod2Say('tueLook',T('tue_selfLook')); later(()=>{ if(S) monAway(14,T('tue_atWindow')); },2000); addPanic(6); }
  if(T2.ask==='blinds' && S.blinds.closed) S.blinds.timer=6;   /* the blinds she closed open again a little after the defense starts */
  S.noDeath=true; S.stalkerOn=true; S.st.stage='hidden'; S.st.p=0; S.st.wait=1.5;
  hintAt(T('tue_howDef'),()=>$('lamp-window'),{ttl:8,now:true});
  return D; }
function tueDefenseTick(D,T2){ if(!D||D.done) return; const st=S.st;
  if(D.last!=='hidden' && st.stage==='hidden') D.retreats++;
  D.last=st.stage;
  if(T2.decided==='shown' && T2.ask==='blinds' && st.stage==='window' && st.p>.3 && !S.blinds.closed && S.blinds.cd<=0 && (D.helped||0)<2 && !S.blinds.jammed){   /* warned: she lowers the blinds herself */
    D.helped=(D.helped||0)+1; S.blinds.closed=true; S.blinds.timer=8; S.blinds.cd=CD.blinds; SFX.blinds&&SFX.blinds(); mod2Say('tueHelp',T('tue_help')); }
  if(T2.decided==='banned' && S.blinds.closed && !D.whyBlinds){ D.whyBlinds=true; tueSave('why',true); later(()=>{ if(S) mod2Say('tueWhy',T('tue_whyBlinds')); },800); }
  if(D.retreats>=2 || S.t-D.at>75 || D.cut){ D.done=true; S.stalkerOn=false; S.noDeath=false; st.stage='hidden'; st.p=0; T2.defAt=S.t; hintClear();
    if(S.mia.awayScripted){ S.mia.awayT=0; S.mia.awayScripted=false; } } }
/* endGame() during the defense lands here: a bad scare, a cut stream, the night goes on to its consequence */
function tueSpared(reason){ const T2=S.tue, D=T2&&T2.def; if(!D||D.done) return;
  T2.fail=true; tueSave('fail',true); D.cut=true; SFX.scare&&SFX.scare(); S.glitch=1.4; S.shake=.6; S.panic=Math.min(S.panic,85);
  S.mia.forceFace='panic'; S.mia.forceFaceUntil=S.t+4; floaty(T('tue_cut')); tueDefenseTick(D,T2); }

function tueEndStory(T2){ const L=[T(T2.decided==='shown'?'tue_sumShown':T2.decided==='banned'?'tue_sumBanned':'tue_sumNone')];
  if(T2.found) L.push(T('tue_sumFound')); if(T2.fail) L.push(T('tue_sumFail')); return L.join(' '); }

function tueTick(dt){
  const T2=S.tue||(S.tue={});
  if(!T2.boot){ T2.boot=true; monPeonies(true); }   /* the peonies are still on the desk */
  if(!T2.open && S.t>8){ T2.open=true; tueOpen(); }
  if(!T2.music && S.t>20) T2.music=askChat({ask:'tue_musicAsk', self:'tue_musicSelf', how:'mon_how1', opts:TUE_MUSIC, wait:20});
  askChatTick(T2.music); if(T2.music&&T2.music.done&&T2.musicAt==null) T2.musicAt=S.t;
  if(!T2.cat && T2.musicAt!=null && S.t-T2.musicAt>8){ T2.cat=true; T2.catAt=S.t; mod2Say('tueCat',T('tue_cat').replace('{cat}',monCat())); }
  if(!T2.anom && T2.catAt!=null && S.t-T2.catAt>7) T2.anom=tueAnomaly();
  tueAnomalyTick(T2.anom);
  if(!T2.def && T2.anom && S.t-T2.anom.at>50 && T2.ask!=='pending' && (T2.answeredAt==null||S.t-T2.answeredAt>8)) T2.def=tueDefense(T2);   /* her action plays out before he comes */
  tueDefenseTick(T2.def,T2);
  if(T2.defAt!=null){ const t=S.t-T2.defAt;
    if(!T2.cons && t>4){ T2.cons=true; mod2Say('tueEnd',T(T2.fail?'tue_endFail':T2.decided==='shown'?'tue_endShown':T2.decided==='banned'?'tue_endBanned':'tue_endNone')); }
    if(!T2.bye && t>13 && !T2.fail){ T2.bye=true; mod2Say('tueBye',T('tue_bye')); }
    if(!T2.ended && t>(T2.fail?9:19)){ T2.ended=true; S.endStory=tueEndStory(T2); endGame('win'); } }
}

/* ---------------- the DM after Tuesday: one agreement for the next nights */
const DM_TUE={ru:{
  hi:'модер… спасибо, что был сегодня', shown:'без тебя я бы так и сидела у окна', banned:'странно, жалюзи сами закрылись… это ведь ты был?', bannedQuiet:'странный вечер был. я так ничего и не поняла',
  none:'я ходила к окну, и там правда кто-то стоял. я так испугалась', fail:'мне до сих пор страшно. я не знаю, что это было',
  ask:'давай договоримся. если что-то случится — что мне делать?',
  r1:'ночью окно не открывай, даже если попросят в чате', r2:'если что-то услышишь — сначала закрывай жалюзи', r3:'если что-то пойдёт не так — сразу пиши мне',
  ok:'хорошо. я тебе доверяю' },
en:{
  hi:'mod… thank you for being here tonight', shown:'without you i\'d still be sitting by that window', banned:'weird, the blinds closed by themselves… that was you, right?', bannedQuiet:'weird evening. i still don\'t get what happened',
  none:'i went to the window, and someone really was there. i was so scared', fail:'i\'m still scared. i don\'t know what that was',
  ask:'let\'s agree on something. if anything happens — what should i do?',
  r1:'don\'t open the window at night, even if chat asks', r2:'if you hear something, close the blinds first', r3:'if anything goes wrong, message me right away',
  ok:'okay. i trust you' }};
function dmTuesday(done){ const L=DM_TUE[LANG]||DM_TUE.en, P=PROG.tue||{};
  const line=P.fail?L.fail:P.decided==='shown'?L.shown:P.decided==='banned'?(P.why?L.banned:L.bannedQuiet):L.none;
  dmShow([{mia:L.hi},{mia:line},{mia:L.ask},
    {pick:[{id:'window',text:L.r1},{id:'blinds',text:L.r2},{id:'write',text:L.r3}], save:id=>tueSave('rule',id)},
    {mia:L.ok}],done,{keep:true}); }   /* 23.11: the window stays - Stranger's message comes next (tueFinale) */

/* the last message and the countdown card, then the demo end (or the next night in the full game) */
function tueFinale(done,demo){   /* 23.11: «I trust you» - a pause - a new private message from Stranger_99 in its own dialog - dark - (demo) the end card */
  const w=$('dmWin'); if(!w){ done&&done(); return; }
  setTimeout(()=>{ let n=w.querySelector('.dm-note'); if(!n){ n=document.createElement('div'); n.className='dm-note'; w.querySelector('.dm-box').appendChild(n); }
    n.innerHTML=`<span class="dm-note-av"></span><span class="dm-note-t"><b>Stranger_99</b><small>${esc(T('tue_dmNew'))}</small></span><button type="button" class="pbtn">${esc(T('tue_dmOpen'))}</button>`;
    n.hidden=false; SFX.softKnock&&SFX.softKnock();
    n.querySelector('button').onclick=()=>{ n.hidden=true;
      dmShow([{mia:T('tue_whisper')}],()=>{ setTimeout(()=>tueFadeOut(done,demo),3200); },{who:'Stranger_99',sub:T('tue_dmSub'),cls:'stranger',keep:true}); }; },1600); }
function tueFadeOut(done,demo){ const w=$('dmWin'), st=$('stage'); let el=$('monCold'); if(!el){ el=document.createElement('div'); el.id='monCold'; st.appendChild(el); }
  el.hidden=false; el.classList.add('fin'); el.innerHTML=demo?`<p>${esc(T(window.TM_JAM===true?'tue_chapEnd':'tue_demoEnd'))}</p>`:''; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
  setTimeout(()=>{ if(w) w.hidden=true; },600);
  setTimeout(()=>{ el.hidden=true; el.classList.remove('fin'); done&&done(); },demo?3600:1600); }
/* the mod's answer to «what do I do?»: two buttons above the trust row; the answer goes to the stream chat as the mod's line */
function tueAskShow(T2){ const chat=$('chat'), foot=$('lcChatFoot'); if(!chat) return; let bar=$('tueAsk');
  if(!bar){ bar=document.createElement('div'); bar.id='tueAsk'; if(foot) chat.insertBefore(bar,foot); else chat.appendChild(bar); }
  bar.innerHTML=`<span>${esc(T('tue_askLbl'))}</span><button type="button" class="pbtn" data-a="blinds">${esc(T('tue_askBlinds'))}</button><button type="button" class="pbtn" data-a="away">${esc(T('tue_askAway'))}</button>`;
  bar.hidden=false; hintAt(T('tue_askLbl'),()=>bar,{ttl:6,now:true});
  bar.querySelectorAll('button').forEach(b=>b.onclick=()=>tueAnswer(T2,b.dataset.a)); }
function tueAnswer(T2,a){ if(!S||T2.ask!=='pending') return; T2.ask=a; T2.answeredAt=S.t; tueSave('ask',a); const bar=$('tueAsk'); if(bar) bar.hidden=true; hintClear();
  const m=pushMsg('normal',T('tue_modNick'),T(a==='blinds'?'tue_askBlinds':'tue_askAway').toLowerCase()); m.read=true; m.st='read'; m.isMod=true;
  later(()=>{ const el=document.querySelector(`#chatlist [data-id="${m.id}"]`); if(el) el.classList.add('modmsg'); },0);
  if(a==='blinds') later(()=>{ if(!S) return; mod2Say('tueDoBlinds',T('tue_doBlinds')); later(()=>{ if(!S||T2.def) return; S.blinds.closed=true; S.blinds.timer=999; SFX.blinds&&SFX.blinds(); },900); },900);   /* closed until the defense - nobody knows if he is still there */
  else later(()=>{ if(!S) return; mod2Say('tueDoAway',T('tue_doAway')); later(()=>{ if(S&&!T2.def) monAway(12,T('tue_awayBadge')); },1200); },900); }   /* she moves away; he stays in view outside */
