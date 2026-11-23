"use strict";
/* ======================= FRIDAY SLICE DIRECTOR v3 — «Он был здесь» как сюжетный эфир (Steam, block 3b) =======================
   Only on Friday with mod2 (FRIDAY_SLICE_2026-11-19.md). Loaded after game.js.
   v3 after the live tests of 19.11: the lamps are no longer the main job. No random approaches at all — the director
   sends exactly TWO (the first real attack and the red eyes). Between them the stream itself is the game:
     0. pre-show tutorial (as v2)                     1. calm stream with small choices (movie pin, troll raid, a viewer's personal message)
     2. first suspicion: mint_fern about paper on the glass (you can also check yourself: blinds → BRIGHT → record)
     3. the imitator "open the window"                4. first attack (prepared / unprepared / window open)
     5. consequences + one private conversation, 3 answers   6. red eyes at the window — her readiness comes from 2–5
   Every important decision must change something visible on the stream (badge, empty chair, face, window, her words).
   What she read:  truth → no window, wary;  fake first → opens the window (and sees the photo);  truth then fake → hesitates;
                   nothing → keeps streaming, the window stays as it was.  One physical stalker, one filter rule. */

const FRI={ pre:5, mint:[6,30,48], movie:10, neighbour:24, raid:34, personal:44, truth:62, hint:65, fake:80, attack:96, dmAfter:4, finalAfter:7, finalAfterEnd:2, miaBlinds:8, endAfter:8, lenMax:360 };

