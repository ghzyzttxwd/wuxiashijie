import {MING_CORE_NPC_BY_ID}from'../data/npcs/ming/index.js';
import {changeRelation,relationWith}from'./relationships.js';

export function canTalkToNpc(session,npcId){
  const def=MING_CORE_NPC_BY_ID[npcId],state=session?.worldState?.npc?.states?.[npcId],world=session?.character?.world;
  if(!def||!state||!world)return{ok:false,reason:'unknown_npc'};
  if(!state.alive)return{ok:false,reason:'npc_dead'};
  if(state.discovered===false)return{ok:false,reason:'npc_not_discovered'};
  if(state.locationId!==world.location||state.sceneId!==world.scene)return{ok:false,reason:'npc_not_in_same_scene'};
  return{ok:true,def,state};
}

function lineFor(def,state,relation){
  if(relation>=30)return`${def.name}已认得你，谈起了“${state.currentGoal||def.publicGoals?.[0]||'眼下之事'}”。`;
  if(relation>=10)return`${def.name}对你已有些印象，只简短说了几句当前局势。`;
  return`${def.name}打量了你一眼。此刻正在${state.activity||'处理自己的事情'}。`;
}

export function talkToNpc(session,npcId){
  const check=canTalkToNpc(session,npcId);if(!check.ok)throw Error(check.reason);
  const before=relationWith(session.worldState,npcId),gain=before===0?2:1,worldState=changeRelation(session.worldState,npcId,gain),after=before+gain;
  const history=[...(worldState.interactions?.history||[]),{type:'talk',npcId,day:session.character.world.day,hour:session.character.world.hour}].slice(-80);
  return{session:{...session,worldState:{...worldState,interactions:{schema:1,history}}},result:{npcId,relationBefore:before,relationAfter:after,message:lineFor(check.def,check.state,after)}};
}
