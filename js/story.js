"use strict";
// ======================= STORY ARC: night by night =======================
// Three threads. MIA (on stream, August): she gets scared, goes to the police, decides to move out — and doesn't make it.
// STRANGER_99 (chat): writes to her at first, then more and more to YOU, the moderator.
// YOUR DESKTOP (the same night, after the stream; the clock always jumps): every night something new appears on your own computer.
// Each night ends on a question that the next one answers. Beats fire at a share of the night (at) and wait for a free caption.
const STORY={
 ru:{
  mon:{beats:[{at:.08,mia:'модер, гостевой доступ к лампам и защитным звукам работает? если что — помоги со светом'},
              {at:.20,mia:'через восемь дней переезжаю. хочу провести последнюю неделю эфиров здесь, пока всё не разобрала'},
              {at:.35,mia:'кстати, вчера кто-то оставил у моей двери цветы. розовые пионы. без записки. мило… наверное'},
              {at:.55,stalker:'ты снова тут? я скучал'},
              {at:.93,mia:'всё, чат, спокойной ночи. модер, ты тоже иди спать, хорошо?'}]},
  tue:{beats:[{at:.25,mia:'у нас на Шелковичной опять фонарь не горит. темнота под окнами'},
              {at:.2, mia:'модер, гостевой доступ со вчера оставила. если опять кто-то будет у окна — помоги, ладно?'},
              {at:.35,mia:'курьер из «Пиона» опять спрашивал, одна ли я живу. странный парень'},
              {at:.45,mia:'мне кажется, вчера после стрима под окном кто-то стоял. долго стоял'},
              {at:.6, stalker:'тебе идут розовые цветы'},
              {at:.92,mia:'я купила умные лампы, чтобы было светлее. пусть хоть свет будет на моей стороне'}]},
  wed:{beats:[{at:.3, mia:'чат… кто-то пишет мне в личку. он знает, что я ела на ужин. я никому не говорила'},
              {at:.4, mia:'и нет, это не Денис. мы расстались в мае, он вообще в другом городе. наверное'},
              {at:.5, stalker:'модер, ты тоже смотришь её каждую ночь?'},
              {at:.92,mia:'модер, спасибо, что ты тут. правда. я тебе написала в личку'}]},
  thu:{beats:[{at:.25,mia:'*шмыг* сходила в полицию. показала им Stranger_99. дело завели, но сказали: пока ничего не случилось, искать особо не будут'},
              {at:.45,stalker:'полиция не поможет. только мы с тобой, модер'},
              {at:.55,mia:'я сохранила переписку. теперь хотя бы не скажут, что мне показалось'},
              {at:.92,mia:'кто-то оставил под дверью пакет с лекарствами. соседка, наверное. я не буду это пить'}]},
  fri:{beats:[{at:.35,stalker:'красиво получилось, правда?'},
              {at:.45,mia:'сосед снизу опять курит под моим окном. каждую ночь. просто стоит и курит'},
              {at:.6, mia:'чат, если со мной что-то случится — это не шутка. запомните этот стрим'},
              {at:.92,mia:'кто-то сфотографировал меня через окно. это фото было в записке. в моей комнате.'}]},
  sat:{beats:[{at:.3, mia:'чат, осталось три стрима из этой квартиры. новый адрес никому не скажу'},
              {at:.45,mia:'новый адрес никому не скажу. даже вам. простите'},
              {at:.55,stalker:'она хочет уехать от нас, модер'},
              {at:.7,mia:'в новом доме сменю все пароли. гостевые доступы тоже придётся выдать заново'},
              {at:.92,mia:'в понедельник последний стрим отсюда. потом коробки, вокзал и новая жизнь'}]},
  sun:{beats:[{at:.25,mia:'как вам коробки на фоне? уже начала собираться. завтра последний стрим отсюда'},
              {at:.5, stalker:'до понедельника, модер. не опаздывай'},
              {at:.7, glitch:'look'},
              {at:.92,mia:'спасибо, что были со мной всю эту неделю. модер, тебе отдельное спасибо. до завтра'}]},
  mon2:{beats:[{at:.06,mia:'всем привет. это последний стрим из этой квартиры. завтра переезд — вокруг одни коробки'},
               {at:.1, chat:['удачи с переездом!','мия, будем ждать на новом месте','наконец-то съезжаешь оттуда','береги себя']},
               {at:.3, mia:'модер, спасибо тебе за всё. правда. без тебя я бы тут не выдержала'},
               {at:.4, mia:'после эфира скину тебе новый адрес. только тебе. но пару дней хочу без стримов, ладно?'},
               {at:.6, stalker:'сегодня всё закончится, модер'},
               {at:.75,mia:'странно… никак не могу отделаться от чувства, что за окном кто-то есть'},
               {at:.86,mia:'ладно. последний раз. не буду бояться'}]}
 },
 en:{
  mon:{beats:[{at:.08,mia:"mod, do the guest controls work? the lights and speaker sounds? help with them if i need it, okay?"},
              {at:.20,mia:"moving in eight days. one last week of streams here before i pack everything"},
              {at:.35,mia:"btw, yesterday someone left flowers at my door. pink peonies. no note. sweet… i guess"},
              {at:.55,stalker:"you're here again? i missed you"},
              {at:.93,mia:"ok chat, good night. mod, you go to sleep too, ok?"}]},
  tue:{beats:[{at:.25,mia:"the streetlight on Shelkovichnaya is out again. can't see a thing outside my window"},
              {at:.2, mia:"mod, left your guest access on from yesterday. if that guy comes back to the window... please help, okay?"},
              {at:.35,mia:"the delivery guy from Peony asked again if i live alone. weird guy"},
              {at:.45,mia:"i think someone was standing under my window after the stream yesterday. for a long time"},
              {at:.6, stalker:'pink flowers suit you'},
              {at:.92,mia:"spent all that money on smart bulbs. they'd better be good for something"}]},
  wed:{beats:[{at:.3, mia:"chat… someone keeps DMing me. he knows what i had for dinner. i didn't tell anyone"},
              {at:.4, mia:"and no, it's not Denis. we broke up in may, he's in another city anyway. i think"},
              {at:.5, stalker:'mod, do you watch her every night too?'},
              {at:.92,mia:"mod, thank you for being here. really. i sent you a DM"}]},
  thu:{beats:[{at:.25,mia:"*sniff* i went to the police. showed them Stranger_99. they opened a case, but said nothing has happened yet, so they won't really look"},
              {at:.45,stalker:"the police won't help. only you and me, mod"},
              {at:.55,mia:"saved the messages. at least they cant say i imagined them now"},
              {at:.92,mia:"someone left a bag of medicine at my door. the neighbor, probably. i'm not taking it"}]},
  fri:{beats:[{at:.35,stalker:'it came out pretty, didn\'t it?'},
              {at:.45,mia:"the downstairs neighbor is smoking under my window again. every night. just standing there, smoking"},
              {at:.6, mia:"chat, i\'m serious. if anything happens to me, please save this stream"},
              {at:.92,mia:"that photo in the note... someone took it through my window. i was sitting right here."}]},
  sat:{beats:[{at:.3, mia:"chat, three more streams from this apartment. i won't tell anyone the new address"},
              {at:.45,mia:"i won't tell anyone the new address. not even you. sorry"},
              {at:.55,stalker:'she wants to get away from us, mod'},
              {at:.7,mia:"changing all the passwords at the new place. guest access too. fresh start"},
              {at:.92,mia:"two more streams, then i can pack up and get on that train"}]},
  sun:{beats:[{at:.25,mia:"how do you like the boxes? i started packing. tomorrow is the last stream from here"},
              {at:.5, stalker:"see you monday, mod. don't be late"},
              {at:.7, glitch:'look'},
              {at:.92,mia:"thanks for hanging out with me this week. and mod... thanks for sticking around. see you tomorrow"}]},
  mon2:{beats:[{at:.06,mia:"hi everyone. this is my last stream from this apartment. moving tomorrow — boxes everywhere"},
               {at:.1, chat:['good luck with the move!','mia, see you at the new place','finally getting out of there','take care']},
               {at:.3, mia:"mod, thank you for everything. really. i couldn't have stayed here without you"},
               {at:.4, mia:"i'll send you my new address after the stream. just you. but i want a couple of days off camera, okay?"},
               {at:.6, stalker:'it all ends tonight, mod'},
               {at:.75,mia:"weird… i can't shake the feeling someone's outside the window"},
               {at:.86,mia:"okay. one last stream. i can do this"}]}
 }
};
// ---------------------------------------------------------------- the desktop between nights (now: 06.11)
// Items pile up: night n shows everything from nights ≤ n, the new ones marked NEW.
/* your desktop after each stream, the same night. The clock always jumps: you don't know where the hours went. */
const DESK={
 ru:{ title:'Рабочий стол', date:'{d} · {t}', cont:'Следующая ночь', newTag:'NEW', hint:'Стрим кончился в 00:00. Файлы телефона синхронизированы. Нажимай на файлы.',
  days:{mon:'вт, 5 августа 2025',tue:'ср, 6 августа 2025',wed:'чт, 7 августа 2025',thu:'пт, 8 августа 2025',fri:'сб, 9 августа 2025',sat:'вс, 10 августа 2025',sun:'пн, 11 августа 2025'},
  items:{
   mon:[{ic:'web',name:'Модерка — журнал',body:'NyanBun · журнал модерации · 4 авг\n\n23:00:04  модератор вошёл в чат\n23:00:04  Stranger_99 вошёл в чат\n23:41:17  Stranger_99: ты снова тут? я скучал\n23:41:18  ⚠ на Stranger_99 есть жалобы с 3 других каналов\n00:00:00  трансляция завершена'},
        {ic:'vid',name:'stream_0408.mp4',body:'stream_0408.mp4\nРазмер: 2,1 ГБ\nСоздан: 5 авг · 00:47\n\nЗапись всего стрима.\nЗапись ты не включал.'}],
   tue:[{ic:'doc',name:'чек_цветы.pdf',body:'ЦВЕТОЧНАЯ ЛАВКА «ПИОН»\n3 авг · 21:40\n\nБукет пионов, розовый ×1 ........ 3 400 ₽\nДоставка ........................ 400 ₽\nОплата: Visa ·4471\n\nАдрес: ул. Шелковичная, 1█, кв. █\nКурьер: Артём\nЗаписка: —'}],
   wed:[{ic:'chat',name:'Личные сообщения',body:'NyanBun → тебе · 7 авг · 01:12\n\n«спасибо, что ты есть. правда. без тебя было бы страшно. ты единственный, кому я тут доверяю»\n\n✓✓ прочитано · 01:37'}],
   thu:[{ic:'web',name:'История поиска',body:'8 авг 00:52  Stranger_99 поиск по нику\n8 авг 01:10  как вычислить зрителя по нику\n8 авг 01:33  можно ли заявить в полицию на зрителя\n8 авг 02:05  шелковичная улица дома с эркером\n8 авг 02:41  во сколько закрывается полиция'}],
   fri:[{ic:'img',name:'window_0808.jpg',photo:true,body:'window_0808.jpg\nПапка: Загрузки\nСнято: 8 авг · 00:20\nКамера: Redmi Note 12'}],
   sat:[{ic:'car',name:'Такси — поездки',body:'Поездка завершена\n10 авг · 00:41 → 01:05\n\nОткуда: ул. Шелковичная, 1█\nКуда: дом\n\n312 ₽ · оплата картой\n\nОцените поездку: ☆ ☆ ☆ ☆ ☆'}],
   sun:[{ic:'mail',name:'Почта — черновики',body:'Черновик · не отправлено\n11 авг · 04:03\n\nОт: S█████████\nКому: NyanBun\n\n«не уезжай. я знаю, где ты живёшь. я всегда рядом»'}]
  }},
 en:{ title:'Desktop', date:'{d} · {t}', cont:'Next night', newTag:'NEW', hint:'The stream ended at 00:00. Phone files synced. Click the files.',
  days:{mon:'Tue, Aug 5, 2025',tue:'Wed, Aug 6, 2025',wed:'Thu, Aug 7, 2025',thu:'Fri, Aug 8, 2025',fri:'Sat, Aug 9, 2025',sat:'Sun, Aug 10, 2025',sun:'Mon, Aug 11, 2025'},
  items:{
   mon:[{ic:'web',name:'Mod log',body:'NyanBun · moderation log · Aug 4\n\n23:00:04  moderator joined the chat\n23:00:04  Stranger_99 joined the chat\n23:41:17  Stranger_99: you\'re here again? i missed you\n23:41:18  ⚠ Stranger_99 has been reported on 3 other channels\n00:00:00  stream ended'},
        {ic:'vid',name:'stream_0408.mp4',body:'stream_0408.mp4\nSize: 2.1 GB\nCreated: Aug 5 · 00:47\n\nA recording of the whole stream.\nYou never pressed record.'}],
   tue:[{ic:'doc',name:'receipt_flowers.pdf',body:'PEONY FLOWER SHOP\nAug 3 · 21:40\n\nPeony bouquet, pink ×1 ........ $45\nDelivery ...................... $5\nPaid: Visa ·4471\n\nAddress: 1█ Shelkovichnaya St., apt █\nCourier: Artyom\nNote: —'}],
   wed:[{ic:'chat',name:'Direct messages',body:'NyanBun → you · Aug 7 · 01:12\n\n"thank you for being here. really. it would be so scary without you. you\'re the only one here i trust"\n\n✓✓ read · 01:37'}],
   thu:[{ic:'web',name:'Search history',body:'Aug 8 00:52  Stranger_99 username search\nAug 8 01:10  how to find a viewer by nickname\nAug 8 01:33  can you report a stream viewer to the police\nAug 8 02:05  shelkovichnaya street houses with bay windows\nAug 8 02:41  what time does the police station close'}],
   fri:[{ic:'img',name:'window_0808.jpg',photo:true,body:'window_0808.jpg\nFolder: Downloads\nTaken: Aug 8 · 00:20\nCamera: Redmi Note 12'}],
   sat:[{ic:'car',name:'Taxi — trips',body:'Trip completed\nAug 10 · 00:41 → 01:05\n\nFrom: 1█ Shelkovichnaya St.\nTo: home\n\n$6.40 · paid by card\n\nRate your trip: ☆ ☆ ☆ ☆ ☆'}],
   sun:[{ic:'mail',name:'Mail — drafts',body:'Draft · not sent\nAug 11 · 04:03\n\nFrom: S█████████\nTo: NyanBun\n\n"don\'t leave. i know where you live. i\'m always close"'}]
  }}
};
/* what the clock says when you look at your desktop after the stream */
const DESK_TIME={mon:'02:51',tue:'03:37',wed:'03:24',thu:'04:46',fri:'03:58',sat:'04:31',sun:'05:02'};
const DESK_ORDER=['mon','tue','wed','thu','fri','sat','sun'];
const DESK_ICON={web:'🌐',note:'🗒',doc:'🧾',chat:'💬',img:'🖼',news:'📰',vid:'🎞',car:'🚕',mail:'✉️'};

