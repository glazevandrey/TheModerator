"use strict";
// ======================= MAIN MENU: play, nights, shop, endless shift, daily bonus =======================
let menuView='main', shopTab='up';
/* 11.11: Mia / room customization hidden from the shop for now (upgrades only); data, LOOKS and applyLooks stay - set true to bring the tab back */
const SHOP_LOOKS=false;
function todayKey(){ const d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function dailyValue(){ return 50+25*Math.min(PROG.daily.streak,6); }
function dailyAvailable(){ return PROG.daily.last!==todayKey(); }
function claimDaily(){
  if(!dailyAvailable()) return;
  const y=new Date(Date.now()-864e5), yk=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();
  PROG.daily.streak = PROG.daily.last===yk ? PROG.daily.streak+1 : 0;
  PROG.bank+=dailyValue(); PROG.daily.last=todayKey(); saveProg(); SFX.donate(); renderMenu();
}
function nextNightIdx(){ return Math.min(PROG.unlocked, NIGHTS.length-1); }
function nightTag(N){ return N.story?T('story'):N.mod?T('mod_'+N.mod):T('tag_first'); }
function openMenu(view){ menuView=view||'main'; ['ovEnd','ovTut','ovPhoto','ovPause'].forEach(id=>$(id).hidden=true); paused=false;
  if(!S||!S.running){ S=newState(0); S.menuScene=true; S.st.stage='window'; S.st.p=.82; MS.stT=rnd(16,24); }   /* the menu shows a calm night with him at the window */
  $('ovMenu').hidden=false; renderMenu(); pfGameplay(false); }
/* ======================= LIVE MENU (11.11): the main screen is her stream =======================
   #menuCv shows the room (#feed, drawn by render.js) full-screen; on top: LIVE bar, logo, a fake cozy chat,
   the shift button and tiles. Other views (nights, shop, ...) are the paper card over the dimmed room. */
const LOGO_HTML='THE M<svg class="logoO" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="12"/><circle cx="50" cy="50" r="33" fill="none" stroke="#d9443c" stroke-width="2.5" opacity=".55"/><circle cx="50" cy="50" r="24" fill="#d9443c"/></svg>DERATOR';
const MS={stT:20,muT:6,chT:1,viewers:1247,vT:2,msgs:[],shown:false};
const MENU_CHAT={
  ru:['мия привет!!','уютно сегодня','а где модер?','💜💜💜','чай с мятой, стрим, кайф','мия ты сегодня без кота?','первый раз тут, привет','какая лампа милая','давай про тот сон','ночной стрим лучший стрим','опять засиделась?','всем доброй ночи','у меня тоже дождь был','мия, лайк за наушники','кто-нибудь, модерните чат','спам опять будет, чую','ня','я из клипа пришёл','шарф связала?','мия улыбнись 🙂','спать пора, но ещё 5 минут','модер есть? тут бот','какая тихая ночь','сверчки слышно? у меня окно открыто'],
  en:['hi mia!!','so cozy tonight','where is the mod?','💜💜💜','mint tea, stream, perfect','mia no cat tonight?','first time here, hi','that lamp is so cute','tell us about that dream','late streams are the best streams','up late again?','good night everyone','it rained here too','love the headphones','can someone mod the chat','spam incoming, i can feel it','nya','came here from a clip','did you finish the scarf?','smile mia 🙂','should sleep, 5 more minutes','any mods? there is a bot','such a quiet night','can you hear the crickets? my window is open']};
function menuLiveOn(){ return S&&S.menuScene&&!$('ovMenu').hidden&&menuView==='main'; }
function menuChatPush(){
  const box=$('mlChat'); if(!box) return; const pool=MENU_CHAT[LANG]||MENU_CHAT.en;
  let t=pick(pool), g=0; while(g++<20 && MS.msgs.slice(-6).some(x=>x.t===t)) t=pick(pool);   /* no repeats on screen */
  const u=genName(); MS.msgs.push({u,t}); if(MS.msgs.length>9) MS.msgs.shift();
  const el=document.createElement('p'); el.className='in'; el.innerHTML=`<b style="color:${nameColor(u)}">${esc(u)}</b>${esc(t)}`;
  box.appendChild(el); while(box.children.length>9) box.removeChild(box.firstChild);
}
function menuSceneTick(dt){
  if(!S||!S.menuScene) return;
  const m=S.mia; S.t+=dt;
  m.blinkT-=dt; if(m.blinkT<=0){ m.blinkT=rnd(2,5); m.blink=.15; } m.blink=Math.max(0,m.blink-dt);
  m.lookT-=dt; if(m.lookT<=0){ m.lookT=rnd(2,5); m.look=Math.random()<.7?0:rnd(-.6,.6); }
  /* he stands at the window most of the time, now and then steps away */
  MS.stT-=dt; if(MS.stT<=0){ if(S.st.stage==='window'){ S.st.stage='hidden'; MS.stT=rnd(5,8); } else { S.st.stage='window'; S.st.p=rnd(.75,.9); MS.stT=rnd(16,26); } }
  if(!menuLiveOn()) return;
  MS.vT-=dt; if(MS.vT<=0){ MS.vT=rnd(2,4); MS.viewers=clamp(MS.viewers+Math.round(rnd(-9,11)),1100,1420); const v=$('mlViewers'); if(v) v.textContent=T('mlViewers',{n:MS.viewers.toLocaleString(LANG==='ru'?'ru-RU':'en-US')}); }
  MS.muT-=dt; if(MS.muT<=0){ MS.muT=rnd(9,16); if(A.ctx&&A.ctx.state==='running') mumble(3+((Math.random()*4)|0),true); }
}
/* draw the room (render.js #feed) into the full-screen menu canvas: fit the complete feed at its original aspect ratio */
function menuDraw(){
  const cv=$('menuCv'); if(!cv||$('ovMenu').hidden) return;
  const W=Math.max(1,Math.round(cv.clientWidth/2)), H=Math.max(1,Math.round(cv.clientHeight/2));
  if(cv.width!==W||cv.height!==H){ cv.width=W; cv.height=H; }
  else if(!menuLiveOn() && cv._drawn) return;
  const scale=Math.min(W/feed.width,H/feed.height);
  const width=feed.width*scale, height=feed.height*scale;
  const c=cv.getContext('2d');
  c.fillStyle='#100d12'; c.fillRect(0,0,W,H);
  c.drawImage(feed,(W-width)/2,(H-height)/2,width,height);
  c.fillStyle=menuLiveOn()?'rgba(0,0,0,.22)':'rgba(0,0,0,.68)'; c.fillRect(0,0,W,H);   /* dim baked in - no CSS filter on a live canvas */
  cv._drawn=true;
}
function renderMenuLive(){
  const ni=nextNightIdx(), N=NIGHTS[ni], first=PROG.onboardMon!==2&&PROG.unlocked===0;
  const endOpen=PROG.unlocked>=3||PROG.done;
  const tiles=[
    `<button class="mltile" data-go="nights" type="button"><b>🌙 ${esc(T('nights'))}</b><span>${Math.min(PROG.unlocked+(PROG.done?1:0),NIGHTS.length)}/${NIGHTS.length}</span></button>`,
    `<button class="mltile${affordUp()?' canbuy':''}" data-go="shop" type="button"><b>🛒 ${esc(T('shop'))}</b><span>${affordUp()?esc(T('canBuyShort')):esc(T('upgrades'))}</span></button>`,
    `<button class="mltile" data-go="endless" type="button" ${endOpen?'':'disabled'}><b>∞ ${esc(T('endlessShort'))}</b><span>${endOpen?esc(T('best',{n:PROG.best})):esc(T('endlessLocked'))}</span></button>`,
    `<button class="mltile" data-go="howto" type="button"><b>? ${esc(T('tutTile'))}</b><span>${esc(T('howto'))}</span></button>`,
    lastDeskKey()?`<button class="mltile" id="deskBtn" type="button"><b>🖥 ${esc(T('deskTile'))}</b><span>${esc(T('deskTileSub'))}</span></button>`:'',
    dailyAvailable()?`<button class="mltile daily2" id="dailyBtn" type="button"><b>🎁 ${esc(T('dailyClaim',{v:dailyValue()}))}</b><span>${esc(T('daily'))}</span></button>`
      :`<div class="mltile done"><b>✓ ${esc(T('daily'))}</b><span>${esc(T('dailyDone',{s:PROG.daily.streak+1}))}</span></div>`
  ].filter(Boolean).join('');
  return `<div class="ml-top"><span class="ml-live">● LIVE</span><span class="ml-chip" id="mlViewers">${esc(T('mlViewers',{n:MS.viewers.toLocaleString(LANG==='ru'?'ru-RU':'en-US')}))}</span><span class="ml-chip ml-clock">23:58</span>
      <span class="ml-chip ml-bank"><span class="coin">HC</span><b>${PROG.bank}</b></span></div>
    <div class="ml-title"><h1 class="logo">${LOGO_HTML}</h1><p>${esc(T('sub'))}</p></div>
    <div class="ml-chat"><div class="ml-msgs" id="mlChat"></div><p class="ml-role">⚑ ${esc(T('mlRole'))}</p></div>
    <div class="ml-act"><button class="pbtn ban ml-play" id="playBtn" type="button"><b>▶ ${esc(T('mlShift'))}</b><small>${esc(first?T('g_first'):T('playNight',{n:ni+1,day:T('dayName_'+N.key)}))}</small></button>
      <div class="ml-grid">${tiles}</div></div>
    <div class="ml-foot"><span class="ml-note">${esc(T('note'))}</span><div class="ml-btns"><div class="langsw" role="group" aria-label="Language"><button type="button" data-lang="en">EN</button><button type="button" data-lang="ru">RU</button></div>
      <button class="ml-ic" id="menuSound" type="button" title="${esc(T('sound'))}">${A.muted?'✕':'♪'}</button><button class="ml-ic fsbtn" type="button" title="${esc(T('fullscreen'))}">⛶</button></div></div>`;
}
function renderMenu(){
  const box=$('menuBody'); if(!box||$('ovMenu').hidden) return;
  const coin=`<span class="bankchip"><span class="coin">HC</span><b>${PROG.bank}</b></span>`;
  const back=`<button class="pbtn plain sm" data-go="main" type="button"><b>← ${esc(T('back'))}</b></button>`;
  let h='';
  const live=menuView==='main', lv=$('menuLive');
  $('ovMenu').classList.toggle('live',live); box.hidden=live; lv.hidden=!live;
  /* 11.11 fix: only one screen may hold #playBtn etc. - a stale hidden copy stole the clicks (shop "Night N" did nothing) */
  if(live) box.innerHTML=''; else lv.innerHTML='';
  $('menuCv')._drawn=false; menuDraw();
  if(live){ lv.innerHTML=renderMenuLive(); MS.msgs=[]; for(let i=0;i<8;i++) menuChatPush(); bindMenu(lv); return; }   /* chat: filled once on open, does not scroll (perf, author 11.11) */
  if(false){
  } else if(menuView==='nights'){
    h=`<div class="mtop"><h2>${esc(T('nights'))}</h2>${coin}</div><div class="diffsw"><span>${esc(T('diff'))}:</span>${['easy','normal','hard'].map(d=>`<button type="button" class="${PROG.diff===d?'on':''}" data-diffsw="${d}">${esc(T('diff_'+d))}</button>`).join('')}</div><div class="nightgrid">`+NIGHTS.map((N,i)=>{
      const open=i<=PROG.unlocked; return `<button class="nightbtn${N.story?' story':''}" type="button" data-night="${i}" ${open?'':'disabled'}><b>${i+1}</b><span>${esc(T('dayName_'+N.key))}</span><em>${open?esc(nightTag(N)):esc(T('locked'))}</em>${open&&PROG.stars&&PROG.stars[N.key]?`<i class="nstars" title="${esc(T('diff_'+['','easy','normal','hard'][PROG.stars[N.key]]))}">${'★'.repeat(PROG.stars[N.key])}</i>`:''}</button>`; }).join('')+`</div>${back}`;
  } else if(menuView==='diff'){
    h=`<div class="mtop"><h2>${esc(T('diffTitle'))}</h2>${coin}</div><p class="sub">${esc(T('diffSub'))}</p><div class="diffgrid">`+['easy','normal','hard'].map(d=>
      `<button class="diffcard ${d}${PROG.diff===d?' on':''}" type="button" data-diff="${d}"><b>${esc(T('diff_'+d))}</b><span>${esc(T('diffD_'+d))}</span>${d==='normal'?`<em>${esc(T('diffRec'))}</em>`:''}</button>`).join('')+`</div>${back}`;
  } else if(menuView==='shop'){
    h=`<div class="mtop"><h2>${esc(T('shop'))}</h2>${coin}</div>
      ${SHOP_LOOKS?`<div class="tabs"><button type="button" class="${shopTab==='up'?'on':''}" data-tab="up">${esc(T('upgrades'))}</button><button type="button" class="${shopTab==='look'?'on':''}" data-tab="look">${esc(T('looks'))}</button></div>`:''}`;
    if(!SHOP_LOOKS) shopTab='up';
    if(shopTab==='up') h+=`<div class="uplist">`+UPGRADES.map(u=>{ const lv=upLv(u.id), max=lv>=u.lv.length, price=max?0:u.lv[lv], [nm,ds]=TA('up_'+u.id);
        return `<div class="uprow"><div class="upinfo"><b>${esc(nm)}</b><span>${esc(ds)}</span></div><div class="pips">${u.lv.map((_,k)=>`<i class="${k<lv?'on':''}"></i>`).join('')}</div>
        ${max?`<span class="maxed">${esc(T('maxed'))}</span>`:`<button class="pbtn buy" type="button" data-up="${u.id}" ${PROG.bank<price?'disabled':''}><span class="coin">HC</span><b>${price}</b></button>`}</div>`; }).join('')+`</div>`;
    else h+=`<div class="looklist">`+Object.keys(LOOKS).map(cat=>`<div class="lookcat"><b>${esc(T('look_'+cat))}</b><div class="swatches">`+LOOKS[cat].map(o=>{
        const own=PROG.owned[cat].includes(o.id), wear=PROG.wear[cat]===o.id, col=cat==='lights'?`rgb(${o.c[0]})`:(Array.isArray(o.c)?o.c[0]:o.c);
        return `<button type="button" class="sw${wear?' wear':''}" data-cat="${cat}" data-look="${o.id}" ${!own&&PROG.bank<o.p?'disabled':''}><i style="background:${col}"></i><span>${esc(T('lk_'+o.id))}</span><em>${wear?esc(T('wearing')):own?esc(T('owned')):`${o.p} HC`}</em></button>`; }).join('')+`</div></div>`).join('')+`</div>`;
    { const ni=nextNightIdx(), N=NIGHTS[ni]; // straight back into the game from the shop
      h+=`<div class="row shopfoot"><button class="pbtn ban cta" id="playBtn" type="button"><b>▶ ${esc(!PROG.tut&&PROG.unlocked===0?T('g_first'):T('playNight',{n:ni+1,day:T('dayName_'+N.key)}))}</b></button>${back}</div>`; }
  } else if(menuView==='howto'){
    h=`<div class="mtop"><h2>${esc(T('howto'))}</h2>${coin}</div><ul>${T('rulesShort')}</ul>${MOBILE?'':`<div class="keys">${esc(T('keys'))}</div>`}<div class="row"><button class="pbtn ban cta" id="guideGoBtn" type="button"><b>▶ ${esc(T('g_replay'))}</b></button><button class="pbtn plain" id="tutGoBtn" type="button"><b>${esc(T('tutGo'))}</b></button>${back}</div>`;
  } else if(menuView==='endless'){
    h=`<div class="mtop"><h2>${esc(T('endless'))}</h2>${coin}</div><p class="sub">${esc(TA('di_endless',{n:1})[1])}</p>
      <div class="lb" id="lbBox"><b>${esc(NO_LB?T('best',{n:PROG.best}):T('lbTitle'))}</b><div class="lbrows">${NO_LB?'':esc(T('best',{n:PROG.best}))}</div></div>
      <div class="row"><button class="pbtn ban cta" id="endlessGo" type="button"><b>▶ ${esc(T('play'))}</b></button>${back}</div>`;
    if(!NO_LB) pfTop().then(r=>{ const el=document.querySelector('#lbBox .lbrows'); if(!el) return;
      if(!r||!r.entries||!r.entries.length){ el.innerHTML=`<span class="note">${esc(T('lbEmpty'))}</span>`; return; }
      el.innerHTML=r.entries.map(e=>`<div class="lbrow${r.userRank===e.rank?' me':''}"><span>${e.rank}</span><b>${esc((e.player&&e.player.publicName)||'—')}</b><em>${e.score}</em></div>`).join(''); });
  }
  box.innerHTML=h; bindMenu(box);
}
function bindMenu(box){
  try{ fsLabels(); }catch(e){}
  box.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ menuView=b.dataset.go; SFX.click(); renderMenu(); });
  box.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{ shopTab=b.dataset.tab; renderMenu(); });
  box.querySelectorAll('[data-diff]').forEach(b=>b.onclick=()=>{ PROG.diff=b.dataset.diff; PROG.diffChosen=true; saveProg(); SFX.click(); const i=diffPending; diffPending=null; if(i!=null) startNight(i,{}); else { menuView='main'; renderMenu(); } });
  box.querySelectorAll('[data-diffsw]').forEach(b=>b.onclick=()=>{ PROG.diff=b.dataset.diffsw; PROG.diffChosen=true; saveProg(); SFX.click(); renderMenu(); });
  box.querySelectorAll('[data-night]').forEach(b=>b.onclick=()=>startNight(+b.dataset.night));
  box.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>buyUpgrade(b.dataset.up));
  box.querySelectorAll('[data-look]').forEach(b=>b.onclick=()=>pickLook(b.dataset.cat,b.dataset.look));
  box.querySelectorAll('[data-lang]').forEach(b=>{ b.classList.toggle('on',b.dataset.lang===LANG); b.onclick=()=>setLang(b.dataset.lang); });
  const pb=box.querySelector('#playBtn'); if(pb) pb.onclick=()=>startNight(nextNightIdx());
  const tg=box.querySelector('#tutGoBtn'); if(tg) tg.onclick=startTutorial;
  const gg=box.querySelector('#guideGoBtn');if(gg)gg.onclick=()=>startNight(0,{guide:true});
  const db=box.querySelector('#dailyBtn'); if(db) db.onclick=claimDaily;
  const dk=box.querySelector('#deskBtn'); if(dk) dk.onclick=()=>{ SFX.click(); $('ovMenu').hidden=true; showDesktop(lastDeskKey(),()=>openMenu('main'),true); };
  const eg=box.querySelector('#endlessGo'); if(eg) eg.onclick=()=>startEndless(0);
  const ms=box.querySelector('#menuSound'); if(ms) ms.onclick=()=>{ setMuted(!A.muted); $('muteLbl').textContent=T(A.muted?'soundOff':'soundOn'); renderMenu(); };
}
function buyUpgrade(id){
  const u=UPGRADES.find(x=>x.id===id), lv=upLv(id); if(!u||lv>=u.lv.length||PROG.bank<u.lv[lv]) return;
  stat('shop/'+id+'/'+(lv+1));
  PROG.bank-=u.lv[lv]; PROG.up[id]=lv+1; saveProg(); SFX.donate(); renderMenu();
}
function pickLook(cat,id){
  const o=LOOKS[cat].find(x=>x.id===id); if(!o) return;
  if(!PROG.owned[cat].includes(id)){ if(PROG.bank<o.p) return; PROG.bank-=o.p; PROG.owned[cat].push(id); SFX.donate(); }
  PROG.wear[cat]=id; saveProg(); applyLooks(); renderMenu();
}