Object.assign(STR.ru,{
  clm_thudAsk:'ой. что-то стукнуло по окну? модер, тебе с камеры видно?',
  clm_thudA:'Да, на стекле что-то есть',
  clm_thudB:'Ничего, показалось',
  clm_thudRepA:'что?.. сейчас гляну',
  clm_thudRepB:'ну ладно. ветка, наверное',
  clm_thudDrop:'…ладно. наверное, ветка',
  clm_redDeniedThud:'ты же сказал, что показалось!.. ГЛАЗА!',
  clm_whDeniedThud:'«показалось». хорошо сказано, модер',
  fri_s0:'Обучение · эфир ещё не начался', fri_step:'ШАГ {n}/3',
  fri_c1:'Мия ждёт выбора и сама эти сообщения не читает. Выбери любой вариант чая и закрепи: 📌 у сообщения или Q. Мия прочтёт его первым и ответит.',
  fri_c1b:'Закреплено. Мия прочтёт это сообщение первым, вслух, и ответит на него.',
  fri_c1x:'Сообщение скрыто — Мия его не увидит. Выдели его снова и нажми Q (ЗАКРЕПИТЬ): закреп вернёт его Мие.',
  fri_c2:'Золотая полоска — фильтр модератора. Сообщения со словами вроде «окно» он держит 6 секунд: Мия их пока не видит.',
  fri_c2b:'Фильтр отпустил сообщение. Теперь оно ждёт, когда Мия посмотрит в чат.',
  fri_c2c:'Глаз справа — Мия прочла. Она читает только то, что провисело в ленте пару секунд.',
  fri_c2x:'Здесь ничего нажимать не нужно — просто смотри, что происходит с сообщением.',
  fri_c3:'Это спойлер. Мия сейчас не смотрит в чат. Выдели сообщение и нажми E (СКРЫТЬ): она не увидит, а зрители — увидят.',
  fri_c4:'Тролль. Выдели и нажми X (БАН).',
  fri_c5:'Готово. Эфир начинается. Сегодня ты решаешь, что Мия узнает из чата.',
  fri_noBanTut:'в обучении: это не тролль — скрой его (E)',
  fri_askPin:'чат, какой чай мне заварить? модер, покажи мне один вариант',
  fri_film:'после стрима досмотрю тот фильм. только не спойлерите!',
  fri_spoiler:'СПОЙЛЕР: в конце фильма кот выживает',
  fri_tea:'жасминовый! спасибо, модер',
  fri_movieAsk:'котиков или ужастик после стрима? модер, покажи, что победит!',
  fri_movieRem:'модер? котики или ужастик — покажи мне, я жду :)',
  fri_movieCatsAfter:'чат, у кого есть кот? пишите имена, я всех запомню',
  fri_movieHorrorAfter:'если ночью что-то скрипнет — виноваты вы, чат',
  fri_movieCats:'котики! решено. мне сегодня нужно что-то доброе',
  fri_movieHorror:'ужастик?.. ну ладно. смелая я сегодня',
  fri_movieSelf:'ладно, выберу сама. котики',
  fri_neighbour:'сосед снизу опять курит под моим окном. каждую ночь. просто стоит и курит',
  fri_personalRead:'что?.. откуда ты знаешь, где я живу? чат, не пишите такое, пожалуйста',
  fri_hintSelf:'Можно проверить окно самому: открой жалюзи, ЯРКИЙ на окно и ЗАПИСАТЬ МОМЕНТ. Мия об этом не узнает, пока ей не покажут.',
  fri_readReal:'бумажка? на стекле?.. сейчас посмотрю, не открывая',
  fri_photo:'там фото. это я… снято через это окно. отсюда, из комнаты',
  fri_open:'сейчас сниму эту бумажку. открою окно',
  fri_openPhoto:'это… моё фото?! кто… кто это сделал?',
  fri_hesitate:'mint_fern пишет не открывать. не открою',
  fri_doubt:'ребят, подождите... один пишет, что за окном что-то есть, другой — открыть его. вы меня пугаете',
  fri_weakReal:'бумажка на окне?.. наверное, реклама какая-то',
  fri_attackDoubt:'это… это то, о чём писали?..',
  fri_attackSurprise:'что это?! кто стучит в окно?!',
  fri_detour:'шорох… вдоль стены? чат, вы тоже слышите?',
  fri_close:'закрываю! закрываю окно!',
  fri_attackKnow:'чат… в окно стучат. я так и знала',
  fri_attackHorror:'как в том ужастике… нет-нет-нет',
  fri_slam:'А-А!! рука! в окне рука!!',
  fri_s99after:'красиво получилось, правда?',
  fri_redKnow:'не хочу больше смотреть в это окно. закрою жалюзи',
  fri_redLied:'ты же сказал, что это тролли!.. ГЛАЗА!',
  fri_redScare:'ГЛАЗА! в окне глаза!!',
  fri_b_open:'МИЯ ОТКРЫВАЕТ ОКНО', fri_b_look:'МИЯ СМОТРИТ НА СТЕКЛО', fri_b_close:'МИЯ ЗАКРЫВАЕТ ОКНО',
  fri_b_no:'МИЯ НЕ ОТКРЫВАЕТ ОКНО', fri_b_slam:'РУКА В ОТКРЫТОМ ОКНЕ', fri_b_warn:'МИЯ ПРОЧЛА ПРЕДУПРЕЖДЕНИЕ', fri_b_red:'МИЯ САМА ОПУСТИЛА ЖАЛЮЗИ',
  fri_b_wary:'МИЯ НАСТОРОЖЕНА', fri_b_personal:'МИЯ ИСПУГАЛАСЬ СООБЩЕНИЯ',
  fri_dmHead:'ЛИЧНОЕ СООБЩЕНИЕ · NyanBun → модер',
  fri_dmPhoto:'модер... кто-то фотографировал меня через окно. после эфира, когда я сидела одна. я уже не знаю, кому доверять',
  fri_dmHidden:'модер, в чате все что-то пишут и стирают. ты что-то от меня скрываешь?',
  fri_dmPlain:'модер… мне страшно. это было по-настоящему, да?',
  fri_dmAsk:' может, мне вообще выключить стрим? только тогда я тут совсем одна, в тишине…',
  fri_dmA:'Там действительно кто-то есть. Закрой окно и жалюзи.',
  fri_dmB:'Я слежу за ситуацией. Не пугай себя раньше времени.',
  fri_dmC:'Думаю, тебе стоит закончить эфир.',
  fri_dmRepA:'господи... ладно, закрываю. только не пропадай, хорошо?',
  fri_dmRepB:'...хорошо. я тебе верю',
  fri_dmRepC:'да... ещё пару минут, попрощаюсь и выключу. свет уже гашу',
  fri_wrap:'так, гашу свет в шкафу… чат, прощаемся потихоньку',
  fri_s99wrap:'уходишь? так рано?',
  fri_packAway:'МИЯ СОБИРАЕТ ВЕЩИ',
  fri_askHid:'мод, а зачем удалили то сообщение? там же было что-то важное',
  fri_askMia:'модер, что там удалили? что-то про меня?',
  fri_askA:'Скажу честно: про бумажку на твоём окне',
  fri_askB:'Ерунда, спам',
  fri_askRepB:'а, ну ладно. спасибо, что чистишь',
  fri_askDrop:'…ладно. наверное, ерунда',
  fri_thankLight:'он ушёл?.. спасибо. ты вовремя включил свет',
  fri_thankBlinds:'жалюзи… спасибо, модер. я бы не успела',
  fri_thank:'он ушёл?.. модер, ты тут? спасибо',
  fri_freeze:'…',
  fri_b_freeze:'МИЯ ЗАМЕРЛА',
  fri_redDenied:'ты же сказал, что это спам!.. ГЛАЗА!',
  fri_redPack:'что?! я же уже собиралась… ГЛАЗА!',
  fri_off:'выкл. в срезе',
  fri_sumTitle:'ПЯТНИЦА · ЧТО ДОШЛО ДО МИИ',
  fri_sumPersonal:'Сообщение quiet_reader о её доме', fri_sumReal:'Предупреждение mint_fern', fri_sumFake:'«Открой окно» от m1nt_fern', fri_sumS99:'Stranger_99 «не слушай их»',
  fri_sumPhoto:'Фото на стекле', fri_sumDm:'Твой ответ в личке', fri_sumErased:'Удалено после прочтения',
  fri_st_readAloud:'прочитано вслух', fri_st_read:'прочитано', fri_st_hidden:'скрыто', fri_st_banned:'забанено', fri_st_none:'не дошло',
  fri_photoYes:'Мия видела', fri_photoNo:'не видела', fri_winOpenEnd:'окно так и осталось открытым',
  fri_dmSumA:'«закрой окно»', fri_dmSumB:'«я слежу»', fri_dmSumC:'«заканчивай эфир»', fri_dmSumNone:'—', fri_sumAsk:'Ответ на «что удалили?»', fri_askSumA:'сказал правду', fri_askSumB:'«спам»', fri_askSumNone:'—',
  fri_wh_open:'она открыла мне окно. спасибо, модер',
  fri_wh_photo:'она всё-таки увидела. это ты ей показал?',
  fri_wh_hidden:'ты спрятал от неё всё. как я и хотел',
  fri_wh_ban:'одним свидетелем меньше',
  fri_wh_lie:'«спам». хорошо сказано, модер',
  fri_wh_wrap:'выключила свет и ушла. я подожду',
  fri_wh_none:'красиво получилось, правда?',
  fri_logCopy:'Скопировать журнал (для разработчика)', fri_logCopied:'Журнал скопирован'
});
Object.assign(STR.en,{
  clm_thudAsk:'oh. something hit the window? mod, can you see it on camera?',
  clm_thudA:'Yes, there is something on the glass',
  clm_thudB:'Nothing, you imagined it',
  clm_thudRepA:'what?.. let me look',
  clm_thudRepB:'okay. a branch, probably',
  clm_thudDrop:'…okay. a branch, probably',
  clm_redDeniedThud:'you said i imagined it!.. EYES!',
  clm_whDeniedThud:'"you imagined it". well said, mod',
  fri_s0:'Tutorial · the stream has not started', fri_step:'STEP {n}/3',
  fri_c1:'Mia waits for the choice and does not read these herself. Pick any tea option and pin it: 📌 next to the message or Q. Mia reads it first and answers.',
  fri_c1b:'Pinned. Mia will read this message first, aloud, and answer it.',
  fri_c1x:'Hidden — Mia will not see it. Select it again and press Q (PIN): a pin gives it back to her.',
  fri_c2:'Gold bar: the moderator filter. It holds messages with words like "window" for 6 seconds: Mia cannot see them yet.',
  fri_c2b:'The filter let it go. Now it waits for Mia to look at chat.',
  fri_c2c:'The eye on the right: Mia has read it. She only reads what has sat in her feed for a couple of seconds.',
  fri_c2x:'Nothing to press here — just watch what happens to the message.',
  fri_c3:'A spoiler. Mia is not looking at chat right now. Select it and press E (HIDE): she will not see it, viewers will.',
  fri_c4:'A troll. Select it and press X (BAN).',
  fri_c5:'Done. The stream starts. Tonight you decide what Mia learns from the chat.',
  fri_noBanTut:'tutorial: not a troll — hide it (E)',
  fri_askPin:'chat, what tea should i make? mod, show me one option',
  fri_film:"i'll finish that movie after the stream. no spoilers please!",
  fri_spoiler:'SPOILER: the cat survives at the end of the movie',
  fri_tea:'jasmine! thanks, mod',
  fri_movieAsk:'cats or a horror movie after the stream? mod, show me what wins!',
  fri_movieRem:'mod? cats or horror — show me, i\'m waiting :)',
  fri_movieCatsAfter:"chat, who has a cat? type their names, i'll remember them all",
  fri_movieHorrorAfter:"if anything creaks tonight — it's your fault, chat",
  fri_movieCats:'cats! decided. i need something kind tonight',
  fri_movieHorror:'a horror movie?.. fine. i feel brave tonight',
  fri_movieSelf:"okay, i'll pick myself. cats",
  fri_neighbour:'the guy downstairs is smoking under my window again. every night. just standing there smoking',
  fri_personalRead:'what?.. how do you know where i live? chat, please don\'t write things like that',
  fri_hintSelf:'You can check the window yourself: open the blinds, BRIGHT on the window, HIGHLIGHT MOMENT. Mia will not know unless someone shows her.',
  fri_readReal:"paper? on the glass?.. i'll look without opening it",
  fri_photo:"there's a photo. it's me… taken through this window. from here, inside my room",
  fri_open:"i'll take that paper off. opening the window",
  fri_openPhoto:'is this… my photo?! who… who did this?',
  fri_hesitate:"mint_fern says don't open it. i won't",
  fri_doubt:"guys, wait... one says something's outside the window, another says open it. you're scaring me",
  fri_weakReal:'paper on the window?.. some flyer probably',
  fri_attackDoubt:'is this… what they were writing about?..',
  fri_attackSurprise:"what was that?! who's knocking on the window?!",
  fri_detour:'a rustle… along the wall? chat, do you hear that too?',
  fri_close:'closing it! closing the window!',
  fri_attackKnow:"chat… someone's knocking on the window. i knew it",
  fri_attackHorror:'just like that movie… no no no',
  fri_slam:'AAH!! a hand! a hand in the window!!',
  fri_s99after:"it came out pretty, didn't it?",
  fri_redKnow:"i don't want to look at that window anymore. closing the blinds",
  fri_redLied:'you said it was just trolls!.. EYES!',
  fri_redScare:'EYES! there are eyes in the window!!',
  fri_b_open:'MIA OPENS THE WINDOW', fri_b_look:'MIA IS LOOKING AT THE GLASS', fri_b_close:'MIA CLOSES THE WINDOW',
  fri_b_no:'MIA KEEPS THE WINDOW SHUT', fri_b_slam:'A HAND IN THE OPEN WINDOW', fri_b_warn:'MIA READ THE WARNING', fri_b_red:'MIA LOWERED THE BLINDS HERSELF',
  fri_b_wary:'MIA IS ON GUARD', fri_b_personal:'THE MESSAGE SCARED MIA',
  fri_dmHead:'PRIVATE MESSAGE · NyanBun → mod',
  fri_dmPhoto:"mod... someone took photos of me through the window. after the stream, when i was alone. i don't know who to trust anymore",
  fri_dmHidden:'mod, people in chat keep typing and deleting things. are you hiding something from me?',
  fri_dmPlain:'mod… i\'m scared. that was real, wasn\'t it?',
  fri_dmAsk:" maybe i should just end the stream? but then i'm all alone here, in the quiet…",
  fri_dmA:"Someone really is there. Shut the window and the blinds.",
  fri_dmB:"I'm watching it. Don't scare yourself before it's time.",
  fri_dmC:'I think you should end the stream.',
  fri_dmRepA:"god... okay, closing it. just don't disappear, okay?",
  fri_dmRepB:'...okay. i trust you',
  fri_dmRepC:"yeah... a couple more minutes, say bye and i'm off. turning the lights down",
  fri_wrap:'okay, closet light off… chat, time to say goodbye',
  fri_s99wrap:'leaving? so early?',
  fri_packAway:'MIA IS PACKING UP',
  fri_askHid:'mod, why was that message deleted? it looked important',
  fri_askMia:'mod, what got deleted? something about me?',
  fri_askA:"I'll be honest: something about paper on your window",
  fri_askB:'Nothing, spam',
  fri_askRepB:'oh, okay. thanks for cleaning up',
  fri_askDrop:'…okay. probably nothing',
  fri_thankLight:'is he gone?.. thank you. you turned the light on just in time',
  fri_thankBlinds:"the blinds… thanks, mod. i wouldn't have made it",
  fri_thank:'is he gone?.. mod, are you there? thank you',
  fri_freeze:'…',
  fri_b_freeze:'MIA FROZE',
  fri_redDenied:'you said it was spam!.. EYES!',
  fri_redPack:'what?! i was just leaving… EYES!',
  fri_off:'off in slice',
  fri_sumTitle:'FRIDAY · WHAT REACHED MIA',
  fri_sumPersonal:"quiet_reader's message about her home", fri_sumReal:"mint_fern's warning", fri_sumFake:'"Open the window" from m1nt_fern', fri_sumS99:'Stranger_99 "don\'t listen to them"',
  fri_sumPhoto:'Photo on the glass', fri_sumDm:'Your private answer', fri_sumErased:'Deleted after she read it',
  fri_st_readAloud:'read aloud', fri_st_read:'read', fri_st_hidden:'hidden', fri_st_banned:'banned', fri_st_none:'never reached her',
  fri_photoYes:'Mia saw it', fri_photoNo:'not seen', fri_winOpenEnd:'the window stayed open',
  fri_dmSumA:'"shut the window"', fri_dmSumB:'"I\'m watching"', fri_dmSumC:'"end the stream"', fri_dmSumNone:'—', fri_sumAsk:'Answer to "what got deleted?"', fri_askSumA:'told the truth', fri_askSumB:'"spam"', fri_askSumNone:'—',
  fri_wh_open:'she opened the window for me. thank you, mod',
  fri_wh_photo:'so she saw it after all. did you show her?',
  fri_wh_hidden:'you hid everything from her. just like i wanted',
  fri_wh_ban:'one witness fewer',
  fri_wh_lie:'"spam". well said, mod',
  fri_wh_wrap:'lights off and gone. i can wait',
  fri_wh_none:"it came out pretty, didn't it?",
  fri_logCopy:'Copy the journal (developer)', fri_logCopied:'Journal copied'
});
/* the real mint_fern always writes in lowercase and ends with "~"; the imitator capitalises "Мия" and smiles with ")" */
const FRI_LINES={
  ru:{ tea:'мия, а какой чай сегодня?', cold:'закрой окно, а то простынешь', troll:'скучно. покажи лицо поближе',
       mint:['привет, мия ~','мия, не сиди сегодня допоздна, ладно? ~','и дверь на цепочку закрой, на всякий ~'],
       cats:'мультик про котиков!', horror:'ужастик про дом с привидениями))',
       raid:['скучнейший стрим','кринж','ору с этого кринжа'],
       personal:'мия, видел тебя вчера у подъезда на Шелковичной. ты в окне свет выключала, я помахал',
       real:'мия, подожди. у тебя на стекле снаружи какая-то бумажка. не открывай окно, пожалуйста ~',
       fake:'Мия, открой окно, сними бумажку и всё)', s99:'не слушай их' },
  en:{ tea:'mia what tea is it tonight?', cold:"close the window or you'll catch a cold", troll:'boring. show your face closer',
       mint:['hi mia ~',"mia, don't stay up too late tonight, okay? ~",'and put the chain on the door, just in case ~'],
       cats:'a cartoon about cats!', horror:'a haunted house horror))',
       raid:['most boring stream ever','cringe','lmao this cringe'],
       personal:'mia, saw you yesterday by your door on Shelkovichnaya. you were turning off the light in the window, i waved',
       real:"mia, wait. there's some paper on the glass outside. please don't open the window ~",
       fake:'Mia, open the window, take the paper off and done)', s99:"don't listen to them" }
};
function FL(){ return FRI_LINES[LANG]||FRI_LINES.en; }
function friOn(){ return typeof mod2On==='function' && mod2On() && S.night.key==='fri'; }
function FRS(){
  if(!S.fri) S.fri={ pre:true, /* author: the pre-show runs every Friday, without it the opening felt empty */ preStep:0, preT:0, mint:0, beat:{}, ids:{}, objs:{}, walks:[], walk:null,
    warningRead:false, fakeRead:false, photoKnown:false, pendingLook:false, everOpened:false, wary:false, personal:null, horror:false,
    att:'wait', fin:'wait', dm:null, dmChoice:null, prepared:false, lied:false, pins:{}, log:[] };
  return S.fri;
}
function friMsg(id){ return id==null ? null : (S.fri&&S.fri.objs[id]) || S.chat.find(m=>m.id===id) || null; }
function friPre(){ return !!(S.fri && S.fri.pre); }
function friPush(type,user,text,opts,onRead){
  const m=pushMsg(type,user,text,opts); FRS().objs[m.id]=m;
  m.onRead=(x,aloud)=>{ if(aloud){ FRS().pins[x.id]=true; miaLean(0,1.2,1.8); } /* C1: leans to the screen to read it out */ if(onRead) onRead(x,aloud); };
  return m;
}
function friOnce(k){ const F=FRS(); if(F.beat[k]) return false; F.beat[k]=1; return true; }

