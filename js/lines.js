"use strict";
// ======================= MORE LINES: Mia's small talk, her replies to viewers, reaction variants, a bigger chat =======================
// talk / night: {t: what Mia says, c: how the chat may answer}. night = topics of that particular night (mon2 replays monday).
// reply: Mia answers a real viewer from the chat ({user}). Reaction variants extend STR (T() picks one from an array).
const LINES={ru:{},en:{}};

// ---------------------------------------------------------------- RU
LINES.ru.talk=[
  {t:'я сегодня полдня искала второй носок. нашла. в холодильнике. не спрашивайте',c:['КАК','классика','а первый где был?']},
  {t:'чат, какой у вас был лучший момент за день? у меня — шаурма',c:['кот лёг мне на ноги','выспался впервые за неделю','тоже шаурма лол']},
  {t:'заварила чай и забыла про него. третий раз за вечер',c:['классика','ставь таймер на чай','холодный чай тоже чай']},
  {t:'днём такая жара, что я переехала жить под вентилятор',c:['у нас тоже +35','август в этом году злой','вентилятор лучший друг']},
  {t:'когда-нибудь я разберу этот стол. не сегодня',c:['не сегодня','стол выглядит норм','это творческий беспорядок']},
  {t:'комар. в комнате. я его слышу. он где-то тут',c:['ахаха держись','купи фумигатор','он за тобой следит']},
  {t:'думаю сменить ник. NyanBun звучит как-то по-детски, да?',c:['НЕТ','ник топ, не меняй','NyanBun навсегда']},
  {t:'соседи сверху опять что-то двигают. в полночь. зачем',c:['перестановка в полночь — классика','может, это не соседи','у меня так же']},
  {t:'спасибо, что вы тут. серьёзно, с вами вечером не так одиноко',c:['<3','мы всегда тут','мия <3']},
  {t:'хочу завести кота. но я сама как кот, двум котам в одной комнате тесно',c:['заведи!!','кот одобряет','ахах']},
  {t:'кто-нибудь знает, почему в этом доме лампы всё время моргают? проводка старая',c:['проверь проводку','у меня так же','это призраки лол']},
  {t:'нашей двери поставили новый замок. теперь мне спокойнее. наверное',c:['наверное...','и правильно','хороший замок?']},
  {t:'я научилась рисовать котиков одной линией. смотрите. ну, представьте',c:['представил','шедевр','покажи потом']},
  {t:'мама звонила, спрашивала, когда я найду «нормальную работу». это и есть работа, мам',c:['привет маме','лучшая работа','мы с тобой']},
  {t:'если я засну прямо на стриме — не будите. просто смотрите, как я сплю',c:['хорошо','странно, но ок','мы и так смотрим']},
  {t:'ночью тут так тихо, что слышно, как гудит холодильник на кухне',c:['уютно','у меня так же','а сейчас тоже слышно?']},
  {t:'я поняла, что не помню, когда последний раз выходила из дома просто погулять',c:['сходи завтра','днём сходи','ночью не ходи']},
  {t:'тому, кто подарил мне эту гирлянду, — спасибо ещё раз. висит до сих пор',c:['красивая','это был я','смотрится уютно']},
  {t:'переставила кресло к окну, а потом обратно. тут оно смотрится лучше',c:['да, лучше','а мне там нравилось','кресло топ']},
  {t:'ставлю песню, которую вы просили в прошлый раз. не судите',c:['ДА','она поставила','бэнгер']},
  {t:'завтра у меня выходной. ну, как выходной. просто никто не пишет по работе',c:['отдыхай','заслужила','выспись']},
  {t:'чат, буду честной: я понятия не имею, что делаю на этих стримах. и мне нравится',c:['и нам нравится','вайб','это и есть контент']},
  {t:'купила новую кружку. с котом. теперь у меня три кружки с котами',c:['мало','покажи','кружек много не бывает']},
  {t:'иногда мне кажется, что вас тут больше, чем показывает счётчик',c:['это лурки','я лурк','нас всегда больше']},
  {t:'обещаю, скоро будет стрим с рисованием. я в это верю',c:['верим','ждём','ага-ага']},
  {t:'летом ночи такие короткие. только стемнело — а уже почти светает',c:['лето уходит','люблю август','белые ночи']},
  {t:'наш модер сегодня молодец, чат такой чистый. спасибо',c:['модер топ','гг, модер','спасибо модеру']},
  {t:'вчера смотрела хоррор и потом час не могла выключить свет. больше не буду',c:['какой?','ахах','не смотри на ночь']},
  {t:'вот бы кто-нибудь научил меня готовить что-то кроме макарон',c:['макароны с сыром — топ','я научу','это база']},
  {t:'у меня за окном только что что-то стукнуло. ветка, наверное',c:['ветка, да','а там есть дерево?','у нас ветра нет']},
  {t:'ладно, чат, вопрос дня: вы совы или жаворонки?',c:['сова','сова очевидно','жаворонок, но я тут']},
  {t:'сегодня так устала, что разговаривала с чайником',c:['он ответил?','норм','чайник хороший собеседник']},
  {t:'хочу на море. просто сидеть и ничего не делать',c:['поехали','море лучшее','ещё успеешь']},
  {t:'иногда перечитываю ваши старые сообщения. вы такие милые',c:['<3','ты тоже','мия топ']},
  {t:'интересно, кто-нибудь из вас живёт рядом? было бы странно встретиться в магазине',c:['я в другом городе','было бы забавно','может, и живу']},
  {t:'в часах села батарейка. они остановились на без пятнадцати двенадцать. жутковато',c:['поменяй','жуть','это знак']},
  {t:'короче, я записалась на йогу. была один раз. считается?',c:['считается','йога топ','один раз — уже спорт']},
  {t:'спасибо за фолловы сегодня, правда. вы лучшие',c:['<3','заслужила','ура']},
  {t:'если честно, я стримлю ночью, потому что днём мне неловко, что все смотрят. а ночью уютно',c:['понимаю','ночь — лучшее время','уютно, да']},
  {t:'кто знает, почему окно запотевает? протираю, а через час снова',c:['это конденсат','проветри','кто-то дышит на стекло']}
];
LINES.ru.night={
  mon:[
    {t:'понедельник, чат. ну вы поняли',c:['поняли','понедельник — боль','держимся']},
    {t:'первый стрим на неделе, так что я свежая. относительно',c:['относительно','выглядишь бодро']},
    {t:'на выходных наконец повесила гирлянду. как вам?',c:['топ','очень уютно','так лучше']},
    {t:'план на неделю: стримить каждую ночь. посмотрим, сколько продержусь',c:['продержишься','каждую ночь?? ура']},
    {t:'у меня сегодня было собеседование. ладно, не буду рассказывать',c:['расскажи!','удачи','держим кулачки']}],
  tue:[
    {t:'вторник. это как понедельник, только без оправданий',c:['ахаха','база']},
    {t:'у нас весь день мигал свет. управляющая компания говорит — «скачки»',c:['у меня тоже','купи стабилизатор','жуть']},
    {t:'если стрим вылетит — это не я, это электричество',c:['понял','держись']},
    {t:'купила новые лампочки, теперь у меня «умный дом». умнее меня точно',c:['ахах','скайнет','умный дом — сила']}],
  wed:[
    {t:'середина недели! половина пройдена, держимся',c:['держимся','среда — маленькая пятница']},
    {t:'чат сегодня какой-то странный, у вас тоже сообщения прыгают?',c:['да, глючит','всё норм','какие сообщения?']},
    {t:'я полдня спала, поэтому сегодня я бодрая сова',c:['бодрая сова — топ','завидую']},
    {t:'мне снилось, что я стримлю, а в чате пишут то, что я скажу через минуту',c:['жуть','вещий сон','странный сон']},
    {t:'кто-то кинул мне в вишлист кресло-мешок. я подумаю',c:['бери','кресло топ']}],
  thu:[
    {t:'*шмыг* ну вот, простыла. летом. как это вообще возможно',c:['кондиционер','выздоравливай','чай с малиной']},
    {t:'голос у меня сегодня как у робота, простите',c:['милый робот','норм голос','береги горло']},
    {t:'выпила три кружки чая с лимоном. я теперь лимон',c:['лимон топ','пей ещё']},
    {t:'если я чихну — это не скример, это просто я',c:['будь здорова заранее','ахаха']},
],
  fri:[
    {t:'ПЯТНИЦА. чат, ПЯТНИЦА',c:['ПЯТНИЦА','ураааа','выходные!!']},
    {t:'кто сегодня никуда не пошёл и сидит со мной? лучшие люди',c:['я','мы','домоседы топ']},
    {t:'неделя была странная. давайте сегодня просто отдохнём',c:['давай','отдыхаем']},
    {t:'планы на выходные: спать. всё',c:['идеальный план','спать — топ']},
    {t:'заказала пиццу, а курьер спросил: «вы та самая NyanBun?» я чуть не умерла',c:['ОГО','ты знаменитость','жуть, если честно']}],
  sat:[
    {t:'суббота, народ! кто тоже не спит в выходной?',c:['я','мы','суббота — лучший день']},
    {t:'сегодня в чате столько новых ников... привет всем новеньким',c:['привет','мы с рейда','привет, мия']},
    {t:'если чат совсем разбушуется — модер, я на тебя рассчитываю',c:['модер справится','держись, модер']},
    {t:'днём кто-то позвонил в домофон и молчал. дважды',c:['жуть','спам','не открывай']},
    {t:'хочу сходить в кино. одна. это нормально?',c:['нормально','лучший способ','сходи']}],
  sun:[
    {t:'воскресенье. завтра снова понедельник. как так',c:['не напоминай','неделя пролетела']},
    {t:'сегодня полрайона без света было, жалюзи вот заело. сидим в полутьме',c:['уютно в темноте','страшновато','свечки зажги']},
    {t:'чат, давайте сегодня без жести. просто посидим',c:['давай','тихий стрим']},
    {t:'я эту неделю почти не сплю',c:['береги себя','выспись','может, съехать?']},
    {t:'спасибо, что были со мной всю неделю. правда',c:['<3','всегда','до понедельника']}]
};
LINES.ru.reply=['{user}, привет-привет!','{user}, спасибо, ты солнышко','{user} спрашивает про гирлянду. с маркетплейса, за копейки','о, {user} тут! давно тебя не было',
  '{user}, ахаха, да, я тоже','{user}, нет, это не фильтр, это лампа','{user}, приятного аппетита!','вижу тебя, {user}. машу','{user} пишет, что тут уютно. так и задумано',
  '{user}, правда? спасибо, мне приятно','{user}, иди спать, тебе же рано вставать','{user}, передаю привет, конечно','так, {user}, без спойлеров',
  '{user}, у меня сейчас ночь, как всегда','{user}, наушники с ушками — подарок. лучший подарок','{user}, обнимаю'];
