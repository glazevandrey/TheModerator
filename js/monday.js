"use strict";
/* THE MODERATOR — the new Monday (demo, 22–23.11.2026). Plan: the analyst's Mon–Tue plan, revised after the 22.11 playtest.
   Something for the player every 30–60 s, cracks growing; the player sees what Mia does not.
     0:00 cold open (two cards)        · 0:12 «с чего начнём» (show a viewer's answer) · then a troll (ban) · then the lights
     then the plush cat's name (show) · ~1:40 «Stranger_99 вошёл в чат», silent · ~2:00 a spam bot (one ban clears it)
     ~2:40 the doorbell: door light, she goes, comes back with peonies, no note · ~3:40 the movie after the stream (show)
     ~4:30 she goes for tea: «присмотри за чатом» → empty room → he is at the window (only the player sees him)
            BRIGHT → he leaves; she comes back and only noticed the light · nothing → a knock as she comes back, she flinches
     then a calm line · +18 s «спокойной ночи» · +32 s the light goes out, the stream does not end
     · +38 s to the mod only: Stranger_99 «ты снова тут? я скучал».
   No stalker system on Monday (NIGHTS.mon.noStalker): his one visit is scripted here. Mia reads the chat (mod2, no filter).
   askChat() is the shared «question → three viewer answers → one shown» scene. What happened is kept in PROG.mon for the DMs. */