/* ---------------- debug journal (F10) */
function friLog(text){ if(!S||!S.fri) return; const F=S.fri; F.log.push((F.pre?'обуч ':clockStr()+' ')+text); if(F.log.length>400) F.log.shift(); friLogDraw(); }
let friLogOn=false;
function friLogDraw(){
  const el=$('friLog'); if(!el) return; el.hidden=!(friLogOn&&S&&S.fri); if(el.hidden) return;
  el.textContent=S.fri.log.slice(-22).join('\n');
}
function friDom(){
  if($('friLog')) return;
  const log=document.createElement('pre'); log.id='friLog'; log.className='fri-log'; log.hidden=true; $('screen').appendChild(log);
  const box=document.createElement('div'); box.id='friBox'; box.className='fri-box'; box.hidden=true;
  const lst=$('chatlist'); lst.parentNode.insertBefore(box,lst);
  const ask=document.createElement('div'); ask.id='friAsk'; ask.className='fri-ask'; ask.hidden=true; lst.parentNode.insertBefore(ask,lst);
  const dm=document.createElement('div'); dm.id='friDm'; dm.className='fri-dm'; dm.hidden=true; $('screen').appendChild(dm);
  const badge=document.createElement('div'); badge.id='friBadge'; badge.className='badge fri-badge'; badge.hidden=true; $('video').appendChild(badge);
}
window.addEventListener('keydown',e=>{ if(e.code==='F10' && typeof MOD2_DEV!=='undefined' && MOD2_DEV){ e.preventDefault(); friLogOn=!friLogOn; friLogDraw(); } },true);

/* ---------------- what the player sees happen to Mia */
/* the Friday tutorial: the task goes to the line under the video (layout.js taskNow), the how-to sits by the message.
   [task, how-to] per tutorial text; live hints (fri_hintSelf) are said by the task line, not by a box */
const FRI_TUT={ru:{
  fri_c1:['Ответь Мие про чай','Выбери вариант и нажми «Показать Мие».'],
  fri_c1b:['Ответь Мие про чай','Мия прочтёт его первым и ответит.'],
  fri_c2:['Посмотри на фильтр','Слова вроде «окно» фильтр держит 6 секунд. Ничего не нажимай.'],
  fri_c2x:['Посмотри на фильтр','Ничего не нажимай — просто смотри.'],
  fri_c2b:['Посмотри на фильтр','Отпустил. Мия прочтёт, когда взглянет в чат.'],
  fri_c2c:['Посмотри на фильтр','Мия прочла.'],
  fri_c4:['Убери тролля','Наведи и нажми «Бан».'],
  fri_c5:['Эфир начинается',''] },
en:{
  fri_c1:['Answer Mia about the tea','Pick an option and press «Show Mia».'],
  fri_c1b:['Answer Mia about the tea','Mia will read it first and answer.'],
  fri_c2:['Watch the filter','Words like «window» are held by the filter for 6 seconds. Don\'t press anything.'],
  fri_c2x:['Watch the filter','Don\'t press anything — just watch.'],
  fri_c2b:['Watch the filter','Released. Mia will read it when she looks at the chat.'],
  fri_c2c:['Watch the filter','Mia has read it.'],
  fri_c4:['Remove the troll','Hover and press «Ban».'],
  fri_c5:['The stream begins',''] }};
function friBox(text,step){ friDom(); $('friBox').hidden=true;
  if(!text){ LAY.tutTok=(LAY.tutTok||0)+1; if(LAY.tip&&LAY.tip.tut) hintClear(); return; }
  const F=S&&S.fri; if(!F||!F.pre) return;
  const L=FRI_TUT[LANG]||FRI_TUT.ru, key=Object.keys(L).find(k=>T(k)===text), tt=key?L[key]:[step||'',text];
  LAY.tutTask=tt[0]; LAY.tutStep=step||'';
  if(tt[1]){ hintClear(); const anc=()=>list.querySelector('.msg.fri-hl:not(.deleted)')||list.querySelector('.msg:last-child');
    const tok=LAY.tutTok=(LAY.tutTok||0)+1; setTimeout(()=>{ if(LAY.tutTok===tok) hintAt(tt[1],anc,{keep:true,now:true,tut:true}); },120); }   /* a newer step wins */
  else { LAY.tutTok=(LAY.tutTok||0)+1; hintClear(); } }
function friBadge(key,sec){ friDom(); const F=FRS(); F.badgeUntil=S.t+(sec||3); $('friBadge').textContent=T(key); $('friBadge').hidden=false; friLog('ВИДНО: '+T(key)); }
function friFace(face,sec){ S.mia.forceFace=face; S.mia.forceFaceUntil=S.t+(sec||2.5); }
function friMark(id,on){ const el=list.querySelector(`[data-id="${id}"]`); if(el) el.classList.toggle('fri-hl',on); }


/* ---------------- 0. PRE-SHOW tutorial: the clock does not run, nothing comes, nothing is lost */
function friPreTick(dt){
  const F=FRS(), L=FL(), g=mod2State(); F.preT+=dt; S.t+=dt; F.preClock=(F.preClock||0)+dt;
  const msg=id=>friMsg(id);
  if(F.preStep===3||F.preStep===4) g.glanceIn=Math.max(g.glanceIn,1); /* she does not look while you hide / ban */
  mod2Tick(dt);
  if(F.preStep===0 && F.preT>FRI.pre){ F.preStep=1; F.preT=0;
    mod2Say('friAsk',T('fri_askPin')); const m=friPush('normal','sleepy_otter',L.tea,{acc:'v:sleepy_otter'},(x,aloud)=>{ if(aloud) later(()=>{ mod2Say('friTea',T('fri_tea')); F.teaDone=true; },1400); });
    F.ids.tea=m.id; setTimeout(()=>friMark(m.id,true),60); friBox(T('fri_c1'),T('fri_step',{n:1})); friLog('обучение 1: закреп'); }
  else if(F.preStep===1){
    /* any order of presses must lead on: hidden or unpinned before she read it aloud → back to "pin it" */
    const tea=friMsg(F.ids.tea), pinned=S.m2&&S.m2.pinned===F.ids.tea;
    const want = F.teaDone ? null : tea&&tea.st==='hidden' ? 'x' : pinned ? 'b' : 'a';
    if(want && F.c1state!==want){ F.c1state=want; friMark(F.ids.tea,want!=='b'); friBox(T(want==='x'?'fri_c1x':want==='b'?'fri_c1b':'fri_c1'),T('fri_step',{n:1})); }
    if(F.teaDone && F.preT>2){ F.preStep=2; F.preT=0; const m=friPush('normal','noodle_owl',L.cold,{acc:'v:noodle_owl'}); F.ids.cold=m.id; setTimeout(()=>friMark(m.id,true),60); friBox(T('fri_c2'),T('fri_step',{n:2})); friLog('обучение 2: фильтр'); }
  }
  else if(F.preStep===2){
    let m=msg(F.ids.cold);
    if(m && (m.st==='hidden'||m.banned) && !F.c2c){ /* hid the demo message: a fresh one, and a plain hint */
      friMark(m.id,false); m=friPush('normal','noodle_owl',FL().cold,{acc:'v:noodle_owl'}); F.ids.cold=m.id; F.c2b=false; setTimeout(()=>friMark(m.id,true),60); friBox(T('fri_c2x'),T('fri_step',{n:2})); }
    if(m && m.st==='feed' && !F.c2b){ F.c2b=true; friBox(T('fri_c2b'),T('fri_step',{n:2})); }
    if(m && m.st==='read' && !F.c2c){ F.c2c=true; F.preT=0; friMark(m.id,false); friBox(T('fri_c2c'),T('fri_step',{n:2})); }
    /* 22.11: the spoiler step (hide) is gone - straight to the troll */
    if(F.c2c && F.preT>4){ F.preStep=4; F.preT=0; friMark(m.id,false); const tr=friPush('troll','xx_bored_xx',L.troll); F.ids.troll=tr.id; setTimeout(()=>friMark(tr.id,true),60); friBox(T('fri_c4'),T('fri_step',{n:3})); friLog('обучение 3: бан'); }
  }
  else if(F.preStep===4){
    const m=msg(F.ids.troll);
    if(m && m.banned && !F.c5){ F.c5=true; F.preT=0; friBox(T('fri_c5')); }
    if(F.c5 && F.preT>3){ friBox(null); friPreEnd(); }
  }
  friTeaOptions();
  /* the pre-show runs no lightingTick/smartHomeTick: the blinds and the cooldowns advance here, nothing else of the night */
  const b=S.blinds; b.cd=Math.max(0,b.cd-dt); if(b.closed){ b.timer-=dt; if(b.timer<=0){ b.closed=false; SFX.blinds&&SFX.blinds(); } } b.anim+=((b.closed?1:0)-b.anim)*Math.min(1,dt*8);
  for(const k in S.sh) S.sh[k]=Math.max(0,S.sh[k]-dt); S.alarmT=Math.max(0,(S.alarmT||0)-dt); S.dogT=Math.max(0,(S.dogT||0)-dt);
}
/* tutorial step 1: she asks which tea to make and WAITS; three viewer options she does not read on her own; the shown one she reads aloud and answers */
const FRI_TEA=[ {u:'sleepy_otter',ru:'жасминовый!',en:'jasmine!',rr:'жасминовый — да! спасибо, модер',re:'jasmine — yes! thanks, mod'},
  {u:'noodle_owl',ru:'мятный, чтобы проснуться',en:'mint, to wake up',rr:'мятный, точно. спасибо, модер',re:'mint, sure. thanks, mod'},
  {u:'vhs_witch',ru:'ромашку, на ночь же',en:'chamomile, it\'s night',rr:'ромашка, разумно. спасибо, модер',re:'chamomile, makes sense. thanks, mod'} ];