Object.assign(STR.ru,{
  m_hello:['приветики, чат! с возвращением на ньян-стрим!','всем привет, я тут, я живая, начинаем','добрый вечер, чатик! устраивайтесь поудобнее','приветик! наливайте чай, у нас ночной стрим'],
  m_boost:['ай, глаза. кто там балуется со светом?','чего так ярко вдруг','умные лампы опять глючат','кто включил прожектор','свет сам прибавился? ладно...'],
  m_dim:['что-то темновато стало...','лампа сейчас притухла?','почему так темно, лампы садятся?','эй, верните свет'],
  m_blinds:['э? жалюзи сами закрылись','жалюзи опустились... сами. ок','умный дом опять что-то решил за меня'],
  m_reopen:['кто опять закрывает жалюзи? открываю','жалюзи снова поднялись','так, жалюзи открыты. наверное'],
  m_siren:['ЧТО ЭТО?! пожарная тревога?!','ТРЕВОГА?! чат, ничего не горит?!','мои уши! откуда сирена?!'],
  m_dog:['это собака? у нас нет собаки...','гав? откуда тут гав?','чат, вы тоже слышали лай?'],
  m_steps:['...в коридоре кто-то есть?','шаги. это шаги. да?','кто-то ходит за стенкой...'],
  m_away:['чат, подождите, схожу проверю','я на минутку. посмотрю и вернусь','никуда не уходите, я сейчас'],
  m_back:['...никого. странно.','вернулась. никого нет. наверное, показалось','всё чисто. вроде бы'],
  m_backSaw:['ТАМ В КОРИДОРЕ КТО-ТО БЫЛ. чат. ЧАТ.','чат... в коридоре кто-то стоял. я видела. я ВИДЕЛА.'],
  m_donate:['аа, спасибо за донат!! так... так. вдох-выдох.','спасибо!! вы правда меня спасаете','ой, донат! спасибо, мне сразу легче','спасибочки! ладно, я спокойна. почти'],
  m_rec:['ой, экран глюканул','стрим сейчас лагнул?','чего камера мигает','камера щёлкнула? странно'],
  m_creep:['...что? кто это написал?','«{text}»... чат, это не смешно.','так, это жуткое сообщение. модеры?','кто-то пишет мне жуткие вещи. чат, не повторяйте'],
  m_troll:['чат, троллей не кормим','ого, грубо','модеры, уберите это, пожалуйста','на грубиянов не отвечаю','о нет, опять они'],
  m_wrong:['стоп, за что забанили {user}? модеры??','эй, {user} же ничего такого не писал','модеры, {user} — свой, разбаньте'],
  m_flick:['лампа {z} опять жужжит...','лампа {z} мигает, мне не нравится','слышите, как гудит лампа {z}?'],
  m_burn:['лампа {z} сдохла. супер.','лампа {z} всё. темнота','пфф, лампа {z} перегорела'],
  m_p50:['такое чувство, что на меня кто-то смотрит','простите, чат, я сегодня какая-то дёрганая','у меня мурашки, хотя тут тепло','почему мне так неспокойно сегодня'],
  m_p78:['чат, мне правда страшно','так, мне это совсем не нравится','я не могу перестать оглядываться','чат, если что-то увидите — скажите мне'],
  m_behindNear:['почему сзади так холодно','кто-то... дышит?','мне кажется, за спиной кто-то стоит'],
  m_knock:['ЧТО ЭТО?! в окно кто-то постучал!','в окно постучали. чат, я не открою.'],
  m_peek:['чат... у меня дверь сама открылась','дверь... приоткрылась. я её закрывала.'],
  m_rescue:['ох, чат... так. так. я в порядке.','спасибо, кто бы ты ни был. мне это было нужно'],
  m_surge:['ого, лампа сейчас вспыхнула?!','свет скачет как ненормальный'],
  m_reports:['чат... почему на меня все кидают жалобы?','мне приходят жалобы на стрим... что происходит?']
});
CHAT.ru.NORMAL.push('добрый вечер всем','привет из казани','привет из алматы','кто-то ещё не спит?','я с ночной смены, привет','мия, а что за чай?','какой у тебя любимый фильм?',
  'завтра будет стрим?','вайб топ','пришёл из клипа','тут всегда так уютно','на фоне учу английский','мия, а ты рисуешь?','сделал себе какао','ночь, чат, мия — идеально',
  'скучал по стримам','у меня кот спит на клавиатуре','этот плед просто мечта','сколько лет каналу?','гирлянда как в детстве','дождь за окном и твой стрим — лучшее',
  'я тоже сова','мия, скажи «мяу»','мяу','привет из белграда','спасибо за стрим','gg','хехе','+','++','это база','кайф','чат, как дела?','у меня всё норм',
  'мия, что на ужин было?','в субботу будет стрим?','лайк за кота на полке','наушники с ушками где брала?','голос такой приятный','кто тоже с телефона смотрит',
  'я из-за тебя не высыпаюсь лол','тихий вечер','свет у тебя такой тёплый','классная кружка','ты обещала историю в прошлый раз','мия, расскажи что-нибудь',':)',
  'вау','мило','что за песня на фоне?','музыка топ, что за плейлист?','лоуфай на фоне идеален','давно тут не был','всем добрый ночи','чат, вы лучшие','спокойной ночи заранее');
