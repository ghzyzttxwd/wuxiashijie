const CAPITAL_ORIGINS=new Set(['military_house','official_heir','hereditary_marquis','prince_heir','imperial_clan','imperial_child']);
export function getOriginSpawnLocation(originId){return CAPITAL_ORIGINS.has(originId)?'ming_capital':'ming_luoyang';}