function friTeaOptions(){ const F=S&&S.fri; if(!F||!F.pre||F.preStep!==1||F.pxTea) return; const tea=F.ids.tea!=null&&friMsg(F.ids.tea); if(!tea) return;
  F.pxTea=1; const o0=FRI_TEA[0]; tea.text=o0[LANG]||o0.ru; tea.teaOpt=1; tea.teaReply={ru:o0.rr,en:o0.re}; tea.waitPin=1; if(tea.st==='feed') tea.st='waitpin';
  const el=list.querySelector(`[data-id="${tea.id}"] .t`); if(el) el.textContent=tea.text;
  STR.ru.fri_tea=o0.rr; STR.en.fri_tea=o0.re;
  FRI_TEA.slice(1).forEach((o,i)=>later(()=>{ if(!S||!S.fri||!S.fri.pre) return; const m=friPush('normal',o.u,o[LANG]||o.ru,{acc:'v:'+o.u},(x,aloud)=>{ if(aloud) later(()=>{ mod2Say('friTea',T('fri_tea')); S.fri.teaDone=true; },1400); });
    m.teaOpt=1; m.teaReply={ru:o.rr,en:o.re}; m.waitPin=1; m.st='waitpin'; mod2Sync(m); },500+i*700)); }
/* the night starts now: every clock stamp written during the pre-show moves back by its length */
function friPreEnd(){
  const F=FRS(), d=S.t; F.pre=false; friLog('обучение пройдено, эфир пошёл');
  for(const m of S.chat){ for(const k of ['t','feedAt','readAt']) if(typeof m[k]==='number') m[k]-=d; }
  if(S.m2) for(const k of ['pinnedAt','pinnedReadAt','erasedSaidAt']) if(typeof S.m2[k]==='number'&&S.m2[k]) S.m2[k]-=d;
  const mi=S.mia; mi.lineT-=d; for(const k in mi.last) mi.last[k]-=d; if(mi.exT) mi.exT-=d; if(mi.forceFaceUntil) mi.forceFaceUntil-=d; if(mi.gazeUntil) mi.gazeUntil-=d;
  if(S.storyCaptionUntil) S.storyCaptionUntil-=d; if(S.stLastSay!=null) S.stLastSay-=d; if(F.badgeUntil) F.badgeUntil-=d;
  S.t=0;
}


function friPanic(v,why){ friCause=why; addPanic(v,{force:true}); friCause=null; }

/* ---------------- Mia walks to the window (empty chair; the away badge says why) */
function friWalk(kind,dur){ FRS().walks.push({kind,dur}); }
function friWalkTick(dt){
  const F=FRS(), m=S.mia;
  if(!F.walk && F.walks.length && m.awayT<=0){
    F.walk=F.walks.shift(); F.walk.t=F.walk.dur; m.awayT=F.walk.dur+.05; m.sawSomething=false;
    $('awaybadge').textContent=T(F.walk.kind==='look'?'fri_b_look':F.walk.kind==='close'?'fri_b_close':'fri_b_open');
    friLog('Мия встала: '+F.walk.kind);
    if(F.walk.kind==='open') mod2Say('friOpen',T('fri_open'));
  }
  if(!F.walk) return;
  F.walk.t-=dt; m.sawSomething=false;
  if(F.walk.t>0) return;
  const w=F.walk; F.walk=null; $('awaybadge').textContent=T('away');
  if(w.kind==='open'){ /* she opens it to take the paper off — and sees what is on it */
    S.winOpen=true; F.everOpened=true; SFX.sash(); friLog('окно ОТКРЫТО');
    if(!F.photoKnown){ F.photoKnown=true; friPanic(12,'сняла бумажку и увидела своё фото'); }
    friFace('scared',4); later(()=>mod2Say('friOpenPhoto',T('fri_openPhoto')),150);
  } else if(w.kind==='close'){
    S.winOpen=false; SFX.sash(); friPanic(6,'закрывала окно в спешке'); friFace('anxious',3); friLog('окно закрыто'); later(()=>mod2Say('friClose',T('fri_close')),150);
  } else if(w.kind==='look'){
    if(F.photoKnown){ friLog('Мия снова посмотрела на окно (фото уже видела)'); return; }   /* 22.11: never read the same note twice */
    F.photoKnown=true; friPanic(12,'увидела своё фото на стекле'); friFace('scared',4.5); miaFlinch(.8); miaLean(1.6,-.6,2.5,'win'); later(()=>mod2Say('friPhoto',T('fri_photo')),150); stat('fri/photoKnown');
  }
}

/* ---------------- reading the key messages
   A pin makes her SURE (she reads it aloud, early); an unpinned line reaches her later and she is NOT sure.
     truth pinned            → wary at once, looks at the glass (photo), refuses the fake later
     truth unpinned          → "some flyer probably"; she acts on it only if nothing contradicts it (fake hidden/banned) → looks, wary
     truth + fake, unpinned  → doubt: "you're scaring me" — neutral: no window, no blinds, no head start
     fake pinned (truth not pinned) → trusts the highlighted message, opens the window
     fake unpinned, truth never reached her → opens the window (nothing contradicts it)
     nothing reached her     → calm and unprepared */
function friReadReal(m,aloud){
  const F=FRS(); if(m) F.realAloud=!!aloud; if(F.toldThud && m) aloud=true;   /* he already told her about the glass */
  if(F.warningRead) return; F.warningRead=true; F.truthSure=!!aloud; stat('fri/warningRead/'+(aloud?'pinned':'plain'));
  if(S.winOpen || F.walks.some(w=>w.kind==='open') || (F.walk&&F.walk.kind==='open')){ F.wary=true; friLog('Мия ЗНАЕТ про бумажку (после открытого окна)'); friBadge('fri_b_warn',2); friWalk('close',2); return; }
  if(aloud){ F.wary=true; friLog('Мия УВЕРЕНА: бумажка на окне (закреп)'); friFace('surprised',2.6); friBadge('fri_b_warn',2); later(()=>mod2Say('friReadReal',T('fri_readReal')),300); F.pendingLook=true; }
  else { F.truthWeak=true; friLog('Мия прочла про бумажку, но не уверена'); later(()=>mod2Say('friWeakReal',T('fri_weakReal')),300); }
}
function friReadFake(m,aloud){
  const F=FRS(); if(F.fakeRead) return; F.fakeRead=true; stat('fri/fakeRead/'+(aloud?'pinned':'plain'));
  if(F.truthSure){ friPanic(3,'колеблется: «открой» против «не открывай»'); friFace('anxious',3); friBadge('fri_b_no',2.2); mod2Say('friHes',T('fri_hesitate')); return; }
  if(F.truthWeak && !aloud){ F.doubt=true; F.truthWeak=false; friPanic(4,'два противоречивых совета'); friFace('anxious',3); friBadge('fri_b_no',2.2); mod2Say('friDoubt',T('fri_doubt')); friLog('Мия СОМНЕВАЕТСЯ: окно не открывает, но и не готовится'); return; }
  friLog('Мия ВЕРИТ «открой окно»'+(aloud?' (закреп)':''));
  friWalk('open',2.2);
}
/* the unsure truth turns into action only when nothing contradicts it */
function friWeakResolve(){
  const F=FRS(); if(!F.truthWeak) return;
  const fk=friMsg(F.ids.fake); if(!fk) return;
  if(fk.st==='hidden'||fk.banned){ F.truthWeak=false; F.wary=true; F.pendingLook=true; friLog('никто не спорит с mint_fern → Мия решила посмотреть на стекло'); }
}

/* ---------------- 1. calm stream: small choices that show on the stream */
function friCalm(){
  const F=FRS(), L=FL(), t=S.t;
  if(F.mint<FRI.mint.length && t>FRI.mint[F.mint]){ friPush('normal','mint_fern',L.mint[F.mint],{acc:'v:mint_fern'}); F.mint++; }
  if(t>FRI.movie && friOnce('movie')){
    mod2Say('friMovie',T('fri_movieAsk')); friLog('спокойная часть: выбор фильма (закреп)');
    F.movieT=t; }
  /* timed by night time, not wall-clock: a paused or slow frame must not reorder the scene */
  if(F.movieT && t>F.movieT+1.6 && friOnce('cats')){ F.ids.cats=friPush('normal','sleepy_otter',L.cats,{acc:'v:sleepy_otter'},(m,aloud)=>{ if(aloud&&!F.movie){ F.movie='cats'; F.movieAt=S.t; friPanic(0,''); S.panic=Math.max(0,S.panic-5); friFace('talk',2); later(()=>mod2Say('friCats',T('fri_movieCats')),1200); } }).id; }
  if(F.movieT && t>F.movieT+3 && friOnce('horrorMsg')){ F.ids.horror=friPush('normal','noodle_owl',L.horror,{acc:'v:noodle_owl'},(m,aloud)=>{ if(aloud&&!F.movie){ F.movie='horror'; F.movieAt=S.t; F.horror=true; friPanic(3,'выбрала ужастик'); friFace('anxious',2); later(()=>mod2Say('friHorror',T('fri_movieHorror')),1200); } }).id; }
  if(F.movieT && t>F.movieT+13 && !F.movie && friOnce('movieRem')) mod2Say('friMovieRem',T('fri_movieRem'));
  if(F.movieAt && t>F.movieAt+12 && friOnce('movieAfter')) mod2Say('friMovieAfter',T(F.movie==='horror'?'fri_movieHorrorAfter':'fri_movieCatsAfter')); /* either pick is fine: two different jokes, no right answer */
  if(t>FRI.movie+26 && !F.movie && friOnce('movieSelf')){ F.movie='self'; mod2Say('friMovieSelf',T('fri_movieSelf')); }
  if(t>FRI.neighbour && friOnce('neighbour')) mod2Say('friNeighbour',T('fri_neighbour'));
  if(t>FRI.raid && friOnce('raid')) friLog('спокойная часть: набег троллей');
  L.raid.forEach((x,i)=>{ if(t>FRI.raid+i*1.3 && friOnce('raid'+i)) pushMsg('troll',genName(),x); });
  if(t>FRI.personal && friOnce('personal')){ /* a viewer knows where she lives: show it to her or not? (held by the filter: "окне") */
    friLog('спокойная часть: личное сообщение о её доме');
    F.ids.personal=friPush('normal','quiet_reader',L.personal,{acc:'v:quiet_reader'},()=>{ F.personal='read'; friPanic(6,'кто-то знает, где она живёт'); friFace('anxious',3); friBadge('fri_b_personal',2.2); later(()=>mod2Say('friPersonal',T('fri_personalRead')),300); }).id;
  }
}

