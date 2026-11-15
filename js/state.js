"use strict";
// ======================= CONFIG & GAME STATE =======================
// One state object (S) holds every value of the running night; PROG holds the saved meta-progress.
const W=320, H=180;
const CAM_Y=12, CAM_H=160;
const ZONES=['window','closet','door'];
const MODES=['DIM','STABLE','BOOST'];
const STAGES=['hidden','window','door','behind'];
const STAGE_LAMP={window:'window',door:'door',closet:'closet',behind:'closet'};
// ways in: A window → door → behind her, B door → behind her, C out of the closet → behind her
const ROUTES={A:['window','door','behind'],B:['door','behind'],C:['closet','behind']};
const LIGHT={window:{x:62,y:70}, closet:{x:156,y:72}, door:{x:262,y:76}};

// Campaign: the four GDD story nights with four "special conditions" nights between them.
// mod: surge (power surges heat lamps), cold (Mia panics faster), raid (troll raid), blackout (jammed blinds, hot lamps)
// Difficulty knobs per night:
//  max   – furthest stage it can reach (window: knocks on the glass, door: peeks in, behind: can kill)
//  chat  – chat interval multiplier (bigger = calmer chat), troll – share of trolls/spam
//  pmul  – multiplier on everything that scares Mia, calm – how fast panic fades when nothing is near
//  adapt – whether it gets used to a lamp held on BOOST, rescue – one free viewer donation when panic is critical
//  cost  – donation price, inc – HypeCoins per second just for keeping the stream on air
//  tox   – how fast unbanned trolls/spam poison the chat (0 = off)
//  routes – weights of the ways in (A window→door→behind, B door→behind, C closet→behind)
//  red   – chance that an approach has red eyes (light feeds him)   decoy – chance of a shape with no eyes elsewhere
//  hot   – a hot night: Mia opens the window now and then (he comes through it faster until the blinds shut it)
const NIGHTS=[
  {key:'mon',  story:false, len:165, aggr:.70, wait0:14, waitMul:1.45, max:'window', bm:1, chat:2.0, troll:.55, pmul:.55, calm:1.3, adapt:false, rescue:true, cost:100, tox:.55, routes:{A:1}, inc:1.0, ev:{note:true}},
  {key:'tue',  story:false,len:220, aggr:.80, wait0:20, waitMul:1.30, max:'door', bm:1,   chat:1.7, troll:.7,  pmul:.65, calm:1.1, adapt:false, rescue:true, cost:100, tox:.7, routes:{A:1}, hot:true, inc:1.0, ev:{}, mod:'surge'},
  {key:'wed',  story:true, len:230, aggr:0.70, wait0:20, waitMul:1.1, max:'behind', bm:1.0, chat:1.45,troll:.8,  pmul:.75, calm:.95, adapt:true,  rescue:true, cost:120, tox:0.6, routes:{A:.6,B:.4}, inc:.9,  ev:{chair:true,breakChat:true}},
  {key:'thu',  story:false,len:240, aggr:0.80,wait0:18, waitMul:0.95, max:'behind', bm:1.15, chat:1.25,troll:.9,  pmul:.85, calm:.8,  adapt:true,  rescue:true, cost:120, tox:0.85, routes:{A:.45,B:.35,C:.2}, inc:.9,  ev:{}, mod:'cold'},
  {key:'fri',  story:true, len:255, aggr:.76,wait0:16, waitMul:0.92,  max:'behind', bm:1.25, chat:1.1, troll:1,   pmul:.95, calm:.7,  adapt:true,  rescue:true, cost:130, tox:1, routes:{A:.4,B:.3,C:.3}, red:.25, inc:.8,  ev:{note:true,chair:true}},
  {key:'sat',  story:false,len:265, aggr:.74,wait0:14, waitMul:0.86,  max:'behind', bm:1.3, chat:1.2, troll:1,   pmul:1.0, calm:.6,  adapt:true,  rescue:false,cost:150, tox:1, routes:{A:.35,B:.35,C:.3}, red:.3, hot:true, inc:.8,  ev:{}, mod:'raid'},
  {key:'sun',  story:false,len:280, aggr:.76,wait0:12, waitMul:0.8,  max:'behind', bm:1.2, chat:1.0, troll:1,   pmul:1.05,calm:.55, adapt:true,  rescue:false,cost:150, tox:1, routes:{A:.3,B:.35,C:.35}, red:.25, decoy:.45, inc:.7,  ev:{}, mod:'blackout'},
  {key:'mon2', story:true, len:300, aggr:.82,wait0:8,  waitMul:0.68,  max:'behind', bm:1.45, chat:.95, troll:1,   pmul:.92, calm:.5, adapt:true,  rescue:false,cost:150, tox:1.1, routes:{A:.25,B:.4,C:.35}, red:.25, decoy:.35, inc:.7,  ev:{boxes:true,finale:true}}
];
// the separate tutorial: nothing moves unless a step makes it move, nothing can be lost
const TUT_NIGHT={key:'tut', tox:0, story:false, len:99999, aggr:1, wait0:9999, waitMul:1, max:'behind', chat:3, troll:0, pmul:0, calm:0, adapt:false, rescue:false, cost:100, inc:0, ev:{}, tut:true};
const ENDLESS_MODS=['surge','cold','raid','blackout',null,null];
function endlessNight(n){ // n = 0,1,2… nights survived in a row
  return {key:'endless', tox:1, routes:{A:.3,B:.35,C:.35}, red:Math.min(.4,.2+.04*n), decoy:Math.min(.4,.15+.05*n), hot:n%2===1, story:false, len:200, bm:1.5, aggr:1.12+.13*n, wait0:10, waitMul:Math.max(.35,.85-.06*n), max:'behind', chat:1, troll:1, pmul:1, calm:.5, adapt:true, rescue:n<2, cost:150, inc:.7,
    ev:n%3===2?{chair:true}:{}, mod:ENDLESS_MODS[(n*7+3)%ENDLESS_MODS.length], endless:true, n};
}

