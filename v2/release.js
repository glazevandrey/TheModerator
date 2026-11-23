"use strict";
/* THE MODERATOR — release switch for the v2 modules (22.11.2026).
   The v2 look (room, Mia, door, window, closet, desk, mug, drinking, typing, subtitles, calm chat) came from review/ and
   carries test panels and test keys. In the game they are off; ?dev in the address turns them back on.
   Loaded right after the v2 modules in index.html. */
const TM_DEV=/[?&]dev\b/.test(location.search);
(function(){
  if(TM_DEV) return;
  document.documentElement.classList.add('tm-release');
  const css=document.createElement('style');
  css.textContent='html.tm-release #wv2,html.tm-release #wv2Gear,html.tm-release #dv2,html.tm-release #mv2,html.tm-release #cl1,html.tm-release #cl1Btn,'+
    'html.tm-release #drkBtn,html.tm-release #typBtn,html.tm-release #typMode,html.tm-release #demoBar,html.tm-release #sc,html.tm-release #scGear,'+
    'html.tm-release #flBtn,html.tm-release #pxSubBtn,html.tm-release #ambv,html.tm-release .ambv-panel{display:none!important}';
  document.head.appendChild(css);
  /* the test keys of the modules: H panels, K closet test, J drink, T/Y typing test, Ctrl+Shift+M tone A/B.
     Ctrl+Shift+L (night journal for testers) stays. */
  addEventListener('keydown',e=>{
    if(/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||'')) return;
    const c=e.code, cs=e.ctrlKey&&e.shiftKey;
    if((!e.ctrlKey&&!e.altKey&&/^(KeyH|KeyK|KeyJ|KeyT|KeyY)$/.test(c)) || (cs&&c==='KeyM')){ e.stopImmediatePropagation(); }
  },true);
  /* panels start hidden: the clean mode the modules already know */
  const clean=()=>document.body&&document.body.classList.add('wv2-clean','sc-clean');
  if(document.body) clean(); else document.addEventListener('DOMContentLoaded',clean);
})();