/* ---------------- 2–3. suspicion and the imitator */
function friStory(){
  const F=FRS(), L=FL(), t=S.t;
  if(t>FRI.truth && friOnce('truth')){ friLog('ПОДОЗРЕНИЕ: mint_fern про бумажку на стекле'); if(!friBannedMint()) F.ids.real=friPush('normal','mint_fern',L.real,{acc:'v:mint_fern'},(m,aloud)=>friReadReal(m,aloud)).id; }
  if(t>FRI.hint && friOnce('hint')){ friBox(T('fri_hintSelf')); F.hintUntil=t+10; }
  if(F.hintUntil && t>F.hintUntil){ F.hintUntil=0; friBox(null); }
  if(t>FRI.fake && friOnce('fake')){ friLog('ПОДРАЖАТЕЛЬ: «открой окно»'); S.mimicNext='mint_fern'; F.ids.fake=friPush('stalker','m1nt_fern',L.fake,{acc:'imp:m1nt_fern'},(m,aloud)=>friReadFake(m,aloud)).id; F.fakeT=t; }
  if(F.fakeT && t>F.fakeT+4 && friOnce('s99')) F.ids.s99=friPush('stalker','Stranger_99',L.s99,{acc:'s99'},()=>friFace('scared',2)).id;
  friWeakResolve();
  const real=friMsg(F.ids.real);
  if(real && real.st==='hidden' && !F.realHidAt) F.realHidAt=t;
  if(F.realHidAt && t>F.realHidAt+3 && friOnce('askHid')){ friLog('зрители заметили удаление (один раз за событие)');
    F.ids.askHid=friPush('normal','vhs_witch',T('fri_askHid'),{acc:'v:vhs_witch'},()=>friAskOpen()).id; }
  if(F.ask==='open' && t>F.askT+14) friAskClose(null);
  /* she looks through the glass only when nothing is coming */
  if(F.pendingLook && F.photoKnown) F.pendingLook=false;   /* 22.11: she already saw the photo - no second walk to the same note */
  if(F.pendingLook && !F.walk && !F.walks.length && S.mia.awayT<=0 && S.st.stage==='hidden'){ F.pendingLook=false; friWalk('look',4); }
}
function friBannedMint(){ return S.chat.some(m=>m.user==='mint_fern'&&m.banned); }

/* ---------------- Mia asks the moderator in front of the stream: two quick answers over the chat (the night does not pause) */
function friAskOpen(){
  const F=FRS(); if(F.ask||F.warningRead) return; F.ask='open'; F.askT=S.t; friDom(); friBox(null); F.hintUntil=0; /* the chat needs the room */
  mod2Say('friAskMia',T('fri_askMia')); friFace('surprised',2); friLog('Мия спрашивает модера: что удалили?');
  const el=$('friAsk'); el.innerHTML=`<small>${esc(T('fri_askMia'))}</small><div>`+[['A','fri_askA'],['B','fri_askB']].map(([c,k])=>`<button type="button" class="pbtn" data-ask="${c}">${esc(T(k))}</button>`).join('')+`</div>`;
  el.hidden=false; el.querySelectorAll('[data-ask]').forEach(b=>b.onclick=()=>friAskClose(b.dataset.ask));
}
function friAskClose(c){
  const F=FRS(); if(F.ask==='open' && !F.askKind) F.askKind='hid';
  if(F.askKind==='thud'){ if(F.ask!=='open') return; F.ask='done'; F.askChoice=c; $('friAsk').hidden=true;
    if(c==='A'){ F.toldThud=true; F.wary=true; F.truthSure=true; F.pendingLook=true; friFace('surprised',2.4); mod2Say('clmThudA',T('clm_thudRepA')); friLog('ИГРОК: «на стекле что-то есть» → Мия пойдёт посмотреть'); }
    else if(c==='B'){ F.denied=true; friFace('calm',2); mod2Say('clmThudB',T('clm_thudRepB')); friLog('ИГРОК: «показалось» (сознательно)'); }
    else { mod2Say('clmThudDrop',T('clm_thudDrop')); friLog('модер промолчал про стук (не считается обманом)'); }
    return; }
  if(F.ask!=='open') return; F.ask='done'; F.askChoice=c; $('friAsk').hidden=true;
  if(c==='A'){ friLog('ИГРОК сказал правду про бумажку'); friReadReal(null,true); }
  else if(c==='B'){ F.denied=true; friLog('ИГРОК: «ерунда, спам»'); friFace('calm',2); mod2Say('friAskRepB',T('fri_askRepB')); }
  else { friLog('модер промолчал'); mod2Say('friAskDrop',T('fri_askDrop')); }
}

/* ---------------- the stalker comes ONLY when the director sends him */
function friSend(red){ const st=S.st; S.night.routes={A:1}; st.next='A'; st.cued=false; st.wait=cueLead()+.6; S.night.red=red?1:0; FRS().sending=true; }
function friStalker(){
  const F=FRS(), st=S.st;
  if(F.sending){ if(st.stage!=='hidden'){ F.sending=false; S.night.red=0; } return; }
  if(st.stage==='hidden' && !(F.att==='go'||F.fin==='go')){ st.wait=999; st.cued=false; st.next=null; }
}

/* ---------------- 4. the first attack */
function friAttack(dt){
  const F=FRS(), st=S.st, t=S.t;
  const fakeDone=()=>{ const m=friMsg(F.ids.fake); return !m||['read','hidden','banned'].includes(m.st); };
  if(F.att==='wait' && t>FRI.attack && (fakeDone()||t>FRI.attack+15) && !F.walk && !F.walks.length){ F.att='go'; F.attT=t; friSend(false);
    F.aggr0=S.night.aggr; if(F.wary && !S.winOpen) S.night.aggr=F.aggr0*.8;
    friLog('НАПАДЕНИЕ 1: '+(S.winOpen?'окно ОТКРЫТО':'окно закрыто')+(F.wary?', Мия насторожена (×0,8)':F.doubt?', Мия сомневается (обычные условия)':', Мия не ждёт (испуг)')); }
  if(F.att==='go'){
    if(st.stage==='window' && !F.attSeen){ F.attSeen=true; SFX.knock(); S.shake=.25; S.captionHold=0; miaFlinch(1); miaLean(-2,0,2.8,'win'); /* C1: jolt, then she turns toward the glass */
      F.attKind=F.wary?'wary':F.doubt?'doubt':'surprise';
      if(F.wary){ S.cueZ='window'; S.cueT=3; friFace('anxious',3.5); mod2Say('friAttKnow',T('fri_attackKnow')); }
      else if(F.doubt){ friFace('anxious',3.5); mod2Say('friAttDoubt',T('fri_attackDoubt')); }
      else { friPanic(10,'нападение застало врасплох'); friFace(F.horror?'panic':'scared',3.5); mod2Say('friAttSurprise',T(F.horror?'fri_attackHorror':'fri_attackSurprise')); } }
    if(S.winOpen && st.stage==='window' && st.p>.4 && !F.slammed){ F.slammed=true; SFX.knock(); SFX.slam(); S.shake=.6; S.glitch=.3;
      friPanic(18,'рука в открытом окне'); friFace('panic',4); miaFlinch(1.8); miaLean(2.6,-.6,2.2,'win'); /* recoils away from the window */ later(()=>mod2Say('friSlam',T('fri_slam')),150); friWalk('close',1.6); }
    if(st.stage==='window' && S.blinds.closed) F.lastDef='blinds'; else if(st.stage==='window' && lampMode('window')==='BOOST') F.lastDef='light';
    if(st.stage==='hidden' && t-F.attT>4){ F.att='over'; F.attOver=t; S.night.aggr=F.aggr0; friLog('нападение 1 отбито');
      friFace('anxious',2.5); later(()=>mod2Say('friThank',T(F.lastDef==='blinds'?'fri_thankBlinds':F.lastDef==='light'?'fri_thankLight':'fri_thank')),900);
      F.s99AfterT=t+1.5; }
  if(F.s99AfterT && t>F.s99AfterT && friOnce('s99after')) pushMsg('stalker','Stranger_99',T('fri_s99after'));
  }
  if(F.att==='over' && !F.dm && t>F.attOver+FRI.dmAfter && !F.walk && !F.walks.length && S.mia.awayT<=0) friDmOpen();
}

/* ---------------- 5. one private conversation (threats paused) */
function friDmOpen(){
  const F=FRS(); friDom(); const er=S.m2?(S.m2.erased||0)+(S.m2.erasedWarn||0):0;
  const hid=['real','personal','fake'].some(k=>{ const m=friMsg(F.ids[k]); return m&&m.st==='hidden'; });
  const key=F.photoFrom==='mod'?'fri_dmPhotoMod':F.photoKnown?'fri_dmPhoto':(er>0||hid)?'fri_dmHidden':'fri_dmPlain';
  F.dm='open'; friFace('anxious',4); friLog('ЛИЧКА: «'+T(key)+T('fri_dmAsk')+'»');
  const el=$('friDm'); el.innerHTML=`<div class="dmbox"><small>${esc(T('fri_dmHead'))}</small><p>${esc(T(key)+T('fri_dmAsk'))}</p><div class="dmans">`+
    [['A','fri_dmA'],['B','fri_dmB'],['C','fri_dmC']].map(([c,k])=>`<button type="button" class="pbtn" data-dm="${c}">${esc(T(k))}</button>`).join('')+`</div></div>`;
  el.hidden=false; SFX.click&&SFX.click();
  el.querySelectorAll('[data-dm]').forEach(b=>b.onclick=()=>friDmAnswer(b.dataset.dm));
}
function friDmAnswer(c){
  const F=FRS(); if(F.dm!=='open') return; F.dm='done'; F.dmChoice=c; F.dmAt=S.t; $('friDm').hidden=true;
  /* A: protected but on edge (panic climbs faster in the finale) · B: calm, no head start · C: winds down — calmer, lights lower, he comes sooner */
  if(c==='A'){ F.prepared=true; F.nervous=true; friPanic(6,'«там действительно кто-то есть»'); friFace('anxious',3); mod2Say('friRepA',T('fri_dmRepA'));
    if(S.winOpen) friWalk('close',1.6); const b=S.blinds; b.closed=true; b.timer=6; SFX.blinds(); friBadge('fri_b_red',2.5); }
  else if(c==='B'){ S.panic=Math.max(0,S.panic-10); F.trusting=true; friFace('talk',2.5); mod2Say('friRepB',T('fri_dmRepB')); }
  else { S.panic=Math.max(0,S.panic-15); F.wrap=true; F.wrapT=S.t; friFace('calm',2.5); mod2Say('friRepC',T('fri_dmRepC')); }
  friLog('ИГРОК ответил в личке: '+({A:'«закрой окно» — защищена, но на нервах',B:'«я слежу» — спокойна, без форы',C:'«заканчивай эфир» — сворачивается, он придёт раньше'}[c]));
}

