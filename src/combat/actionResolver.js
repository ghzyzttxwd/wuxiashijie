import {M5_COMBAT_ACTION_BY_MARTIAL_ID} from '../data/combat/m5Actions.js';
import {MARTIAL_BY_ID} from '../data/martial/index.js';
import {combatActionTalentBonus}from'../player/talentRuntime.js';

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export function calculateDamage(attacker,defender,action,damageMultiplier=1){const offense=action.power*(.72+attacker.attack/100)*damageMultiplier,mitigation=defender.defense*.34;return Math.max(1,Math.round(offense-mitigation));}
export function resolveCombatAction({attacker,defender,martialId,rng=Math.random}){
  const action=M5_COMBAT_ACTION_BY_MARTIAL_ID[martialId],martial=MARTIAL_BY_ID[martialId];if(!action||!martial)throw Error('unsupported_combat_action');if(attacker.energy<action.energyCost)return{ok:false,reason:'energy',events:[{type:'action_rejected',reason:'energy'}]};
  const talent=combatActionTalentBonus(attacker.talentId,martial.category),hitChance=clamp(action.accuracy+talent.accuracyBonus+(attacker.speed-defender.speed)*.003,.12,.98),hit=rng()<hitChance,events=[{type:'action_start',actorId:attacker.id,targetId:defender.id,martialId,martialName:martial.name,durationMs:action.startupMs},{type:'approach',actorId:attacker.id,targetId:defender.id,range:action.range,durationMs:Math.max(90,Math.round(action.startupMs*.65))}];
  if(!hit){events.push({type:'miss',actorId:attacker.id,targetId:defender.id,martialId,durationMs:action.activeMs});events.push({type:'recover',actorId:attacker.id,durationMs:action.recoveryMs});return{ok:true,hit:false,damage:0,energyCost:action.energyCost,events};}
  const damage=calculateDamage(attacker,defender,action,talent.damageMultiplier);events.push({type:'hit',actorId:attacker.id,targetId:defender.id,martialId,damage,hitStopMs:action.hitStopMs,hitCount:action.hitCount});events.push({type:'knockback',targetId:defender.id,distance:action.knockback,durationMs:Math.max(100,action.hitStopMs*2)});events.push({type:'recover',actorId:attacker.id,durationMs:action.recoveryMs});return{ok:true,hit:true,damage,energyCost:action.energyCost,events};
}
