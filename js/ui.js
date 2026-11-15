"use strict";
// ======================= UI: reads the game state and updates the screen =======================
const $=id=>document.getElementById(id);
let captionTimer=0, hl=null;

// --- fit the 1536×1024 stage into any window without scrollbars
// Desktop: 1536×1024 desk scene. Phones in landscape: a compact 1280×600 console with bigger controls.
const IS_TOUCH = (window.matchMedia && matchMedia('(pointer:coarse)').matches) || 'ontouchstart' in window;
let MOBILE=false;
function fitStage(){
  const w=window.innerWidth, h=window.innerHeight, st=$('stage');
  MOBILE = (IS_TOUCH && Math.min(w,h)<=820) || w<760;
  const WIDE=!MOBILE&&w/h>=1.7;
  const PHONE=MOBILE&&w>h&&h<=600;
  const SW=PHONE?w:MOBILE?1100:WIDE?1672:1536;
  const SH=PHONE?h:MOBILE?Math.max(510,1100*h/w):WIDE?941:1024;
  st.classList.toggle('mobile',MOBILE); st.classList.toggle('wide',!MOBILE&&w/h>=1.7);
  st.classList.toggle('phone-ui',PHONE);
  st.classList.toggle('compact',!MOBILE&&w/h<1.5);
  st.classList.toggle('ultrawide',!MOBILE&&w/h>=2.2);
  st.style.width=SW+'px'; st.style.height=SH+'px';
  const s=Math.min(w/SW,h/SH);
  st.style.transform=`translate(-50%,-50%) scale(${s})`;
  if(typeof uxLayoutChrome==='function') uxLayoutChrome();
  if(typeof mobileLayoutChrome==='function') mobileLayoutChrome();
  if(typeof onboardingLayout==='function') onboardingLayout();
  $('rotate').hidden = !(IS_TOUCH && h>w);
}
window.addEventListener('resize',()=>{ fitStage(); try{ placeCallout(); }catch(e){} });

// --- Mia speaks (subtitle). On Wednesday/Friday the stalker sometimes types her line before she says it.
function say(key,text,cool=8){
  if(!S||S.tut.active) return; const now=S.t;
  if(S.running&&S.storyCaptionUntil>now&&key!=='story')return;
  if(S.mia.last[key]!==undefined && now-S.mia.last[key]<cool) return;
  if(now-S.mia.lineT<2.2 && key!=='force') return;
  S.mia.last[key]=now; S.mia.lineT=now;
  const show=()=>{ const el=$('caption');el.classList.toggle('story-key',key==='story'); el.innerHTML='<b>'+(LANG==='ru'?'Мия':'Mia')+':</b> '+esc(text); el.hidden=false; captionTimer=4.2; mumble(Math.min(14,Math.max(3,Math.round(String(text).length/5)))); };
  show();
}
function tipKeyOf(text){ for(const L of ['en','ru']) for(const k in STR[L]) if(STR[L][k]===text) return k; return null; }
function tip(id,text){ if(!S||S.tipsDone[id]||S.tut.active) return;
  if(S.guide&&S.guide.active){S.guide.pendingTip={id,text};return;}
  S.tipsDone[id]=1; S.tipKey=tipKeyOf(text); $('tip').textContent=text; $('tip').parentElement.classList.remove('new'); void $('tip').offsetWidth; $('tip').parentElement.classList.add('new');
  if(MOBILE){ const t=$('tipToast'); t.textContent=text; t.hidden=false; t.classList.remove('go'); void t.offsetWidth; t.classList.add('go'); clearTimeout(tip._h); tip._h=setTimeout(()=>{ t.hidden=true; },Math.min(9000,3500+text.length*45)); } }  // phones have no sticky note: the tip pops over the chat
/* on-video hint captions (sound cue, breaker, blinds): easy only, and each one only on the first night it comes up (remembered in PROG.hintSeen) */
function hintOk(k){ if(!S||S.night.diff!=='easy'||S.night.endless) return false; const H=PROG.hintSeen=PROG.hintSeen||{}, n=S.night.key;
  if(H[k]===undefined){ H[k]=n; saveProg(); } return H[k]===n; }