CHAT.ru.TOPIC={
  mon:['понедельник, держимся','кто тоже только с работы?','начало недели и сразу стрим, люблю','опять понедельник...','мия, как собеседование?','гирлянда новая? красиво'],
  tue:['у меня тоже свет моргал сегодня','вторник ничем не лучше','купи стабилизатор, серьёзно','лампы мигают или это у меня?','держи свечку на всякий','электрики, ау'],
  wed:['середина недели, ура','у меня сообщения в чате прыгают, у вас?','чат глючит','среда — маленькая пятница','мия, ты сегодня бодрая','какое-то странное чувство сегодня'],
  thu:['выздоравливай!!','чай с малиной и мёдом','береги себя, мия','будь здорова','голос милый, даже простуженный','может, отдохнёшь сегодня?'],
  fri:['ПЯТНИЦААА','кто тоже дома в пятницу','пятница с мией лучше любой тусы','выходные!!','пицца в пятницу — закон','в пятницу все сидят тут, я знаю'],
  sat:['мы с рейда!','привет от рейда','всем привет, я новенький','столько народу сегодня','суббота!','модер сегодня в огне'],
  sun:['света нет полрайона','у меня тоже вырубали','сидим в темноте вместе','воскресная тоска','завтра понедельник...','уютно в полутьме']
};
{ const N=CHAT.ru.NERVOUS;
  N.window.push('там у окна кто-то стоит?','мне показалось или в окне лицо','мия, не смотри в окно','что это за силуэт','окно. ОКНО.');
  N.door.push('дверь сама открылась?','за дверью кто-то есть','мия, закрой дверь, пожалуйста','в коридоре тень','я видел, как дверь качнулась');
  N.behind.push('ОН ЗА НЕЙ','МИЯ, НЕ ОБОРАЧИВАЙСЯ','это не смешно, что это','модер, сделай что-нибудь','ЗА СПИНОЙ ЗА СПИНОЙ');
  N.dark.push('мия, включи свет','ничего не видно','зачем так темно','у тебя лампы садятся?','темнота жуткая');
  N.chair.push('в кресле кто-то сидит','кресло... там силуэт','чат, вы видите кресло?','мне не кажется, там кто-то есть','почему она не видит?');
  N.note.push('что там на окне?','бумажка на стекле','мия, посмотри на окно','кто-то приклеил записку','запишите кто-нибудь, что там');
  N.loop.push('это уже было','я видел этот стрим','почему чат повторяется','мне страшно, это повтор','те же ники, те же сообщения'); }
