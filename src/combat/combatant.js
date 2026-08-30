export function createCombatant({id,name,maxHp=100,hp=maxHp,attack=50,defense=30,speed=50,maxEnergy=100,energy=maxEnergy,side='left'}){
  if(!id||!name) throw Error('invalid_combatant');
  return{id,name,maxHp,hp:Math.max(0,Math.min(maxHp,hp)),attack,defense,speed,maxEnergy,energy:Math.max(0,Math.min(maxEnergy,energy)),side,status:[]};
}

export function isDefeated(combatant){return !combatant||combatant.hp<=0;}
