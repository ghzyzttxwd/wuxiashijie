import {resolveCombatAction} from './actionResolver.js';
import {isDefeated} from './combatant.js';

export function createBattleState({left,right}){
  if(!left||!right) throw Error('invalid_battle_state');
  return{schema:1,turn:0,finished:false,winnerId:null,combatants:{[left.id]:left,[right.id]:right},log:[]};
}

export function executeAction(state,{attackerId,defenderId,martialId,rng=Math.random}){
  if(state.finished) return{state,events:[{type:'battle_finished'}],result:null};
  const attacker=state.combatants[attackerId],defender=state.combatants[defenderId];
  if(!attacker||!defender) throw Error('combatant_not_found');
  const result=resolveCombatAction({attacker,defender,martialId,rng});
  if(!result.ok) return{state,events:result.events,result};

  const nextAttacker={...attacker,energy:Math.max(0,attacker.energy-result.energyCost)};
  const nextDefender=result.hit?{...defender,hp:Math.max(0,defender.hp-result.damage)}:{...defender};
  const defeated=isDefeated(nextDefender);
  const next={
    ...state,
    turn:state.turn+1,
    finished:defeated,
    winnerId:defeated?attacker.id:null,
    combatants:{...state.combatants,[attacker.id]:nextAttacker,[defender.id]:nextDefender},
    log:[...state.log,{turn:state.turn+1,attackerId,defenderId,martialId,hit:result.hit,damage:result.damage}]
  };
  const events=defeated?[...result.events,{type:'defeat',targetId:defender.id,winnerId:attacker.id}]:result.events;
  return{state:next,events,result};
}
