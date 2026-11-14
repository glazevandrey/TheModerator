"use strict";
// ======================= CHAT & MODERATION =======================
const NAME_A=['sleepy','pixel','bean','noodle','vhs','lamp','moth','cozy','soft','tiny','static','night','cloud','mint','fern','echo','velvet','dusk','paper','lofi','frog','rain','neon','mochi'];
const NAME_B=['otter','moth','water','cat','ghost','enjoyer','boi','fox','gremlin','sprout','wave','owl','toast','mango','bird','byte','kid','witch','raccoon','bun'];
function genName(){
  const s=Math.random();
  if(s<.45) return pick(NAME_A)+'_'+pick(NAME_B);
  if(s<.7) return pick(NAME_A)+pick(NAME_B)+((Math.random()*99)|0);
  if(s<.85) return pick(NAME_B)+'.'+pick(NAME_A);
  return pick(NAME_A)+pick(NAME_B);
}
function disguise(n){ // the stalker mimics a real viewer's name with one swapped character
  const map={o:'0',l:'1',i:'l',e:'3',a:'4',s:'5'};
  const idx=[...n].map((c,i)=>map[c]?i:-1).filter(i=>i>=0);
  if(!idx.length) return n+'_';
  const i=pick(idx); return n.slice(0,i)+map[n[i]]+n.slice(i+1);
}
function hashOf(n){ let h=0; for(const c of n) h=(h*31+c.charCodeAt(0))>>>0; return h; }
const NAME_COLORS=['#d9a066','#9fb38a','#8fb0bd','#c99ab8','#d6c27a','#b9a08c','#9aa7d1','#c98f7a'];
function nameColor(n){ return NAME_COLORS[hashOf(n)%NAME_COLORS.length]; }

// little hand-made avatar faces (SVG): mood depends on the user type
function avatarSVG(m){
  const h=hashOf(m.user||'x'), col=nameColor(m.user||'x');
  if(m.type==='donation') return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#647C86"/><path d="M12 18s-5.5-3.3-5.5-7.4A3 3 0 0 1 12 8.8a3 3 0 0 1 5.5 1.8C17.5 14.7 12 18 12 18z" fill="#E9B65E"/></svg>`;
  if(m.type==='stalker' && m.user==='Stranger_99') return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1d1a1c"/><path d="M6.5 11a5.5 5.5 0 0 1 11 0v2.5l-1.8 1.3V17H8.3v-2.2L6.5 13.5z" fill="#d6c9b7"/><circle cx="9.6" cy="11.4" r="1.6" fill="#1d1a1c"/><circle cx="14.4" cy="11.4" r="1.6" fill="#1d1a1c"/><path d="M10 15.2h4M11 15v2M13 15v2" stroke="#1d1a1c" stroke-width=".8"/></svg>`;
  if(m.type==='troll') return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#9a4a42"/><path d="M6.8 8.6l3.4 1.4M17.2 8.6l-3.4 1.4" stroke="#2a1512" stroke-width="1.6" stroke-linecap="round"/><circle cx="9" cy="11.6" r="1.3" fill="#2a1512"/><circle cx="15" cy="11.6" r="1.3" fill="#2a1512"/><path d="M8.5 17c2-2 5-2 7 0" fill="none" stroke="#2a1512" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  if(m.type==='spam') return `<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="5" fill="#756B68"/><rect x="6.5" y="9" width="3.5" height="3" fill="#D6C9B7"/><rect x="14" y="9" width="3.5" height="3" fill="#D6C9B7"/><path d="M8 16h8" stroke="#D6C9B7" stroke-width="1.6"/><path d="M12 3V0" stroke="#756B68" stroke-width="1.6"/></svg>`;
  /* 12.11: his disguised messages ("your window is so clean...") get an evil devil face */
  if(m.type==='stalker') return `<svg viewBox="0 0 24 24"><path d="M4.2 8.5L3 1.8l5.2 3.6zM19.8 8.5L21 1.8l-5.2 3.6z" fill="#b8342c"/><circle cx="12" cy="12.6" r="10.4" fill="#6a2440"/><path d="M6.6 9.4l3.6 1.6M17.4 9.4l-3.6 1.6" stroke="#1a0a10" stroke-width="1.7" stroke-linecap="round"/><circle cx="9.2" cy="12.2" r="1.25" fill="#ffd36b"/><circle cx="14.8" cy="12.2" r="1.25" fill="#ffd36b"/><path d="M7.6 15.4q4.4 3.8 8.8 0" fill="#1a0a10"/><path d="M9.4 16.3l.7 1.1.7-.9M13.2 16.4l.7 1 .7-1.1" fill="#f1e8d8"/></svg>`;
  const stalk=false;
  const eye=stalk?`<circle cx="9" cy="11" r="1.6" fill="none" stroke="#2a2220" stroke-width="1"/><circle cx="15" cy="11" r="1.6" fill="none" stroke="#2a2220" stroke-width="1"/>`
                 :`<circle cx="9" cy="11" r="1.4" fill="#2a2220"/><circle cx="15" cy="11" r="1.4" fill="#2a2220"/>`;
  const mood=stalk?`<path d="M9 16.2h6" stroke="#2a2220" stroke-width="1.4" stroke-linecap="round"/>`
    : (h%3===0?`<ellipse cx="12" cy="16" rx="2" ry="1.6" fill="#2a2220"/>` : h%3===1?`<path d="M8.6 15c1.8 2 5 2 6.8 0" fill="none" stroke="#2a2220" stroke-width="1.5" stroke-linecap="round"/>` : `<path d="M9 15.6h6" stroke="#2a2220" stroke-width="1.5" stroke-linecap="round"/>`);
  const ears=h%4===0?`<path d="M4 7L5 1l5 4zM20 7l-1-6-5 4z" fill="${col}"/>`:'';
  return `<svg viewBox="0 0 24 24">${ears}<circle cx="12" cy="12" r="11" fill="${col}"/><circle cx="6.5" cy="14" r="1.6" fill="rgba(255,120,120,.25)"/><circle cx="17.5" cy="14" r="1.6" fill="rgba(255,120,120,.25)"/>${eye}${mood}</svg>`;
}

