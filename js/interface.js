"use strict";
/* UI-only variant. Existing nodes retain their IDs and game handlers. */
for(const [lang,labels] of Object.entries({
  en:{uxNotes:'NOTES',uxClose:'Close notes',uxStream:'STREAM CONTROLS',uxPreview:'UI PREVIEW',uxSelect:'Hover or select a message to moderate',uxSelected:'SELECTED',uxReady:'READY',uxWait:'RECHARGING',uxTrust:'TRUST',uxChatHint:'hover → BAN'},
  ru:{uxNotes:'ЗАМЕТКИ',uxClose:'Закрыть заметки',uxStream:'УПРАВЛЕНИЕ ЭФИРОМ',uxPreview:'ТЕСТ ИНТЕРФЕЙСА',uxSelect:'Наведи или выбери сообщение',uxSelected:'ВЫБРАНО',uxReady:'ГОТОВО',uxWait:'ПЕРЕЗАРЯДКА',uxTrust:'ДОВЕРИЕ',uxChatHint:'наведи → БАН'}
})) Object.assign(STR[lang],labels);
Object.assign(STR.en,{uxMissing:'Need {n} HC',uxDonateReady:'Ready to send',uxDonateWait:'Recharging · {n}s',uxOffline:'Stream offline'});
Object.assign(STR.ru,{uxMissing:'Не хватает {n} HC',uxDonateReady:'Можно отправить',uxDonateWait:'Перезарядка · {n} с',uxOffline:'Эфир не идёт'});

const uxScreen=$('screen');
const uxToolbar=document.createElement('div'); uxToolbar.className='ux-toolbar';
uxToolbar.innerHTML='<span class="ux-preview" data-i18n="uxPreview"></span><span class="sp"></span><button id="notesToggle" type="button" class="bzb ux-notes" aria-expanded="false" aria-controls="glassnote"><span aria-hidden="true">▤</span><span data-i18n="uxNotes"></span><i aria-hidden="true"></i></button>';
uxScreen.prepend(uxToolbar);
uxToolbar.insertBefore($('clock'),$('notesToggle'));
uxToolbar.append($('pauseBtn2'));
const uxUpper=document.createElement('div'); uxUpper.className='ux-upper';
uxScreen.insertBefore(uxUpper,$('streamPanel')); uxUpper.append($('streamPanel'),$('chat'));
const uxLower=document.createElement('div'); uxLower.className='ux-lower';
uxScreen.insertBefore(uxLower,document.querySelector('.actions'));
uxLower.append(document.querySelector('.actions'),document.querySelector('.lighting'),document.querySelector('.smarthome'));

const uxActions=document.querySelector('.actions');
const uxActionHeader=document.createElement('header'); uxActionHeader.className='modhead'; uxActionHeader.innerHTML='<svg class="i"><use href="#i-cam"/></svg><b data-i18n="uxStream"></b>';
uxActions.prepend(uxActionHeader);
const uxDock=document.createElement('div'); uxDock.className='ux-moderation';
uxDock.append($('chatfoot'),$('actBan')); $('chat').append(uxDock);