CHAT.ru.TROLL.push('ну и скука','мия, ты серьёзно?','худший стрим в моей жизни','кто это смотрит добровольно','иди поработай лучше','ору с этого кринжа','позорище',
  'лучше бы спать легла','ни о чём','где контент?','слабенько','вот это уровень... дна','выключаю','голос как у робота лол');
CHAT.ru.SPAM.push('ЗАРАБОТОК от 5000₽ в день >> earn-fast.click','бесплатные стикеры для стрима >> st1ckers.xyz','ХОЧЕШЬ 1000 ЗРИТЕЛЕЙ? пиши в лс',
  'накрутка лайков дёшево, смотри профиль','скины бесплатно >> fr33skins.biz','лучшие боты для чата >> chatb0t.store');

// ---------------------------------------------------------------- EN
LINES.en.talk=[
  {t:"found my missing sock behind the fridge today. how does that even happen",c:['HOW','classic','where was the first one?']},
  {t:"chat, what was the best part of your day? mine was a shawarma",c:['my cat slept on my legs','slept 8 hours for once','also shawarma lol']},
  {t:"made tea and forgot about it. third time tonight",c:['classic','set a timer for the tea','cold tea is still tea']},
  {t:"it's so hot during the day i basically live under the fan now",c:['same, 35 degrees here','august is brutal this year','fan is my best friend']},
  {t:"someday i'll clean this desk. not today",c:['not today','desk looks fine','creative chaos']},
  {t:"there's a mosquito. in the room. i can hear it. it's somewhere here",c:['lmao good luck','get a plug-in repellent','it is watching you']},
  {t:"thinking of changing my name. NyanBun sounds kinda childish, right?",c:['NO','the name is perfect','NyanBun forever']},
  {t:"the upstairs neighbors are moving furniture again. at midnight. why",c:['why do they always do this at night','maybe not the neighbors','same here']},
  {t:"thank you for being here. seriously, evenings aren't as lonely with you",c:['<3','we are always here','mia <3']},
  {t:"i keep looking at cat adoption pages. someone stop me",c:['get one!!','you should get one','lol']},
  {t:"anyone know why the lamps in this building keep flickering? old wiring",c:['check the wiring','mine do too','ghosts lol']},
  {t:"we got a new lock on the door. i feel safer now. probably",c:['probably...','good call','is it a good lock?']},
  {t:"i learned to draw a cat without lifting the pen. i\'ll show you next time",c:['imagined it','masterpiece','show us later']},
  {t:"mom called asking when i'll get a \"real job\". this is the job, mom",c:['hi mom','best job','we got you']},
  {t:"if i fall asleep on stream, somebody please clip it",c:['ok','weird but ok','we always watch']},
  {t:"it's so quiet at night you can hear the fridge humming in the kitchen",c:['cozy','same here','can you hear it now?']},
  {t:"i realized i don't remember the last time i went out just for a walk",c:['go tomorrow','go in the daytime',"don't go at night"]},
  {t:"whoever sent me these fairy lights, i still love them. thank you",c:['so pretty','that was me','looks cozy']},
  {t:"moved the armchair to the window, then back. it looks better here",c:['yeah better','i liked it there','armchair is great']},
  {t:"playing the song you asked for last time. don't judge",c:['YES','she played it','banger']},
  {t:"day off tomorrow. well, sort of. nobody's messaging me about work",c:['rest up','you earned it','sleep in']},
  {t:"i had a whole plan for tonight and we've just been talking about food",c:['and we love it','vibes','that is the content']},
  {t:"bought another cat mug. i already had two. i know.",c:['not enough','show us','you can never have too many']},
  {t:"sometimes it feels like there's more of you here than the counter says",c:['lurkers','im a lurker','there are always more of us']},
  {t:"i haven\'t forgotten about the drawing stream. i\'ll pick a day, i promise",c:['we believe','waiting','sure sure']},
  {t:"summer nights are so short. it just got dark and it's almost dawn",c:['summer is ending','love august','white nights']},
  {t:"our mod is doing great tonight, chat is so clean. thank you",c:['mod is goated','gg mod','thanks mod']},
  {t:"watched a horror movie yesterday and couldn't turn the light off for an hour. never again",c:['which one?','lol',"don't watch at night"]},
  {t:"wish someone would teach me to cook anything but pasta",c:['mac and cheese is elite','i can teach you','pasta counts']},
  {t:"something just tapped my window. a branch, probably",c:['a branch, yeah','is there a tree?','there is no wind tho']},
  {t:"okay chat, question of the day: night owls or early birds?",c:['owl','owl obviously','early bird but here anyway']},
  {t:"i was so tired today i talked to the kettle",c:['did it answer?','normal','kettle is a good listener']},
  {t:"i want to go to the sea. just sit there and do nothing",c:["let's go",'sea is the best','you still can']},
  {t:"sometimes i reread your old messages. you're all so sweet",c:['<3','so are you','mia is the best']},
  {t:"i wonder if any of you live nearby. it'd be weird to meet at the store",c:['different city here','that would be funny','maybe i do']},
  {t:"the clock stopped at quarter to twelve. i keep checking it like it\'s going to change",c:['change it','creepy','it is a sign']},
  {t:"so i signed up for yoga. went once. does that count?",c:['it counts','yoga is great','once is enough']},
  {t:"thank you for the follows tonight, really. you're the best",c:['<3','you earned it','yay']},
  {t:"honestly i stream at night because daytime feels like everyone's watching. nights are cozy",c:['i get it','night is the best time','cozy, yeah']},
  {t:"anyone know why the window keeps fogging up? i wipe it and an hour later it's back",c:["it's condensation",'open it for a bit','someone is breathing on it']}
];
LINES.en.night={
  mon:[
    {t:"monday, chat. you know",c:['we know','mondays hurt','hang in there']},
    {t:"first stream of the week and i'm already tired. good start",c:['relatively','you look awake']},
    {t:"finally hung the string lights over the weekend. what do you think?",c:['love it','so cozy','much better']},
    {t:"plan for the week: stream every night. let's see how long i last",c:["you'll make it",'every night?? yay']},
    {t:"i had a job interview today. okay, i won't talk about it",c:['tell us!','good luck','fingers crossed']}],
  tue:[
    {t:"how is it only tuesday? i swear this week's been going for a month",c:['lmao','facts']},
    {t:"the lights were flickering here all day. building management says \"surges\"",c:['same here','maybe get a surge protector','creepy']},
    {t:"if the stream crashes, it's not me, it's the electricity",c:['got it','hang in there']},
    {t:"bought new smart bulbs, now i have a \"smart home\". smarter than me for sure",c:['lol','skynet','smart home ftw']}],
  wed:[
    {t:"we made it to wednesday. how\'s everyone holding up?",c:['hanging on','wednesday is mini friday']},
    {t:"chat is weird tonight, are your messages jumping around too?",c:['yeah its glitchy','all fine here','what messages?']},
    {t:"slept through my alarm. twice. so i guess we're staying up tonight",c:['your sleep schedule is worse than mine','jealous']},
    {t:"had a dream where chat kept saying my next line before i said it",c:['creepy','prophetic dream','weird dream']},
    {t:"someone put a bean bag chair on my wishlist. i'll think about it",c:['get it','chair is great']}],
  thu:[
    {t:"*sniff* great, i caught a cold. in summer. how is that even possible",c:['air conditioning','get well soon','honey and tea']},
    {t:"my voice sounds like a robot today, sorry",c:['cute robot','voice is fine','rest your throat']},
    {t:"had three cups of lemon tea. i am a lemon now",c:['lemon supremacy','drink more']},
    {t:"if i sneeze, that's not a jump scare, that's just me",c:['bless you in advance','lol']},
],
  fri:[
    {t:"FRIDAY. chat, FRIDAY",c:['FRIDAY','yaaay','weekend!!']},
    {t:"anyone else cancel their friday plans? or did we all just not have any",c:['me','us','homebodies unite']},
    {t:"it's been a weird week. let's just chill tonight",c:["let's",'chilling']},
    {t:"weekend plans: sleep. that's it",c:['perfect plan','sleep is elite']},
    {t:"ordered pizza and the courier asked \"are you THE NyanBun?\" i almost died",c:['WOW',"you're famous",'kinda creepy tbh']}],
  sat:[
    {t:"saturday night, and here we all are. hi chat",c:['me','us','saturday is the best']},
    {t:"so many new names in chat tonight... hi to all the new people",c:['hi','we came from the raid','hi mia']},
    {t:"if chat goes completely wild — mod, i'm counting on you",c:['mod has it','good luck mod']},
    {t:"someone buzzed the intercom today and just stayed silent. twice",c:['creepy','spam',"don't open"]},
    {t:"i want to go to the movies. alone. is that normal?",c:['totally normal','best way to watch','go']}],
  sun:[
    {t:"sunday. tomorrow is monday again. how",c:["don't remind me",'week flew by']},
    {t:"half the neighborhood lost power today, and now the blinds are jammed. we're sitting in the dark",c:['cozy in the dark','kinda scary','light some candles']},
    {t:"chat, let's keep it chill tonight. just hang out",c:['deal','quiet stream']},
    {t:"i've barely slept this week",c:['take care','get some sleep','maybe move out?']},
    {t:"thank you for being here all week. really",c:['<3','always','see you monday']}]
};
LINES.en.reply=['{user}, hiii!','aww, thank you, {user}. that\'s sweet','the lights? got them online, {user}. they were pretty cheap','oh, {user} is here! haven\'t seen you in a while',
  '{user}, haha, yeah, me too','{user}, no, that\'s not a filter, it\'s the lamp','{user}, enjoy your food!','hi {user}! i see you','{user} says it\'s cozy here. that\'s the plan',
  '{user}, really? thank you, that\'s sweet','{user}, go to sleep, you have to get up early','{user}, of course i\'ll say hi','okay {user}, no spoilers',
  'still nighttime here, {user}','the headphones were a gift, {user}. i wear them way too much','{user}, sending hugs'];
