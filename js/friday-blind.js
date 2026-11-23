"use strict";
/* Friday, attack 1 "blind" (19.11, author: "давай попробуем"): the attack is played with the same skill as the rest of the night.
   The camera and the lamp sensors drop out just before he comes. The player does not SEE where he is:
     - a sound cue (knock = window, creak = door) and Mia's ear (only if she was already on guard);
     - the chat: real viewers write where he is, the imitator writes the other place, trolls make noise.
       Those lines carry trigger words, so the filter holds them: Mia does not see them unless the moderator PINS one.
   Answers: lamps and blinds work as always (blind); a PIN tells Mia where he is - the true one makes her act
   (window: she lowers the blinds herself, door: she puts the chain on), the imitator's one sends her the wrong way.
   The picture comes back when he leaves that place, gets right up to it (p≥0.85) or after 14 s.
   No new tools: camera glitch + chat + pin + lamps. The red-eyes finale is untouched. */
const FBL={ enterMax:14, close:.85, msgs:[.8,1.7,2.6,3.6], hintSec:8 };
Object.assign(STR.ru,{
  fbl_off:'КАМЕРА · НЕТ СИГНАЛА', fbl_sub:'звук идёт · датчики не отвечают', fbl_sensor:'НЕТ СВЯЗИ',
  fbl_hint:'Камера и датчики отключились. Слушай: стук — окно, скрип — дверь. Свет и жалюзи работают. «Показать Мие» скажет ей, куда смотреть.',
  fbl_miaOff:'ой… камера погасла? модер, ты меня видишь?',
  fbl_earWin:'стук… это окно. модер, это ОКНО', fbl_earDoor:'скрип… это дверь. модер, ДВЕРЬ',
  fbl_earDoubt:'окно? или дверь?.. я не понимаю, откуда', fbl_earNone:'ЧТО ЭТО?! кто здесь?!',
  fbl_realWin:'мия у тебя в окне кто-то!!', fbl_realDoor:'мия дверь сзади открывается!!',
  fbl_fakeWin:'он у двери!! мия беги закрой дверь', fbl_fakeDoor:'в окне лицо!!! закрой окно скорее',
  fbl_real2Win:'я слышал стук по стеклу, это окно', fbl_real2Door:'скрип был, это дверь, точно',
  fbl_troll:'ахахах скример, ну наконец-то контент',
  fbl_actWin:'окно… жалюзи вниз. всё. всё', fbl_actDoor:'дверь… цепочка… закрыла!',
  fbl_wrongDoWin:'окно?! закрываю окно, закрываю!', fbl_wrongDoDoor:'дверь?! держу дверь!', fbl_wrongBack:'там никого… а звук — с другой стороны!!',
  fbl_close:'ОН ПРЯМО ТУТ', fbl_back:'камера вернулась… он был там. прямо там'
});
Object.assign(STR.en,{
  fbl_off:'CAMERA · NO SIGNAL', fbl_sub:'audio is live · sensors not responding', fbl_sensor:'NO LINK',
  fbl_hint:'Camera and sensors are down. Listen: a knock is the window, a creak is the door. Lights and blinds still work. «Show Mia» tells her where to look.',
  fbl_miaOff:'oh… did my camera die? mod, can you see me?',
  fbl_earWin:'a knock… it\'s the window. mod, the WINDOW', fbl_earDoor:'a creak… it\'s the door. mod, the DOOR',
  fbl_earDoubt:'the window? the door?.. i can\'t tell where', fbl_earNone:'WHAT IS THAT?! who\'s there?!',
  fbl_realWin:'mia someone is at your window!!', fbl_realDoor:'mia the door behind you is opening!!',
  fbl_fakeWin:'he\'s at the door!! mia run, shut the door', fbl_fakeDoor:'a face in the window!!! close the window quick',
  fbl_real2Win:'i heard knocking on the glass, it\'s the window', fbl_real2Door:'that was a creak, it\'s the door, for sure',
  fbl_troll:'lmao a jumpscare, finally some content',
  fbl_actWin:'the window… blinds down. there. there', fbl_actDoor:'the door… the chain… done!',
  fbl_wrongDoWin:'the window?! i\'m shutting the window!', fbl_wrongDoDoor:'the door?! i\'m holding the door!', fbl_wrongBack:'nobody there… the sound is from the other side!!',
  fbl_close:'HE IS RIGHT HERE', fbl_back:'the camera is back… he was there. right there'
});
Object.assign(FRI_SUM.ru,{
  blHeld:'Нападение вслепую: камера погасла, а ты нашёл его по звуку.',
  blRight:'В темноте ты показал Мие правду из чата → она сама {act}.', blRightWin:'опустила жалюзи', blRightDoor:'закрыла дверь на цепочку',
  blWrong:'В темноте ты показал Мие совет подражателя → она побежала не туда.',
  blClose:'Пока камера не работала, он подошёл вплотную.',
  blEar:'Она была настороже и сама расслышала, откуда звук.' });