/* Blinds stay the same action and keep the B shortcut; only their home changes. */
const uxBlinds=$('actBlinds'); uxBlinds.classList.add('shb','ux-blinds');
document.querySelector('.shbtns').prepend(uxBlinds);
const uxTrust=document.querySelector('.trustrow');
const uxMoney=document.createElement('div'); uxMoney.className='ux-money';
uxMoney.append(uxTrust.querySelector('.coin'),$('hcval')); uxActions.insertBefore(uxMoney,document.querySelector('.hcrow'));
/* One wallet, reusing the balance, progress and donation nodes from the game. */
const uxWallet=document.querySelector('.hcrow'); uxWallet.classList.add('ux-wallet');
const uxTarget=document.createElement('span'); uxTarget.className='ux-wallet-target';
uxTarget.innerHTML='/ <b id="uxDonationTarget">100</b>';
uxMoney.append(uxTarget,uxWallet.querySelector('.tiny')); uxWallet.prepend(uxMoney);
const uxDonateMain=document.createElement('span'); uxDonateMain.className='ux-donate-main';
const uxDonate=$('actDonate'); uxDonate.querySelector('b').append(document.createTextNode(' HC'));
uxDonateMain.append(uxDonate.querySelector('.i'),uxDonate.querySelector('b'),uxDonate.querySelector('small')); uxDonate.prepend(uxDonateMain);
const uxDonateStatus=document.createElement('span'); uxDonateStatus.id='donateStatus'; uxDonateStatus.className='ux-donate-status'; uxDonate.append(uxDonateStatus);
uxDonate.setAttribute('aria-describedby','donateStatus');
uxWallet.querySelector('.hcbar').setAttribute('role','progressbar');
uxTrust.querySelector('.sp').replaceWith($('stars')); $('chat').append(uxTrust);
/* Match the original camera geometry: utility controls live in the stream header,
   and equipment status uses the existing monitor bezel rather than a new row. */
