"use strict";
/* Eight live broadcasts. Session memory avoids nearby repeats without changing v:2 saves. */
const NARRATIVE_RECENT=new Map();
function freshLine(pool,key){
  if(!Array.isArray(pool))return pool;
  if(!pool.length)return '';
  const id=LANG+':'+key,old=NARRATIVE_RECENT.get(id)||[],free=pool.filter(x=>!old.includes(typeof x==='string'?x:x.t));
  const different=pool.filter(x=>(typeof x==='string'?x:x.t)!==old.at(-1));
  const value=pick(free.length?free:different.length?different:pool);
  old.push(typeof value==='string'?value:value.t);while(old.length>Math.min(8,pool.length-1))old.shift();NARRATIVE_RECENT.set(id,old);return value;
}
const REGULARS=['sleepy_otter','vhs_witch','mint_fern','noodle_owl'];
function viewerName(){return Math.random()<.6?pick(REGULARS):genName();}
const NIGHT_TALKS={
 ru:{
 mon:[['гирлянду в новую квартиру заберу первой. пусть хоть что-то там сразу будет знакомое',['сначала чайник','и кружку с котом']],['vhs_witch, да, на левом ушке всё ещё та золотая звёздочка. держится лучше меня',['не отклеивай','уже фирменный знак']],['эти пионы пахнут на всю комнату. никогда мне такие не дарили',['красивые','только воду меняй']]],
 tue:[['вчерашний букет переставила подальше от края. чуть не снесла локтем',['береги цветы','и локоть']],['вы просили лампы потеплее — вот. теперь у меня лицо как у булочки',['NyanBun буквально','так уютнее']],['sleepy_otter, ты вчера тоже со смены пришёл? у нас уже расписание совпадает',['ночная смена чата','я тоже после работы']]],
 wed:[['вчера думала закрыть личку совсем. но там и ваши нормальные сообщения',['можно только друзьям','не читай незнакомых']],['сегодня ужин фотографировать не буду. после того сообщения как-то не хочется',['понимаем','не обязана всё показывать']],['mint_fern, спасибо за список настроек приватности. я сохранила',['хорошо','проверь потом спокойно']]],
 thu:[['номер заявления записала. всё время проверяю, не потеряла ли бумажку',['сфоткай тоже','сохрани копию']],['чай уже четвёртый. горло всё равно болит, зато руки тёплые',['береги голос','можно тихий стрим']],['модер, если появится ещё один такой ник — сохрани сообщение перед баном, ладно?',['да, нужны скрины','мы тоже сохраним']]],
 fri:[['после того фото даже шторы поправлять неприятно. будто кто-то ждёт',['не подходи к окну','мы здесь']],['на звёздочке на наушниках край загнулся. всё собиралась подклеить',['оставь, узнаваемо','та самая звезда']],['сегодня без доставки. не хочу ещё раз объяснять незнакомому человеку, какая у меня квартира',['понимаю','есть что дома поесть?']]],
 sat:[['новенькие, привет. если я оглядываюсь — это не постановка для рейда',['поняли','мы без приколов']],['сначала хотела взять все вещи. теперь думаю: главное документы и ноутбук',['остальное довезёшь','собери важное отдельно']],['noodle_owl, список коробок помог. только коробка «разное» уже третья',['всё важное — разное','вечная коробка']]],
 sun:[['гирлянду сниму после завтрашнего эфира. сегодня пусть ещё горит',['проводы гирлянды','на новом месте повесишь']],['в новой квартире сначала проверю дверь. потом уже интернет',['верный порядок','и окна']],['переезжать поможет подруга. договорились: если не отвечу утром, она придёт сама',['хорошо, что не одна','пусть позвонит заранее']]],
 mon2:[['sleepy_otter, завтра уже не буду знать, где у меня чай. всё по коробкам',['подпиши одну ЧАЙ','кружку не упаковывай']],['в новом доме доступ к лампам настрою заново. эти останутся хозяевам',['начнёшь с чистого листа','главное, чтобы спокойно']],['после переезда пару вечеров без камеры. хочу сначала просто побыть дома',['мы подождём','отдохни обязательно']]]
 },
 en:{
 mon:[['the fairy lights are coming with me. something familiar for the new place',['kettle first','and the cat mug']],['vhs_witch, yep, the gold star is still on the left ear. holding up better than me',['keep it','part of the look now']],['those peonies smell so strong. nobody has ever sent me flowers like that',['they look lovely','remember fresh water']]],
 tue:[['moved the flowers back from the edge. nearly knocked them over yesterday',['save the flowers','and your elbow']],['you asked for warmer lights. now i look like a bread roll',['NyanBun literally','cozier this way']],['sleepy_otter, were you just off work yesterday too? same schedule now',['night shift chat','just got home too']]],
 wed:[['nearly closed my DMs completely. but your nice messages are in there too',['friends only maybe','ignore strangers']],['not posting dinner photos today. that message really got to me',['fair enough','you don’t owe us photos']],['mint_fern, thanks for the privacy settings list. saved it',['good','check it after the stream']]],
 thu:[['wrote down the report number. keep checking i haven’t lost the paper',['take a photo too','save a copy']],['fourth cup of tea. throat still hurts, but my hands are warm',['rest your voice','quiet stream is fine']],['mod, if another account like that shows up, save the message before banning it. please',['screenshots matter','we can save them too']]],
 fri:[['after that photo, even fixing the curtains feels wrong. like someone is waiting',['stay away from the window','we are here']],['the gold star on my headphones is peeling. keep meaning to fix it',['keep it','the famous star']],['no deliveries tonight. don’t want to explain which apartment is mine again',['understandable','got something to eat?']]],
 sat:[['hi raiders. if i keep looking behind me, it’s not a bit for the raid',['got it','no jokes from us']],['wanted to take everything. now I’m thinking documents and laptop first',['the rest can wait','pack the essentials']],['noodle_owl, your packing list helped. already on my third box of miscellaneous though',['everything is miscellaneous','the eternal box']]],
 sun:[['taking the lights down after tomorrow’s stream. one more night with them',['farewell lights','put them up at the new place']],['checking the door at the new place first. internet second',['good priorities','and the windows']],['a friend is helping me move. if i don’t answer in the morning, shes coming over',['glad you aren’t alone','good plan']]],
 mon2:[['sleepy_otter, tomorrow i wont even know which box the tea is in',['label one TEA','don’t pack the mug']],['I’ll set up the lights from scratch at the new place. these stay with the landlord',['fresh start','hope it’s peaceful']],['couple of evenings off camera after moving. just want to be home for a bit',['we can wait','take your time']]]
 }};
