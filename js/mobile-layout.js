"use strict";
/* Landscape chrome only. Reuse original buttons, handlers and state. */
const mobileRail=document.createElement('nav');mobileRail.id='mobileRail';mobileRail.hidden=true;
mobileRail.setAttribute('aria-label','Stream tools');
mobileRail.innerHTML='<button type="button" id="mobileChat" class="mobile-tool on"><svg class="i"><use href="#i-chat"/></svg></button><button type="button" id="mobileSettings" class="mobile-tool"><svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/></svg></button>';
uxUpper.append(mobileRail);
const mobileFooter=document.createElement('div');mobileFooter.id='mobileFooter';mobileFooter.hidden=true;uxScreen.append(mobileFooter);
const mobileBezel=document.querySelector('.bezel-bottom'),mobileBezelButtons=mobileBezel.querySelector('.bezelbtns');
function mobileLayoutChrome(){
  const phone=$('stage').classList.contains('phone-ui');mobileRail.hidden=mobileFooter.hidden=!phone;
  if(phone){
    mobileRail.insertBefore($('notesToggle'),$('mobileSettings'));
    mobileFooter.append($('systemPanel'),mobileBezelButtons);
  }else if(mobileBezelButtons.parentNode!==mobileBezel)mobileBezel.append(mobileBezelButtons);
}
$('mobileChat').onclick=()=>{uxSetNotes(false,false);list.scrollTop=list.scrollHeight;if(S)S.unread=0;};
$('mobileSettings').onclick=()=>{uxSetNotes(false,false);if(S&&(S.running||paused))setPause(!paused);};
function mobileLabels(){
  $('mobileChat').setAttribute('aria-label',T('chatTitle'));
  $('mobileSettings').setAttribute('aria-label',T('pause'));
  mobileRail.setAttribute('aria-label',T('uxStream'));
}
const mobileOldLang=applyLang;
applyLang=function(){mobileOldLang();mobileLabels();};
mobileLabels();fitStage();