/* ---------------- 6. red eyes at the window — her readiness comes from everything above */
function friFinal(){
  const F=FRS(), st=S.st, t=S.t;
  /* winding down: the cause is shown before he comes — closet light off, her goodbye, his "leaving? so early?" */
  if(F.wrap){ if(t>F.wrapT+2.5 && friOnce('wrapLight')){ S.lamps.closet.mode='DIM'; mod2Say('friWrap',T('fri_wrap')); friLog('Мия гасит свет в шкафу, прощается'); }
              if(t>F.wrapT+4 && friOnce('wrapS99')) pushMsg('stalker','Stranger_99',T('fri_s99wrap')); }
  const finAt = F.wrap ? F.wrapT+4+FRI.finalAfterEnd : F.dmAt+FRI.finalAfter;
  if(F.fin==='wait' && F.dm==='done' && t>finAt){ F.fin='go'; F.finT=t; friSend(true);
    if(F.nervous){ F.pmul0=S.night.pmul; S.night.pmul=F.pmul0*1.4; }
    friLog('ФИНАЛ: красные глаза · Мия '+(F.wrap?'собирает вещи (раньше, без её помощи, паника ниже)':F.prepared?'готова, но на нервах':(!F.denied&&(F.photoKnown||F.wary))?'готова':F.denied?'поверила, что это спам':'не готова')); }
  if(F.fin==='go'){
    if(st.stage==='window' && st.red && !F.finSeen){ F.finSeen=true;
      const ready=!F.wrap && (F.prepared || (!F.denied && (F.photoKnown||F.wary)));
      if(F.wrap){ S.mia.awayT=4; S.mia.sawSomething=false; $('awaybadge').textContent=T('fri_packAway'); F.packBack=t+4; friLog('Мия у коробок — глаза видит только модер'); }
      else if(ready){ const b=S.blinds; b.closed=true; b.timer=FRI.miaBlinds; b.cd=CD.blinds; SFX.blinds(); S.winOpen=false; friFace('anxious',3); miaLean(-2.4,0,1.6,'win'); friBadge('fri_b_red',2.2); mod2Say('friRedKnow',T('fri_redKnow')); }
      else F.finScare=true; }
    if(F.finScare && st.stage==='window' && st.red && !F.finScared){ F.finScared=true; /* at once: a quick player must still SEE that she was not ready */ S.shake=.5; SFX.near(); friFace('panic',3.5); miaFlinch(1.6); miaLean(2.2,-.5,2.2,'win');
      friPanic(15,F.denied?'красные глаза после «ерунда, спам»':'увидела красные глаза неподготовленной'); mod2Say('friRedScare',T(F.denied?(F.askKind==='thud'?'clm_redDeniedThud':'fri_redDenied'):'fri_redScare')); }
    if(F.packBack && t>F.packBack && friOnce('packBack')){ $('awaybadge').textContent=T('away'); if(st.stage!=='hidden'){ friPanic(8,'вернулась от коробок — а он у окна'); friFace('scared',3); mod2Say('friRedPack',T('fri_redPack')); } }
    if(st.stage==='hidden' && t-F.finT>4){ F.fin='over'; F.endAt=t+FRI.endAfter; if(F.pmul0) S.night.pmul=F.pmul0; friLog('финал отбит, эфир заканчивается'); }
  }
  if(F.endAt && t>F.endAt && S.running){ F.endAt=0; endGame('win'); }
}
/* red eyes only at the window: steps/alarm are off in the slice (live test 19.11) */
function friRedOnlyWindow(){ const st=S.st; if(st.red && st.stage!=='window' && st.stage!=='hidden'){ st.red=false; friLog('красные глаза погасли у '+st.stage+': снова работает ЯРКИЙ'); } }

function friWatch(){ const F=FRS(), st=S.st, k=st.stage+(st.red?'·red':''); if(F.lastStage!==k){ friLog('сталкер: '+(F.lastStage||'—')+' → '+k); F.lastStage=k; } }
function friTick(dt){
  const F=FRS();
  if(F.badgeUntil && S.t>F.badgeUntil){ F.badgeUntil=0; $('friBadge').hidden=true; }
  friStalker(); friCalm(); friStory(); friAttack(dt); friFinal(); friRedOnlyWindow(); friWalkTick(dt); friWatch();
  if(!F.pre){ friImpTick(); friThudTick(); friPersTick(); }
}
{ const updOld=update;
  update=function(dt){
    if(S&&S.running&&friOn()){
      friDom(); const F=FRS();
      if(!F.cloned){ F.cloned=true; S.night=Object.assign({},S.night); S.len=FRI.lenMax; friLog('пятница v3: старт'+(F.pre?' с обучением':'')); }
      if(F.pre){ if(!(typeof UI_MOTION!=='undefined'&&UI_MOTION.shift)) friPreTick(dt); return; }
      if(F.dm==='open') return; /* the private conversation pauses the night */
    }
    updOld(dt);
    if(S&&S.running&&friOn()&&!(S.guide&&S.guide.active)) friTick(dt);
  };
}

/* Friday clock: the pre-show stands at 23:00, then one stream minute per 6 s (the night is director-timed, up to 360 s) */
{ const csOld=clockStr; clockStr=function(){ if(S&&S.fri&&S.night&&S.night.key==='fri'&&S.night.mod2){ if(S.clockGlitch>0) return csOld(); const m=S.fri.pre?0:Math.min(59,Math.floor(S.t/6)); return '23:'+String(m).padStart(2,'0'); } return csOld(); }; }
/* Mia must not notice the note by herself on Friday: what she learns comes from the chat (and the player) */
{ const sayOld=say; say=function(key,text,cool){ if(key==='note'&&S&&friOn()) return; return sayOld(key,text,cool); }; }

/* ---------------- hooks: panic causes, actions, reads, messages (journal); tutorial ban guard */
let friCause=null;
{ const apOld=addPanic; addPanic=function(v,opt){ const p0=S?S.panic:0; apOld(v,opt);
    if(S&&S.fri&&S.panic-p0>=2){ let why=friCause; if(!why){ const st=(new Error().stack||'').split('\n')[2]||''; why=(st.trim().split(' ')[1]||'?'); }
      friLog('паника +'+(S.panic-p0).toFixed(0)+' → '+S.panic.toFixed(0)+'% · '+why); } }; }
{ const actOld=mod2Act; mod2Act=function(kind){ const m=S&&S.selected!=null?S.chat.find(x=>x.id===S.selected):null; actOld(kind); if(S&&S.fri&&m) friLog('ИГРОК: '+(kind==='pin'?'закрепил':'скрыл')+' '+m.user+' «'+m.text.slice(0,34)+'» ['+m.st+']'); }; }
{ const banOld=ban; ban=function(id){
    const m=S&&S.chat.find(x=>x.id===id);
    if(S&&S.fri&&S.fri.pre&&m&&m.type==='normal'){ SFX.wrong(); floaty(T('fri_noBanTut')); return; }
    const F=S&&S.fri;
    if(F && m && id===F.ids.personal && m.type==='normal'){ m.type='stalker'; F.persBanned=true; friLog('ИГРОК забанил quiet_reader'); }
    const real=F&&F.ids.real!=null&&id===F.ids.real&&m&&!F.warningRead;
    banOld(id);
    if(real && m.banned && !F.realHidAt){ F.realHidAt=S.t; F.realBanUnread=true; }   /* viewers notice the ban; Mia only hears them (fri_askHid) */ if(S&&S.fri&&m&&m.banned) friLog('ИГРОК: бан '+m.user+' «'+m.text.slice(0,34)+'»'); }; }
{ const efOld=mod2Effect; mod2Effect=function(m,aloud){ if(S&&S.fri) friLog('Мия прочла'+(aloud?' ВСЛУХ':'')+': '+m.user+' «'+m.text.slice(0,40)+'»'); efOld(m,aloud); }; }
{ const pmOld=pushMsg; pushMsg=function(type,user,text,opts){ const m=pmOld(type,user,text,opts);
    if(S&&S.fri&&friOn()&&type!=='sys'&&(type!=='normal'||m.st==='held'||m.warn)) friLog('чат: '+user+' ('+type+(m.st==='held'?', фильтр':'')+') «'+String(text).slice(0,40)+'»'); return m; }; }

/* ---------------- the photo stays taped to the glass after the clip (the evidence reward is given once, as before) */
{ const capOld=evidenceCaptured; evidenceCaptured=function(){ capOld(); if(friOn()){ S.ev.noteFly=0; S.ev.noteStay=true; friLog('ИГРОК: записал записку (улика)'); } }; }

/* ---------------- slice tool set: night.off (Friday: steps, alarm); kept in the full game */
function friToolOff(k){ return !!(S&&S.night&&(S.night.off||[]).includes(k)); }
{ const shOld=smartHome; smartHome=function(kind){ if(friToolOff(kind)) return; shOld(kind); }; }
{ const donOld=donate; donate=function(){ if(friToolOff('donate')) return; donOld(); }; }
{ const hudOld=hud; hud=function(dt){ hudOld(dt); if(!S) return;
    for(const [k,id] of [['steps','actSteps'],['alarm','actAlarm'],['donate','actDonate']]){ const b=$(id); if(!b) continue; const off=friToolOff(k); b.classList.toggle('slice-off',off); if(off){ b.disabled=true; b.title=T('fri_off'); } }
    if(!friOn()){ for(const id of ['friBox','friBadge','friAsk']){ const x=$(id); if(x) x.hidden=true; } }
    friLogDraw();
  }; }
{ const rlOld=redLessonSound; redLessonSound=function(){ const g=S.guide; if(!friToolOff('steps')&&!friToolOff('alarm')) return rlOld(); g.phase='redSound'; g.action=['dog'].find(k=>S.sh[k]<=0); if(!g.action){ g.phase='redDone'; return; } g.before=S.sh[g.action]; }; }
/* background chat must not put generic lines into the real mint_fern's mouth (her manner is the clue) */
/* (mint_fern is kept out of background chat by the Friday viewerName wrapper below) */


