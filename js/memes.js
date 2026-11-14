"use strict";
/* ======================= MEMES (11.11) =======================
   Light meme lines from regular viewers, so the chat is not dull: background, after Mia talks, after a scare,
   on the phone call, after a good ban, at the end of the night. Only while it is still "safe":
   not in the finale, not on Sunday / second Monday, not while he is close (then the chat is only nervous).
   Stranger_99 never uses them. No swearing, no lyrics / brands / streamer names. */
const MEME={
  ru:{bg:['67','six seven 🤙','ауф','имба стрим','это база','кринж или норм?','сигма стример','абоба','краш','ору','ничего не понял, но очень интересно','кто тут с 2 ночи','мия я тебя могну','-1000 ауры','+500 ауры за наушники','npc чат','брейнрот стрим','лайк не глядя'],
      mia:['W мия','ахахах база','ну всё, она могнула весь чат','реально','ору с неё'],
      scare:['F','я аж подпрыгнул','-1000 ауры мне','это скример??','я не боюсь, это вы боитесь','ауф… чё это было','мы обречены'],
      phone:['не бери!!','это спам по-любому','ваш номер выиграл приз','мия скинь','скидывай трубку'],
      ban:['F за него','бан-хаммер имба','мод могнул','минус один нпс','хорош мод'],
      end:['пережили','мы вернулись','это была имба ночь','67 до завтра']},
  en:{bg:['67','six seven','W stream','real','chat is this real','the aura','+1000 aura','npc chat','brainrot hours','bro is locked in','no cap','lowkey cozy','not me staying up for this'],
      mia:['W mia','she cooked','real','LMAO','mia mogged us all'],
      scare:['F','it\'s joever','bro I jumped','-1000 aura for me','we\'re so cooked','i\'m not scared you\'re scared'],
      phone:['DON\'T ANSWER','it\'s a scam call','your car\'s extended warranty','hang up hang up','block that number'],
      ban:['F in chat','mod got him','ratio + banned','W mod','one less npc'],
      end:['we\'re so back','we survived','W night','67 see u tomorrow']}};
const MEME_NIGHTS=['mon','tue','wed','thu','fri','sat'];
function memeOk(near){
  if(!S||!S.running||S.over) return false;
  if(typeof FIN!=='undefined'&&FIN.active) return false;
  const N=S.night||{}; if(!N.endless && MEME_NIGHTS.indexOf(N.key)<0) return false;
  const st=S.st; if(!near && st && st.stage!=='hidden' && !(st.stage==='window'&&st.p<.35)) return false;
  return true;
}
function memeLine(kind){
  const M=MEME[LANG]||MEME.en, used=S.memeUsed||(S.memeUsed={});
  let free=M[kind].filter(t=>!used[t]); if(!free.length){ for(const t of M[kind]) delete used[t]; free=M[kind]; }
  const t=pick(free); used[t]=1; return t;
}
/* kind, chance 0..1, delay in ms; near=true lets it through right after a scare even if he is around */
function memeSay(kind,chance,delay,near){
  if(!memeOk(near)||Math.random()>chance) return;
  const go=()=>{ if(memeOk(near)) pushMsg('normal',genName(),memeLine(kind)).meme=true; };
  if(delay) later(go,delay); else go();
}
/* end of the night: one line in the last minutes */
function memeTick(){
  if(!S||!S.running||S.memeEnd||S.tut.active) return;
  if(S.t/S.len>.95){ S.memeEnd=true; memeSay('end',.8,0); }
}
