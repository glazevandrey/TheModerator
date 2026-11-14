"use strict";
// ======================= NIGHTS: tutorial, per-day events, finale =======================
// ---------- TUTORIAL: a separate step-by-step night. Each step waits for the player; nothing advances on a timer.
const q=sel=>document.querySelector(sel);
function tutShowStalker(stage,at){ const st=S.st; st.frozenAt=at; enterStage(stage,.05); }
function tutHide(){ const st=S.st; st.stage='hidden'; st.p=0; st.frozenAt=null; st.boostT=0; }
const TUT=[
  {k:'hello', next:true},
  {k:'troll', at:'video', hl:'#chat', key:'tt_trollK',
    on(){ S.tut.msgId=pushMsg('troll','xX_h4ter_Xx',T('t1msg')).id; },
    done(){ const m=S.chat.find(x=>x.id===S.tut.msgId); return m&&m.banned; }},
  /* 12.11: show what a regular viewer looks like - even weird / meme lines are not trolls */
  {k:'normal', next:true, at:'video', hl:'#chat', on(){ pushMsg('normal',genName(),LANG==='ru'?'67':'67'); later(()=>pushMsg('normal',genName(),LANG==='ru'?'абоба, стрим скучноват':'meh, kinda boring stream'),700); }},
  {k:'tox', next:true, at:'video', hl:'#toxbar'},
  {k:'lamps', next:true, hl:'.lighting .lamps'},
  /* the sound cue: plays window → door → closet in a loop, the matching lamp card flashes */
  {k:'cue', next:true, hl:'.lighting .lamps', on(){ S.tut.cueI=0; S.tut.cueT=0; },
    tick(dt){ const Tt=S.tut; Tt.cueT-=dt; if(Tt.cueT<=0){ const z=['window','door','closet'][Tt.cueI++%3]; SFX.cue(z); S.cueZ=z; S.cueT=2.4; Tt.cueT=3; } },
    off(){ S.cueZ=null; S.cueT=0; }},
  {k:'window', hl:'#actBlinds', key:'tt_windowK', on(){ S.blinds.cd=0; tutShowStalker('window',.5); }, done(){ return S.st.stage==='hidden'; }},
  {k:'door', hl:'#lamp-door .mk[data-m="BOOST"]', key:'tt_doorK', on(){ tutShowStalker('door',.5); }, done(){ if(S.st.stage!=='door'){ tutHide(); return true; } }},
  {k:'cool', hl:'#lamp-door .mk[data-m="STABLE"]', done(){ return S.lamps.door.mode==='STABLE'; }},
  /* the dog only freezes him: the MOTION bar turns grey with a countdown */
  {k:'dog', hl:'#actDog', key:'tt_dogK', on(){ S.sh.dog=0; tutShowStalker('door',.85); },
    done(){ if(S.st.frozenT>0 && S.st.frozenT<3.6){ tutHide(); S.st.frozenT=0; return true; } }},
  {k:'behind', hl:'#lamp-closet .mk[data-m="BOOST"]', key:'tt_behindK', on(){ tutShowStalker('behind',.5); }, done(){ if(S.st.stage!=='behind'){ tutHide(); return true; } }},
  {k:'cool2', hl:'#lamp-closet .mk[data-m="STABLE"]', done(){ return S.lamps.closet.mode==='STABLE'; }},
  {k:'rec', hl:'#actRec', key:'tt_recK', on(){ S.blinds.closed=false; S.blinds.timer=0; S.tut.clips=S.clips.length; S.rec.cd=0; tutShowStalker('window',.55); },
    done(){ if(S.clips.length>S.tut.clips && S.rec.active<=0){ tutHide(); return true; } }},
  {k:'donate', hl:'#actDonate', key:'tt_donateK', on(){ S.panic=55; S.hc=Math.max(S.hc,donateCost()); S.donate.cd=0; S.tut.don=S.stats.donates; }, done(){ return S.stats.donates>S.tut.don; }},
  {k:'smart', next:true, hl:'.smarthome', on(){ S.sh.dog=0; }},
  {k:'done', next:true, last:true}
];
function tutGo(i){
  const Tt=S.tut; const prev=TUT[Tt.step]; if(prev&&prev.off) prev.off(); Tt.step=i; Tt.t=0; const st=TUT[i]; highlight(null);
  if(!st){ tutFinish(); return; }
  if(st.on) st.on();
  highlight(st.hl?q(st.hl):null);
  callout(T('tt_'+st.k), st.key?T(st.key):'', {next:!!st.next, nextLbl:st.last?T('tutFinish'):T('tutNext'), at:st.at||'chat', step:(i+1)+' / '+TUT.length});
}
function tutTick(dt){
  const Tt=S.tut; if(!Tt.active) return; Tt.t+=dt;
  if(Tt.step===-1){ if(Tt.t>3.2) tutGo(0); return; }
  const st=TUT[Tt.step]; if(st && st.tick) st.tick(dt);
  if(st && st.done && Tt.t>.3 && st.done()){ SFX.click&&SFX.click(); tutGo(Tt.step+1); }
}
function tutNextClick(){ if(!S||!S.tut.active) return; const st=TUT[S.tut.step]; if(!st||!st.next) return; if(st.last){ tutFinish(); return; } tutGo(S.tut.step+1); }
function tutFinish(){
  stat('tutorial/done');
  if(!S) return; S.tut.active=false; S.running=false; S.over=true; hideCallout(); highlight(null); pfGameplay(false);
  PROG.tut=true; saveProg(); $('ovTut').hidden=false;
}
function tutSkip(){ stat('tutorial/skip'); PROG.tut=true; saveProg(); hideCallout(); highlight(null); startNight(0); }
document.getElementById('calloutNext').onclick=tutNextClick;
document.getElementById('calloutSkip').onclick=tutSkip;
document.getElementById('tutNight1').onclick=()=>startNight(0);
document.getElementById('tutMenu').onclick=()=>{ $('ovTut').hidden=true; openMenu('main'); };
function dayEventsTick(dt){
  const ev=DY().ev, E=S.ev;
  if(DY().press && dprog()>DY().press.at && !E.pressed){ E.pressed=true; S.glitch=.4; SFX.near(); floaty(T('f_press')); }
  if(S.t>7 && !E.nw){ E.nw=true; const k='nw_'+DY().key; if(T(k)!==k) tip('nw',T(k)); }      // what's new tonight
  if(DY().hot && !S.tut.active){ // it's August: now and then she opens the window
    if(E.hotT===undefined) E.hotT=rnd(28,40);
    E.hotT-=dt; if(E.hotT<=0){ E.hotT=rnd(50,75);
      if(!nightRain(S.night) && !S.winOpen && !S.blinds.closed && !S.blinds.jammed && S.mia.awayT<=0 && S.st.stage!=='window'){ S.winOpen=true; SFX.sash(); floaty(T('f_winOpen')); say('force',T('m_hot')); later(()=>tip('hot',T('tipHot')),1500); } } }
  if(DY().mod==='surge'){ E.surgeT-=dt; if(E.surgeT<=0){ E.surgeT=rnd(28,42)/(S.night.surge||1); const z=pick(ZONES.filter(z=>!S.lamps[z].burned)); if(z){ S.lamps[z].heat=Math.min(99,S.lamps[z].heat+Math.round(32*(S.night.surge||1))); S.lamps[z].surgeT=1.6; S.glitch=.3; SFX.surge(); floaty(T('f_surge',{z:T('zat_'+z)})); tip('surge',T('tipSurge')); say('surge',T('m_surge'),30); } } }
  if(DY().mod==='cold' && S.t>6) say('cold',T('m_cold'),999);
  if(ev.chair){
    if(E.chairShow>0){ E.chairShow-=dt; }
    else { E.chairT-=dt; if(E.chairT<=0 && lampMode('closet')!=='BOOST' && S.st.stage!=='behind'){ E.chairShow=4.5; E.chairT=rnd(35,50); SFX.near(); later(()=>say('chair',T('m_chair'),20),2600); } }
  }
  if(ev.note){
    const want = S.t>45 && S.t<255;
    if(want && !E.note){ E.note=true; SFX.thud(); later(()=>say('note',T('m_note'),60),2500); if(DY().key==='mon') later(()=>tip('noteMon',T('tipNoteMon')),4500); }
    if(!want) E.note=false;
  }
  if(ev.loop && S.t>20){ say('loop',T('m_loop'),40); }
}
function dayIntro(){
  const d=DY(), el=document.getElementById('dayintro'); const [a,b]=TA('di_'+d.key,{n:(d.n||0)+1});
  el.querySelector('b').textContent=a; el.querySelector('span').textContent=b; el.hidden=false; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
  setTimeout(()=>{ el.hidden=true; },4200);
}