// Shop: upgrades (effects read by the systems) and looks (read by the renderer)
const UPGRADES=[
  {id:'cool',   lv:[300,700]},   // lamps heat up slower
  {id:'blinds', lv:[250,600]},   // blinds stay shut longer
  {id:'lens',   lv:[300,700]},   // more HC per clip
  {id:'speaker',lv:[400,900]},   // smart-home cooldowns shorter
  {id:'calm',   lv:[500]},       // donations calm more and cost less
  {id:'trust',  lv:[900]}        // a 4th trust credit
];
const LOOKS={
  hoodie:[{id:'blue',c:['#6c7aa6','#454f78'],p:0},{id:'black',c:['#3e3a44','#26232b'],p:200},{id:'mint',c:['#7fa79a','#4d7266'],p:250},{id:'red',c:['#a5524c','#6e2f2b'],p:300},{id:'cream',c:['#cbb99a','#8f7d62'],p:300}],
  phones:[{id:'pink',c:'#d68ca0',p:0},{id:'gold',c:'#e9b65e',p:150},{id:'teal',c:'#6fb5b0',p:150},{id:'violet',c:'#9a84d0',p:200}],
  lights:[{id:'warm',c:['233,182,94','214,140,160','150,190,170'],p:0},{id:'sakura',c:['240,160,190','255,210,230','220,120,160'],p:200},{id:'ice',c:['150,200,240','200,230,255','120,170,220'],p:200},{id:'ember',c:['240,120,60','233,182,94','200,80,60'],p:250}]
};
const COST={donate:150};
const CD={blinds:20, rec:12, dog:20, steps:30, alarm:45, donate:4};
const HEAT={boost:8, stable:-4, dim:-7};
// chat toxicity: each troll/spam left hanging (4–24 s old) adds `per`/s, it fades by `decay`/s, a good ban takes `ban` off
const TOX={per:2.0, decay:2.0, ban:6, half:50};

const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[(Math.random()*a.length)|0];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// ---- saved progress
// ---- difficulty: multipliers on top of a night's own numbers (the campaign, not the tutorial or the endless shift)
//  press – the last part of the night (from `at`): he comes back sooner and moves faster
const DIFFS={
  easy:  {aggr:.8,  wait:1.3, pmul:.75, calm:1.3, red:0,   decoy:0,   tox:.5, rescue:true, heat:.8, surge:.6, chat:1.15, troll:.85},
  normal:{aggr:1,   wait:1,   pmul:1,   calm:1,   red:1,   decoy:1,   tox:1},
  hard:  {aggr:1.22,wait:.85, pmul:1.1, calm:.9,  red:1.6, decoy:1.6, tox:1.1, rescue:false, press:{at:.78,rate:1.22,wait:.6}, night:{sun:1.12}}
};
const DIFF_RANK={easy:1,normal:2,hard:3};
function applyDiff(N,d){ const D=DIFFS[d]||DIFFS.normal; if(d==='normal'||!D) return N; const o=Object.assign({},N);
  o.aggr=N.aggr*D.aggr*((D.night&&D.night[N.key])||1); o.waitMul=N.waitMul*D.wait; o.wait0=N.wait0*D.wait; o.pmul=N.pmul*D.pmul; o.calm=N.calm*D.calm; o.tox=(N.tox??1)*D.tox;
  o.chat=N.chat*(D.chat||1); o.troll=N.troll*(D.troll||1); o.heat=D.heat||1; o.surge=D.surge||1;
  o.red=Math.min(.6,(N.red||0)*D.red); o.decoy=Math.min(.6,(N.decoy||0)*D.decoy); if(D.rescue!==undefined) o.rescue=D.rescue; if(D.press) o.press=D.press; o.diff=d; return o; }