function floaty(t){ const el=$('floaty'); el.textContent=t; el.classList.add('show'); S.floatT=2.2; }
// tutorial card: sits over the chat (or over the bottom of the video for chat steps) so it never hides him or the controls
function callout(t,k,opt){
  opt=opt||{}; $('calloutText').textContent=t; $('calloutKey').textContent=MOBILE?'':(k||''); $('calloutKey').hidden=MOBILE||!k;
  $('calloutStep').textContent=opt.step||''; const nb=$('calloutNext'); nb.hidden=!opt.next; nb.textContent=(opt.nextLbl||T('tutNext'))+' →';
  const c=$('callout'); c.hidden=false; c.dataset.at=opt.at||'chat'; placeCallout();
}
function placeCallout(){
  const c=$('callout'); if(c.hidden) return; const scr=$('screen'), base=scr.getBoundingClientRect(), k=scr.offsetWidth/base.width;
  const tgt=c.dataset.at==='video'?$('video'):$('chat'), r=tgt.getBoundingClientRect();
  const L=(r.left-base.left)*k, Tp=(r.top-base.top)*k, Wd=r.width*k, Ht=r.height*k, pad=12;
  c.style.width=(Wd-pad*2)+'px'; c.style.left=(L+pad)+'px';
  const h=c.offsetHeight; c.style.top=(Tp+Ht-h-pad)+'px';
}
function hideCallout(){ $('callout').hidden=true; }
function highlight(el){ if(hl) hl.classList.remove('pulse'); hl=el; if(el) el.classList.add('pulse'); }
function clockStr(){ if(S&&S.clockGlitch>0) return '11.08'; const mins=Math.floor(streamMin()); return mins>=60?'00:00':'23:'+String(mins).padStart(2,'0'); }

// --- system status (shown in the SYSTEM module)
function systemStatus(){
  const dead=ZONES.filter(z=>S.lamps[z].burned).length;
  if(S.signalLost || (S.over&&S.overReason==='kill') || S.glitch>.5) return ['SIGNAL LOST','sm_signal',3];
  if(dead>=2) return ['POWER OFFLINE','sm_power',3];
  if(dead===1) return ['LIGHT FAILURE','sm_light',2];
  if(S.running && STAGE_LAMP[S.st.stage]) return ['WARNING','sm_stalker',2];
  if(S.panic>75) return ['WARNING','sm_panic',2];
  if(ZONES.some(z=>S.lamps[z].heat>80)) return ['WARNING','sm_heat',1];
  if(S.mia.awayT>0) return ['WARNING','sm_away',1];
  return ['SYSTEM OK','sm_ok',0];
}
// build the LED grid once: 3 rows (window/door/closet) × 4 (mode, heat, motion, health)
const LED_ROWS=['window','door','closet'];
(function(){ const g=$('ledgrid'); for(let r=0;r<3;r++) for(let c=0;c<4;c++){ const i=document.createElement('i'); i.dataset.r=r; i.dataset.c=c; g.appendChild(i); } })();