Object.assign(FRI_SUM.en,{
  blHeld:'Blind attack: the camera died and you found him by sound.',
  blRight:'In the dark you showed Mia the truth from chat → she {act} herself.', blRightWin:'lowered the blinds', blRightDoor:'put the chain on the door',
  blWrong:'In the dark you showed Mia the imitator\'s advice → she ran the wrong way.',
  blClose:'While the camera was down he got right up close.',
  blEar:'She was on guard and heard where the sound came from herself.' });

function fblDom(){
  if($('friBlind')) return;
  $('video').insertAdjacentHTML('beforeend',`<div id="friBlind" class="fri-blind" hidden><b id="fblOff"></b><small id="fblSub"></small><p id="fblHint" hidden></p></div>`);
}
function fblShow(on){ fblDom(); const el=$('friBlind'); el.hidden=!on; $('video').classList.toggle('fri-dark',on);
  if(on){ $('fblOff').textContent=T('fbl_off'); $('fblSub').textContent=T('fbl_sub'); } }

/* the attack has just been sent (friday.js friAttack → friSend): pick where he comes from, cut the camera */
function fblStart(){
  const F=FRS(), st=S.st;
  const zone = S.winOpen ? 'window' : S.blinds.closed ? 'door' : (window.FBL_FORCE || (Math.random()<.5?'window':'door'));   /* FBL_FORCE: test hook only */
  F.bl={ zone, phase:'dark', t0:S.t, enterT:0, q:[], pin:null };
  F.attSeen=true;   /* the old "he is at the window" block in friday.js is replaced by this file */
  if(zone==='door'){ S.night.routes={B:1}; st.next='B'; }
  S.tipsDone.routeB=1; S.tipsDone.first=1;   /* the notes panel must not name the zone either ("he came straight through the door") */
  fblShow(true); S.glitch=.5; SFX.thud&&SFX.thud();
  F.blAggr=S.night.aggr; S.night.aggr*=1.7;   /* in the dark he comes faster: doing nothing must not be safe */
  mod2Say('fblOff',T('fbl_miaOff'));
  if(!PROG.fblSeen){ $('fblHint').textContent=T('fbl_hint'); $('fblHint').hidden=false; } else $('fblHint').hidden=true;   /* first time only, inside the dead picture: the chat must stay free */
  friLog('НАПАДЕНИЕ 1 вслепую: камера и датчики отключились, он идёт к '+(zone==='window'?'ОКНУ':'ДВЕРИ'));
}
/* he has stepped into his place: her ear, then the chat */
function fblEnter(){
  const F=FRS(), b=F.bl, z=b.zone, W=z==='window', other=W?'Door':'Win', own=W?'Win':'Door';
  b.enterT=S.t; b.ids={}; S.shake=.25; miaFlinch(1);
  F.attKind=F.wary?'wary':F.doubt?'doubt':'surprise';
  if(F.wary){ b.ear=true; friFace('anxious',3.5); miaLean(W?-2:2,0,2.8,W?'win':'door'); mod2Say('fblEar',T('fbl_ear'+own)); }
  else if(F.doubt){ friFace('anxious',3.5); mod2Say('fblEar',T('fbl_earDoubt')); }
  else { friPanic(10,'нападение вслепую застало врасплох'); friFace(F.horror?'panic':'scared',3.5); mod2Say('fblEar',T('fbl_earNone')); }
  /* half the time the imitator speaks FIRST: "act on the first line you see" must not be a safe rule (author's test 19.11) */
  const fakeFirst=Math.random()<.5, ord=fakeFirst?[1,0,2,3]:[0,1,2,3], at=k=>S.t+FBL.msgs[ord[k]];
  if(fakeFirst) friLog('подражатель пишет первым');
  b.q.push({at:at(0),fn:()=>{ b.ids.real=friPush('normal','sleepy_otter',T('fbl_real'+own),{acc:'v:sleepy_otter'},(m,aloud)=>fblPinned('real',aloud)).id; }});
  b.q.push({at:at(1),fn:()=>{ S.mimicNext='noodle_owl'; b.ids.fake=friPush('stalker','n00dle_owl',T('fbl_fake'+own),{acc:'imp:n00dle_owl'},(m,aloud)=>fblPinned('fake',aloud)).id; }});
  /* 22.11: no troll and no second real line - her ear and the sound lead; the chat has one warning and the imitator's opposite advice */
  friLog('он '+(W?'у ОКНА':'у ДВЕРИ')+' · Мия '+(F.wary?'расслышала сама':F.doubt?'не понимает откуда':'в испуге'));
}
/* a pin is the moderator telling her where he is; an unpinned line changes nothing (she is not sure) */
function fblPinned(kind,aloud){
  const F=FRS(), b=F.bl; if(!aloud||!b||b.pin) return; const st=S.st, W=b.zone==='window';
  if(kind==='real'){ b.pin='right'; friLog('ИГРОК закрепил правду: '+(W?'окно':'дверь'));
    /* the truth from the mod lets her shut him out for good this time (no detour): that is the reward for reading the chat right */
    if(W){ const bl=S.blinds; bl.closed=true; bl.timer=Math.max(bl.timer||0,6); SFX.blinds(); S.winOpen=false; miaLean(-2.2,0,1.8,'win'); }
    else { st.frozenT=Math.max(st.frozenT||0,4); SFX.door&&SFX.door(); miaLean(2.2,0,1.8,'door'); }
    b.q.push({at:S.t+1.2,fn:()=>{ if(S.st.stage===b.zone){ F['detour'+F.att+F.fin]=true; SFX.thud&&SFX.thud(); stalkerRetreat('hidden'); } }});
    friFace('anxious',3); later(()=>mod2Say('fblAct',T(W?'fbl_actWin':'fbl_actDoor')),300); }
  else { b.pin='wrong'; friLog('ИГРОК закрепил ложь подражателя → Мия бежит не туда');
    /* she turns to the wrong side (no real walk-away: the room's "back from checking" logic would end the attack for us) */
    st.p=Math.min(.8,st.p+.15); friPanic(6,'кинулась не туда по закрепу'); friFace('scared',3);
    miaLean(W?2.6:-2.6,0,3,W?'door':'win'); later(()=>mod2Say('fblWrongDo',T(W?'fbl_wrongDoDoor':'fbl_wrongDoWin')),300);
    b.q.push({at:S.t+3.2,fn:()=>{ friFace('scared',3); miaLean(W?-2:2,0,2,W?'win':'door'); mod2Say('fblWrong',T('fbl_wrongBack')); friPanic(6,'поняла, что звук с другой стороны'); }}); }
}
function fblEnd(why){
  const F=FRS(), b=F.bl; b.phase='done'; b.res=why; fblShow(false); S.glitch=.35; if(F.blAggr){ if(F.att==='go') S.night.aggr=F.blAggr; F.blAggr=0; }
  PROG.fblSeen=true; try{ saveProg(); }catch(e){}
  if(why==='close'){ S.shake=.5; SFX.near&&SFX.near(); miaFlinch(1.6); friFace('panic',3.5); friPanic(10,'камера вернулась — он вплотную'); mod2Say('fblClose',T('fbl_close')); }
  else if(why==='moved'){ later(()=>mod2Say('fblBack',T('fbl_back')),400); }
  friLog('камера вернулась: '+({close:'он вплотную',moved:'он ушёл с места',held:'он отогнан',time:'время вышло'}[why]||why));
}
function fblTick(){
  const F=FRS(), b=F.bl, st=S.st; if(!b) return;
  if(b.q.length){ const q=b.q; b.q=[]; for(const x of q){ if(S.t>=x.at) x.fn(); else b.q.push(x); } }
  if(b.phase!=='dark') return;
  /* in the dark she does not take her eyes off the chat: a fresh pin is read as soon as the 1.5 s rule allows (test 19.11: a slow glance let him reach her first) */
  { const g=S.m2; if(g && g.pinned!=null && !g.pinnedReadAt){ const m=S.chat.find(x=>x.id===g.pinned); if(m && m.feedAt!=null){ const need=m.feedAt+mod2Cfg().minFeed-S.t; g.glanceIn=Math.min(g.glanceIn,Math.max(.15,need+.1)); } } }
  if(!b.enterT){ if(st.stage===b.zone) fblEnter(); else if(S.t-b.t0>8) fblEnd('time'); return; }
  if(F.slammed) fblEnd('slam');   /* the hand through the open window: friday.js plays it, we only give the picture back */
  else if(st.stage==='hidden') fblEnd('held');
  else if(st.stage!==b.zone) fblEnd('moved');
  else if(st.p>=FBL.close) fblEnd('close');
  else if(S.t-b.enterT>FBL.enterMax) fblEnd('time');
}