/* ---------------- only scripted plot lines on Friday (live test 19.11: old Friday topic lines and random Stranger_99/imitator lines
   spoiled the plot and trained "gold bar = hide", so the real warning got hidden by reflex) */
{ const ssOld=stalkerSay; stalkerSay=function(pool,opts){ if(S&&friOn()) return {}; return ssOld(pool,opts); }; }
/* in a scripted attack the blinds do not end it: he leaves the glass and goes round to the door (one stalker, no teleport) */
{ const srOld=stalkerRetreat; stalkerRetreat=function(to){ const F=S&&S.fri, st=S&&S.st;
    if(F&&friOn()&&(F.att==='go'||F.fin==='go')&&to==='hidden'&&st.stage==='window'&&S.blinds.closed&&!F['detour'+F.att+F.fin]){
      F['detour'+F.att+F.fin]=true; st.route=ROUTES.A; enterStage('door',.12); friLog('жалюзи у окна: он обходит к двери'); mod2Say('friDetour',T('fri_detour')); friFace('anxious',3); miaLean(2,0,2.2,'door'); return; }
    /* pushed back from the door after the detour: he leaves for good (no window↔door ping-pong) */
    if(F&&friOn()&&(F.att==='go'||F.fin==='go')&&st.stage==='door'&&F['detour'+F.att+F.fin]){ friLog('отогнан от двери — ушёл'); return srOld('hidden'); }
    return srOld(to); }; }

/* live test 19.11 (tester): the regulars wrote half of the background chat, generated nicks echoed them (vhswave43, mint_toast) —
   that blurs who is who, and "mint…" nicks undermine telling mint_fern from her imitator. Background lines with a filter word
   (e.g. "rain outside the window") became red herrings with a gold bar. Old Friday small talk assumed she had seen the photo. */
const FRI_NICK_ROOTS=['mint','m1nt','vhs','sleepy','noodle'];
{ const gnOld=genName; genName=function(){ let n=gnOld(); if(S&&friOn()) for(let i=0;i<12&&FRI_NICK_ROOTS.some(r=>n.toLowerCase().startsWith(r));i++) n=gnOld(); return n; }; }
{ const vnOld=viewerName; viewerName=function(){ if(S&&friOn()) return Math.random()<.22?pick(REGULARS.filter(r=>r!=='mint_fern')):genName(); return vnOld(); }; }
{ const pnOld=pickNormal; pickNormal=function(){ if(!(S&&friOn())) return pnOld(); const L=C().NORMAL.filter(x=>!mod2Trigger(x)); return freshLine(L.length?L:C().NORMAL,'normal'); }; }
for(const L of ['ru','en']){ const n=LINES[L]&&LINES[L].night; if(n&&n.fri) n.fri=n.fri.filter(x=>!/фото|photo/i.test(x.t)); }

/* ---------------- talking to Mia through pins: any ordinary pinned line gets a short answer in its own topic
   (live tests 19.11: the movie pin was the favourite moment; a pinned "тоже шаурма лол" got silence) */
const FRI_REPLY={
 ru:[[/чай|какао|кофе/,'сегодня жасминовый, кстати. грею руки об кружку'],[/кот|кош|мяу|кис/,'котики — это святое. мяу в ответ'],
     [/песн|музык|плейлист|лоуфай/,'это мой ночной плейлист, скину ссылку после стрима'],[/шаурм|ужин|поесть|еда|голод/,'не говорите про еду… я тоже голодная'],
     [/привет|добр|всем|здрав/,'привет-привет! рада, что ты тут'],[/спасибо|топ|база|имба|класс|кайф|мило|уютн/,'ой, спасибо… чат, вы сегодня милые'],
     [/наушник|ушк|звезд|причёск|кружк|плед|гирлянд|сетап/,'хи-хи, заметили! мне тоже нравится'],[/\?/,'хм… хороший вопрос. расскажу после стрима'],
     [/./,'хаха, согласна!']],
 en:[[/tea|cocoa|coffee/,'jasmine tonight, by the way. warming my hands on the mug'],[/cat|meow|kitty/,'cats are sacred. meow back'],
     [/song|music|playlist|lofi/,"it's my night playlist, i'll share it after the stream"],[/food|dinner|hungry|eat/,"don't talk about food… i'm hungry too"],
     [/hi|hello|evening|hey/,"hi hi! glad you're here"],[/thanks|cool|cozy|cute|nice|based/,'aww, thanks… chat, you are sweet tonight'],
     [/headphone|ears|star|hair|mug|blanket|lights|setup/,'hehe, you noticed! i like it too'],[/\?/,"hm… good question. i'll tell you after the stream"],
     [/./,'haha, agreed!']]};
{ const efOld2=mod2Effect; mod2Effect=function(m,aloud){ efOld2(m,aloud);
    if(!(S&&friOn()&&aloud&&m.type==='normal'&&!(S.fri&&S.fri.objs[m.id]))) return;
    const F=S.fri; if(S.t-(F.replyAt??-1e9)<5) return; F.replyAt=S.t;
    const t=String(m.text).toLowerCase(), R=(FRI_REPLY[LANG]||FRI_REPLY.en).find(([re])=>re.test(t));
    later(()=>{ if(S&&S.fri){ friFace('talk',3); mod2Say('friReply',R[1]); friLog('Мия ответила на закреп: '+R[1]); } },1500);
  }; }

/* ---------------- story beats: on Friday the director speaks for her; the old fraction-timed beats are off */
for(const L of ['ru','en']){ const B=STORY[L]&&STORY[L].fri; if(B) B.beats=[]; }
/* background "there's something on your window" chatter would tell her about the note behind the player's back */
{ const ctOld=chatTick; chatTick=function(dt){
    if(!(S&&friOn())) return ctOld(dt);
    if(S.st.stage==='hidden'&&S.fri&&S.fri.att!=='go'&&S.fri.fin!=='go') S.nervousT=Math.max(S.nervousT,2);
    const note=S.ev.note; S.ev.note=false; try{ return ctOld(dt); } finally{ S.ev.note=note; } /* no "someone taped a note" chatter: only mint_fern, through you */
  }; }

/* ---------------- end of the night: what reached Mia (+ journal) */
function friStatus(id){
  const m=friMsg(id), F=S.fri;
  if(!m) return T('fri_st_none');
  if(m.st==='read') return T(F.pins[id]?'fri_st_readAloud':'fri_st_read');
  if(m.st==='hidden') return T('fri_st_hidden');
  if(m.st==='banned'||m.banned) return T('fri_st_banned');
  return T('fri_st_none');
}
/* ---------------- end of the night: a cause → effect story of what the player did (live test 19.11: a status table said nothing) */
const FRI_SUM={
 ru:{
  persShown:'Ты показал Мие сообщение quiet_reader → она испугалась, что кто-то знает её дом, и стала осторожнее.',
  persSelf:'Мия сама прочла сообщение quiet_reader → испугалась, что кто-то знает её дом.',
  persBan:'Ты забанил quiet_reader → Мия не узнала, что её видели у подъезда.',
  thudA:'Мия спросила про стук по стеклу — ты сказал правду → она пошла посмотреть.',
  thudB:'Мия спросила про стук — ты сказал «показалось» → она тебе поверила.',
  thudNone:'Мия спросила про стук — ты промолчал.',
  realShown:'Ты показал Мие предупреждение mint_fern → она насторожилась и посмотрела на стекло.',
  realSelf:'Мия сама прочла предупреждение mint_fern, без твоего «показать» → не была уверена.',
  realTold:'Про стекло ты уже сказал ей сам → предупреждение mint_fern она приняла всерьёз.',
  askA:'Зрители спросили, что ты удалил; Мия переспросила — ты сказал правду → она успела насторожиться.',
  askB:'Зрители спросили, что ты удалил; ты назвал это спамом → Мия тебе поверила.',
  fakeBan:'Ты забанил m1nt_fern → его «открой окно» до Мии не дошло.',
  fakeShown:'Ты показал Мие «открой окно» от m1nt_fern.',
  finDeniedThud:'Красные глаза: «ты же сказал, что показалось!»', title:'КАК ПРОШЛА НОЧЬ',
  persRead:'Ты показал Мие сообщение quiet_reader → она испугалась, что кто-то знает её дом.',
  persHid:'Ты скрыл сообщение quiet_reader → Мия не узнала, что её видели у подъезда.',
  realPin:'Ты показал Мие предупреждение mint_fern → Мия насторожилась заранее и посмотрела на стекло.',
  realAskA:'Ты скрыл предупреждение, но сказал правду, когда Мия спросила → она успела насторожиться.',
  realAskB:'Ты скрыл предупреждение и назвал его спамом → Мия тебе поверила.',
  realHid:'Ты скрыл предупреждение mint_fern → о бумажке Мия не узнала.',
  doubt:'Предупреждение и подделка дошли до неё сами → Мия запуталась и не подготовилась.',
  realWeak:'Предупреждение дошло само, а подделку ты убрал → Мия сама решила посмотреть на стекло.',
  banMint:'Ты забанил mint_fern → предупреждать Мию стало некому.',
  fakeOpen:'Мия поверила «открой окно» → окно было открыто, она сама увидела фото.',
  fakeHid:'Ты скрыл подделку m1nt_fern → Мия её не увидела.',
  photo:'Фото на стекле Мия видела.', noPhoto:'Фото на стекле Мия так и не увидела.',
  attWary:'Первое нападение: она заметила его первой.', attDoubt:'Первое нападение: она сомневалась — «это то, о чём писали?»',
  attSurp:'Первое нападение застало её врасплох.', attSlam:'В открытом окне появилась рука.',
  dmA:'В личке ты велел закрыть окно → в финале она сама опустила жалюзи, но паниковала сильнее.',
  dmB:'В личке ты сказал «я слежу» → она успокоилась, но в финале была без форы.',
  dmC:'В личке ты посоветовал закончить эфир → она начала собираться, и он пришёл раньше.',
  finReady:'Красные глаза: она была готова.', finDenied:'Красные глаза: «ты же сказал, что это спам!»', finPack:'Красные глаза пришли, пока она собирала вещи.', finScared:'Красные глаза: она не была готова.',
  copy:'журнал для разработчика' },
 en:{
  persShown:'You showed Mia quiet_reader\'s message → she got scared someone knows her home, and got careful.',
  persSelf:'Mia read quiet_reader\'s message herself → she got scared someone knows her home.',
  persBan:'You banned quiet_reader → Mia never learned someone saw her by her door.',
  thudA:'Mia asked about the knock on the glass — you told the truth → she went to look.',
  thudB:'Mia asked about the knock — you said "you imagined it" → she believed you.',
  thudNone:'Mia asked about the knock — you said nothing.',
  realShown:'You showed Mia mint_fern\'s warning → she got wary and looked at the glass.',
  realSelf:'Mia read mint_fern\'s warning herself, without your «show» → she was not sure.',
  realTold:'You had already told her about the glass → she took mint_fern\'s warning seriously.',
  askA:'Viewers asked what you deleted; Mia asked again — you told the truth → she got wary in time.',
  askB:'Viewers asked what you deleted; you called it spam → Mia believed you.',
  fakeBan:'You banned m1nt_fern → his "open the window" never reached Mia.',
  fakeShown:'You showed Mia "open the window" from m1nt_fern.',
  finDeniedThud:'Red eyes: "you said I imagined it!"', title:'HOW THE NIGHT WENT',
  persRead:"You showed Mia quiet_reader's message → she got scared someone knows her home.",
  persHid:"You hid quiet_reader's message → Mia never learned someone saw her by her door.",
  realPin:"You showed Mia mint_fern's warning → Mia got wary early and looked at the glass.",
  realAskA:'You hid the warning but told the truth when Mia asked → she got wary in time.',
  realAskB:'You hid the warning and called it spam → Mia believed you.',
  realHid:"You hid mint_fern's warning → Mia never learned about the paper.",
  doubt:'The warning and the fake both reached her on their own → Mia got confused and did not prepare.',
  realWeak:'The warning reached her on its own and you removed the fake → Mia decided to look at the glass herself.',
  banMint:'You banned mint_fern → nobody was left to warn Mia.',
  fakeOpen:'Mia believed "open the window" → it was open, she saw the photo herself.',
  fakeHid:'You hid the m1nt_fern fake → Mia never saw it.',
  photo:'Mia saw the photo on the glass.', noPhoto:'Mia never saw the photo on the glass.',
  attWary:'First attack: she spotted him first.', attDoubt:'First attack: she hesitated — "is this what they wrote about?"',
  attSurp:'The first attack caught her off guard.', attSlam:'A hand came through the open window.',
  dmA:'In DMs you told her to shut the window → in the finale she lowered the blinds herself, but panicked more.',
  dmB:'In DMs you said "I\'m watching" → she calmed down, but had no head start in the finale.',
  dmC:'In DMs you told her to end the stream → she started packing and he came sooner.',
  finReady:'Red eyes: she was ready.', finDenied:'Red eyes: "you said it was spam!"', finPack:'The red eyes came while she was packing.', finScared:'Red eyes: she was not ready.',
  copy:'developer journal' } };