// ---------------------------------------------------------------- beats during the night
function storyTick(dt){
  if(!S||!S.running||S.tut.active||S.night.endless)return;
  const B=(STORY[LANG]||STORY.en)[DY().key];if(!B)return;
  S.story=S.story||{done:{},pending:[]};S.story.pending=S.story.pending||[];S.storyLog=S.storyLog||[];
  const d=dprog();
  B.beats.forEach((b,i)=>{
    if(S.story.done[i]||d<b.at)return;S.story.done[i]=1;
    if(b.mia){S.story.pending.push(b.mia);S.storyLog.push({clock:clockStr(),text:b.mia});}
    else if(b.stalker)stalkerSay(b.stalker,{name:'Stranger_99'});
    else if(b.glitch)storyGlitch(b.glitch);
    else if(b.chat)b.chat.forEach((t,j)=>later(()=>pushMsg('normal',REGULARS[j%REGULARS.length],t),j*900));
  });
  const st=S.st,safe=S.mia.awayT<=0&&!SCR.phoneOn&&!S.ev.chairShow&&(st.stage==='hidden'||st.stage==='window'&&st.p<.32);
  if(S.story.pending.length&&safe&&captionTimer<=0&&S.t-S.mia.lineT>2.2){
    say('story',S.story.pending.shift(),0);captionTimer=7;S.storyCaptionUntil=S.t+7;S.talkT=Math.max(S.talkT||0,12);
    $('caption').classList.add('story-key');
  }
  miaMemo();
}
function storyGlitch(kind){
  if(kind==='look'){ S.mia.look=0; S.mia.surpriseT=1.6; say('force',T('m_lookCam')); captionTimer=Math.max(captionTimer,6); S.glitch=.6; SFX.glitch(); }
}
// ---------------------------------------------------------------- the desktop screen
let deskNext=null;
function deskItems(key){ const D=(DESK[LANG]||DESK.en), n=DESK_ORDER.indexOf(key); const out=[];
  DESK_ORDER.slice(0,n+1).forEach(k=>(D.items[k]||[]).forEach((it,i)=>out.push({...it,id:k+i,isNew:k===key}))); return out; }
