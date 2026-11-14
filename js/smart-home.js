"use strict";
// ======================= SMART HOME: dog bark, footsteps, fire alarm =======================
// Each noise affects the stalker, and each can send Mia out of the room to check (unless a donation holds her attention).
function smartHome(kind){
  if(!S.running||S.sh[kind]>0) return;
  S.sh[kind]=CD[kind]*(1-.15*upLv('speaker')); const st=S.st;
  if(kind==='dog'){
    SFX.dog(); S.dogT=1.2; addPanic(4); say('force',T('m_dog'));
    if(st.stage==='window'||st.stage==='door'||st.stage==='closet'){ st.frozenT=6; floaty(T('f_freeze')); }
    distract(.25);
  } else if(kind==='steps'){
    SFX.steps(); addPanic(8); say('force',T('m_steps'));
    if(st.stage==='window'||st.stage==='door'||st.stage==='closet'){ stalkerRetreat(); floaty(T('f_step')); }
    distract(.5);
  } else if(kind==='alarm'){
    SFX.siren(); S.alarmT=2.6; addPanic(18); S.shake=.4; say('force',T('m_siren'));
    if(st.stage!=='hidden'){ stalkerRetreat('hidden'); floaty(T('f_gone')); }
    distract(.9);
  }
}
function distract(chance){
  if(S.focus>0||S.mia.awayT>0||S.tut.active) return;
  if(Math.random()<chance) later(()=>{
    if(S.mia.awayT>0) return;
    S.mia.awayT=6; S.mia.sawSomething = S.st.stage==='door'||S.st.stage==='closet'||S.st.stage==='behind';
    say('force',T('m_away')); tip('away',T('tipAway'));
  },1200);
}
function smartHomeTick(dt){
  for(const k in S.sh) S.sh[k]=Math.max(0,S.sh[k]-dt);
  S.alarmT=Math.max(0,S.alarmT-dt); S.dogT=Math.max(0,S.dogT-dt);
  const m=S.mia;
  if(m.awayT>0){
    m.awayT-=dt;
    if(m.awayT<=0){
      if(m.sawSomething || S.st.stage==='door' || S.st.stage==='closet' || S.st.stage==='behind'){ addPanic(25,{force:true}); say('force',T('m_backSaw')); stalkerRetreat('hidden'); }
      else say('force',T('m_back'));
      m.sawSomething=false;
    }
  }
}
