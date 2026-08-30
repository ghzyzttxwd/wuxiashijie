import {MARTIAL_BY_ID}from'../data/martial/index.js';
export const MARTIAL_STATE_SCHEMA=1;
export const MASTERY_MAX=10000,UNDERSTANDING_MAX=100;
export function createMartialEntry(id){if(!MARTIAL_BY_ID[id])throw Error('unknown_martial');return{id,mastery:0,understanding:0,trainingHours:0,learnedAt:null};}
export function ensureMartialState(character){const existing=character.martialState;if(existing?.schema===MARTIAL_STATE_SCHEMA&&existing.learned)return character;const learned={};for(const id of character.martialKnown||[])if(MARTIAL_BY_ID[id])learned[id]=createMartialEntry(id);return{...character,martialState:{schema:MARTIAL_STATE_SCHEMA,learned}};}
export function hasMartial(character,id){return Boolean(ensureMartialState(character).martialState.learned[id]);}
export function masteryStage(mastery){if(mastery>=10000)return'圆满';if(mastery>=7000)return'大成';if(mastery>=4000)return'熟练';if(mastery>=1500)return'入门';return'初学';}