/* view mode (from the menu): everything from nights already played, nothing marked NEW, the button goes back */
function lastDeskKey(){ const s=PROG.deskSeen||{}; let k=null; DESK_ORDER.forEach(x=>{ if(s[x]) k=x; }); return k; }
function showDesktop(key,next,view){
  if(DESK_ORDER.indexOf(key)<0){ next&&next(); return; }
  deskNext=next; const D=(DESK[LANG]||DESK.en), items=deskItems(key); if(view) items.forEach(it=>it.isNew=false);
  $('deskDate').textContent=D.date.replace('{d}',(D.days||{})[key]||'').replace('{t}',DESK_TIME[key]||'03:12'); $('deskTitle').textContent=D.title; $('deskHint').textContent=D.hint; $('deskCont').querySelector('b').textContent=view?'← '+T('back'):D.cont+' →';
  $('deskIcons').innerHTML=items.map(it=>`<button type="button" class="dicon${it.isNew?' new':''}" data-desk="${it.id}"><span class="di">${DESK_ICON[it.ic]||'📄'}</span><span class="dn">${esc(it.name)}</span>${it.isNew?`<em>${D.newTag}</em>`:''}</button>`).join('');
  $('deskWin').hidden=true; $('desktop').hidden=false; SFX.click&&SFX.click();
  $('deskIcons').querySelectorAll('[data-desk]').forEach(b=>b.onclick=()=>{ const it=items.find(x=>x.id===b.dataset.desk); b.classList.remove('new'); const em=b.querySelector('em'); if(em) em.remove(); openDeskItem(it); });
  if(!view){ PROG.deskSeen=PROG.deskSeen||{}; PROG.deskSeen[key]=true; saveProg(); }
  const first=items.find(x=>x.isNew); if(first) setTimeout(()=>{ if(!$('desktop').hidden && $('deskWin').hidden){ const b=$('deskIcons').querySelector(`[data-desk="${first.id}"]`); if(b) b.click(); } },700);
}
function openDeskItem(it){
  $('deskWinTitle').textContent=it.name; $('deskWinBody').textContent=it.body;
  const cv=$('deskPhoto'); cv.hidden=!it.photo; if(it.photo) drawPhoto(cv);
  $('deskWin').hidden=false; SFX.key&&SFX.key();
}
document.getElementById('deskWinClose').onclick=()=>{ $('deskWin').hidden=true; };
document.getElementById('deskCont').onclick=()=>{ $('desktop').hidden=true; const n=deskNext; deskNext=null; n&&n(); };