function uxLayoutChrome(){
  const header=document.querySelector('.streamhead');
  header.insertBefore($('netbat'),header.querySelector('.tech'));
  for(const id of ['clock','notesToggle','pauseBtn2']) header.insertBefore($(id),$('netbat'));
  uxToolbar.hidden=true;
  const bezel=document.querySelector('.bezel-bottom');
  if(MOBILE){ uxScreen.append($('systemPanel')); $('systemPanel').append($('netbat')); }
  else bezel.insertBefore($('systemPanel'),bezel.querySelector('.sp'));
  const note=$('glassnote'),wasPinned=$('stage').classList.contains('notes-pinned');
  $('stage').classList.toggle('notes-pinned',!MOBILE);
  $('notesToggle').hidden=!MOBILE;
  $('actBan').hidden=MOBILE;
  if(MOBILE){ uxScreen.append(note); if(wasPinned) note.hidden=true; }
  else { uxUpper.append(note); note.hidden=false; }
}
/* Trust already lives in the dock, so remove only its duplicate from the stream bar. */
document.querySelector('.streambar .sb:has(.star)').hidden=true;
document.querySelector('.chathead .hint').dataset.i18n='uxChatHint';
const uxNote=$('glassnote'); uxNote.hidden=true; uxNote.setAttribute('role','region'); uxNote.setAttribute('aria-labelledby','notesToggle');
const uxClose=document.createElement('button'); uxClose.type='button'; uxClose.id='notesClose'; uxClose.className='ux-close'; uxClose.textContent='×'; uxNote.prepend(uxClose);
function uxSetNotes(open,focus){
  if(!MOBILE) return;
  uxNote.hidden=!open; $('notesToggle').setAttribute('aria-expanded',String(open));
  if(open){ $('notesToggle').classList.remove('unread'); if(focus) uxClose.focus({preventScroll:true}); }
  else if(focus) $('notesToggle').focus({preventScroll:true});
}
$('notesToggle').onclick=()=>uxSetNotes(uxNote.hidden,true);
uxClose.onclick=()=>uxSetNotes(false,true);
document.addEventListener('keydown',e=>{ if(MOBILE&&e.key==='Escape'&&!uxNote.hidden){ e.preventDefault(); e.stopImmediatePropagation(); uxSetNotes(false,true); } },true);
document.addEventListener('pointerdown',e=>{ if(MOBILE&&!uxNote.hidden&&!uxNote.contains(e.target)&&!$('notesToggle').contains(e.target)) uxSetNotes(false,false); });
const noteTip=$('tip2');
function fitNoteText(){
  if(!noteTip.clientHeight) return;
  const maximum=parseInt(getComputedStyle(noteTip).getPropertyValue('--note-type-size'),10);
  for(let size=maximum;size>=22;size--){
    noteTip.style.fontSize=size+'px';
    if(noteTip.scrollHeight<=noteTip.clientHeight && noteTip.scrollWidth<=noteTip.clientWidth) break;
  }
}
new MutationObserver(()=>{
  if(uxNote.hidden) $('notesToggle').classList.add('unread');
  else fitNoteText();
}).observe(noteTip,{childList:true,characterData:true,subtree:true});
new ResizeObserver(fitNoteText).observe(noteTip);
document.fonts.addEventListener('loadingdone',fitNoteText);
for(const id of ['actDog','actSteps','actAlarm','actRec','actDonate']){
  const el=document.createElement('em'); el.className='ux-remaining'; el.setAttribute('aria-hidden','true'); $(id).append(el);
}
const uxOldHud=hud;
hud=function(dt){
  uxOldHud(dt); if(!S) return;
  $('toxValue').textContent=Math.round(S.tox)+'%';
  const uxCost=donateCost(),uxMissing=Math.max(0,uxCost-S.hc),uxCooling=S.donate.cd>0;
  $('uxDonationTarget').textContent=uxCost;
  uxWallet.classList.toggle('can-donate',!uxDonate.disabled);
  const uxStatus=!S.running?(paused?T('pause'):T('uxOffline')):uxCooling?T('uxDonateWait',{n:Math.ceil(S.donate.cd)}):uxMissing?T('uxMissing',{n:uxMissing}):T('uxDonateReady');
  if(uxDonateStatus.textContent!==uxStatus) uxDonateStatus.textContent=uxStatus;
  const uxProgress=uxWallet.querySelector('.hcbar'); uxProgress.setAttribute('aria-label',T('toDonation')); uxProgress.setAttribute('aria-valuemin','0'); uxProgress.setAttribute('aria-valuemax',uxCost); uxProgress.setAttribute('aria-valuenow',Math.min(S.hc,uxCost));
  const sel=S.chat.find(m=>m.id===S.selected), finale=FIN.active&&FIN.phase===6;
  const valid=sel&&!sel.banned&&!['sys','donation'].includes(sel.type);
  $('actBan').disabled=!finale&&(!S.running||!valid);
  $('chat').classList.toggle('has-selection',!!valid||finale);
  $('chatfoot').textContent=finale?'Stranger_99':valid?T('uxSelected')+': '+sel.user:T('uxSelect');
  $('actBan').setAttribute('aria-label',T('banBtn')+(valid?' · '+sel.user:''));
  if(valid){ const row=list.querySelector('[data-id="'+sel.id+'"]'); const button=row&&row.querySelector('.msgban'); if(button) button.setAttribute('aria-label',T('banBtn')+' · '+sel.user); }
  for(const [id,v] of [['actDog',S.sh.dog],['actSteps',S.sh.steps],['actAlarm',S.sh.alarm],['actRec',S.rec.cd],['actDonate',S.donate.cd]]){
    const el=$(id).querySelector('.ux-remaining'); const txt=v>0?Math.ceil(v)+(LANG==='ru'?' с':'s'):'';
    if(el.textContent!==txt) el.textContent=txt;
  }
  for(const z of ZONES) document.querySelectorAll('#lamp-'+z+' .mk').forEach(b=>b.setAttribute('aria-pressed',String(!S.lamps[z].burned&&S.lamps[z].mode===b.dataset.m)));
  if(typeof onboardingHud==='function')onboardingHud();
};
const uxOldSelect=selectMsg;
selectMsg=function(id){ uxOldSelect(id); hud(0); };
const uxOldLang=applyLang;
applyLang=function(){ uxOldLang(); uxClose.setAttribute('aria-label',T('uxClose')); };
/* A tutorial anchored to chat must leave its new moderation dock clickable. */
const uxOldPlace=placeCallout;
placeCallout=function(){
  uxOldPlace(); const c=$('callout'); if(c.hidden||c.dataset.at==='video') return;
  const base=uxScreen.getBoundingClientRect(), box=$('chatlist').getBoundingClientRect(), k=uxScreen.offsetWidth/base.width;
  c.style.top=((box.bottom-base.top)*k-c.offsetHeight-10)+'px';
};

