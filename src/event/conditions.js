function flagValue(flags,key){return flags?.[key];}
export function conditionMatches(condition={},context={}){
  const {world={},flags={},npcStates={}}=context;
  if(condition.minDay!=null&&(world.day??1)<condition.minDay)return false;
  if(condition.maxDay!=null&&(world.day??1)>condition.maxDay)return false;
  if(condition.flagsAll?.some(key=>!flagValue(flags,key)))return false;
  if(condition.flagsAny?.length&&!condition.flagsAny.some(key=>flagValue(flags,key)))return false;
  if(condition.flagsNone?.some(key=>flagValue(flags,key)))return false;
  if(condition.npcDead?.some(id=>npcStates[id]?.alive!==false))return false;
  if(condition.npcAlive?.some(id=>npcStates[id]?.alive===false))return false;
  return true;
}
