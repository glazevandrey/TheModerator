"use strict";
// ======================= TEXTS for the Yandex Games build: campaign, menu, shop, ads =======================
Object.assign(STR.en,{
  dayLbl_tue:'TUE · NIGHT 2', dayLbl_wed:'WED · NIGHT 3', dayLbl_thu:'THU · NIGHT 4', dayLbl_fri:'FRI · NIGHT 5', dayLbl_sat:'SAT · NIGHT 6', dayLbl_sun:'SUN · NIGHT 7', dayLbl_mon2:'MON · NIGHT 8', dayLbl_endless:'ENDLESS · NIGHT {n}',
  dayName_tue:'Tuesday', dayName_thu:'Thursday', dayName_sat:'Saturday', dayName_sun:'Sunday', dayName_endless:'Endless shift',
  di_tue:['TUESDAY','The streetlight in the yard is out again.'], di_thu:['THURSDAY','Mia has a cold. She\'s more easily frightened tonight.'],
  di_sat:['SATURDAY','A troll raid hits the chat. Keep it clean.'], di_sun:['SUNDAY','Blackout. The blinds are jammed and the lamps are already warm.'],
  di_endless:['NIGHT {n}','The shift never ends. How long can you keep her on air?'],
  mod_surge:'Power surges', mod_cold:'Mia has a cold', mod_raid:'Troll raid', mod_blackout:'Blackout',
  play:'PLAY', playNight:'Night {n}: {day}', nights:'Nights', shop:'Shop', endless:'Endless shift', howto:'How to play', back:'Back',
  bank:'HypeCoins', locked:'locked', story:'story', endlessLocked:'Opens after night 3', best:'Best: {n} nights',
  daily:'Daily bonus', dailyClaim:'Take +{v} HC', dailyDone:'Come back tomorrow · streak {s}',
  up_cool:['Lamp coolers','Lamps heat up 15% slower per level.'], up_blinds:['Heavy blinds','Blinds stay shut 3 s longer per level.'],
  up_lens:['Better webcam','+25% HypeCoins per clip per level.'], up_speaker:['Smart speaker','Smart-home cooldowns 15% shorter per level.'],
  up_calm:['Kind words','Donations cost 30 HC less (minimum 80 HC) and calm Mia more.'], up_trust:['Trusted mod','A 4th trust credit.'],
  music:'Music', upgrades:'Upgrades', looks:'Mia & room', canBuy:'can buy: {name}', canBuyShort:'● you can buy an upgrade', shopHintFirst:'You have enough HypeCoins for an upgrade. Check the Shop: upgrades make the nights easier.', loseShop:'Tip: try the "{name}" upgrade in the Shop.', maxed:'max', owned:'owned', wearing:'wearing', buy:'Buy',
  look_hoodie:'Hoodie', look_phones:'Cat-ear headphones', look_lights:'Fairy lights',
  lk_blue:'Blue', lk_black:'Black', lk_mint:'Mint', lk_red:'Red', lk_cream:'Cream', lk_pink:'Pink', lk_gold:'Gold', lk_teal:'Teal', lk_violet:'Violet', lk_warm:'Warm', lk_sakura:'Sakura', lk_ice:'Ice', lk_ember:'Ember',
  earned:'Earned tonight', winBonus:'Night bonus', toBank:'to your bank', x2ad:'×2 HypeCoins', x2done:'Doubled!',
  continueAd:'Continue the night', continueSub:'Watch an ad: panic drops, it backs off', continueSubFree:'Once per night: panic drops, it backs off',
  menu:'Menu', nextNight:'Next: {day}', retry:'Try again', again:'Replay',
  e_endless:['SHIFT OVER','You kept her on air for {n} nights.'], endlessNext:'Keep going',
  lbTitle:'Leaderboard', lbEmpty:'Leaderboard appears on Yandex Games.',
  rotate:'Turn your phone sideways', pausedSub:'Take a breather. The stream is paused.', musicV:'♪ Music', sfxV:'🔊 Sounds', mlViewers:'NyanBun · {n} watching', mlRole:'You\'re a moderator now', mlShift:'START YOUR SHIFT', endlessShort:'Endless', sound:'Sound', language:'Language', quit:'Back to menu', fullscreen:'Fullscreen', windowed:'Exit fullscreen',
  jammed:'BLINDS JAMMED', surge:'POWER SURGE', m_surge:'whoa, the lamp just flared up?!', m_cold:'*sniff* sorry chat, i\'m sick today',
  campaignDone:'Campaign complete. The endless shift is open.',
  deskTile:'Your desktop', deskTileSub:'files from the nights you played',
  rulesShort:`<li><b>Survive until 00:00.</b> If Mia's panic hits 100% or it reaches her, the night is lost.</li>
<li>It comes through the <b>window</b>, the <b>door</b> or the <b>closet</b>, then goes <b>behind her</b>. The <b>MOTION</b> bars show where.</li>
<li><b>BRIGHT</b> the lamp of that zone to push it back. <b>Red eyes</b> are not stopped by light — use sounds and the blinds.</li>
<li>Window: <b>close the blinds</b>. Behind her: <b>closet lamp</b> or the <b>fire alarm</b>.</li>
<li>Chat: ban trolls and spam, not regulars. <b>Show Mia</b> — she reads it first. Banning <b>him</b> makes him faster.</li>
<li><b>Record</b> a moment to keep evidence.</li>`
});
Object.assign(STR.ru,{
  dayLbl_tue:'ВТ · НОЧЬ 2', dayLbl_wed:'СР · НОЧЬ 3', dayLbl_thu:'ЧТ · НОЧЬ 4', dayLbl_fri:'ПТ · НОЧЬ 5', dayLbl_sat:'СБ · НОЧЬ 6', dayLbl_sun:'ВС · НОЧЬ 7', dayLbl_mon2:'ПН · НОЧЬ 8', dayLbl_endless:'БЕСКОНЕЧНАЯ · НОЧЬ {n}',
  dayName_tue:'вторник', dayName_thu:'четверг', dayName_sat:'суббота', dayName_sun:'воскресенье', dayName_endless:'бесконечная смена',
  di_tue:['ВТОРНИК','Во дворе опять не горит фонарь.'], di_thu:['ЧЕТВЕРГ','Мия простыла. Она пугается быстрее.'],
  di_sat:['СУББОТА','На чат налетел рейд троллей. Держи его в чистоте.'], di_sun:['ВОСКРЕСЕНЬЕ','Блэкаут. Жалюзи заело, лампы уже горячие.'],
  di_endless:['НОЧЬ {n}','Смена не кончается. Сколько продержишь её в эфире?'],
  mod_surge:'Скачки напряжения', mod_cold:'Мия простыла', mod_raid:'Рейд троллей', mod_blackout:'Блэкаут',
  play:'ИГРАТЬ', playNight:'Ночь {n}: {day}', nights:'Ночи', shop:'Магазин', endless:'Бесконечная смена', howto:'Как играть', back:'Назад',
  bank:'HypeCoins', locked:'закрыто', story:'сюжет', endlessLocked:'Откроется после 3-й ночи', best:'Рекорд: {n} ноч.',
  daily:'Ежедневный бонус', dailyClaim:'Забрать +{v} HC', dailyDone:'Приходи завтра · серия {s}',
  up_cool:['Охлаждение ламп','Лампы греются на 15% медленнее за уровень.'], up_blinds:['Плотные жалюзи','Жалюзи держатся на 3 с дольше за уровень.'],
  up_lens:['Хорошая вебка','+25% HypeCoins за клип за уровень.'], up_speaker:['Умная колонка','Перезарядка умного дома на 15% короче за уровень.'],
  up_calm:['Добрые слова','Донат стоит 120 и успокаивает сильнее.'], up_trust:['Модер с репутацией','4-й кредит доверия.'],
  music:'Музыка', upgrades:'Улучшения', looks:'Мия и комната', canBuy:'можно купить: {name}', canBuyShort:'● можно купить улучшение', shopHintFirst:'Тебе хватает HypeCoins на улучшение. Загляни в Магазин: улучшения помогают пережить ночи.', loseShop:'Совет: попробуй улучшение «{name}» в Магазине.', maxed:'макс.', owned:'куплено', wearing:'надето', buy:'Купить',
  look_hoodie:'Худи', look_phones:'Наушники с ушками', look_lights:'Гирлянда',
  lk_blue:'Синее', lk_black:'Чёрное', lk_mint:'Мятное', lk_red:'Красное', lk_cream:'Кремовое', lk_pink:'Розовые', lk_gold:'Золотые', lk_teal:'Бирюзовые', lk_violet:'Фиолетовые', lk_warm:'Тёплая', lk_sakura:'Сакура', lk_ice:'Лёд', lk_ember:'Угли',
  earned:'Заработано за ночь', winBonus:'Бонус за ночь', toBank:'в копилку', x2ad:'×2 HypeCoins', x2done:'Удвоено!',
  continueAd:'Продолжить ночь', continueSub:'Посмотри рекламу: паника спадёт, он отступит', continueSubFree:'Раз за ночь: паника спадёт, он отступит',
  menu:'Меню', nextNight:'Дальше: {day}', retry:'Ещё раз', again:'Переиграть',
  e_endless:['СМЕНА ОКОНЧЕНА','Ты продержал её в эфире {n} ноч.'], endlessNext:'Дальше',
  lbTitle:'Лидеры', lbEmpty:'Таблица лидеров появится на Яндекс Играх.',
  rotate:'Поверни телефон горизонтально', pausedSub:'Выдохни. Она ждёт.', musicV:'♪ Музыка', sfxV:'🔊 Звуки', mlViewers:'NyanBun · {n} зрителей', mlRole:'Вам выдана роль модератора', mlShift:'ЗАСТУПИТЬ НА СМЕНУ', endlessShort:'Бесконечная', sound:'Звук', language:'Язык', quit:'В меню', fullscreen:'На весь экран', windowed:'Свернуть',
  jammed:'ЖАЛЮЗИ ЗАЕЛО', surge:'СКАЧОК НАПРЯЖЕНИЯ', m_surge:'ого, лампа сейчас вспыхнула?!', m_cold:'*шмыг* простите, чат, я сегодня болею',
  campaignDone:'Кампания пройдена. Бесконечная смена открыта.',
  deskTile:'Рабочий стол', deskTileSub:'файлы из пройденных ночей',
  rulesShort:`<li><b>Продержись до 00:00.</b> Если паника Мии дойдёт до 100% или он доберётся до неё — ночь проиграна.</li>
<li>Он приходит через <b>окно</b>, <b>дверь</b> или <b>шкаф</b> и идёт ей <b>за спину</b>. Полоски <b>ДВИЖЕНИЕ</b> показывают где.</li>
<li><b>ЯРКИЙ</b> на лампе этой зоны отталкивает его. <b>Красные глаза</b> свет не останавливает — звуки и жалюзи.</li>
<li>У окна — <b>закрой жалюзи</b>. За спиной — <b>лампа шкафа</b> или <b>пожарная тревога</b>.</li>
<li>Чат: бань троллей и спам, а не зрителей. <b>Показать Мие</b> — она прочтёт первым. Бан <b>его</b> делает его быстрее.</li>
<li><b>Записать момент</b> — снимок для улик.</li>`
});
// spam without anything that looks like a real link
CHAT.en.SPAM=['FREE FOLLOWERS!!! check my profile','cheap viewers, dm me','wanna grow your channel? check my bio','promote your stream for $5, dm me'];
CHAT.ru.SPAM=['БЕСПЛАТНЫЕ ФОЛЛОВЕРЫ!!! смотри мой профиль','дешёвые зрители, пиши в лс','хочешь славы? раскрутка в описании профиля','раскрутка стрима за 300₽, пиши мне'];
function TA(k,vars){ let v=(STR[LANG]&&STR[LANG][k])||STR.en[k]||[k,'']; if(!Array.isArray(v)) v=[v]; return v.map(s=>vars?String(s).replace(/\{(\w+)\}/g,(_,n)=>vars[n]!==undefined?vars[n]:''):s); }