Object.assign(STR.en,{
  m_hello:["hiii chat! good to see you","hey everyone! sorry, took me a minute to get set up","good evening chat! get comfy","hey chat. got your tea? i'm getting mine"],
  m_boost:["ow, my eyes. who keeps doing that with the lights?","why is it so bright suddenly","the smart lamps are being weird again","who turned on the floodlight","the light just went up by itself? okay..."],
  m_dim:["it's getting kinda dark in here...","did the lamp just dim?","why is it so dark, are the lamps dying?","hey, give me my light back"],
  m_blinds:["huh? the blinds just closed by themselves","the blinds came down... on their own. okay","apparently the blinds have plans of their own"],
  m_reopen:["who keeps closing the blinds? opening them again","the blinds went back up","okay, blinds are open. i think"],
  m_siren:["WHAT IS THAT?! is that the fire alarm?!","ALARM?! chat, is something burning?!","my ears! where is that siren coming from?!"],
  m_dog:["was that a dog? we don't have a dog...","wait, whose dog is that?","chat, did you hear barking too?"],
  m_steps:["...is someone in the hallway?","footsteps. those are footsteps. right?","i can hear someone walking in the hall..."],
  m_away:["hold on chat, i'm gonna go check","one sec, let me check","don't go anywhere, be right back"],
  m_back:["...nothing there. weird.","i'm back. nobody there. must've imagined it","all clear. i think"],
  m_backSaw:["THERE WAS SOMEONE IN THE HALLWAY. chat. CHAT.","chat... someone was standing in the hallway. i saw it. i SAW it."],
  m_donate:["omg thank you for the donation!! okay... okay. deep breath.","thank you. i really needed that","oh! thank you for that. seriously.","thank youuu. sorry, i'm a bit of a mess tonight"],
  m_rec:["ugh, my screen just glitched","did the stream just lag?","why is my camera flickering","did the camera just click? weird"],
  m_creep:["...what? who wrote that?","\"{text}\"... that's not funny, chat.","okay that message is creepy. mods?","someone is writing creepy stuff. chat, don't repeat it"],
  m_troll:["ignore the trolls, chat","wow okay, rude","can a mod get that please?","yeah, i\'m not reading that one out","oh no, them again"],
  m_wrong:["wait, why did you ban {user}? mods??","hey, {user} didn't say anything bad","mods, {user} is one of us, unban them"],
  m_flick:["the {z} lamp is buzzing again...","the {z} lamp keeps flickering, i don't like it","can you hear the {z} lamp humming?"],
  m_burn:["the {z} lamp just died. great.","great. now the {z} lamp\'s out too","pff, the {z} lamp burned out"],
  m_p50:["i keep feeling like someone's looking at me","sorry chat i'm a little jumpy tonight","why have i got goosebumps? it's not even cold","why am i so on edge tonight"],
  m_p78:["chat i'm kind of freaking out","okay i really don't like this","i can't stop looking over my shoulder","chat, if you see something, tell me"],
  m_behindNear:["why is it so cold behind me","is someone... breathing?","it feels like someone's standing behind me"],
  m_knock:["WHAT WAS THAT?! something knocked on my window!","someone knocked on the window. chat, i'm not opening it."],
  m_peek:["chat... my door just opened by itself","the door... opened a little. i closed it."],
  m_rescue:["aww chat... okay. okay. i'm fine.","thank you, whoever you are. i needed that"],
  m_surge:["whoa, the lamp just flared up?!","the lights are going crazy"],
  m_reports:["chat... why is everyone reporting me?","i'm getting reports on the stream... what's going on?"]
});
CHAT.en.NORMAL.push('good evening everyone','hello from texas','hello from manila','anyone else still up?','just off night shift, hi','mia what tea is that?','whats your favorite movie?',
  'stream tomorrow?','vibes','came from a clip','always so cozy here','studying with this on','mia do you draw?','made myself hot cocoa','got this on while i finish my homework',
  'missed the streams','my cat is asleep on my keyboard','that blanket looks so soft','how long have you been streaming?','those lights remind me of being a kid','rain here too. perfect background noise',
  'night owl too','mia say "meow"','meow','hi from belgrade','thanks for streaming','gg','hehe','+','++','facts','nice','chat how are you?','doing fine here',
  'mia what did you have for dinner?','stream on saturday?','love the cat on the shelf','where did you get the cat-ear headphones?','such a nice voice','anyone else watching on their phone',
  'i have work in six hours why am i still here','quiet evening','your lighting is so warm','cute mug','you promised a story last time','mia tell us something',':)',
  'wow','cute','what song is this?','music slaps, what playlist?','lofi in the background is perfect','long time no see','good night everyone','chat you are the best','gonna fall asleep with this on');