Object.assign(STR.ru,{
  mon_ask1:'модер, ты тут? чат голосует, с чего начнём. покажи мне, что выбрали',
  mon_ask1Self:'модер занят? ладно, тогда просто поболтаем',
  mon_task1:'Покажи Мие, что выбрал чат', mon_how1:'Выбери ответ зрителя и нажми «Показать Мие».',
  mon_troll:'тупая стримерша, иди спать уже', mon_taskBan:'Убери тролля', mon_howBan:'Он оскорбляет Мию. Наведи на сообщение и нажми «Бан».',
  mon_banThanks:'о, кто-то тут уже наводит порядок. спасибо, модер', mon_trollRead:'…ну и ладно. не буду обращать внимания',
  mon_lightAsk:'модер, я дала тебе гостевой доступ к лампам. прибавь свет у окна — проверим, работает ли', mon_taskLight:'Включи ЯРКИЙ у окна',
  mon_howLight:'Мия дала тебе доступ к свету. Нажми ЯРКИЙ у окна (или клавишу 1).', mon_lightThanks:'о, работает! красиво стало. спасибо',
  mon_lightSelf:'ладно, потом проверим лампы',
  mon_seeHow:'Движение у окна. Проверь светом — ЯРКИЙ у окна.', mon_taskSee:'Кто-то у окна',
  mon_cold1:'11 августа 2025 года эфир NyanBun оборвался.\nМию так и не нашли.', mon_cold2:'4 августа. За семь дней до этого.',
  mon_catAsk:'знакомьтесь: это мой плюшевый кот, у него до сих пор нет имени. чат, предлагайте! модер, покажи мне лучшее',
  mon_catSelf:'ладно, пусть пока будет просто Кот', mon_taskCat:'Помоги назвать кота', mon_howCat:'Выбери имя и нажми «Показать Мие».',
  mon_joined:'Stranger_99 вошёл в чат',
  mon_bot1:'хочешь славы? раскрутка в описании профиля', mon_bot2:'бесплатные зрители >> nyan-boost.store', mon_taskBot:'Убери спам-бота',
  mon_botGone:'о, бота уже нет. спасибо, модер',
  mon_bellAsk:'ой, звонок… кто так поздно? модер, включи свет у двери, в коридоре темно', mon_taskBell:'Включи ЯРКИЙ у двери',
  mon_howBell:'Нажми ЯРКИЙ у двери (клавиша 3).', mon_bellGo:'сейчас, гляну кто там', mon_away:'Мия отошла',
  mon_peonies:'цветы… розовые пионы. без записки. я никому адрес не давала… может, соседка ошиблась?',
  mon_peonies2:'ладно, поставлю в воду. красивые же',
  mon_movieAsk:'после стрима что-нибудь посмотрю. чат, что? модер, покажи мне победителя',
  mon_movieSelf:'ладно, решу сама', mon_taskMovie:'Помоги выбрать фильм',
  mon_teaGo:'так, я за чаем. модер, присмотри за чатом, ладно?', mon_taskTea:'Присмотри за эфиром',
  mon_teaLight:'я вернулась… модер, это ты свет у окна включал?', mon_teaKnock:'ай! что-то стукнуло в окно… ветка, наверное',
  mon_teaBack:'я вернулась! чай с мятой, как и обещала',
  mon_calm:'{cat} сегодня молодец, весь эфир просидел смирно',
  mon_bye:'всё, чат, спокойной ночи. завтра в то же время. модер… ты ведь будешь?',
  mon_dark:'ой, свет… пробки, что ли? ладно, всё равно выключаюсь',
  mon_whisper:'Stranger_99 → тебе: «ты снова тут? я скучал»', mon_dmTag:'личное сообщение', mon_whisperNoBan:'Это личное сообщение. Отправителя нет в чате.'
});
Object.assign(STR.en,{
  mon_ask1:'mod, are you here? chat is voting how we start. show me what they picked',
  mon_ask1Self:'mod is busy? okay, we just chat then',
  mon_task1:'Show Mia what chat picked', mon_how1:'Pick a viewer\'s answer and press «Show Mia».',
  mon_troll:'dumb streamer, just go to bed', mon_taskBan:'Remove the troll', mon_howBan:'He is insulting Mia. Hover the message and press «Ban».',
  mon_banThanks:'oh, someone is already keeping order here. thanks, mod', mon_trollRead:'…whatever. not paying attention to that',
  mon_lightAsk:'mod, i gave you guest access to the lamps. turn up the window light — let\'s see if it works', mon_taskLight:'Turn the window lamp BRIGHT',
  mon_howLight:'Mia gave you the lights. Press BRIGHT on the window lamp (or key 1).', mon_lightThanks:'oh, it works! looks nice. thanks',
  mon_lightSelf:'okay, we\'ll check the lamps later',
  mon_seeHow:'Movement at the window. Check it with light — BRIGHT on the window.', mon_taskSee:'Someone at the window',
  mon_cold1:'On August 11, 2025, the NyanBun stream cut off.\nMia was never found.', mon_cold2:'August 4. Seven days earlier.',
  mon_catAsk:'meet my plush cat. he still has no name. chat, ideas! mod, show me the best one',
  mon_catSelf:'okay, let\'s just call him Cat for now', mon_taskCat:'Help name the cat', mon_howCat:'Pick a name and press «Show Mia».',
  mon_joined:'Stranger_99 joined the chat',
  mon_bot1:'want to go viral? promo in my profile', mon_bot2:'free viewers >> nyan-boost.store', mon_taskBot:'Remove the spam bot',
  mon_botGone:'oh, the bot\'s gone. thanks, mod',
  mon_bellAsk:'oh, the doorbell… who is it this late? mod, turn on the door light, the hallway is dark', mon_taskBell:'Turn the door lamp BRIGHT',
  mon_howBell:'Press BRIGHT on the door lamp (key 3).', mon_bellGo:'one sec, let me see who it is', mon_away:'Mia stepped away',
  mon_peonies:'flowers… pink peonies. no note. i never gave anyone my address… maybe a neighbour mixed up the door?',
  mon_peonies2:'okay, they go in water. they\'re pretty',
  mon_movieAsk:'i\'ll watch something after the stream. chat, what? mod, show me the winner',
  mon_movieSelf:'okay, i\'ll pick myself', mon_taskMovie:'Help pick a movie',
  mon_teaGo:'okay, getting tea. mod, keep an eye on the chat, okay?', mon_taskTea:'Watch the stream',
  mon_teaLight:'i\'m back… mod, did you turn on the window light?', mon_teaKnock:'ah! something hit the window… a branch, probably',
  mon_teaBack:'i\'m back! mint tea, as promised',
  mon_calm:'{cat} was so good tonight, sat still the whole stream',
  mon_bye:'okay chat, good night. same time tomorrow. mod… you\'ll be here, right?',
  mon_dark:'oh, the lights… a fuse? whatever, i\'m logging off anyway',
  mon_whisper:'Stranger_99 → you: «you\'re here again? i missed you»', mon_dmTag:'private message', mon_whisperNoBan:'This is a private message. The sender is not in the chat.'
});
const MON_CAT=[
  {u:'sleepy_otter', ru:'Пухлик!', en:'Puffy!', name:{ru:'Пухлик',en:'Puffy'}, rr:'Пухлик… да он и правда пухлик. решено!', re:'Puffy… he really is puffy. done!'},
  {u:'noodle_owl', ru:'Мармелад', en:'Marmalade', name:{ru:'Мармелад',en:'Marmalade'}, rr:'Мармелад! сладкий, как он сам', re:'Marmalade! as sweet as he is'},
  {u:'vhs_witch', ru:'Граф Мурлыка', en:'Count Purrington', name:{ru:'Граф Мурлыка',en:'Count Purrington'}, rr:'Граф Мурлыка… звучит солидно. ваше сиятельство', re:'Count Purrington… very dignified. your grace'} ];
