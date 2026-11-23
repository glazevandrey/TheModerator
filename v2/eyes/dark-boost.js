"use strict";
/* THE MODERATOR — the stalker stays black under BRIGHT (22.11, from the clarity pass): the light reveals his outline,
   it does not wash his body grey/orange. Visual only: the figure drawers of the door / window / closet modules get a canvas
   proxy that darkens every sprite they draw while that zone's lamp is on BRIGHT (the rim light canvas excepted).
   Loaded after those modules. */
function darkUnderBoost(name,zone){ if(typeof window[name]!=='function') return; const f0=window[name];
  window[name]=function(c){ const m=S?lampMode(zone):'STABLE'; if(m!=='BOOST') return f0.apply(this,arguments);
    const px=new Proxy(c,{ get(t,k){ const v=t[k]; if(k==='drawImage') return function(src){
          if(src && src.getContext && !(typeof WV2!=='undefined'&&src===WV2.rimC)){ const q=src.getContext('2d'); q.save(); q.setTransform(1,0,0,1,0,0); q.globalCompositeOperation='source-atop'; q.fillStyle='rgba(5,4,9,.62)'; q.fillRect(0,0,src.width,src.height); q.restore(); }
          return v.apply(t,arguments); };
        return typeof v==='function'?v.bind(t):v; }, set(t,k,v){ t[k]=v; return true; } });
    const args=[...arguments]; args[0]=px; return f0.apply(this,args); }; }
darkUnderBoost('dv2Threat','door'); darkUnderBoost('dv2ThreatBox','door'); darkUnderBoost('wv2Sprite','window'); darkUnderBoost('cl1Figure','closet');