// ---- fullscreen toggle (works in the itch iframe and on Yandex)
function fsEl(){ return document.fullscreenElement||document.webkitFullscreenElement; }
function fsCan(){ const d=document.documentElement; return !!(d.requestFullscreen||d.webkitRequestFullscreen) && (document.fullscreenEnabled||document.webkitFullscreenEnabled); }
function fsToggle(){ try{ if(fsEl()){ (document.exitFullscreen||document.webkitExitFullscreen).call(document); }
  else { const d=document.documentElement, r=(d.requestFullscreen||d.webkitRequestFullscreen).call(d,{navigationUI:'hide'}); if(r&&r.catch) r.catch(()=>{}); } }catch(e){} }
function fsLabels(){ const on=!!fsEl(); document.querySelectorAll('.fsLbl').forEach(el=>el.textContent=(on?'⤡ ':'⛶ ')+T(on?'windowed':'fullscreen'));
  document.querySelectorAll('.fsbtn').forEach(b=>b.hidden=!fsCan()); }
document.addEventListener('click',e=>{ const b=e.target.closest('.fsbtn'); if(b){ fsToggle(); } });
document.addEventListener('fullscreenchange',()=>{ fsLabels(); setTimeout(()=>{ try{ fitStage(); }catch(e){} },60); });
document.addEventListener('webkitfullscreenchange',()=>{ fsLabels(); setTimeout(()=>{ try{ fitStage(); }catch(e){} },60); });