const NIGHT_STALKER={
 ru:{mon:['цветы уже у тебя. хорошо','ты всегда ставишь кружку слева','ещё восемь вечеров здесь','не выключай гирлянду'],tue:['фонарь всё ещё не починили','пионы лучше не ставить на край','курьер давно ушёл','ты оставила окно открытым'],wed:['ты сегодня ничего не показала на ужин','я знаю, когда ты читаешь личку','модер, ей с тобой спокойнее','не всем сообщениям нужен ответ'],thu:['номер заявления не запирает дверь','кто-нибудь из них остался с тобой?','модер, сохрани и это','пакет всё ещё у двери'],fri:['на фото ты ещё не заметила','шторы надо закрывать до темноты','сосед уже докурил','оставь фото себе'],sat:['коробок стало больше','ты всем сказала, что уедешь','новые зрители уйдут. я останусь','модер, не отпускай её так рано'],sun:['не снимай гирлянду','завтра ты выключишь всё это','последний вечер ещё впереди','подруга придёт только утром'],mon2:['новый адрес ничего не исправит','зачем тебе вечера без камеры','лампы оставишь. а меня?','ещё несколько минут, модер']},
 en:{mon:['the flowers are inside. good','you always put your mug on the left','eight more evenings here','leave the fairy lights on'],tue:['streetlight still isn’t fixed','don’t leave the peonies near the edge','the courier left ages ago','you left the window open'],wed:['no dinner photo today','i know when you read your DMs','mod, she feels safer with you','not every message needs an answer'],thu:['a report number doesn’t lock a door','did any of them stay with you?','mod, save this one too','the bag is still by the door'],fri:['you hadn’t noticed when i took it','close the curtains before dark','the neighbor finished his cigarette','keep the photo'],sat:['more boxes now','you told everyone you’re leaving','the raiders will leave. I’ll stay','mod, don’t let her go so soon'],sun:['don’t take the lights down','tomorrow you’ll switch all of this off','one last evening to go','your friend isn’t coming till morning'],mon2:['a new address wont fix this','why do you need evenings off camera','you’re leaving the lamps. what about me?','a few more minutes, mod']}
};
for(const lang of ['ru','en']){
  const L=LINES[lang];L.night={};
  for(const [night,rows] of Object.entries(NIGHT_TALKS[lang]))L.night[night]=rows.map(([t,c])=>({t,c}));
  /* General small talk stays light; facts, threats and promises belong to a specific night. */
  L.talk=L.talk.filter((_,i)=>[1,2,4,12,21,22,28,30,32,37].includes(i));
  CHAT[lang].STALKER.broken=lang==='ru'?['сообщение удалено. я всё ещё здесь','порядок в чате ничего не меняет','скриншот тоже сохрани, модер']:['message deleted. still here','a tidy chat changes nothing','save a screenshot too, mod'];
  CHAT[lang].STALKER.finale=NIGHT_STALKER[lang].mon2;
}
function stalkerPool(kind){
  const base=C().STALKER,night=NIGHT_STALKER[LANG][DY().key];
  if(!night||S.tut.active||DY().endless)return base[kind]||base.general;
  if(kind==='anchor')return night[0];
  if(kind==='general'||kind==='finale'||kind==='broken')return night;
  return base[kind]||night;
}
for(const lang of ['ru','en']){
 CHAT[lang].NERVOUS.chair=lang==='ru'?['на кресле что-то висит?','это куртка или человек?','свет на кресло, пожалуйста']:['something on the chair?','is that a jacket or a person?','can we get light on the chair'];
}
const NARRATIVE_TEXT={
 ru:{storyTitle:'Слова Мии',storyRead:'Перечитать важное',storyClose:'Вернуться',storyEmpty:'Важные слова Мии появятся здесь по ходу эфира.',storyNew:'Мия сказала кое-что важное',storyPending:'Сохранено во время эфира',
 noteMonTxt:'Ты уедешь. Я останусь рядом.',wh_sun:'Stranger_99 → тебе (шёпот): «завтра она выключит камеру в последний раз.»',
 m_chair:'это моя куртка на спинке. сейчас тоже показалось, что кто-то сидит',tipDecoy:'Тени предметов похожи на человека. У них нет глаз и движения на ДАТЧИКЕ. Проверяй лампы.',
 e_kill:['ЭФИР ОБОРВАЛСЯ','Он схватил Мию раньше, чем закончился эфир. Дальше — только шум и крики чата.'],
 donationMsg:['отправил {v} HC: «выдохни, мы здесь»','отправил {v} HC: «можно просто помолчать»','отправил {v} HC: «не надо извиняться за страх»'],
 m_loop:'модер, сохрани сообщения. я хочу показать их полиции',m_finalGrab:'подожди… отпусти меня!',
 reactionAgain_dog:['опять запись собаки. я всё равно вздрагиваю','знаю, это динамик. но звучит слишком близко'],reactionAgain_steps:['эти шаги из динамика, да? я уже не понимаю','опять этот звук. не буду выходить проверять'],reactionAgain_flick:['опять лампа {z}. мы же только её проверяли','свет {z} снова мигает. я вижу'],reactionAgain_donate:['спасибо. я тут, дышу','вижу, спасибо. давай просто досидим вместе'],reactionAgain_boost:['вижу, модер. только не держи так долго','опять ярко. хорошо, я к окну не подойду'],reactionAgain_dim:['да, убавили. я подожду','теперь темнее. только не оставляйте меня так надолго']},
 en:{storyTitle:'Mia’s words',storyRead:'Read important lines',storyClose:'Back',storyEmpty:'Important things Mia says will appear here during the stream.',storyNew:'Mia said something important',storyPending:'Saved during the stream',
 noteMonTxt:'You can move. I will still be close.',wh_sun:'Stranger_99 → you (whisper): "tomorrow she switches the camera off for the last time."',
 m_chair:'that’s my jacket on the chair. thought it was someone for a second too',tipDecoy:'Objects cast human-looking shadows. They have no eyes or MOTION reading. Check the lamp sensors.',
 e_kill:['FEED CUT OFF','He grabbed Mia before the stream ended. Then only static and the chat screaming.'],
 donationMsg:['sent {v} HC: "breathe. we are here"','sent {v} HC: "it’s okay to sit quietly"','sent {v} HC: "you don’t have to apologize for being scared"'],
 m_loop:'mod, save those messages. i want to show the police',m_finalGrab:'wait… let go of me!',
 reactionAgain_dog:['the dog recording again. still makes me jump','i know it’s the speaker. sounds so close though'],reactionAgain_steps:['those are the speaker footsteps, right? can’t tell anymore','that sound again. not going out to check'],reactionAgain_flick:['the {z} lamp again. we just checked it','the {z} light is flickering again. i see it'],reactionAgain_donate:['thank you. still here, still breathing','i see it, thanks. let’s just stay here a bit'],reactionAgain_boost:['got it, mod. just don’t leave it like that','bright again. okay, staying away from the window'],reactionAgain_dim:['okay, lights down. I’ll wait','darker now. don’t leave me like this too long']}
};
for(const lang of ['ru','en'])Object.assign(STR[lang],NARRATIVE_TEXT[lang]);
function narrativeReaction(key,text){
  const category={m_dog:'dog',m_steps:'steps',m_flick:'flick',m_donate:'donate',m_boost:'boost',m_dim:'dim'}[key];
  if(!category||!S||S.tut.active)return text;
  const count=S.reactionCounts||(S.reactionCounts={});count[category]=(count[category]||0)+1;
  if(count[category]<2)return text;
  const line=freshLine(STR[LANG]['reactionAgain_'+category],'reactionAgain_'+category);return line;
}
const NIGHT_CHAT={
 ru:{mon:['звёздочка на ушке всё ещё на месте','последняя неделя в этой комнате?','гирлянду обязательно забери','я пока чай налью'],tue:['вчерашние цветы ещё стоят','свет сегодня теплее','опять после смены сюда','фонарь так и не сделали?'],wed:['личку можно закрыть для незнакомых','мия, ничего не обязана рассказывать','можем просто посидеть','сегодня без личных вопросов'],thu:['сохраняйте жуткие сообщения','мия, береги голос','заявление сохрани копией','чай и тихий эфир'],fri:['занавески лучше закрыть','фото передали полиции?','я сохранил этот эфир','пожалуйста, не подходи к окну'],sat:['привет с рейда','что тут произошло за неделю?','новенькие, без шуток про окно','упакуй документы отдельно'],sun:['завтра последний эфир отсюда','коробки уже подписаны?','хорошо, что подруга поможет','в новом месте будет спокойнее'],mon2:['удачи завтра с переездом','гирлянду не забудь','мы дождёмся новых эфиров','отдохни после переезда']},
 en:{mon:['gold star still on the headphones','last week in this room?','take the fairy lights with you','getting some tea'],tue:['flowers from yesterday are still there','warmer lighting tonight','back after work again','streetlight still broken?'],wed:['you can close DMs to strangers','you don’t owe us personal stuff','happy to just hang out','no personal questions tonight'],thu:['save the creepy messages','rest your voice mia','keep a copy of the report','tea and a quiet stream'],fri:['better close the curtains','did the police get the photo?','saved this stream','please stay away from the window'],sat:['hello from the raid','what happened this week?','new people, no window jokes please','pack your documents separately'],sun:['last stream here tomorrow','labeled the boxes yet?','glad your friend is helping','hope the new place feels safer'],mon2:['good luck moving tomorrow','don’t forget the fairy lights','we will wait for new streams','take a break after moving']}
};
for(const lang of ['ru','en'])CHAT[lang].TOPIC=NIGHT_CHAT[lang];
/* The montage reveals facts to the player. It is not an overnight police lab report. */
Object.assign(FINTX.ru,{
 rpIntro:'Пропала М. К. (стримерша NyanBun). Подруга приехала помочь с переездом: вещи на месте, Мия не отвечает. Вы — последний, кому она писала. Кого проверить? Приложите всё, что у вас есть.',
 rpNote:'Укажите, что может помочь проверке.',
 protoBody:'По подозрению в преследовании и причастности к исчезновению гр. К. М. задержан гражданин, использовавший учётные записи модератора канала NyanBun и Stranger_99. {how} Проживает в двух километрах от ул. Шелковичной. Имеются основания полагать, что 4–11 августа находился у дома пропавшей. При задержании изъяты телефон Redmi Note 12, ключ от её квартиры и наушники, соответствующие видимым на записях эфиров. Устройство направлено на исследование. Задержанный отрицает причастность, называет Stranger_99 другим человеком и утверждает, что пытался защитить Мию.{extra} Местонахождение К. М. не установлено.',
 protoHowEv:'Проверка начата в связи с его контактом с пропавшей и материалами его заявления ({list}).',protoHowNone:'Проверка начата в связи с его контактом с пропавшей; личность проверена при утреннем опросе.',
 protoExtra:' В заявлении также указан {who}. Проверка этого сообщения продолжается.'
});
Object.assign(FINTX.en,{
 rpIntro:'M. K. (streamer NyanBun) is missing. Her friend arrived to help her move: her things are still there, but Mia is not answering. You were the last person she wrote to. Who should we check? Attach anything you have.',
 rpNote:'Include anything that could help the inquiry.',
 protoBody:'A citizen using the moderator account of the NyanBun channel and the account Stranger_99 was detained on suspicion of stalking and involvement in the disappearance of M. K. {how} Resides two kilometers from Shelkovichnaya Street. There are grounds to believe he was at the missing woman’s residence between August 4 and 11. A Redmi Note 12, a key to her apartment and headphones matching those in her streams were seized at the arrest. The device has been submitted for examination. The detainee denies involvement, describes Stranger_99 as another person and states that he was trying to protect Mia.{extra} The whereabouts of M. K. remain unknown.',
 protoHowEv:'The inquiry followed his contact with the missing woman and the materials in his report ({list}).',protoHowNone:'The inquiry followed his contact with the missing woman; his identity was checked at the morning interview.',
 protoExtra:' His statement also names {who}. This allegation remains under investigation.'
});
for(const lang of ['ru','en']){
 const ru=lang==='ru',f=FINTX[lang].flash;
 FINTX[lang].ev.find(x=>x.id==='log').n=ru?'журнал входов':'login log';
 f[0].x=ru?'Обе учётные записи сохранены в приложении на одном телефоне. Устройство 7F3A-91C2.':'Both accounts are saved in the app on one phone. Device 7F3A-91C2.';
 f[2].k=ru?'ЛИЧНЫЕ СООБЩЕНИЯ · 7 АВГ':'DIRECT MESSAGES · AUG 7';
 f[3].t=ru?'Снято: 8 авг · 00:20\nКамера: Redmi Note 12\nСохранённые координаты: ул. Шелковичная':'Taken: Aug 8 · 00:20\nCamera: Redmi Note 12\nSaved coordinates: Shelkovichnaya St.';
 f[3].x=ru?'Ты снял её через двадцать минут после четвергового эфира. В пятницу фото появилось на окне.':'You photographed her twenty minutes after Thursday’s stream. On Friday the photo appeared on the window.';
 f[4].k=ru?'ТАКСИ · 10 АВГ':'TAXI · AUG 10';
 f[6].t=ru?'Панель управления · Redmi Note 12 · LTE\nИстория геопозиции: ул. Шелковичная, 1█':'Control panel · Redmi Note 12 · LTE\nSaved location history: 1█ Shelkovichnaya St.';
 f[6].x=ru?'Все восемь ночей ты открывал панель у её дома. Домашний компьютер получал копии файлов позже.':'All eight nights you opened the controls outside her house. Your home computer received copies of the files later.';
 f.splice(7,0,{k:ru?'ДВА РЕЖИМА':'TWO TACTICS',t:ru?'Один силуэт. Один телефон.\nПод красными линзами — то же лицо.':'One figure. One phone.\nThe same face behind the red lenses.',h:ru?'Ты менял способ приблизиться.':'You changed how you approached.',x:ru?'Сначала ты отходил от света. Позже шёл быстрее, пока Мия не успела тебя рассмотреть. Звуки тревоги могли привлечь соседей.':'At first you backed away from the light. Later you rushed forward before Mia could see your face. An alarm could bring the neighbors.'});
}
/* Optional reader. Opening it pauses only a running night and restores the previous state. */
const storyButton=document.createElement('button');storyButton.type='button';storyButton.id='storyButton';storyButton.hidden=true;
$('glassnote').insertBefore(storyButton,$('banLeg'));
const storyViewer=document.createElement('section');storyViewer.id='storyViewer';storyViewer.className='overlay';storyViewer.hidden=true;storyViewer.setAttribute('role','dialog');storyViewer.setAttribute('aria-modal','true');storyViewer.setAttribute('aria-labelledby','storyTitle');
storyViewer.innerHTML='<div class="paper"><h2 id="storyTitle"></h2><div id="storyLines"></div><button type="button" class="pbtn" id="storyClose"></button></div>';$('stage').append(storyViewer);
let storyWasRunning=false,storyFocus=null;
function storyOpen(){
  if(!S||FIN.active||S.guide&&S.guide.active||!evidenceViewer.hidden||!storyViewer.hidden)return;
  storyFocus=document.activeElement;storyWasRunning=S.running;if(storyWasRunning){setPause(true);$('ovPause').hidden=true;}
  $('storyTitle').textContent=T('storyTitle');$('storyClose').textContent=T('storyClose');
  $('storyLines').innerHTML=(S.storyLog||[]).map(x=>'<article><small>'+esc(x.clock)+'</small><p>'+esc(x.text)+'</p></article>').join('')||'<p>'+esc(T('storyEmpty'))+'</p>';
  storyViewer.hidden=false;storyButton.classList.remove('unread');S.storyReadCount=(S.storyLog||[]).length;$('storyClose').focus();
}
function storyClose(resume=true){
  if(storyViewer.hidden)return;storyViewer.hidden=true;const go=storyWasRunning;storyWasRunning=false;
  if(go&&resume&&S&&!S.over)setPause(false);else if(go&&!resume)paused=false;
  if(storyFocus&&storyFocus.isConnected)storyFocus.focus({preventScroll:true});
}
storyButton.onclick=storyOpen;$('storyClose').onclick=()=>storyClose();
document.addEventListener('click',e=>{if(e.target.closest('[data-read-story]'))storyOpen();});
document.addEventListener('keydown',e=>{
  if(storyViewer.hidden)return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();storyClose();return;}
  if(e.key==='Tab'){e.preventDefault();$('storyClose').focus();}
  if(!e.target.closest('#storyViewer')){e.preventDefault();e.stopImmediatePropagation();}
},true);
const narrativeHud=hud;
hud=function(dt){narrativeHud(dt);if(!S)return;const n=(S.storyLog||[]).length;storyButton.hidden=!n;storyButton.disabled=!!(S.guide&&S.guide.active)||FIN.active;storyButton.textContent=T('storyRead');storyButton.classList.toggle('unread',n>(S.storyReadCount||0));};