// ---------- FINALE (night 8 survives to 00:00)
/* FINALE. Night 8 is live: at midnight her stream breaks off and never comes back.
   Morning: the police knock politely — you were the last one she talked to. They hand you a report form: pick a suspect,
   attach what you have (each piece opens on click). In the evening their answer comes with your own webcam photo and
   names exactly what in YOUR attachments gave you away. The pieces fall into place (slow, click by click). The monitor goes dark,
   blue and red lights crawl over your wall, a siren comes closer. Stranger_99 says "thank you, mod." — you hit BAN again and again
   and cannot ban yourself. A hard knock. The arrest report. */
const FIN={active:false,t:0,phase:0,wait:false,q:null};
const FINTX={
 ru:{ policeKnock:'Это полиция. Откройте, пожалуйста.',
  rpTitle:'ЗАЯВЛЕНИЕ', rpMeta:'в отдел полиции · 12 августа 2025 · 09:41', rpIntro:'Пропала М. К. (стримерша NyanBun). Вы — последний, с кем она переписывалась. Укажите, кого проверить в первую очередь, и приложите всё, что у вас есть.',
  rpSusLbl:'Кого из них, по-вашему, нужно проверить в первую очередь? (нажмите, чтобы прочитать)', rpEvLbl:'Материалы (нажмите, чтобы открыть; галочка — приложить)', rpNote:'Чем больше материалов, тем быстрее его найдут.', rpSend:'Подписать и передать', rpPick:'Выберите, кого проверить', rpSent:'Полицейский забирает бланк: «Спасибо. Мы с вами свяжемся».', rpViewHint:'Нажмите на подозреваемого или на материал, чтобы прочитать.',
  sus:[{id:'denis',n:'Денис Е.',d:'бывший Мии',x:'Бывший парень Мии. Расстались в мае.\n\nМия на стриме, ср: «и нет, это не Денис. мы расстались в мае, он вообще в другом городе. наверное»'},
       {id:'courier',n:'Артём, курьер «Пиона»',d:'знает её адрес',x:'Курьер цветочной лавки «Пион». Доставлял ей розовые пионы без записки.\n\nМия на стриме, вт: «курьер из «Пиона» опять спрашивал, одна ли я живу. странный парень»'},
       {id:'neighbor',n:'Сосед снизу',d:'курит под её окном',x:'Живёт этажом ниже. Его окна выходят туда же, куда её.\n\nМия на стриме, пт: «сосед снизу опять курит под моим окном. каждую ночь. просто стоит и курит»'},
       {id:'stranger',n:'Stranger_99',d:'пишет ей каждую ночь',x:'Пользователь чата NyanBun. Личность неизвестна.\n\nКаждую ночь пишет ей жуткое: «я скучал», «тебе идут розовые цветы», «она хочет уехать от нас, модер», «сегодня всё закончится, модер».'}],
  ev:[{id:'chat',n:'скриншоты чата (Stranger_99)'},{id:'log',n:'журнал модерации (с IP)'},{id:'receipt',n:'чек «Пион»'},{id:'photo',n:'window_0808.jpg'}],
  evChat:'Скриншоты чата NyanBun · 4–11 авг\n\nStranger_99: ты снова тут? я скучал\nStranger_99: тебе идут розовые цветы\nStranger_99: модер, ты тоже смотришь её каждую ночь?\nStranger_99: только мы с тобой, модер\nStranger_99: красиво получилось, правда?\nStranger_99: она хочет уехать от нас, модер\nStranger_99: сегодня всё закончится, модер',
  flash:[{k:'ЖУРНАЛ АВТОРИЗАЦИИ · 4 АВГ',t:'23:00:04  moderator · 7F3A-91C2\n23:00:04  Stranger_99 · 7F3A-91C2',h:'Два имени. Один телефон.',x:'Обе учётные записи — на Redmi Note 12. Пароли обеих сохранены на устройстве.'},
         {k:'ЧЕК · «ПИОН» · 3 АВГ',t:'Букет пионов, розовый ×1\nДоставка: ул. Шелковичная\nОплата: Visa ·4471',h:'·4471 — твоя карта.',x:'Ты заказал цветы к её двери за день до первого эфира.'},
         {k:'ЛИЧНЫЕ СООБЩЕНИЯ · 6 АВГ',t:'«ты единственный, кому я тут доверяю»\n✓✓ прочитано · 01:37\nУстройство: Redmi Note 12',h:'Ты прочитал его после эфира.',x:'Стрим закончился в 00:00. В 01:37 сообщение открыли с твоего телефона.'},
         {k:'window_0808.jpg',t:'Снято: 8 авг · 00:20\nКамера: Redmi Note 12\nGPS: ул. Шелковичная',h:'Ты стоял у её окна.',x:'Через двадцать минут после эфира.'},
         {k:'ТАКСИ · 9 АВГ',t:'00:41  ул. Шелковичная → дом\nОплата: Visa ·4471',h:'Ты уехал от неё.',x:'Через сорок одну минуту после эфира. Той же картой.'},
         {k:'ЖУРНАЛ АКТИВНОСТИ · ЧАТ',t:'Stranger_99 отправлял сообщения\nтолько в паузах между командами модератора.',h:'Ты переключался между аккаунтами.',x:'Пока ты управлял светом, Stranger_99 молчал. Когда ты переставал касаться экрана, чат оживал.'},
         {k:'СЕССИИ МОДЕРАТОРА · 4–11 АВГ',t:'Устройство: Redmi Note 12 · LTE\nGPS: ул. Шелковичная, 1█',h:'Ты не сидел дома.',x:'Все восемь ночей ты модерировал с телефона у её дома. Свет из окна бил тебе в лицо.'},
         {k:'11 АВГ · 23:59',mia:'«…модер? это ты?»',x:'Она смотрела не в камеру. Она смотрела на силуэт за окном.'}],
  flHint:'нажми, чтобы продолжить',
  mailHead:'Входящие · 12 августа · 19:20\nОт: отдел полиции\nТема: Re: Заявление № 0412', mailCleared:'Проверка указанного вами лица ({who}) завершена: к делу непричастен.\n\n',
  mailTop:'Статус: подозреваемый установлен.\n\nСпасибо за приложенные материалы:\n', mailEv:{chat:'• скриншоты сделаны с устройства, на котором сохранён вход Stranger_99',log:'• в журнале модерации IP Stranger_99 совпадает с вашим',receipt:'• карта ·4471 из чека оформлена на вас',photo:'• window_0808.jpg снят телефоном Redmi Note 12, зарегистрированным на вас'},
  mailNone:'Статус: подозреваемый установлен.\n\nВы не приложили материалов. Но заявление отправлено с IP-адреса, с которого каждую ночь писал Stranger_99.\n', mailCam:'\nФото заявителя, сделанное при подаче:', camStamp:'12.08.2025 09:52 · ВЕБ-КАМЕРА',
  banAsk:'Stranger_99 всё ещё в чате. Забань его.',
  protoTitle:'ПРОТОКОЛ ЗАДЕРЖАНИЯ', protoMeta:'по делу № 0412 · 12 августа 2025 · 21:14',
  protoBody:'По подозрению в преследовании и причастности к исчезновению гр. К. М. задержан гражданин, использовавший в сети учётные записи «модератор канала NyanBun» и «Stranger_99». Проживает в двух километрах от ул. Шелковичной. {how} В период с 4 по 11 августа 2025 г. выходил в сеть с мобильного телефона, находясь у дома пропавшей. По показаниям соседей, располагал дубликатом ключей от её квартиры. В ходе допроса утверждал, что «Stranger_99» — иное лицо, и просил установить его местонахождение. Заявил, что пытался её защитить.{extra} Местонахождение К. М. не установлено.',
  protoHowEv:'Установлен на основании материалов, приложенных им к собственному заявлению ({list}).', protoHowNone:'Установлен по IP-адресу, с которого подано его собственное заявление.', protoEvName:{chat:'снимки экрана переписки',log:'журнал модерации канала',receipt:'кассовый чек',photo:'фотоснимок'},
  protoExtra:' По заявлению задержанного был доставлен {who}; причастность не подтвердилась, освобождён.', protoWho:{denis:'гр. Денис Е.',courier:'курьер цветочной лавки «Пион» гр. Артём',neighbor:'сосед пропавшей'},
  last:'«Stranger_99? Мы давно тебя ищем.»', sys:'Вы больше не модератор.', notFound:'Мия так и не найдена.'},
 en:{ policeKnock:'Police. Please open the door.',
  rpTitle:'POLICE REPORT', rpMeta:'to the police department · August 12, 2025 · 09:41', rpIntro:'M. K. (streamer NyanBun) is missing. You are the last person she talked to. Tell us who you think we should investigate. Attach any evidence you have.',
  rpSusLbl:'Who should we investigate first? (click for details)', rpEvLbl:'Evidence (click to open; checkbox — attach)', rpNote:'Attach anything that might help.', rpSend:'Sign and hand it over', rpPick:'Pick who to check', rpSent:'The officer takes the form: "Thank you. We\'ll be in touch."', rpViewHint:'Click a suspect or a piece of evidence to read it.',
  sus:[{id:'denis',n:'Denis E.',d:"Mia's ex",x:"Mia's ex-boyfriend. They broke up in May.\n\nMia on stream, Wed: \"and no, it's not Denis. we broke up in may, he's in another city anyway. i think\""},
       {id:'courier',n:'Artyom, Peony courier',d:'knows her address',x:'A courier from the Peony flower shop. Delivered pink peonies to her door, no note.\n\nMia on stream, Tue: "the delivery guy from Peony asked again if i live alone. weird guy"'},
       {id:'neighbor',n:'Downstairs neighbor',d:'smokes under her window',x:'Lives one floor below. His windows face the same way as hers.\n\nMia on stream, Fri: "the downstairs neighbor is smoking under my window again. every night. just standing there, smoking"'},
       {id:'stranger',n:'Stranger_99',d:'writes to her every night',x:'A user in the NyanBun chat. Identity unknown.\n\nEvery night he writes creepy things: "i missed you", "pink flowers suit you", "she wants to get away from us, mod", "it all ends tonight, mod".'}],
  ev:[{id:'chat',n:'chat screenshots (Stranger_99)'},{id:'log',n:'moderation log (with IPs)'},{id:'receipt',n:'Peony receipt'},{id:'photo',n:'window_0808.jpg'}],
  evChat:"NyanBun chat screenshots · Aug 4–11\n\nStranger_99: you're here again? i missed you\nStranger_99: pink flowers suit you\nStranger_99: mod, do you watch her every night too?\nStranger_99: only you and me, mod\nStranger_99: it came out pretty, didn't it?\nStranger_99: she wants to get away from us, mod\nStranger_99: it all ends tonight, mod",
  flash:[{k:'LOGIN LOG · AUG 4',t:'23:00:04  moderator · 7F3A-91C2\n23:00:04  Stranger_99 · 7F3A-91C2',h:'Two names. One phone.',x:'Both accounts were used on a Redmi Note 12. Both passwords are saved on the device.'},
         {k:'RECEIPT · PEONY · AUG 3',t:'Peony bouquet, pink ×1\nDelivery: Shelkovichnaya St.\nPaid: Visa ·4471',h:'·4471 is your card.',x:'You ordered flowers to her door the day before the first stream.'},
         {k:'DIRECT MESSAGES · AUG 6',t:'"you\'re the only one here i trust"\n✓✓ read · 01:37\nDevice: Redmi Note 12',h:'You read it after the stream.',x:'The stream ended at 00:00. At 01:37 the message was opened on your phone.'},
         {k:'window_0808.jpg',t:'Taken: Aug 8 · 00:20\nCamera: Redmi Note 12\nGPS: Shelkovichnaya St.',h:'You stood at her window.',x:'Twenty minutes after the stream.'},
         {k:'TAXI · AUG 9',t:'00:41  Shelkovichnaya St. → home\nPaid: Visa ·4471',h:'You took a taxi home.',x:'Forty-one minutes after the stream. The same card.'},
         {k:'ACTIVITY LOG · CHAT',t:'Stranger_99 sent messages only\nin the pauses between moderator commands.',h:'You were switching accounts.',x:'Stranger_99 stopped typing whenever you used the controls. His messages appeared between your commands.'},
         {k:'MODERATOR SESSIONS · AUG 4–11',t:'Device: Redmi Note 12 · LTE\nGPS: 1█ Shelkovichnaya St.',h:'You were never at home.',x:'All eight nights you moderated from your phone outside her house. The light from her window hit you in the face.'},
         {k:'AUG 11 · 23:59',mia:'"…mod? is that you?"',x:'She wasn\'t looking at the camera. She was looking at the figure outside the window.'}],
  flHint:'click to continue',
  mailHead:'Inbox · August 12 · 19:20\nFrom: Police Department\nSubject: Re: Report no. 0412', mailCleared:'We investigated {who}. We found no evidence of involvement.\n\n',
  mailTop:'Status: suspect identified.\n\nThank you for the evidence you attached:\n', mailEv:{chat:'• the screenshots were taken on a device with Stranger_99\'s login saved',log:"• in the moderation log Stranger_99's IP matches yours",receipt:'• card ·4471 on the receipt is registered to you',photo:'• window_0808.jpg was taken with a Redmi Note 12 registered to you'},
  mailNone:'Status: suspect identified.\n\nYou attached no evidence. But the report was sent from the IP address Stranger_99 wrote from every night.\n', mailCam:'\nPhoto of the applicant, taken when the report was submitted:', camStamp:'2025-08-12 09:52 · WEBCAM',
  banAsk:'Stranger_99 is still in the chat. Ban him.',
  protoTitle:'ARREST REPORT', protoMeta:'case no. 0412 · August 12, 2025 · 21:14',
  protoBody:'On suspicion of stalking and involvement in the disappearance of M. K., a citizen was detained who used the online accounts "moderator of the NyanBun channel" and "Stranger_99". Resides two kilometers from Shelkovichnaya Street. {how} Between August 4 and 11, 2025, he went online from a mobile phone while located at the missing person\'s residence. According to neighbors, he had a duplicate key to her apartment. During questioning he stated that "Stranger_99" is a different person and asked that this person be located. He stated that he had been trying to protect her.{extra} The whereabouts of M. K. remain unknown.',
  protoHowEv:'Identified on the basis of the materials he attached to his own report ({list}).', protoHowNone:'Identified by the IP address from which his own report was filed.', protoEvName:{chat:'screen captures of the chat',log:'channel moderation log',receipt:'payment receipt',photo:'photograph'},
  protoExtra:' On the detainee\'s report, {who} was brought in; involvement was not confirmed, released.', protoWho:{denis:'Denis E.',courier:'Artyom, a courier of the Peony flower shop',neighbor:'the missing person\'s neighbor'},
  last:'"Stranger_99? We\'ve been looking for you."', sys:'You are no longer a moderator.', notFound:'Mia has not been found.'}
};
const FX=()=>FINTX[LANG]||FINTX.en;
function startFinale(){
  stat('finale/start');
  S.running=false; S.over=true; FIN.active=true; FIN.t=0; FIN.phase=0; FIN.wait=false; FIN.q=null; FIN.tp=0; FIN.sus=null; FIN.ev=null; FIN.bans=0; FIN.knocked=false; pfGameplay(false);
  PROG.bank+=S.hc+300; PROG.done=true; PROG.unlocked=NIGHTS.length-1; saveProg();
  finClock=0; S.finaleEmpty=true; S.cueT=0; S.cueZ=null; $('cueline').hidden=true; FIN.said=false;
}
function finQueue(key,delay){ FIN.q={key,at:FIN.t+(delay||0)}; }
function finShow(key,opt){
  opt=opt||{}; FIN.wait=!opt.noBtn; FIN.q=null; $('finText').textContent=opt.text||T(key); $('finCard').hidden=false; $('finCard').classList.toggle('top',!!opt.top);
  const b=$('finNext'); b.hidden=!!opt.noBtn; b.disabled=true; setTimeout(()=>{ b.disabled=false; },1100);
}
function finNext(){
  if(!FIN.active||!FIN.wait||$('finNext').disabled) return;
  FIN.wait=false; $('finCard').hidden=true; finEnter(FIN.phase+1);
}
function finEnter(ph){
  const mon=$('monitor'); FIN.phase=ph; FIN.tp=FIN.t;
  if(ph===2){ /* morning: a polite knock at YOUR door */
    SFX.staticOff(); $('caption').hidden=true; captionTimer=0; const pk=$('police'); pk.innerHTML='<p class="pk-knock"></p><b></b>'; pk.classList.add('soft'); pk.hidden=false;
    SFX.softKnock(); setTimeout(()=>{ if(FIN.phase===2) pk.querySelector('.pk-knock').textContent=LANG==='ru'?'тук · тук · тук':'knock · knock · knock'; },200);
    setTimeout(()=>{ if(FIN.phase===2){ pk.querySelector('b').textContent=FX().policeKnock; } },1900);
    finQueue('finPolice',3.6); }
  if(ph===3){ $('police').hidden=true; openReport(); }
  if(ph===4){ $('report').hidden=true; openMail(); }
  if(ph===5){ $('report').hidden=true; $('mail').hidden=true; finFlash(); }
  if(ph===6){ /* the monitor goes dark: your room, police lights on the wall, a siren coming. Stranger_99 thanks you. */
    const tok=FIN.tok=(FIN.tok||0)+1;
    $('flash').hidden=true; mon.classList.remove('nosignal'); S.signalLost=0; mon.classList.add('playback'); S.finReflect=FIN.t; S.finLights=FIN.t+1.5; SFX.near(); SFX.sirenOn();
    setTimeout(()=>{ if(FIN.phase!==6) return; $('stage').classList.add('finban'); const m=pushMsg('stalker','Stranger_99',T('finSelfMsg')); m.read=true; FIN.selfId=m.id; S.selected=null; selectMsg(m.id); SFX.creak&&SFX.creak();
      setTimeout(()=>{ if(FIN.phase===6&&FIN.bans===0) finShow('',{noBtn:true,top:true,text:FX().banAsk}); },700);
      setTimeout(()=>{ if(FIN.tok===tok&&FIN.phase===6&&FIN.bans===0) finKnock(); },14000); },1300); }
  if(ph===7){ SFX.sirenOff(); $('stage').classList.remove('finban'); S.finLights=null; fillProtocol(); $('epilogue').hidden=false; $('protoNext').hidden=true; }
  if(ph===8){ SFX.slam(); $('epilogue').classList.add('slam'); }
  if(ph===9){ $('endLast').textContent=FX().last; $('endMia').textContent=FX().notFound; $('endSys').textContent=FX().sys; $('endcard').hidden=false; rateShow($('rateItchEnd'),true); stat('finale/end',true); }
}
function finaleTick(dt){
  if(!FIN.active) return; FIN.t+=dt; const t=FIN.t, since=t-FIN.tp;
  if(FIN.q && t>=FIN.q.at && !FIN.wait){ const k=FIN.q.key; if(k==='finPolice'){ const pk=$('police'); pk.querySelector('b').textContent=''; pk.querySelector('.pk-knock').textContent=''; } finShow(k); }
  if(FIN.phase===0 && !FIN.said && finClock>3){ FIN.said=true; say('force',T('m_final')); captionTimer=5; }
  if(FIN.phase===0){ finClock+=dt; if(finClock>FIN_LEN){ FIN.phase=1; $('monitor').classList.add('nosignal'); SFX.staticOn(); S.signalLost=1; finQueue('fin1',1.4); } }
  if(FIN.phase===7 && since>3.2) $('protoNext').hidden=false;
  if(FIN.phase===8 && since>2.4) finEnter(9);
}
document.getElementById('finNext').onclick=finNext;
/* reading the protocol up close (Outlast-style): click the paper, click again (or any key) to put it down */
function readDoc(v){ $('readDoc').hidden=!v; if(v) SFX.click&&SFX.click(); }
document.getElementById('protocol').onclick=()=>readDoc(true);
document.getElementById('readDoc').onclick=()=>readDoc(false);
document.getElementById('protoNext').onclick=()=>{ if(FIN.active && FIN.phase===7) finEnter(8); };
/* the report form: every suspect and every piece of evidence opens on click; the checkbox attaches it */
function evBody(id){ const D=(DESK[LANG]||DESK.en).items, X=FX();
  return id==='chat'?X.evChat : id==='log'?D.mon[0].body : id==='receipt'?D.tue[0].body : D.fri[0].body; }