function setSeg(el,v){ el.style.setProperty('--v',clamp(v,0,100)+'%'); }
function hud(dt){
  if(!S) return;
  const st=S.st;
  $('clock').textContent=clockStr(); $('digits').textContent=clockStr();
  /* a quiet fair-play hint: a phone's network and battery in the corner of "your monitor" (later nights start lower and it drains) */
  { const i=Math.max(0,NIGHTS.findIndex(n=>n.key===S.night.key)), b=Math.max(3,Math.round(92-i*9-(S.t/S.len)*14)); const nb=$('netbat'); const txt='LTE ▂▄▆ '+b+'%'; if(nb.textContent!==txt) nb.textContent=txt; nb.classList.toggle('low',b<20); }
  $('viewers').textContent=Math.round(S.viewers).toLocaleString(LANG==='ru'?'ru-RU':'en-US');
  $('stars').textContent=S.trust+'/'+S.maxTrust;
  setSeg($('panicfill'),S.panic); $('panicval').textContent=Math.round(S.panic)+'%';
  $('panicbar').classList.toggle('crit',S.panic>=80); $('streamPanel').classList.toggle('crit',S.panic>=85);
  setSeg($('nightfill'),dprog()*100);
  $('dayLbl').textContent=T('dayLbl_'+DY().key,{n:(DY().n||0)+1});
  // chat activity + unread
  const leds=$('activity').children, lit=Math.min(8,Math.round(S.rate*1.6));
  for(let i=0;i<8;i++) leds[i].className = i<lit ? (i>5?'r':i>3?'y':'g') : '';
  $('toxfill').style.width=Math.round(S.tox)+'%'; $('toxbar').classList.toggle('hot',S.tox>TOX.half); $('toxbar').classList.toggle('crit',S.tox>80);
  $('newcount').textContent='+'+S.unread; $('newcount').classList.toggle('on',S.unread>0);
  const sel=S.selected!=null?S.chat.find(m=>m.id===S.selected):null;
  $('chatfoot').textContent= sel ? T('chatFootSel',{user:sel.user}) : T('chatFoot');
  // actions
  $('hcval').textContent=S.hc; setSeg($('hcfill'),S.hc/donateCost()*100); $('donateCost').textContent=donateCost();
  $('actDonate').disabled=!S.running||S.hc<donateCost()||S.donate.cd>0;
  const rb=$('actRec'); rb.disabled=!S.running||S.rec.active>0||S.rec.cd>0; rb.classList.toggle('recording',S.rec.active>0);
  cd(rb,S.rec.cd,CD.rec);
  $('actBan').disabled=!S.running && !(FIN.active&&FIN.phase===6); $('actBan').classList.toggle('armed',!!sel);
  const cr=$('credits'); while(cr.children.length<S.maxTrust) cr.appendChild(document.createElement('i')); while(cr.children.length>S.maxTrust) cr.removeChild(cr.lastChild);
  [...cr.children].forEach((el,i)=>{ el.classList.toggle('off',i>=S.trust); });
  if(S.trustHit){ S.trustHit=0; const c=$('credits').children[S.trust]; if(c){ c.classList.remove('crack'); void c.offsetWidth; c.classList.add('crack'); } }
  // lamps
  for(const z of ZONES){
    const L=S.lamps[z], card=$('lamp-'+z), m=lampMode(z);
    const motion = S.running && STAGE_LAMP[st.stage]===z;
    const adapting = motion && L.mode==='BOOST' && st.boostT>adaptAt()-2 && !S.tut.active;
    card.classList.toggle('burned',L.burned); card.classList.toggle('hot',!L.burned&&L.heat>80);
    const redHere = motion && st.red && st.stage!=='behind';
    if(L.surgeT>0) L.surgeT-=dt; card.classList.toggle('surged',L.surgeT>0); card.classList.toggle('redeyes',redHere);
    card.classList.toggle('motion',motion); card.classList.toggle('adapt',adapting);
    card.querySelector('.bulb').className='bulb '+m.toLowerCase()+(L.flick<1?' flick':'');
    card.querySelectorAll('.mk').forEach(b=>{ b.classList.toggle('on',!L.burned&&b.dataset.m===L.mode); b.disabled=!S.running||L.burned; });
    setSeg(card.querySelector('.prox i'), motion?st.p*100:0);
    const pr=card.querySelector('.prox'), fz=motion && st.frozenT>0; pr.classList.toggle('frozen',fz); if(fz) pr.dataset.fz=T('fz')+' '+Math.ceil(st.frozenT);
    card.classList.toggle('cue', S.cueZ===z && S.cueT>0);
    setSeg(card.querySelector('.heat i'), L.burned?100:L.heat);
    card.querySelector('.hv').textContent=L.burned?'—':Math.round(L.heat)+'%';
    const key = L.burned ? 'ls_dead' : redHere ? 'ls_red' : L.surgeT>0 ? 'ls_surge' :
      adapting ? 'ls_adapt' : L.heat>80 ? 'ls_hot' : motion ? 'motion' :
      L.mode==='DIM' && L.heat>0 ? 'ls_cool' : 'ls_ok';
    const status = card.querySelector('.lstatus');
    const type = key==='ls_ok' ? 'ok' : key==='ls_cool' ? 'cooling' : 'alert';
    if(status.dataset.type!==type){
      status.dataset.type=type;
      status.querySelector('use').setAttribute('href','#i-'+type);
    }
    const label = key==='motion' ? T(key)+' · '+T('z_'+z) : T(key);
    if(status.lastElementChild.textContent!==label) status.lastElementChild.textContent=label;
  }
  blindsHud();
  // smart home
  for(const [k,id] of [['dog','actDog'],['steps','actSteps'],['alarm','actAlarm']]){ const b=$(id); b.disabled=!S.running||S.sh[k]>0; cd(b,S.sh[k],CD[k]); }
  // system module
  const [code,msg,lv]=systemStatus(); $('sysTitle').textContent=T({'SYSTEM OK':'sc_ok','WARNING':'sc_warn','LIGHT FAILURE':'sc_light','POWER OFFLINE':'sc_power','SIGNAL LOST':'sc_signal'}[code]); $('sysmsg').textContent=T(msg); $('systemPanel').dataset.lv=lv;
  const grid=$('ledgrid').children;
  LED_ROWS.forEach((z,r)=>{ const L=S.lamps[z], m=lampMode(z), cells=[...grid].slice(r*4,r*4+4);
    cells[0].className = m==='DEAD'?'off':m==='DIM'?'b':m==='BOOST'?'o':'y';
    cells[1].className = L.burned?'off':L.heat>80?'r blink':L.heat>45?'y':'g';
    cells[2].className = STAGE_LAMP[st.stage]===z?'r blink':'off';
    cells[3].className = L.burned?'r':'g'; });
  // badges, captions
  $('recind').hidden=!(S.rec.active>0 && Math.floor(S.t*2)%2===0);
  $('focusbadge').hidden=!(S.focus>0); $('awaybadge').hidden=!(S.mia.awayT>0);
  if($('tip2').textContent!==$('tip').textContent) $('tip2').textContent=$('tip').textContent;
  if(captionTimer>0){ captionTimer-=dt; if(captionTimer<=0) $('caption').hidden=true; }
  if(S.floatT>0){ S.floatT-=dt; if(S.floatT<=0) $('floaty').classList.remove('show'); }
}
/* blinds: big button on the window lamp. shut = time left closed, cooldown = fill + seconds, call = pulse when he is at the window */
function blindsHud(){
  const b=S.blinds, bb=$('actBlinds'), st=S.st, max=8+3*upLv('blinds');
  const cool=!b.closed&&b.cd>0, ready=!b.closed&&!cool&&!b.jammed;
  $('blindsLbl').textContent=T(b.jammed&&!b.closed?'blindsJam':b.closed?'blindsClosed':'blindsOpen');
  $('blindsT').textContent= b.closed?Math.ceil(Math.max(0,b.timer)) : cool?Math.ceil(b.cd)+(LANG==='ru'?' с':'s') : '';
  bb.classList.toggle('shut',b.closed); bb.classList.toggle('cool',cool); bb.classList.toggle('jam',!!b.jammed&&!b.closed);
  bb.classList.toggle('call', S.running && ready && ((st.stage==='window' && st.p<=.5) || S.winOpen || (S.cueZ==='window'&&S.cueT>0)));
  bb.disabled=!S.running||cool;
  const f=bb.querySelector('.cd'); f.style.width=(b.closed?Math.max(0,b.timer)/max*100 : cool?(1-b.cd/CD.blinds)*100 : 0)+'%';
}
function cd(btn,v,max){ const e=btn.querySelector('.cd'); if(e) e.style.width=(v>0?v/max*100:0)+'%'; }