CHAT.en.TOPIC={
  mon:['monday, hang in there','who else just got off work?','rough monday. glad youre live','monday again...','mia how was the interview?','new lights? pretty'],
  tue:['my lights flickered today too','tuesday is no better','maybe get a surge protector, seriously','are the lamps flickering or is it me?','keep a candle just in case','any electricians in chat?'],
  wed:['middle of the week, yay','anyone elses chat jumping around?','chat is glitching','wednesday is mini friday','mia you look awake today','weird feeling tonight'],
  thu:['get well soon!!','tea with honey','take care mia','bless you','voice is cute even with a cold','maybe rest tonight?'],
  fri:['FRIDAYYY','who else is home on a friday','friday with mia beats any party','weekend!!','friday pizza just arrived','usual friday crowd is here'],
  sat:['we came from the raid!','hi from the raid','hi all, im new','so many people tonight','saturday!','mod is on fire tonight'],
  sun:['half the area has no power','ours went out too','sitting in the dark together','sunday blues','monday tomorrow...','cozy in the half-dark']
};
{ const N=CHAT.en.NERVOUS;
  N.window.push('is someone standing at the window?','was that a face in the window','mia dont look at the window','what is that silhouette','window. WINDOW.');
  N.door.push('did the door open by itself?',"someone's behind the door",'mia close the door please','shadow in the hallway','i saw the door move');
  N.behind.push("HE'S BEHIND HER","MIA DON'T TURN AROUND",'not funny, what is that','mod do something','BEHIND YOU BEHIND YOU');
  N.dark.push('mia turn on the light',"can't see anything",'why is it so dark','are your lamps dying?','the dark is creepy');
  N.chair.push("someone's sitting in the chair",'wait theres someone in that chair','chat do you see the chair?',"i'm not imagining it, someone's there","why can't she see it?");
  N.note.push("what's on the window?",'paper on the glass','mia look at your window','someone taped a note','someone clip it, what does it say');
  N.loop.push('this already happened','i watched this stream','why is chat repeating',"i'm scared, it's a rerun",'same names, same messages'); }