const MON_LOG=[]; // the normal messages of Monday, replayed on the second Monday
function pushMsg(type,user,text,opts){
  const m={id:nextId++,type,user,text,t:S.t,banned:false,read:false};
  S.chat.push(m); if(S.chat.length>90) S.chat.shift();
  if(S.night.key==='mon' && type==='normal' && MON_LOG.length<80) MON_LOG.push({user,text});
  renderMsg(m, opts&&opts.top); S.rate+=1;
  /* UI tick; a disguised stalker (copied nick) sounds like a normal viewer, only Stranger_99 himself is the dull low one */
  if(type==='stalker'&&user==='Stranger_99') scareFace();
  if(type!=='sys'&&type!=='donation') chatBlip(type==='stalker'&&user!=='Stranger_99'?'normal':type);
  if(chatHover) S.unread++;
  return m;
}
function recentNormalName(){ const n=S.chat.filter(m=>m.type==='normal').slice(-12); return n.length?pick(n).user:genName(); }
/* Stranger_99 only ever writes while the moderator's hands are off the controls (2.6 s without a click or a key). Otherwise the line waits. */
let lastAct=-1e9; const markAct=()=>{ lastAct=performance.now(); };
document.addEventListener('pointerdown',markAct,true); document.addEventListener('keydown',markAct,true);
function stalkerIdle(){ if(S&&S.guide&&S.guide.active&&S.guide.phase==='ban')return false;return !S||!S.running||S.tut.active||performance.now()-lastAct>2600; }
function stalkerSay(pool,opts){
  if(!stalkerIdle()){ (S.stQ=S.stQ||[]).push({pool,opts,t:S.t}); return {}; }
  const name = opts&&opts.name ? opts.name : Math.random()<.4 ? 'Stranger_99' : (Math.random()<.6 ? disguise(recentNormalName()) : genName());
  const m=pushMsg('stalker',name,typeof pool==='string'?pool:pick(pool),opts);
  if(opts&&opts.read) m.read=true;
  tip('creepy',T('tipCreepy'));
  return m;
}
let monIdx=0;
function chatTick(dt){
  const d=dprog(), ev=DY().ev;
  S.rate=Math.max(0,S.rate-dt*.6);
  S.chatT-=dt;
  if(S.chatT<=0){
    const raid=DY().mod==='raid';
    const N=DY(); S.chatT=rnd(.9,2.1)*(1-.3*d)*(raid?.75:1)*N.chat;
    const r=S.guide&&S.guide.active&&S.guide.phase==='ban'?1:Math.random(), tr=((raid?.3:.12)+.06*d)*N.troll, sp=tr+(raid?.12:.05)*N.troll;
    if(r<tr) pushMsg('troll',genName(),pickTroll());
    else if(r<sp) pushMsg('spam',genName(),pick(C().SPAM));
    else if(ev.repeat && MON_LOG.length && Math.random()<.7){ const x=MON_LOG[monIdx++%MON_LOG.length]; pushMsg('normal',x.user,x.text); }
    else if(!S.tut.active && memeOk() && Math.random()<.07) pushMsg('normal',genName(),memeLine('bg')).meme=true;
    else pushMsg('normal',genName(),pickNormal());
  }
  memeTick();
  // regular viewers react to what they can see on stream
  S.nervousT-=dt;
  if(S.nervousT<=0){
    S.nervousT=rnd(6,11); const st=S.st; const N=C().NERVOUS;
    if(st.stage==='behind') pushMsg('normal',genName(),pick(N.behind));
    else if((st.stage==='window'||st.stage==='door'||st.stage==='closet') && st.p>.35 && Math.random()<.7) pushMsg('normal',genName(),pick(N[st.stage]));
    else if(S.decoy && Math.random()<.35) pushMsg('normal',genName(),pick(N[S.decoy.zone]));   // viewers fall for the decoy too
    else if(S.ev.chairShow>0) pushMsg('normal',genName(),pick(N.chair));
    else if(S.ev.note && Math.random()<.5) pushMsg('normal',genName(),pick(N.note));
    else if(ev.loop && Math.random()<.5) pushMsg('normal',genName(),pick(N.loop));
    else if(ZONES.filter(z=>['DIM','DEAD'].includes(lampMode(z))).length>=2 && Math.random()<.6) pushMsg('normal',genName(),pick(N.dark));
  }
  if(S.tut.active){ for(const m of S.chat) if(m.type!=='stalker'&&!m.read&&S.t-m.t>8) m.read=true; return; }
  const st=S.st;
  if(S.t>(S.tutEnd||0)+10 && !S.tipsDone.anchor){ S.tipsDone.anchor=1; stalkerSay(C().STALKER.anchor,{name:'Stranger_99'}); }
  /* once a night from Wednesday: the mod panel drops off the mobile network for a moment */
  if(!S.reconDone && S.t>S.len*.42 && NIGHTS.findIndex(n=>n.key===DY().key)>=2){ S.reconDone=true; pushMsg('sys','',T('reconnect')); }
  if(S.stQ&&S.stQ.length&&stalkerIdle()){ const q=S.stQ.shift(); if(S.t-q.t<14) stalkerSay(q.pool,q.opts); }
  st.msgT-=dt;
  if(st.msgT<=0){
    st.msgT=rnd(16,26)*(1-.35*d);
    if(ev.breakChat && Math.random()<.4) stalkerSay(C().STALKER.broken,{top:true});      // messages that break the order of the chat
    else if(ev.finale && d>.5 && Math.random()<.4) stalkerSay(C().STALKER.finale);
    else if(st.stage!=='hidden') stalkerSay(Math.random()<.65?C().STALKER[st.stage]:C().STALKER.general);
    else if(S.t>40 && Math.random()<.5) stalkerSay(C().STALKER.general);
  }
  // toxicity: trolls and spam left hanging poison the chat; at 100% viewers mass-report the stream (−1 trust)
  let pend=0; for(let i=S.chat.length-1;i>=0;i--){ const m=S.chat[i], a=S.t-m.t; if(a>24) break; if(!m.banned && a>4 && (m.type==='troll'||m.type==='spam')) pend++; }
  S.tox=clamp(S.tox+(pend*TOX.per*(DY().tox??1)-TOX.decay)*dt,0,100);
  if(S.tox>35) tip('tox',T('tipTox'));
  if(S.tox>TOX.half) S.viewers=Math.max(300,S.viewers-dt*8*(S.tox-TOX.half)/50);
  if(S.tox>=100){ S.tox=55; S.trust--; S.trustHit=1; S.shake=.3; SFX.wrong(); floaty(T('f_reports')); say('reports',T('m_reports'),8);
    pushMsg('sys','',T('sysReports')).read=true; if(S.trust<=0){ endGame('tox'); return; } }
  // Mia reads what moderators leave in chat
  for(const m of S.chat){
    if(m.banned||m.read) continue;
    const age=S.t-m.t;
    if(m.type==='stalker' && age>7*Math.max(1,DY().chat*.7)){ m.read=true; S.stats.readStalker=(S.stats.readStalker||0)+1; addPanic(8); if(st.stage!=='hidden') st.p=Math.min(.95,st.p+.15); else st.wait=Math.max(.5,st.wait-4); /* her fear feeds him */ say('readcreep',T('m_creep',{text:m.text}),5); }
    else if((m.type==='troll'||m.type==='spam') && age>9*Math.max(1,DY().chat*.8)){ m.read=true; addPanic(S.tox>TOX.half?7:4); say('readtroll',T('m_troll'),12); }
  }
}
function ban(id){
  if(typeof FIN!=='undefined' && FIN.active && FIN.phase===6){ finSelfBan(); return; }
  const m=S.chat.find(x=>x.id===id); if(!m||m.banned||m.type==='sys'||m.type==='donation'||!S.running) return;
  if(S.guide&&S.guide.active&&S.guide.phase==='ban'&&m.type==='normal'){SFX.wrong();floaty(T('f_wrongTut'));return;}
  if(S.tut.active && m.type==='normal'){ SFX.wrong(); floaty(T('f_wrongTut')); return; } // tutorial: a free mistake
  if(m.meme){ m.banned=true; if(S.selected===id) S.selected=null; banAnim(m); SFX.ban(); return; }   /* 12.11: a meme line - banning it costs nothing, gives nothing */
  m.banned=true; if(S.selected===id) S.selected=null; banAnim(m);
  if(m.type==='troll'||m.type==='spam'){ S.stats.goodBans++; S.hc+=10; S.tox=Math.max(0,S.tox-TOX.ban); SFX.ban(); if(!S.tut.active) memeSay('ban',.15,900); }
  else if(m.type==='stalker'){
    S.stats.himBans++; SFX.ban(); S.st.aggr=Math.min(2.4,S.st.aggr*1.08);   // +8% advance speed
    later(()=>{ if(Math.random()<.5) stalkerSay(C().STALKER.angry); }, 1500+Math.random()*2000);
  } else {
    S.stats.wrongBans++; S.trust--; addPanic(15,{force:true}); SFX.wrong(); S.shake=.3; S.trustHit=1;
    say('wrongban',T('m_wrong',{user:m.user}),4);
    const who=m.user;
    STR[LANG].riot.map(x=>x.replace(/\{user\}/g,who)).forEach((t,i)=>later(()=>pushMsg('normal',genName(),t),300+i*550));
    if(S.trust<=0) endGame('trust');
  }
}
function banSelected(){ if(typeof FIN!=='undefined' && FIN.active && FIN.phase===6){ finSelfBan(); return; } if(S && S.selected!=null) ban(S.selected); else { const b=$('actBan'); b.classList.add('nope'); setTimeout(()=>b.classList.remove('nope'),400); } }
function selectMsg(id){ if(!S) return; S.selected = S.selected===id?null:id; list.querySelectorAll('.msg.sel').forEach(x=>x.classList.remove('sel')); if(S.selected!=null){ const el=list.querySelector(`[data-id="${id}"]`); if(el) el.classList.add('sel'); } }