// --- language
function applyLang(){ try{ if(typeof banLegend==='function') banLegend(); }catch(e){}
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent=T(el.dataset.i18n); });
  if(NO_ADS){ document.querySelectorAll('.adtag').forEach(e=>e.remove()); const cs=document.querySelector('#contBtn small'); if(cs) cs.dataset.i18n='continueSubFree'; document.querySelectorAll('[data-i18n="continueSubFree"]').forEach(el=>el.textContent=T('continueSubFree')); }
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{ el.innerHTML=T(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===LANG));
  $('muteLbl').textContent=T(A.muted?'soundOff':'soundOn');
  $('tip').textContent=T((S&&S.tipKey)||'tip0');
  if(typeof renderMenu==='function') renderMenu();
  if(S&&S.over&&lastEnd&&!$('ovEnd').hidden) showEnd(lastEnd);
  if(S) hud(0);
}
function setLang(l){ LANG=l; try{ localStorage.setItem('mod_lang',l); }catch(e){} applyLang(); try{ fsLabels(); }catch(e){} }
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));

// --- chat hover pauses autoscroll
$('chat').addEventListener('mouseenter',()=>{ chatHover=true; });
$('chat').addEventListener('mouseleave',()=>{ chatHover=false; if(S) S.unread=0; list.scrollTop=list.scrollHeight; });

fitStage();

// a mouse click must not leave a focus ring behind (it showed up again on the next key press)
document.addEventListener('pointerup',e=>{ const b=e.target.closest&&e.target.closest('button'); if(b) setTimeout(()=>b.blur(),0); });