CHAT.en.TROLL.push('so boring','mia are you serious?','worst stream of my life','who watches this voluntarily','go get a real job','crying at this cringe','embarrassing',
  'should have gone to bed','nothing burger',"where's the content?",'weak','new low honestly','closing this','voice like a robot lol');
CHAT.en.SPAM.push('EARN $500 A DAY >> earn-fast.click','free stream stickers >> st1ckers.xyz','WANT 1000 VIEWERS? dm me',
  'cheap likes, check my profile','free skins >> fr33skins.biz','best chat bots >> chatb0t.store');

// ---------------------------------------------------------------- behaviour
// Every 16–26 s, when things are calm, Mia talks: replies to a recent viewer, a topic of tonight, or small talk.
// Chat answers 1–2 times. (The second monday used to replay monday as a déjà vu; removed 10.11 — the nights are live now.)
const MON_TALK=[]; let monTalkIdx=0;
function talkPool(){ const L=LINES[LANG]||LINES.en, k=DY().key; return {talk:L.talk, night:L.night[k]||[], reply:L.reply}; }
function miaTalkTick(dt){
  if(!S||!S.running||S.over||S.tut.active) return;
  if(!S.talkUsed){ S.talkUsed={}; if(S.talkT===undefined) S.talkT=rnd(10,15); if(DY().key==='mon2') monTalkIdx=0; }
  const st=S.st, calm=S.panic<50 && S.mia.awayT<=0 && !(S.ev.chairShow>0) && captionTimer<=0 && (st.stage==='hidden'||(st.stage==='window'&&st.p<.35));
  if(!calm) return; S.talkT-=dt; if(S.talkT>0) return;
  S.talkT=rnd(16,26);
  const P=talkPool(), k=DY().key; let e=null;
  {
    const r=Math.random();
    if(r<.3){ const rec=S.chat.slice(-14).filter(m=>m.type==='normal'&&!m.banned&&S.t-m.t<25); if(rec.length) e={t:pick(P.reply).replace('{user}',pick(rec).user),c:[]}; }
    if(!e && r<.62){ const free=P.night.filter(x=>!S.talkUsed[x.t]); if(free.length) e=pick(free); }
    if(!e){ const free=P.talk.filter(x=>!S.talkUsed[x.t]); e=pick(free.length?free:P.talk); }
    S.talkUsed[e.t]=1; if(k==='mon' && MON_TALK.length<40) MON_TALK.push(e);
  }
  say('talk',e.t,0);
  if(!(e.c&&e.c.length)) memeSay('mia',.3,2200+Math.random()*1200);
  const g=S, cs=(e.c||[]).slice().sort(()=>Math.random()-.5).slice(0,Math.random()<.5?2:1);
  cs.forEach((t,i)=>setTimeout(()=>{ if(S===g && S.running) pushMsg('normal',genName(),t); },1700+i*1400+Math.random()*900));
}
// regular viewers: now and then something about tonight
function pickNormal(){ const L=C(), top=L.TOPIC&&L.TOPIC[DY().key]; return (top&&Math.random()<.22)?pick(top):pick(L.NORMAL); }

// ---------------------------------------------------------------- ways in, habits, hot nights (RU / EN)
Object.assign(STR.ru,{
  zl_closet:'шкаф', f_closet:'ШКАФ ПРИОТКРЫЛСЯ', f_redLight:'КРАСНЫЕ ГЛАЗА · СВЕТ ЕГО ЗЛИТ', f_decoy:'ЭТО ПРОСТО ТЕНЬ', f_winClosed:'ОКНО ЗАКРЫТО',
  tipCloset:'Он может быть уже в квартире — в шкафу. Шорох вешалок = шкаф. Лампа шкафа отгоняет его, «Шаги» и «Лай» тоже работают.',
  tipRouteB:'Он вошёл сразу через дверь, без окна. Слушай перед появлением: стук — окно, скрип — дверь, шорох вешалок — шкаф.',
  tipRed:'КРАСНЫЕ ГЛАЗА: свет его только злит, ЯРЧЕ ускоряет. Убавь лампу (ТЕМНЕЕ) и пугай звуками умного дома, у окна — жалюзи.',
  tipDecoy:'Не всё, что видно, — он. У обманки нет глаз, а ДАТЧИК ДВИЖЕНИЯ на карточке лампы не врёт.',
  tipHot:'Мия открыла окно: через открытое окно он идёт гораздо быстрее. Закрой жалюзи — окно закроется.',
  m_hot:['так жарко... открою окно, ладно?','всё, не могу, открываю окно','чат, тут дышать нечем. проветрю немного'],
  nw_tue:'Сегодня жарко: Мия может открыть окно. Тогда он идёт через окно быстрее — закрывай жалюзи.',
  nw_wed:'Новое: он может войти сразу через ДВЕРЬ. Перед этим скрипнет дверь — слушай.',
  nw_thu:'Новое: ШКАФ. Шорох вешалок значит, что он уже в квартире. Лампа шкафа — твой ответ.',
  nw_fri:'Новое: КРАСНЫЕ ГЛАЗА. Такого свет не пугает, а злит: убавляй лампу и пугай звуками.',
  nw_sat:'Рейд и жара: чат будет бешеный, а Мия может открыть окно.',
  nw_sun:'Новое: ОБМАНКИ. В темноте не всё — он. Смотри на датчик движения на карточках ламп.',
  nw_mon2:'Он знает все пути. И ты тоже.'
});
Object.assign(STR.en,{
  zl_closet:'closet', f_closet:'THE CLOSET CREAKED OPEN', f_redLight:'RED EYES · LIGHT ANGERS IT', f_decoy:'JUST A SHADOW', f_winClosed:'WINDOW SHUT',
  tipCloset:'He can already be inside — in the closet. Rattling hangers = the closet. The closet lamp drives him back; Footsteps and Bark work too.',
  tipRouteB:'He came straight through the door, skipping the window. Listen before he shows up: a tap = window, a creak = door, rattling hangers = closet.',
  tipRed:'RED EYES: light only feeds this one, BRIGHT speeds him up. Turn the lamp DOWN and scare him with smart-home noises; at the window — the blinds.',
  tipDecoy:"Not everything you see is him. A decoy has no eyes, and the MOTION sensor on the lamp card never lies.",
  tipHot:'Mia opened the window: through an open window he comes much faster. Shut the blinds — the window closes too.',
  m_hot:["it's so hot... i'm opening the window, ok?","that's it, opening the window","chat, i can't breathe in here. airing it out a bit"],
  nw_tue:"It's hot tonight: Mia may open the window. Then he comes through it faster — shut the blinds.",
  nw_wed:'New: he can come straight through the DOOR. The door creaks first — listen.',
  nw_thu:"New: the CLOSET. Rattling hangers mean he's already inside. Use the closet lamp.",
  nw_fri:"New: RED EYES. Light doesn't scare this one, it angers him: dim the lamp, use the noises.",
  nw_sat:'Raid and heat: chat goes wild, and Mia may open the window.',
  nw_sun:'New: DECOYS. In the dark not everything is him. Watch the motion sensor on the lamp cards.',
  nw_mon2:'He knows every way in. So do you.'
});
CHAT.ru.STALKER.closet=['я давно здесь','тут пахнет твоими свитерами','не открывай шкаф','тесно, но я подожду'];
CHAT.en.STALKER.closet=["i've been here a while",'it smells like your sweaters in here',"don't open the closet","it's cramped, but i can wait"];
CHAT.ru.NERVOUS.closet=['шкаф приоткрылся??','в шкафу кто-то есть','мия, что у тебя в шкафу','я видел глаза в шкафу','почему шкаф открыт'];
CHAT.en.NERVOUS.closet=['did the closet just open??',"someone's in the closet",'mia whats in your closet','i saw eyes in the closet','why is the closet open'];

