export const FIGHTER_VISUAL_STATES=Object.freeze({
  IDLE:'idle',
  WINDUP:'windup',
  RUN:'run',
  ATTACK:'attack',
  EVADE:'evade',
  HIT:'hit',
  KNOCKBACK:'knockback',
  RECOVER:'recover',
  DEFEAT:'defeat'
});

export function createVisualState(state=FIGHTER_VISUAL_STATES.IDLE,progress=0){
  return{state,progress:Math.max(0,Math.min(1,Number(progress)||0))};
}

export function visualStatesForEvent(eventType,progress=0){
  const p=Math.max(0,Math.min(1,Number(progress)||0));
  switch(eventType){
    case'action_start':return{actor:createVisualState(FIGHTER_VISUAL_STATES.WINDUP,p),target:createVisualState()};
    case'approach':return{actor:createVisualState(FIGHTER_VISUAL_STATES.RUN,p),target:createVisualState()};
    case'hit':return{actor:createVisualState(FIGHTER_VISUAL_STATES.ATTACK,p),target:createVisualState(FIGHTER_VISUAL_STATES.HIT,p)};
    case'miss':return{actor:createVisualState(FIGHTER_VISUAL_STATES.ATTACK,p),target:createVisualState(FIGHTER_VISUAL_STATES.EVADE,p)};
    case'knockback':return{actor:createVisualState(FIGHTER_VISUAL_STATES.RECOVER,p),target:createVisualState(FIGHTER_VISUAL_STATES.KNOCKBACK,p)};
    case'recover':return{actor:createVisualState(FIGHTER_VISUAL_STATES.RECOVER,p),target:createVisualState()};
    case'defeat':return{actor:createVisualState(),target:createVisualState(FIGHTER_VISUAL_STATES.DEFEAT,p)};
    default:return{actor:createVisualState(),target:createVisualState()};
  }
}

export function applyVisualState(fighter,visual){
  fighter.visualState=visual?.state||FIGHTER_VISUAL_STATES.IDLE;
  fighter.visualProgress=visual?.progress??0;
  return fighter;
}