// ======================= tutorial, readable controls, early-night events =======================
Object.assign(STR.en,{
  m_DIM:'DIM', m_STABLE:'NORMAL', m_BOOST:'BRIGHT', banShort:'BAN',
  sc_ok:'SYSTEM OK', sc_warn:'WARNING', sc_light:'LIGHT FAILURE', sc_power:'POWER OFFLINE', sc_signal:'SIGNAL LOST',
  dayLbl_tut:'TUTORIAL', dayName_tut:'Tutorial', di_tut:['TUTORIAL','No rush. Nothing here can go wrong.'],
  tutTile:'Tutorial', tutGo:'Play the tutorial', tutNext:'Next', tutSkip:'Skip tutorial', tutFinish:'Start night 1',
  tutDoneTitle:'TUTORIAL COMPLETE', tutDoneSub:'You\'ve got the basics. Start with Monday.',
  tutDoneList:`<li>It comes through the <b>window</b>, the <b>door</b> or the <b>closet</b>, then goes <b>behind her</b>.</li>
<li>Window: <b>close the blinds</b>. Door and behind: <b>BRIGHT</b> on that lamp, then back to <b>NORMAL</b>.</li>
<li>Ban <b>trolls and spam</b>, never regular viewers.</li>
<li><b>Record</b> the moment when you see something important.</li>`,
  tt_hello:"Meet Mia. You're moderating her late-night stream. Help her stay on air until midnight.",
  tt_troll:'That red angry face marks a troll. Hover over the message or tap it, then press BAN beside it.', tt_trollK:'or hover the message → BAN',
  tt_normal:'Look at the icon next to the name. Red angry face — troll, grey robot — spam: ban those. Purple devil — creepy messages: ban them before Mia reads them. Everyone else is a regular viewer, even if they write weird stuff ("67") or complain. Don\'t ban them: a wrong ban costs a ★ trust credit; with no trust left, Mia stops listening to you.',
  tt_lamps:'This is the room lighting. The window, the door and the closet each have a lamp: NORMAL · BRIGHT. Bright light pushes him back. Only one lamp can be on BRIGHT at a time, or the fuse trips.',
  tt_cue:'Right before he shows up you hear a sound: tapping on the glass — window, someone trying the handle — door, hangers rustling — closet. That lamp flashes yellow. Hear it — get the light ready there.',
  tt_window:'He is at the WINDOW — see the MOTION bar? Use BLINDS in Smart Home. While he is still far from the glass, the blinds send him away.', tt_windowK:'Smart Home → BLINDS · or B',
  tt_dog:'He is at the DOOR again. Press DOG BARK: he FREEZES for 6 seconds. He won\'t leave, but it buys you time.', tt_dogK:'or Z',
  tt_door:'Now he is at the DOOR. Press BRIGHT on the door lamp and wait until the MOTION bar is empty.', tt_doorK:'or key 3',
  tt_cool:'He left. Set the lamp back to NORMAL: BRIGHT is only needed while he is close.',
  tt_behind:'He came out of the closet. He\'s BEHIND her now. Set the CLOSET lamp to BRIGHT, quickly.', tt_behindK:'or key 2',
  tt_cool2:'He backed off. Closet lamp back to NORMAL.',
  tt_rec:'Record what the camera sees: clips keep evidence. Press HIGHLIGHT MOMENT.', tt_recK:'or R',
  tt_donate:"Mia is getting nervous — watch the PANIC bar under the video. At 100% she ends the stream. Donate to calm her down. HC also trickle in while the stream runs.", tt_donateK:'or G',
  tt_smart:'Smart home is your backup plan. Dog: he freezes. Footsteps: he backs off one step. Fire alarm: he leaves until his next approach. But Mia may leave to check the noise.',
  tt_done:'You\'re ready. In a real night, he won\'t wait for you. Good luck, mod.',
  f_wrongTut:'THAT IS A REGULAR VIEWER', f_knock:'HE KNOCKED ON THE GLASS', f_peek:'HE LOOKED INTO THE ROOM', f_rescue:'A VIEWER CALMED HER DOWN',
  m_knock:'WHAT WAS THAT?! something knocked on my window!', m_peek:'chat... my door just opened by itself',
  tipMax:'You let him get too close and Mia got a scare. Next time push him back sooner.',
  rescueMsg:'donated 100 HC: "mia breathe, we are all here with you <3"', m_rescue:'aww chat... okay. okay. i\'m fine.',
  donationMsg:'donated {v} HC: "you\'re doing great, breathe <3"'
});
Object.assign(STR.ru,{
  m_DIM:'ТЕМНЕЕ', m_STABLE:'ОБЫЧНЫЙ', m_BOOST:'ЯРКИЙ', banShort:'БАН',
  sc_ok:'СИСТЕМА ОК', sc_warn:'ВНИМАНИЕ', sc_light:'СБОЙ СВЕТА', sc_power:'НЕТ ПИТАНИЯ', sc_signal:'НЕТ СИГНАЛА',
  dayLbl_tut:'ОБУЧЕНИЕ', dayName_tut:'обучение', di_tut:['ОБУЧЕНИЕ','Никакой спешки. Тут нельзя проиграть.'],
  tutTile:'Обучение', tutGo:'Пройти обучение', tutNext:'Дальше', tutSkip:'Пропустить обучение', tutFinish:'Начать ночь 1',
  tutDoneTitle:'ОБУЧЕНИЕ ПРОЙДЕНО', tutDoneSub:'Вот и вся работа. Первая ночь — лёгкая.',
  tutDoneList:`<li>Он приходит через <b>окно</b>, <b>дверь</b> или <b>шкаф</b> и идёт ей <b>за спину</b>.</li>
<li>У окна — <b>закрой жалюзи</b>. У двери и за спиной — <b>ЯРКИЙ</b> на этой лампе, потом обратно <b>ОБЫЧНЫЙ</b>.</li>
<li>Бань <b>троллей и спам</b>, обычных зрителей не трогай.</li>
<li><b>Записывай момент</b>, когда видишь что-то важное.</li>`,
  tt_hello:'Это Мия, она стримит по ночам. Ты — её модератор. Задача: продержать её в эфире до полуночи. Сейчас покажу, как.',
  tt_troll:'В чате тролль (красное злое лицо). Нажми на его сообщение, потом большую кнопку БАН.', tt_trollK:'или наведи на сообщение → БАН',
  tt_normal:'Смотри на значок у ника. Красное злое лицо — тролль, серый робот — спам: их бань. Фиолетовый чёртик — жуткие сообщения: бань, пока Мия не прочитала. Все остальные — обычные зрители, даже если пишут странное («67») или ворчат. Их не трогай: за ошибочный бан теряешь ★ доверие; без доверия Мия перестанет тебя слушать.',
  tt_lamps:'Это свет в комнате. У окна, двери и шкафа своя лампа: ОБЫЧНЫЙ · ЯРКИЙ. Яркий свет отпугивает его. ЯРКИЙ можно держать только на одной лампе, иначе выбьет пробки.',
  tt_cue:'Перед его появлением слышен звук: стук в стекло — окно, кто-то дёргает ручку — дверь, шорох вешалок — шкаф. Лампа этой зоны мигнёт жёлтым. Услышал — готовь там свет.',
  tt_window:'Он у ОКНА — видишь полоску ДВИЖЕНИЕ? Нажми ЖАЛЮЗИ на лампе окна. Пока он далеко от стекла, жалюзи прогоняют его.', tt_windowK:'кнопка ЖАЛЮЗИ на лампе ОКНО · или B',
  tt_dog:'Он снова у ДВЕРИ. Нажми ЛАЙ СОБАКИ: он ЗАМРЁТ на 6 секунд. Не уйдёт, но даст тебе время.', tt_dogK:'или Z',
  tt_door:'Теперь он у ДВЕРИ. Нажми ЯРКИЙ на лампе двери и подожди, пока полоска ДВИЖЕНИЕ не опустеет.', tt_doorK:'или клавиша 3',
  tt_cool:'Он ушёл. Верни лампу на ОБЫЧНЫЙ: ЯРКИЙ нужен, только пока он рядом.',
  tt_behind:'Он ЗА СПИНОЙ — вылез из шкафа. Это самое опасное: быстро ЯРКИЙ на лампе ШКАФА.', tt_behindK:'или клавиша 2',
  tt_cool2:'Он отступил. Верни лампу шкафа на ОБЫЧНЫЙ.',
  tt_rec:'Его можно заснять: клип сохраняет то, что видела камера, — так копятся улики. Нажми ЗАПИСАТЬ МОМЕНТ.', tt_recK:'или R',
  tt_donate:'Мия нервничает — смотри шкалу ПАНИКА под видео. На 100% она бросит стрим. Задонать — она успокоится. HC капают и сами, пока идёт стрим.', tt_donateK:'или G',
  tt_smart:'Умный дом — запасной план. Собака — он замирает. Шаги — отступает на шаг. Тревога — уходит совсем. Но Мия может уйти проверить шум.',
  tt_done:'Всё! Дальше он ходит сам. Удачи, модер.',
  f_wrongTut:'ЭТО ОБЫЧНЫЙ ЗРИТЕЛЬ', f_knock:'ОН ПОСТУЧАЛ В ОКНО', f_peek:'ОН ЗАГЛЯНУЛ В КОМНАТУ', f_rescue:'ЗРИТЕЛЬ ЕЁ УСПОКОИЛ',
  m_knock:'ЧТО ЭТО?! в окно кто-то постучал!', m_peek:'чат... у меня дверь сама открылась',
  tipMax:'Ты подпустил его слишком близко, и Мия испугалась. В следующий раз отгоняй раньше.',
  rescueMsg:'задонатил 100 HC: «мия, выдохни, мы все тут с тобой <3»', m_rescue:'ох, чат... так. так. я в порядке.',
  donationMsg:'задонатил {v} HC: «ты молодец, выдохни <3»'
});
