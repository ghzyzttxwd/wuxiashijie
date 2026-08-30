export function applyEventEffects(worldState,effects={}){
  let next={...worldState,events:{...worldState.events,flags:{...(worldState.events?.flags||{})}},npc:{...worldState.npc,states:{...(worldState.npc?.states||{})}}};
  if(effects.setFlags)next.events.flags={...next.events.flags,...effects.setFlags};
  for(const id of effects.killNpcIds||[]){const state=next.npc.states[id];if(state)next.npc.states[id]={...state,alive:false,health:0,activity:'已故'};}
  for(const id of effects.reviveNpcIds||[]){const state=next.npc.states[id];if(state)next.npc.states[id]={...state,alive:true,health:Math.max(1,state.health||100)};}
  return next;
}