/* ---------------- hooks */
{ const atkOld=friAttack; friAttack=function(dt){ const F=FRS(), was=F.att; atkOld(dt);
    if(was==='wait' && F.att==='go' && !F.bl) fblStart();
    fblTick(); }; }
/* in the dark she cannot SEE him, so "something is visibly coming - she watches it, not the chat" does not hold:
   she is glued to the chat, and a pin cuts in even while she is talking (test 19.11: pins waited out the whole attack) */
function fblDark(){ const F=S&&S.fri; return !!(F&&F.bl&&F.bl.phase==='dark'&&friOn()); }
{ const dOld=mod2Danger; mod2Danger=function(){ if(fblDark()){ const st=S.st; return S.scareT>0 || st.stage==='behind'; } return dOld(); }; }
{ const fOld=mod2FreeToTalk; mod2FreeToTalk=function(){ return fblDark() ? true : fOld(); }; }
/* the sensors are down too: no motion / proximity / zone cue on the lamp cards while it is dark */
{ const hudOld=hud; hud=function(dt){ hudOld(dt);
    const F=S&&S.fri; if(!F||!F.bl||F.bl.phase!=='dark') return;
    for(const z of ZONES){ const card=$('lamp-'+z); if(!card) continue;
      card.classList.remove('motion','adapt','redeyes','cue'); setSeg(card.querySelector('.prox i'),0);
      const st=card.querySelector('.lstatus'); if(st&&st.lastElementChild){ st.lastElementChild.textContent=T('fbl_sensor');
        if(st.dataset.type!=='alert'){ st.dataset.type='alert'; const u=st.querySelector('use'); if(u) u.setAttribute('href','#i-alert'); } } }   /* the same on all three cards: nothing tells the zone */
    const cl=$('cueline'); if(cl) cl.hidden=true; }; }
/* the night summary: the attack line tells what happened in the dark */
{ const sOld=friStory2; friStory2=function(){ const out=sOld(), F=S.fri, b=F.bl, L=FRI_SUM[LANG]||FRI_SUM.en; if(!b) return out;
    const old=[L.attWary,L.attDoubt,L.attSurp]; const i=out.findIndex(x=>old.includes(x)); const lines=[];
    if(b.pin==='right') lines.push(L.blRight.replace('{act}',b.zone==='window'?L.blRightWin:L.blRightDoor));
    else if(b.pin==='wrong') lines.push(L.blWrong);
    if(b.res==='close') lines.push(L.blClose); else if(!b.pin && (b.res==='held'||b.res==='moved')) lines.push(L.blHeld);   /* slam/time: friday.js already has its own line */
    if(b.ear) lines.push(L.blEar);
    if(i>=0) out.splice(i,1,...lines); else out.push(...lines);
    return out; }; }