const MON_MOVIE=[
  {u:'noodle_owl', ru:'ужастик про дом с призраками', en:'a haunted house horror', rr:'ужастик? после сегодняшнего… ладно, но с включённым светом', re:'horror? after tonight… fine, but with the lights on'},
  {u:'sleepy_otter', ru:'мультик про котиков', en:'a cartoon about cats', rr:'котики! {cat} одобряет', re:'cats! {cat} approves'},
  {u:'vhs_witch', ru:'документалку про космос', en:'a space documentary', rr:'космос, хорошо. засну на второй минуте, но хорошо', re:'space, nice. i\'ll fall asleep in two minutes, but nice'} ];
const MON_ASK1=[
  {u:'sleepy_otter', ru:'давай просто поболтаем!', en:'let\'s just chat!',
   rr:'болтаем! наливайте чай, сегодня никуда не спешим', re:'chatting it is! get your tea, no rush tonight'},
  {u:'noodle_owl', ru:'порисуй котиков', en:'draw some cats',
   rr:'котиков попозже, честно. сначала поболтаем', re:'cats later, promise. chatting first'},
  {u:'vhs_witch', ru:'включи что-нибудь страшное', en:'put on something scary',
   rr:'страшное? не-не, у меня сегодня уютный вечер :)', re:'scary? nope, cozy night today :)'} ];

/* one question to chat, three answers she waits on (waitPin: she does not read them on her own), one shown → read aloud + answered */
function askChat(spec){
  const A={ spec, ids:[], done:false, at:S.t, picked:null };
  mod2Say('monAsk',T(spec.ask));
  spec.opts.forEach((o,i)=>later(()=>{ if(!S||A.done) return;
    const m=pushMsg('normal',o.u,o[LANG]||o.ru,{acc:'v:'+o.u});
    m.waitPin=1; m.st='waitpin'; mod2Sync(m); A.ids.push(m.id); setTimeout(()=>askMark(m.id,true),60);   /* the three answers are marked */
    m.onRead=(x,aloud)=>{ if(!aloud||A.done) return; A.done=true; A.picked=i; askChatEnd(A); hintClear(); if(spec.onPick) spec.onPick(i);
      later(()=>{ if(S) mod2Say('monAskReply',(LANG==='ru'?o.rr:o.re).replace('{cat}',monCat())); },1400); };
  },600+i*800));
  hintAt(T(spec.how),()=>{ const id=A.ids[0]; return id!=null&&list.querySelector(`[data-id="${id}"]`)||$('chatlist'); },{ttl:9,now:false});
  return A;
}
/* the options she did not pick become ordinary lines: she may read them later like any other */
function askMark(id,on){ const el=list.querySelector(`[data-id="${id}"]`); if(el) el.classList.toggle('fri-hl',on); }
function askChatEnd(A){ for(const id of A.ids){ askMark(id,false); const m=S.chat.find(x=>x.id===id); if(m&&m.waitPin){ m.waitPin=0; if(m.st==='waitpin'){ m.st='feed'; m.feedAt=S.t; } mod2Sync(m); } } }
function askChatTick(A){ if(!A||A.done) return;
  if(S.t-A.at>A.spec.wait && !(S.m2&&S.m2.pinned!=null&&A.ids.includes(S.m2.pinned))){ A.done=true; A.picked=-1; askChatEnd(A); hintClear(); if(A.spec.onPick) A.spec.onPick(-1); mod2Say('monAskSelf',T(A.spec.self)); } }

/* the task line under the video while a question is open (layout.js taskNow) */
function monTask(){ const M=S&&S.mon; if(!M) return null;
  if(M.ask1&&!M.ask1.done) return {t:T('mon_task1'), s:''};
  if(M.ban&&!M.ban.done) return {t:T('mon_taskBan'), s:''};
  if(M.light&&!M.light.done) return {t:T('mon_taskLight'), s:''};
  if(M.cat&&!M.cat.done) return {t:T('mon_taskCat'), s:''};
  if(M.bot&&!M.bot.done) return {t:T('mon_taskBot'), s:''};
  if(M.bell&&M.bell.phase==='ask') return {t:T('mon_taskBell'), s:''};
  if(M.movie&&!M.movie.done) return {t:T('mon_taskMovie'), s:''};
  if(M.tea&&M.tea.phase!=='done') return {t:M.tea.seenAt!=null&&!M.tea.res?T('mon_taskSee'):T('mon_taskTea'), s:''};
  return null; }