// ---- DOM
const list=document.getElementById('chatlist'); let chatHover=false;
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function renderMsg(m,top){
  const el=document.createElement('div');
  el.className='msg in '+m.type+(m.user==='Stranger_99'?' unmasked':'')+(top?' misplaced':''); el.dataset.id=m.id;
  if(m.type==='sys') el.innerHTML=`<span class="t">${esc(m.text)}</span>`;
  else el.innerHTML=`<span class="av">${avatarSVG(m)}</span><span class="body"><span class="u" style="color:${m.user==='Stranger_99'?'#3a2416':m.type==='troll'?'#d77a6e':m.type==='donation'?'#E9B65E':nameColor(m.user)}">${esc(m.user)}</span><span class="t"${m.type==='troll'?' style="color:#e38a7e"':''}>${esc(m.text)}</span></span><button class="msgban" type="button" tabindex="-1"><svg class="i"><use href="#i-gavel"/></svg>${esc(T('banShort'))}</button>`;
  if(top) list.insertBefore(el,list.firstChild); else list.appendChild(el);
  while(list.children.length>70) list.removeChild(top?list.lastChild:list.firstChild);
  if(!chatHover) list.scrollTop=list.scrollHeight;
}
function banAnim(m){
  const el=list.querySelector(`[data-id="${m.id}"]`); if(!el) return;
  el.classList.remove('sel'); el.classList.add('banning');
  setTimeout(()=>{ el.classList.remove('banning'); el.classList.add('deleted'); el.innerHTML=`<span class="t">${esc(T('deleted'))} · ${esc(m.user)}</span>`; },380);
}
list.addEventListener('click',e=>{
  const el=e.target.closest('.msg'); if(!el||el.classList.contains('deleted')) return;
  if(e.target.closest('.msgban')){ ban(+el.dataset.id); return; }
  selectMsg(+el.dataset.id);
});
/* quiet trolls (no insult, easy to miss) only from Friday on; early nights get only the obvious ones */
const QUIET_TROLL=new Set(['отписался','zzzzz','мия, ты серьёзно?','лучше бы спать легла','ни о чём','где контент?','слабенько','выключаю','скилл ишью','ну и скука',
  'unfollowed','mia are you serious?','should have gone to bed','nothing burger',"where's the content?",'weak','closing this','skill issue','so boring']);
function pickTroll(){ const all=C().TROLL, i=NIGHTS.findIndex(n=>n.key===DY().key); if(i<0||i>=4) return pick(all); return pick(all.filter(t=>!QUIET_TROLL.has(t))); }