function rpView(title,body,photo){ $('rpVTitle').textContent=title; $('rpVBody').textContent=body; const cv=$('rpVPhoto'); cv.hidden=!photo; if(photo) drawPhoto(cv); $('rpView').classList.add('on'); }
function openReport(){
  const X=FX(); $('rpTitle').textContent=X.rpTitle; $('rpMeta').textContent=X.rpMeta; $('rpIntro').textContent=X.rpIntro; $('rpSusLbl').textContent=X.rpSusLbl; $('rpEvLbl').textContent=X.rpEvLbl; $('rpNote').textContent=X.rpNote;
  $('rpVTitle').textContent=''; $('rpVBody').textContent=X.rpViewHint; $('rpVPhoto').hidden=true; $('rpView').classList.remove('on');
  $('rpSus').innerHTML=X.sus.map(s=>`<button type="button" class="rp-s" data-s="${s.id}"><b>${esc(s.n)}</b><span>${esc(s.d)}</span></button>`).join('');
  $('rpEv').innerHTML=X.ev.map(e=>`<div class="rp-e"><input type="checkbox" checked data-ev="${e.id}" aria-label="${esc(e.n)}"><button type="button" class="rp-open" data-open="${e.id}">📎 ${esc(e.n)}</button></div>`).join('');
  const send=$('rpSend'); send.disabled=true; send.querySelector('b').textContent=X.rpPick; $('rpSent').hidden=true;
  $('rpSus').querySelectorAll('.rp-s').forEach(b=>b.onclick=()=>{ FIN.sus=b.dataset.s; SFX.click&&SFX.click(); $('rpSus').querySelectorAll('.rp-s').forEach(x=>x.classList.toggle('on',x===b)); const s=X.sus.find(x=>x.id===FIN.sus); rpView(s.n,s.x,false); send.disabled=false; send.querySelector('b').textContent=X.rpSend; });
  $('rpEv').querySelectorAll('.rp-open').forEach(b=>b.onclick=()=>{ SFX.click&&SFX.click(); const e=X.ev.find(x=>x.id===b.dataset.open); rpView(e.n,evBody(e.id),e.id==='photo'); });
  send.onclick=()=>{ if(!FIN.sus||FIN.phase!==3) return; FIN.ev=[...$('rpEv').querySelectorAll('input:checked')].map(i=>i.dataset.ev); send.disabled=true; SFX.click&&SFX.click();
    $('rpSent').textContent=X.rpSent; $('rpSent').hidden=false; setTimeout(()=>SFX.rec(),500); setTimeout(()=>{ if(FIN.active&&FIN.phase===3){ $('report').hidden=true; finEnter(5); } },2800); };
  $('report').hidden=false;
}
/* the end of it: BAN, again and again. It doesn't work. The police don't wait for your clicks: the knock comes ~4 s after the first try (or 14 s after his message if you never try). */
function finKnock(){ if(!FIN.active||FIN.phase!==6||FIN.knocked) return; FIN.knocked=true; SFX.knock(); $('finCard').hidden=true; $('stage').classList.add('quake'); setTimeout(()=>{ $('stage').classList.remove('quake'); if(FIN.phase===6) finEnter(7); },3000); }
function finSelfBan(){
  if(!FIN.active||FIN.phase!==6||FIN.knocked||!$('stage').classList.contains('finban')) return; FIN.bans++;
  SFX.wrong(); $('finCard').hidden=true; $('stage').classList.add('quake'); setTimeout(()=>$('stage').classList.remove('quake'),400);
  pushMsg('sys','',T('finSelfSys')); floaty(T('finSelfSys')); S.floatT=2.6; const cl=document.getElementById('chatlist'); cl.scrollTop=cl.scrollHeight; if(FIN.selfId!=null) selectMsg(FIN.selfId);
  SFX.sirenUp(Math.min(FIN.bans,4));
  if(FIN.bans===1) setTimeout(()=>SFX.breath(),500);
  if(FIN.bans===1){ const tok=FIN.tok; setTimeout(()=>{ if(FIN.tok===tok) finKnock(); },4200); }
}
/* the pieces fall into place: one by one, each waits for a click (or ~7 s) */
function finFlash(){
  const F=$('flash'), sl=FX().flash; F.hidden=false; FIN.flI=0; $('flHint').textContent=FX().flHint; flashShow();
}
function flashShow(){
  if(!FIN.active||FIN.phase!==5) return; const F=$('flash'), sl=FX().flash;
  clearTimeout(FIN.flT);
  if(FIN.flI>=sl.length){ F.classList.add('black'); setTimeout(()=>{ F.classList.remove('black'); if(FIN.phase===5) finEnter(6); },1300); return; }
  const s=sl[FIN.flI++]; F.classList.toggle('mia',!!s.mia); F.classList.remove('go'); void F.offsetWidth; F.classList.add('go'); SFX.glitch();
  $('flK').textContent=s.k||''; $('flT').textContent=s.mia?s.mia:s.t; $('flH').textContent=s.h||''; $('flX').textContent=s.x||'';
  FIN.flAt=performance.now(); FIN.flT=setTimeout(flashShow, 7500);
}
document.getElementById('flash').onclick=()=>{ if(FIN.phase===5 && performance.now()-(FIN.flAt||0)>900){ SFX.click&&SFX.click(); flashShow(); } };
/* the answer to your report: what gave you away, and your own face */
function openMail(){
  const X=FX(), who=FIN.sus&&FIN.sus!=='stranger'?X.sus.find(s=>s.id===FIN.sus).n:null, ev=FIN.ev||[];
  const body=(who?X.mailCleared.replace('{who}',who):'')+(ev.length?X.mailTop+ev.map(e=>X.mailEv[e]).join('\n')+'\n':X.mailNone)+X.mailCam;
  $('mlHead').textContent=X.mailHead; $('mlText').textContent=body;
  drawCamShot($('mlCam'),X.camStamp); $('mlNext').querySelector('b').textContent=T('finNext'); $('mlNext').disabled=true; setTimeout(()=>{ $('mlNext').disabled=false; },1600);
  $('mail').hidden=false; SFX.rec();
}
document.getElementById('mlNext').onclick=()=>{ if(FIN.active&&FIN.phase===4) finEnter(5); };
function drawCamShot(cv,stamp){
  const c=cv.getContext('2d'), w=cv.width, h=cv.height;
  c.fillStyle='#0b0d10'; c.fillRect(0,0,w,h);
  const g=c.createRadialGradient(w*.5,h*.62,10,w*.5,h*.62,w*.7); g.addColorStop(0,'rgba(120,150,170,.30)'); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.fillRect(0,0,w,h);   /* lit by the monitor */
  c.fillStyle='rgba(216,210,198,.18)'; for(let i=0;i<9;i++){ c.save(); c.translate(16+i*34,14+(i%3)*22); c.rotate((i%5-2)*.05); c.fillRect(0,0,24,17); c.restore(); }   /* her stream printouts on the wall */
  c.save(); c.translate(w*.5,h*.6); c.fillStyle='#050506';
  c.beginPath(); c.ellipse(0,-6,46,56,0,0,7); c.fill();
  for(const [x,y,r] of [[-28,-44,22],[-6,-54,24],[20,-50,22],[36,-34,17],[-38,-28,16]]){ c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }
  c.fillRect(-18,40,36,30); c.beginPath(); c.moveTo(-150,h); c.quadraticCurveTo(-130,72,-50,62); c.lineTo(50,62); c.quadraticCurveTo(130,72,150,h); c.closePath(); c.fill();
  c.fillStyle='rgba(150,180,200,.22)'; c.beginPath(); c.ellipse(0,4,40,44,0,Math.PI*1.05,Math.PI*1.95,true); c.fill();   /* monitor glow on the face */
  c.fillStyle='rgba(230,236,240,.85)'; c.fillRect(-20,-6,7,3); c.fillRect(13,-6,7,3);   /* eyes catch the screen */
  c.restore();
  c.globalAlpha=.12; for(let i=0;i<1400;i++){ c.fillStyle=Math.random()<.5?'#fff':'#000'; c.fillRect(Math.random()*w,Math.random()*h,1,1); } c.globalAlpha=1;
  c.fillStyle='#e0554d'; c.beginPath(); c.arc(14,h-14,4,0,7); c.fill(); c.fillStyle='rgba(240,236,228,.85)'; c.font='bold 11px monospace'; c.fillText(stamp,24,h-10);
}
function fillProtocol(){
  const X=FX(), who=FIN.sus&&FIN.sus!=='stranger'?X.sus.find(s=>s.id===FIN.sus).n:null, ev=FIN.ev||[];
  const how=ev.length?X.protoHowEv.replace('{list}',ev.map(e=>X.protoEvName[e]).join(', ')):X.protoHowNone;
  const body=X.protoBody.replace('{how}',how).replace('{extra}',who?X.protoExtra.replace('{who}',X.protoWho[FIN.sus]||who):'');
  document.querySelectorAll('#protocol h3,#readDoc h2').forEach(e=>e.textContent=X.protoTitle);
  document.querySelectorAll('#protocol .meta,#readDoc .rd-meta').forEach(e=>e.textContent=X.protoMeta);
  document.querySelectorAll('#protocol p,#readDoc p').forEach(e=>e.textContent=body);
}