Object.assign(STR.ru,{ f_winOpen:'МИЯ ОТКРЫЛА ОКНО', f_surge:'СКАЧОК: ЛАМПА {z} +30% НАГРЕВА', ls_surge:'СКАЧОК!', ls_red:'СВЕТ ЗЛИТ → ТЕМНЕЕ', tag_first:'знакомство',
  tipSurge:'Скачок напряжения резко греет одну лампу. Если она уже горячая — переведи её на НОРМУ, иначе перегорит.',
  tt_tox:'Тролли и спам, которых ты не забанил, копятся: растёт ТОКСИЧНОСТЬ чата. На 100% зрители кидают жалобы, и ты теряешь ★ доверие. Не забывай про чат.' });
Object.assign(STR.en,{ f_winOpen:'MIA OPENED THE WINDOW', f_surge:'SURGE: {z} LAMP +30% HEAT', ls_surge:'SURGE!', ls_red:'LIGHT ANGERS → DIM', tag_first:'first night',
  tipSurge:'A power surge heats one lamp up. If it is already hot, set it to NORMAL or it will burn out.',
  tt_tox:"Trolls and spam you don't ban pile up: chat TOXICITY rises. At 100% viewers mass-report the stream and you lose a ★ trust credit. Keep an eye on the chat." });

Object.assign(STR.ru,{ f_breaker:'ПРОБКИ: ЯРЧЕ — ТОЛЬКО ОДНА ЛАМПА', tipBreaker:'Пробки не тянут две лампы на ЯРЧЕ: включишь вторую — первая вернётся на НОРМУ. Угадывай, где он, по звуку и датчикам.' });
Object.assign(STR.en,{ f_breaker:'BREAKER: ONLY ONE LAMP ON BRIGHT', tipBreaker:"The breaker can't take two lamps on BRIGHT: turn on a second one and the first drops back to NORMAL. Use the sounds and motion sensors to find him." });

Object.assign(STR.ru,{ diff:'Сложность', diffTitle:'Выбери сложность', diffSub:'Её можно сменить в любой момент в меню «Ночи». Прогресс общий.', diffRec:'рекомендуем',
  diff_easy:'Только сюжет', diff_normal:'Нормальная', diff_hard:'Кошмар',
  diffD_easy:'Он медленнее и реже, без обманок и красных глаз, Мия спокойнее. Чтобы просто узнать историю.',
  diffD_normal:'Как задумано: можно проиграть, но большинство дойдёт до финала.',
  diffD_hard:'Для опытных и стримеров: он быстрее и злее, больше красных глаз и обманок, никто не спасёт Мию донатом, а в конце ночи — прессинг.',
  f_press:'ОН НЕ ДАСТ ЕЙ ДОЖИТЬ ДО ПОЛУНОЧИ', trust:'Доверие' });
Object.assign(STR.en,{ diff:'Difficulty', diffTitle:'Choose a difficulty', diffSub:'You can change it any time in the Nights menu. Progress is shared.', diffRec:'recommended',
  diff_easy:'Story only', diff_normal:'Normal', diff_hard:'Nightmare',
  diffD_easy:'A gentler pace, a calmer Mia, and no red eyes or decoys. For players here for the story.',
  diffD_normal:'The standard challenge. Keep track of the room and the chat to make it through.',
  diffD_hard:'For veterans and streamers: he is faster and meaner, more red eyes and decoys, no viewer will rescue Mia, and the end of each night turns up the pressure.',
  f_press:"HE WON'T LET HER MAKE IT TO MIDNIGHT", trust:'Trust' });