/* piece 2: one obvious troll. She does not read him for 12 s (time to find «Бан»); banned → she thanks the mod,
   left alone → she reads it herself and shrugs it off (the usual cost of a read troll) */
function monBan(){ const B={ id:null, done:false, at:S.t };
  const m=pushMsg('troll','xX_h4ter_Xx',T('mon_troll')); B.id=m.id; m.waitPin=1; m.st='waitpin'; mod2Sync(m); setTimeout(()=>askMark(m.id,true),60);
  hintAt(T('mon_howBan'),()=>list.querySelector(`[data-id="${B.id}"]`)||$('chatlist'),{ttl:12,now:true});
  return B; }
function monBanTick(B){ if(!B||B.done) return; const m=S.chat.find(x=>x.id===B.id);
  if(!m||m.banned){ B.done=true; hintClear(); later(()=>{ if(S) mod2Say('monBanThanks',T('mon_banThanks')); },900); return; }
  if(S.t-B.at>12 && m.waitPin){ m.waitPin=0; askMark(m.id,false); if(m.st==='waitpin'){ m.st='feed'; m.feedAt=S.t; } mod2Sync(m); }
  if(m.st==='read'){ B.done=true; hintClear(); later(()=>{ if(S) mod2Say('monTrollRead',T('mon_trollRead')); },1200); } }

/* piece 2: the guest access to the lamps - she asks for BRIGHT at the window and reacts; nothing chases anyone */
function monLight(){ const L={ done:false, at:S.t };
  mod2Say('monLightAsk',T('mon_lightAsk'));
  hintAt(T('mon_howLight'),()=>$('lamp-window').querySelector('[data-m="BOOST"]')||$('lamp-window'),{ttl:12,now:true});
  return L; }
function monLightTick(L){ if(!L||L.done) return;
  if(lampMode('window')==='BOOST'){ L.done=true; hintClear(); later(()=>{ if(S) mod2Say('monLightThanks',T('mon_lightThanks')); },700); return; }
  if(S.t-L.at>25){ L.done=true; hintClear(); mod2Say('monLightSelf',T('mon_lightSelf')); } }

/* the plush cat's name stays with Mia (later nights and the DMs use it) */
function monCat(){ const n=PROG.mon&&PROG.mon.cat; return n?(n[LANG]||n.ru):(LANG==='ru'?'Кот':'Cat'); }
function monSave(k,v){ PROG.mon=PROG.mon||{}; PROG.mon[k]=v; try{ saveProg(); }catch(e){} }

/* the cold open: two cards, ~8 s, the night waits; a click skips */
function monCold(){ const st=$('stage'); let el=$('monCold'); if(!el){ el=document.createElement('div'); el.id='monCold'; st.appendChild(el); }
  setPause(true); $('ovPause').hidden=true; el.hidden=false;
  const show=(t)=>{ el.innerHTML=`<p>${esc(t).replace(/\n/g,'<br>')}</p>`; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); };
  let done=false; const end=()=>{ if(done) return; done=true; el.hidden=true; if(S&&!S.over&&paused) setPause(false); };
  show(T('mon_cold1')); setTimeout(()=>{ if(!done) show(T('mon_cold2')); },4200); setTimeout(end,7600); el.onclick=end; }

/* a spam bot: three quick lines; one ban clears all his lines */
function monBot(){ const B={ user:'promo_bot77', ids:[], at:S.t, done:false };
  [T('mon_bot1'),T('mon_bot2'),T('mon_bot1')].forEach((t,i)=>later(()=>{ if(!S||B.done) return; B.ids.push(pushMsg('spam',B.user,t).id); },i*1300));
  return B; }
function monBotTick(B){ if(!B||B.done) return; const mine=S.chat.filter(m=>m.user===B.user);
  if(mine.some(m=>m.banned)){ B.done=true; for(const m of mine) if(!m.banned){ m.banned=true; banAnim(m); } hintClear(); later(()=>{ if(S) mod2Say('monBotGone',T('mon_botGone')); },900); }
  else if(S.t-B.at>40) B.done=true; }   /* ignored: toxicity grew, nothing else */