function freshProg(){ return {v:2, diff:'normal', diffChosen:false, unlocked:0, done:false, bank:0, up:{}, owned:{hoodie:['blue'],phones:['pink'],lights:['warm']}, wear:{hoodie:'blue',phones:'pink',lights:'warm'}, best:0, daily:{last:'',streak:0}, tut:false, stars:{}, shopHint:false}; }
let PROG=freshProg();
function saveProg(){ pfSave(PROG); }
function upLv(id){ return PROG.up[id]||0; }
// the cheapest upgrade the bank can pay for right now (null if none)
function affordUp(){ let best=null; for(const u of UPGRADES){ const lv=upLv(u.id); if(lv<u.lv.length && PROG.bank>=u.lv[lv] && (!best||u.lv[lv]<best.price)) best={id:u.id,price:u.lv[lv]}; } return best; }
function look(cat){ const id=PROG.wear[cat]; return LOOKS[cat].find(x=>x.id===id)||LOOKS[cat][0]; }

let S=null, nextId=1;
function lampObj(){ return {mode:'STABLE',heat:0,burned:false,flick:1,warned:false,rel:9}; }
function newState(idx,endN,tut){
  const N = tut ? TUT_NIGHT : endN!=null ? endlessNight(endN) : applyDiff(NIGHTS[idx||0],PROG.diff||'normal');
  const s={
    idx:idx||0, night:N, len:N.len, t:0, running:false, over:false, overReason:null, scareT:0, continued:false,
    panic:0, trust:3+upLv('trust'), maxTrust:3+upLv('trust'), hc:0, viewers:1204,
    lamps:{window:lampObj(), closet:lampObj(), door:lampObj()},
    blinds:{closed:false,timer:0,cd:0,anim:0,jammed:N.mod==='blackout'},
    sh:{dog:0,steps:0,alarm:0}, alarmT:0, dogT:0,
    donate:{cd:0}, focus:0, rec:{active:0,cd:0},
    st:{stage:'hidden',p:0,wait:N.wait0,aggr:1,boostT:0,frozenT:0,frozenAt:null,backed:false,msgT:rnd(18,26),route:ROUTES.A,red:false,next:null,cued:false,lit:0},
    decoy:null, winOpen:false,
    mia:{lineT:0,last:{},look:0,lookT:2,blink:0,blinkT:3,surpriseT:0,awayT:0},
    tut:{active:!!tut,step:0,t:0,msgId:0,wait:false},
    chat:[], chatT:1.2, nervousT:6, selected:null, unread:0, rate:0,
    clips:[], stats:{goodBans:0,wrongBans:0,himBans:0,maxPanic:0,recs:0,donates:0}, hcf:0, rescued:false,
    ev:{chairT:rnd(30,45), chairShow:0, note:false, noteRec:false, surgeT:rnd(25,40)},
    tox:0, glitch:0, shake:0, floatT:0, hbT:0, tipsDone:{}, tutEnd:0, signalLost:0
  };
  if(N.mod==='blackout') for(const z of ZONES) s.lamps[z].heat=20;
  return s;
}
function DY(){ return S.night; }
function dprog(){ return clamp(S.t/S.len,0,1); }
// the clock runs at one speed every night (1 stream minute = 5 s); longer nights simply start earlier (23:18 … 23:00)
function streamMin(){ if(!S||S.len>3000) return S?Math.min(59,Math.floor(S.t/5)):0; const total=S.len/5; return Math.min(60,60-total+Math.min(total,S.t/5)); }
function lampMode(z){ const L=S.lamps[z]; return L.burned?'DEAD':L.mode; }
function adaptAt(){ return S.night.adapt ? 5.5-1.5*dprog() : 1e9; }
function later(fn,ms){ const g=S; setTimeout(()=>{ if(S===g && S.running) fn(); },ms); }
const ARCHIVE=[];