Object.assign(STR.ru,{ m_lookCam:'*резко оборачивается к окну* …показалось' });
Object.assign(STR.en,{ m_lookCam:'*turns sharply to the window* …must be nothing' });

/* Mia remembers what you did last night. Picked by priority: she read one of his messages > you banned regular viewers >
   you cleaned up his messages > donations came right when she was scared > she nearly ended the stream > a calm night. */
const MEMO={
 ru:{read:'модер, вчера я всё-таки прочитала одно из тех сообщений. полночи не спала',
     wrong:'кстати, вчера забанили пару нормальных ребят. модер, ты в порядке? ты какой-то нервный был',
     him:'спасибо, что вчера так быстро убирал те жуткие сообщения. я их даже не увидела',
     don:'вчера кто-то донатил ровно тогда, когда мне было страшнее всего. как будто знал. спасибо',
     panic:'вчера я реально чуть не выключила стрим посреди эфира. простите',
     calm:'вчера было так спокойно. модер, ты лучший'},
 en:{read:"mod, i ended up reading one of those messages yesterday. couldn't sleep half the night",
     wrong:"hey mod, a few regulars got banned yesterday. everything okay?",
     him:"thank you for clearing those creepy messages so fast yesterday. i didn't even see them",
     don:"whoever donated last night... your timing was really good. thank you",
     panic:"sorry about last night. i nearly just shut everything off",
     calm:"yesterday was so calm. mod, you're the best"}
};
function miaMemo(){
  const M=PROG.memo; if(!M||S.memoDone||M.next!==DY().key||dprog()<.15||captionTimer>0) return;
  S.memoDone=true; const k=M.read>0?'read':M.wrong>=2?'wrong':M.him>=2?'him':M.don>=2?'don':M.panic>=85?'panic':'calm';
  say('force',(MEMO[LANG]||MEMO.en)[k]); S.mia.lineT=S.t; if(S.talkT!==undefined) S.talkT=Math.max(S.talkT,12);
}