/* scripted walk away: the empty chair, no generic «я вернулась» (smart-home.js), her own line on return */
function monAway(sec,badge){ S.mia.awayT=sec; S.mia.awayScripted=true; S.mia.sawSomething=false; $('awaybadge').textContent=badge||T('mon_away'); }

/* the doorbell → door light → she goes → peonies on the desk */
function monBell(){ const B={ phase:'ask', at:S.t };
  SFX.doorbell&&SFX.doorbell(); later(()=>{ if(S) mod2Say('monBellAsk',T('mon_bellAsk')); },900);
  later(()=>{ if(S&&B.phase==='ask') SFX.doorbell&&SFX.doorbell(); },5200);   /* 23.11: the courier rings again while the door is still dark */
  hintAt(T('mon_howBell'),()=>$('lamp-door').querySelector('[data-m="BOOST"]')||$('lamp-door'),{ttl:10,now:false});
  return B; }
function monBellTick(B){ if(!B) return;
  if(B.phase==='ask' && (lampMode('door')==='BOOST' || S.t-B.at>14)){ B.phase='away'; B.lit=lampMode('door')==='BOOST'; hintClear(); mod2Say('monBellGo',T('mon_bellGo')); B.goAt=S.t+2.5; }
  else if(B.phase==='away' && B.goAt && S.t>B.goAt){ B.goAt=0; monAway(16); B.backAt=S.t+16; }
  else if(B.phase==='away' && B.backAt && S.t>B.backAt){ B.phase='back'; monPeonies(true); mod2Say('monPeonies',T('mon_peonies')); B.at2=S.t; }
  else if(B.phase==='back' && S.t-B.at2>7){ B.phase='done'; mod2Say('monPeonies2',T('mon_peonies2')); } }
function monPeonies(on){ let im=$('monPeonies'); if(!im){ im=document.createElement('img'); im.id='monPeonies'; im.alt=''; im.src=(window.DEMO_ART||'v2/demo/')+'peonies.png'; $('feed').after(im); }   /* right over the picture, under every overlay (day intro, scanlines, captions) */ im.hidden=!on; }

/* she goes for tea: the empty room; he comes to the window; only the player sees him.
   BRIGHT (after 1.5 s of him being visible) → he steps back and leaves; she returns and noticed only the light.
   Nothing → he stays; as she returns, a knock - she hears it, does not see him. No lines while she is away. */
function monTea(){ const V={ phase:'say', at:S.t, seenAt:null, res:null };
  mod2Say('monTeaGo',T('mon_teaGo')); return V; }
function monTeaTick(V,dt){ if(!V||V.phase==='done') return; const st=S.st;
  if(V.phase==='say' && S.t-V.at>3){ V.phase='away'; monAway(26); V.backAt=S.t+26; V.comeAt=S.t+5; }
  if(V.phase==='away'){
    if(S.t>V.comeAt && !V.res){ if(st.stage!=='window'){ st.stage='window'; st.p=.05; st.red=false; SFX.creak&&SFX.creak(); }
      st.p=Math.min(.55,st.p+dt*.18);
      if(st.p>=.3 && V.seenAt==null){ V.seenAt=S.t; hintAt(T('mon_seeHow'),()=>$('lamp-window').querySelector('[data-m="BOOST"]')||$('lamp-window'),{ttl:9,now:true}); }
      if(V.seenAt!=null && lampMode('window')==='BOOST' && S.t-V.seenAt>1.5){ V.res='light'; hintClear(); } }
    if(V.res==='light' && st.stage==='window'){ st.leaving=true; st.p=Math.max(0,st.p-dt*.13); if(st.p<=0){ st.stage='hidden'; st.p=0; st.leaving=false; } }   /* 23.11: ~4 s back into the dark, fading */
    if(S.t>V.backAt){ V.phase='back'; S.mia.awayT=0; S.mia.awayScripted=false; $('awaybadge').hidden=true;
      if(V.res==='light'){ later(()=>{ if(S) mod2Say('monTeaLight',T('mon_teaLight')); },600); }
      else if(V.seenAt!=null){ V.res='knock'; hintClear(); SFX.knock&&SFX.knock(); S.shake=.3; miaFlinch(1); addPanic(12);
        S.mia.forceFace='scared'; S.mia.forceFaceUntil=S.t+3; later(()=>{ if(S) mod2Say('monTeaKnock',T('mon_teaKnock')); },500); }
      else { V.res='none'; later(()=>{ if(S) mod2Say('monTeaBack',T('mon_teaBack')); },600); }
      monSave('contact',V.res); V.leaveAt=S.t; } }
  if(V.phase==='back'){ if(st.stage==='window'){ st.leaving=true; st.p=Math.max(0,st.p-dt*.13); if(st.p<=0){ st.stage='hidden'; st.p=0; st.leaving=false; } }
    if(S.t-V.leaveAt>4 && st.stage==='hidden') V.phase='done'; } }

