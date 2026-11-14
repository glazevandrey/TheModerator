"use strict";
/* Cosmetic motion lives here; real timers are held only during the menu handoff. */
const UI_MOTION={shift:false,finish:null,timer:null,animations:[],menuView:null,previous:null,clips:new WeakMap()};
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
function motionAllowed(){return !motionPreference.matches&&typeof Element.prototype.animate==='function'&&!document.hidden;}
function motionAnimate(el,frames,options){
  if(!el||!el.getClientRects().length||!motionAllowed())return null;
  const old=UI_MOTION.clips.get(el);if(old)old.cancel();
  const animation=el.animate(frames,Object.assign({duration:240,easing:'cubic-bezier(.2,.75,.25,1)'},options));
  UI_MOTION.clips.set(el,animation);const release=()=>{if(UI_MOTION.clips.get(el)===animation)UI_MOTION.clips.delete(el);};animation.finished.then(release,release);return animation;
}
function motionReveal(el,delay,duration){
  if(!el||!el.getClientRects().length)return;
  const previous=UI_MOTION.clips.get(el);if(previous)previous.cancel();
  const cs=getComputedStyle(el),end=cs.transform==='none'?'':cs.transform;
  const opacity=cs.animationName.indexOf('fadein')<0;
  const from={transform:'translateY(9px) '+end},to={transform:end||'none'};
  if(opacity){from.opacity=0;to.opacity=1;}
  return motionAnimate(el,[from,to],{duration:duration||260,delay:delay||0,fill:'backwards'});
}
function motionGlow(el){
  if(!el)return;const previous=UI_MOTION.clips.get(el);if(previous)previous.cancel();const shadow=getComputedStyle(el).boxShadow;
  motionAnimate(el,[{boxShadow:shadow},{boxShadow:shadow+', 0 0 0 1px #edc47c88, 0 0 12px #edb55d55'},{boxShadow:shadow}],{duration:380,easing:'ease-out'});
}
function motionCaptureMenu(opts){
  if(UI_MOTION.finish)UI_MOTION.finish(false);
  if(!motionAllowed()||opts&&(opts.skipMotion||opts.skipTut||opts.skipGuide||opts.tut)||$('ovMenu').hidden||menuView!=='main')return null;
  const menu=$('menuCv'),stage=$('stage'),r=menu.getBoundingClientRect(),s=stage.getBoundingClientRect();
  if(!r.width||!r.height||!menu.width||!menu.height)return null;
  /* Capture the actual displayed menu image, excluding its letterbox margins. */
  render();menuDraw();
  const fit=Math.min(r.width/feed.width,r.height/feed.height),w=feed.width*fit,h=feed.height*fit;
  const room=document.createElement('canvas');room.width=feed.width;room.height=feed.height;
  const px=menu.width/r.width,py=menu.height/r.height;
  room.getContext('2d').drawImage(menu,(r.width-w)/2*px,(r.height-h)/2*py,w*px,h*py,0,0,room.width,room.height);
  const ghost=$('menuLive').cloneNode(true);ghost.removeAttribute('id');ghost.hidden=false;ghost.classList.add('motion-menu-ghost');
  ghost.setAttribute('aria-hidden','true');ghost.setAttribute('inert','');
  ghost.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  const k=stage.offsetWidth/s.width;
  return {room,ghost,from:{left:(r.left-s.left+(r.width-w)/2)*k,top:(r.top-s.top+(r.height-h)/2)*k,width:w*k,height:h*k},night:null};
}
function motionEnterNight(capture,onReady){
  if(!capture||!motionAllowed()){onReady();return;}
  const stage=$('stage'),s=stage.getBoundingClientRect(),r=$('video').getBoundingClientRect(),k=stage.offsetWidth/s.width;
  const target={left:(r.left-s.left)*k,top:(r.top-s.top)*k,width:r.width*k,height:r.height*k};
  const layer=document.createElement('div');layer.className='shift-transition';layer.id='shiftTransition';layer.setAttribute('aria-hidden','true');
  const backdrop=document.createElement('div');backdrop.className='shift-backdrop';
  const room=document.createElement('div');room.className='shift-room';room.append(capture.room);
  capture.room.style.objectFit=getComputedStyle(feed).objectFit;
  for(const key in capture.from)room.style[key]=capture.from[key]+'px';
  layer.append(backdrop,room,capture.ghost);stage.append(layer);
  const night=S;UI_MOTION.shift=true;const animations=[];let done=false;
  UI_MOTION.animations=animations;
  UI_MOTION.menuView=null;
  const finish=notify=>{
    if(done)return;done=true;clearTimeout(UI_MOTION.timer);UI_MOTION.timer=null;for(const animation of animations)if(animation)animation.cancel();
    layer.remove();UI_MOTION.shift=false;UI_MOTION.finish=null;UI_MOTION.animations=[];
    if(notify!==false&&S===night)onReady();
  };
  UI_MOTION.finish=finish;
  animations.push(capture.ghost.animate([{opacity:1,filter:'blur(0px)'},{opacity:0,filter:'blur(3px)'}],{duration:230,fill:'forwards',easing:'ease-out'}));
  animations.push(backdrop.animate([{opacity:1},{opacity:0}],{duration:530,delay:170,fill:'forwards',easing:'ease-in-out'}));
  const frames=[{},{}];for(const key in target){frames[0][key]=capture.from[key]+'px';frames[1][key]=target[key]+'px';}
  frames[0].borderRadius='0px';frames[1].borderRadius=getComputedStyle($('video')).borderRadius;
  animations.push(room.animate(frames,{duration:790,delay:80,fill:'forwards',easing:'cubic-bezier(.65,0,.2,1)'}));
  animations.push(room.animate([{opacity:1},{opacity:0}],{duration:180,delay:740,fill:'forwards',easing:'ease-out'}));
  /* Stagger the console around the moving room, keeping the camera itself steady. */
  for(const [el,delay] of [[$('chat'),240],[document.querySelector('.actions'),340],[document.querySelector('.lighting'),390],[document.querySelector('.smarthome'),440],[$('glassnote'),480],[$('systemPanel'),490],[document.querySelector('.streamhead'),610],[document.querySelector('.streambar'),610]]){
    const animation=motionReveal(el,delay,280);if(animation)animations.push(animation);
  }
  UI_MOTION.timer=setTimeout(()=>finish(true),950);
}
document.addEventListener('keydown',e=>{
  if(!UI_MOTION.shift)return;e.preventDefault();e.stopImmediatePropagation();if(e.key==='Escape'&&UI_MOTION.finish)UI_MOTION.finish(true);
},true);
window.addEventListener('resize',()=>{if(UI_MOTION.finish)UI_MOTION.finish(true);});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&UI_MOTION.finish)UI_MOTION.finish(true);});
motionPreference.addEventListener('change',()=>{if(motionPreference.matches&&UI_MOTION.finish)UI_MOTION.finish(true);});
/* Menu navigation: animate only a changed view, not every live update. */
const motionOriginalRenderMenu=renderMenu;
renderMenu=function(){
  const previous=UI_MOTION.menuView;motionOriginalRenderMenu();if($('ovMenu').hidden)return;
  UI_MOTION.menuView=menuView;if(previous===menuView)return;
  if(menuView==='main')for(const [selector,delay] of [['.ml-top',0],['.ml-title',50],['.ml-act',100],['.ml-foot',140]])motionReveal($('menuLive').querySelector(selector),delay,300);
  else motionReveal($('menuBody'),0,220);
};
const motionOriginalOpenMenu=openMenu;
openMenu=function(view){if(UI_MOTION.finish)UI_MOTION.finish(false);return motionOriginalOpenMenu(view);};
/* Existing overlays and document windows keep their original event handlers. */
const motionPanels=['ovPause','ovEnd','ovTut','ovPhoto','glassnote','deskWin','finCard','readDoc','report','mail'];
const motionPanelObserver=new MutationObserver(records=>{
  for(const record of records){const el=record.target;if(el.hidden||el.getAttribute('hidden')===record.oldValue)continue;
    const panel=el.querySelector('.paper,.rd-in,.rp-in,.ml-in')||el;motionReveal(panel,0,220);
  }
});
for(const id of motionPanels){const el=$(id);if(el)motionPanelObserver.observe(el,{attributes:true,attributeFilter:['hidden'],attributeOldValue:true});}
let motionLastTip=$('tip2').textContent;
new MutationObserver(()=>{const text=$('tip2').textContent;if(text===motionLastTip)return;motionLastTip=text;if(!UI_MOTION.shift)motionReveal($('glassnote'),0,210);}).observe($('tip2'),{childList:true,characterData:true,subtree:true});
/* Successful actions, rather than attempted clicks, trigger the small accents. */
const motionOriginalHud=hud;
hud=function(dt){motionOriginalHud(dt);if(!S)return;
  const now={state:S,hc:S.hc,recs:S.stats.recs,donates:S.stats.donates,ready:!$('actDonate').disabled,blinds:S.blinds.closed,modes:ZONES.map(z=>S.lamps[z].mode),sounds:['dog','steps','alarm'].map(key=>S.sh[key])};
  const prev=UI_MOTION.previous;UI_MOTION.previous=now;if(!prev||prev.state!==S||UI_MOTION.shift||!S.running)return;
  if(now.hc-prev.hc>=5)motionAnimate($('hcval'),[{transform:'scale(1)'},{transform:'scale(1.09)'},{transform:'scale(1)'}],{duration:240});
  if(now.recs>prev.recs)motionAnimate($('actRec').querySelector('.cambadge'),[{transform:'rotate(-7deg) scale(1)'},{transform:'rotate(3deg) scale(1.14)'},{transform:'rotate(-7deg) scale(1)'}],{duration:280});
  if(now.donates>prev.donates)motionGlow(document.querySelector('.ux-wallet'));
  else if(now.ready&&!prev.ready)motionGlow($('actDonate'));
  ZONES.forEach((z,i)=>{if(now.modes[i]!==prev.modes[i]&&!S.lamps[z].burned)motionGlow($('lamp-'+z).querySelector('.mk.on'));});
  if(now.blinds!==prev.blinds)motionGlow($('actBlinds'));
  ['actDog','actSteps','actAlarm'].forEach((id,i)=>{if(now.sounds[i]>prev.sounds[i])motionGlow($(id));});
};