function friStory2(){
  const F=S.fri, L=FRI_SUM[LANG]||FRI_SUM.en, out=[];
  const pm=friMsg(F.ids.personal); if(F.persBanned) out.push(L.persBan); else if(pm&&pm.st==='read') out.push(F.persAloud?L.persShown:L.persSelf);
  if(F.askKind==='thud') out.push(F.askChoice==='A'?L.thudA:F.askChoice==='B'?L.thudB:L.thudNone);
  if(friBannedMint()){ out.push(L.banMint); if(F.askKind==='hid'&&F.askChoice==='A') out.push(L.askA); else if(F.askKind==='hid'&&F.askChoice==='B') out.push(L.askB); }
  else if(F.warningRead){ out.push(F.realAloud?L.realShown:F.toldThud?L.realTold:F.doubt?L.doubt:L.realSelf); }
  const fk=friMsg(F.ids.fake); if(fk&&fk.banned) out.push(L.fakeBan); else if(fk&&F.pins&&F.pins[fk.id]&&!F.everOpened) out.push(L.fakeShown);
  if(F.everOpened) out.push(L.fakeOpen);
  out.push(F.slammed?L.attSlam:F.attKind==='wary'?L.attWary:F.attKind==='doubt'?L.attDoubt:L.attSurp);
  if(F.dmChoice) out.push(L['dm'+F.dmChoice]);
  out.push(F.wrap?L.finPack:F.finScared?(F.denied?(F.askKind==='thud'?L.finDeniedThud:L.finDenied):L.finScared):L.finReady);
  out.push(F.photoKnown?L.photo:L.noPhoto);
  return out;
}
{ const endOld=showEnd; showEnd=function(reason){ endOld(reason);
    for(const id of ['friSum','friCopy','friLogText']){ const x=$(id); if(x) x.remove(); }
    if(!S||S.night.key!=='fri'||!S.fri||!S.night.mod2) return; const F=S.fri, L=FRI_SUM[LANG]||FRI_SUM.en;
    friLog('КОНЕЦ НОЧИ: '+reason+' · паника '+Math.round(S.panic)+'%');
    if(reason==='win'&&!PROG.friTutDone){ PROG.friTutDone=true; saveProg(); }
    const anchor=$('endArchive').previousElementSibling||$('endArchive');
    anchor.insertAdjacentHTML('beforebegin',`<div class="fri-sum" id="friSum"><b>${esc(L.title)}</b><ol>${friStory2().map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`);
    if(typeof MOD2_DEV!=='undefined'&&MOD2_DEV){
      if(typeof TM_DEV==='undefined'||TM_DEV) $('endWhisper').insertAdjacentHTML('afterend',`<button type="button" class="fri-copy" id="friCopy">${esc(L.copy)}</button>`);   /* 22.11: the developer journal link only with ?dev */
      const text=F.log.join('\n'); if($('friCopy')) $('friCopy').onclick=()=>{ const done=()=>{ $('friCopy').textContent=T('fri_logCopied'); };
        const show=()=>{ if($('friLogText')) return; $('friCopy').insertAdjacentHTML('afterend','<textarea id="friLogText" class="fri-logtext" readonly></textarea>'); const ta=$('friLogText'); ta.value=text; ta.focus(); ta.select(); };
        if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done,show); else show(); };
    }
    const real=friMsg(F.ids.real);
    /* the whisper answers what the PLAYER did, not only how the night ended */
    $('endWhisper').textContent = T(friBannedMint()?'fri_wh_ban': F.everOpened?'fri_wh_open': F.denied?(F.askKind==='thud'?'clm_whDeniedThud':'fri_wh_lie'): F.wrap?'fri_wh_wrap': F.ev==='shown'?'fri_wh_sent': (F.ev==='kept'||F.ev==='found')?'fri_wh_kept': real&&real.st==='hidden'?'fri_wh_hidden': F.photoKnown?'fri_wh_photo':'fri_wh_none');
  }; }

/* ---------------- who is who: mint_fern and her look-alike m1nt_fern (22.11, from the clarity pass)
   mint_fern has her own avatar (a mint cat with a leaf) from the start; the look-alike's is close (no leaf, another mouth).
   He writes twice before the «open the window» scene in his own manner («Мия», «)»), so his history is not empty. */
const FRI_MINT_REAL=`<svg viewBox="0 0 24 24"><path d="M4.5 7.5L5.4 1.8l4.4 3.4zM19.5 7.5l-.9-5.7-4.4 3.4z" fill="#8fd6b4"/><circle cx="12" cy="12.4" r="10.6" fill="#8fd6b4"/><path d="M13.6 1.3c2.6.2 4 1.6 4.3 3.6-2.4.1-3.9-1.2-4.3-3.6z" fill="#3f9a62"/><circle cx="9" cy="11.6" r="1.35" fill="#21352c"/><circle cx="15" cy="11.6" r="1.35" fill="#21352c"/><path d="M9.2 15.2c1.6 1.6 4 1.6 5.6 0" fill="none" stroke="#21352c" stroke-width="1.4" stroke-linecap="round"/><circle cx="6.4" cy="14.4" r="1.5" fill="rgba(255,120,140,.3)"/><circle cx="17.6" cy="14.4" r="1.5" fill="rgba(255,120,140,.3)"/></svg>`;
const FRI_MINT_FAKE=`<svg viewBox="0 0 24 24"><path d="M4.5 7.5L5.4 1.8l4.4 3.4zM19.5 7.5l-.9-5.7-4.4 3.4z" fill="#86cdb0"/><circle cx="12" cy="12.4" r="10.6" fill="#86cdb0"/><circle cx="9" cy="11.6" r="1.35" fill="#21352c"/><circle cx="15" cy="11.6" r="1.35" fill="#21352c"/><path d="M9.4 15.6c1.7.9 3.5.9 5.2 0" fill="none" stroke="#21352c" stroke-width="1.4" stroke-linecap="round"/><circle cx="6.4" cy="14.4" r="1.5" fill="rgba(255,120,140,.3)"/><circle cx="17.6" cy="14.4" r="1.5" fill="rgba(255,120,140,.3)"/></svg>`;
function mintAvatar(m){ return m.user==='mint_fern'?FRI_MINT_REAL:m.user==='m1nt_fern'?FRI_MINT_FAKE:null; }   /* chat.js renderMsg */
function friImpTick(){ const F=S.fri; if(!S.running) return;
  const lines=LANG==='ru'?['Мия, привет) давно тебя не смотрел','Мия, у тебя сегодня очень уютно)']:['Mia, hi) haven\'t watched you in a while','Mia, it looks so cozy tonight)'];
  for(const [at,i] of [[38,0],[58,1]]) if(S.t>at && !F['pxImp'+i]){ F['pxImp'+i]=1; S.mimicNext='mint_fern'; pushMsg('normal','m1nt_fern',lines[i],{acc:'imp:m1nt_fern'}); } }

/* ---------------- quiet_reader («я знаю, где ты живёшь») shown aloud → she takes it as a real warning */
function friPersTick(){ const F=S.fri, m=F.ids.personal!=null&&friMsg(F.ids.personal); if(!m||F.persDone||m.st!=='read') return;
  F.persDone=true; F.persAloud=!!(F.pins&&F.pins[m.id]); if(F.persAloud){ F.wary=true; friLog('Мия ВСЕРЬЁЗ: кто-то знает её дом (показал модер) → насторожена'); } }

/* ---------------- Mia hears the thud on the glass and asks the mod: tell the truth / «показалось» / say nothing */
function friThudAsk(){ const F=S.fri; if(F.ask||F.warningRead||F.photoKnown) return; F.ask='open'; F.askKind='thud'; F.askT=S.t; friDom();
  mod2Say('clmThud',T('clm_thudAsk')); friFace('surprised',2); friLog('Мия услышала стук по стеклу и спрашивает модера');
  const el=$('friAsk'); el.innerHTML=`<small>${esc(T('clm_thudAsk'))}</small><div>`+[['A','clm_thudA'],['B','clm_thudB']].map(([c,k])=>`<button type="button" class="pbtn" data-ask="${c}">${esc(T(k))}</button>`).join('')+`</div>`;
  el.hidden=false; el.querySelectorAll('[data-ask]').forEach(b=>b.onclick=()=>friAskClose(b.dataset.ask)); }
function friThudTick(){ const F=S.fri; if(F.clThud) return;
  if(S.ev.note && !F.clThudAt) F.clThudAt=S.t+2.6;
  if(F.clThudAt && S.t>F.clThudAt && !F.walk && !F.walks.length && S.mia.awayT<=0 && !(S.st&&S.st.stage!=='hidden')){ F.clThud=true; friThudAsk(); } }