/* the end: good night, the light goes out, the stream does not cut, a line only the mod sees */
function monEnd(M){   /* the end follows the scenes, not the clock: a quick player is not left waiting; S.len is only a safety net */
  if(M.calmAt==null) return; const t=S.t-M.calmAt;
  if(!M.bye && t>18){ M.bye=true; mod2Say('monBye',T('mon_bye')); }
  if(M.whisperAt && S.t-M.whisperAt>10 && !M.ended){ M.ended=true; endGame('win'); return; }   /* 23.11: 6 s was too short to read it */
  if(!M.dark && t>32){ M.dark=true; for(const z of ZONES){ S.lamps[z].outT=60; S.lamps[z].mode='STABLE'; } SFX.burn&&SFX.burn(); S.glitch=.4; $('video').classList.add('mon-dark'); later(()=>{ if(S) mod2Say('monDark',T('mon_dark')); },700); }
  if(!M.whisper && t>38){ M.whisper=true; M.whisperAt=S.t; SFX.softKnock&&SFX.softKnock(); const m=pushMsg('sys','',T('mon_whisper')); if(m){ m.read=true; const el=list.querySelector(`[data-id="${m.id}"]`); if(el){ el.classList.add('modwhisper'); el.dataset.dm=T('mon_dmTag'); el.onclick=()=>{ floaty(T('mon_whisperNoBan')); SFX.softKnock&&SFX.softKnock(); }; } } } }

function monTick(dt){
  const M=S.mon||(S.mon={});
  if(!M.cold){ $('video').classList.remove('mon-dark'); monPeonies(false); M.cold=true; if(!(PROG.mon&&PROG.mon.coldSeen)){ monSave('coldSeen',true); monCold(); } }
  const after=(k,sec)=>M[k+'At']!=null && S.t-M[k+'At']>sec;
  const mark=(k,done)=>{ if(done && M[k+'At']==null) M[k+'At']=S.t; };
  if(!M.ask1 && S.t>10 && (mod2FreeToTalk()||S.t>14)) M.ask1=askChat({ask:'mon_ask1', self:'mon_ask1Self', how:'mon_how1', opts:MON_ASK1, wait:25});
  askChatTick(M.ask1); mark('ask1',M.ask1&&M.ask1.done);
  if(!M.ban && after('ask1',6)) M.ban=monBan();
  monBanTick(M.ban); mark('ban',M.ban&&M.ban.done);
  if(!M.light && after('ban',6) && (mod2FreeToTalk()||S.t-M.banAt>9)) M.light=monLight();
  monLightTick(M.light); mark('light',M.light&&M.light.done);
  if(!M.cat && after('light',7)) M.cat=askChat({ask:'mon_catAsk', self:'mon_catSelf', how:'mon_howCat', opts:MON_CAT, wait:25,
    onPick:i=>monSave('cat',i>=0?MON_CAT[i].name:null)});
  askChatTick(M.cat); mark('cat',M.cat&&M.cat.done);
  if(!M.joined && after('cat',4)){ M.joined=true; const m=pushMsg('sys','',T('mon_joined')); if(m) m.read=true; S.viewers+=1; }
  if(!M.bot && after('cat',12)) M.bot=monBot();
  monBotTick(M.bot); mark('bot',M.bot&&M.bot.done);
  if(!M.bell && after('bot',8)) M.bell=monBell();
  monBellTick(M.bell); mark('bell',M.bell&&M.bell.phase==='done');
  if(!M.movie && after('bell',8)) M.movie=askChat({ask:'mon_movieAsk', self:'mon_movieSelf', how:'mon_how1', opts:MON_MOVIE, wait:25,
    onPick:i=>monSave('movie',i)});
  askChatTick(M.movie); mark('movie',M.movie&&M.movie.done);
  if(!M.tea && after('movie',10)) M.tea=monTea();
  monTeaTick(M.tea,dt); mark('tea',M.tea&&M.tea.phase==='done');
  if(!M.calm && after('tea',10)){ M.calm=true; M.calmAt=S.t; mod2Say('monCalm',T('mon_calm').replace('{cat}',monCat())); }
  monEnd(M);
}
