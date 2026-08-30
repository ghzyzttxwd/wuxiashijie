import {TALENT_BY_ID} from '../data/talents.js';

export function talentDefinition(character){return character?.talentId?TALENT_BY_ID[character.talentId]||null:null;}
export function talentRuntimeText(character){return talentDefinition(character)?.runtimeText||'无外挂：没有额外特殊机制。';}
export function trainingEffectMultiplier(character,kind,category){const table=talentDefinition(character)?.effects?.[kind]||{};return (table.all??1)*(table[category]??1);}
export function combatActionTalentBonus(talentId,category){const combat=TALENT_BY_ID[talentId]?.effects?.combat||{},all=combat.all||{},specific=combat[category]||{};return{accuracyBonus:(all.accuracyBonus||0)+(specific.accuracyBonus||0),damageMultiplier:(all.damageMultiplier||1)*(specific.damageMultiplier||1)};}
export function combatStatTalentBonus(character){const combat=talentDefinition(character)?.effects?.combat||{};return{defenseMultiplier:combat.defenseMultiplier||1,energyMultiplier:combat.energyMultiplier||1};}
export function hasEventForesight(character){return Boolean(talentDefinition(character)?.effects?.eventForesight);}
export function battleUnderstandingGain(character){return talentDefinition(character)?.effects?.battleUnderstandingGain||0;}
export function lossGrowthEffect(character){return talentDefinition(character)?.effects?.lossGrowth||null;}
