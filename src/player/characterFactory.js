import {ATTRIBUTE_DEFS,rollBaseAttributes} from '../data/attributes.js';
import {ORIGIN_BY_ID} from '../data/origins.js';
import {TALENT_BY_ID} from '../data/talents.js';

export const CHARACTER_SCHEMA=2;

export function applyModifiers(base,...sets){
  const next={...base};
  for(const mods of sets) for(const [key,value] of Object.entries(mods||{})) next[key]=(next[key]||0)+value;
  return next;
}

export function validateAttributeShape(attributes){
  return ATTRIBUTE_DEFS.every(({id})=>Number.isFinite(attributes?.[id]));
}

export function previewCharacter(base,originId,talentId=null){
  if(!validateAttributeShape(base)) throw Error('invalid_attributes');
  const origin=ORIGIN_BY_ID[originId];
  if(!origin) throw Error('invalid_origin');
  const talent=talentId?TALENT_BY_ID[talentId]:null;
  if(talentId&&!talent) throw Error('invalid_talent');
  return applyModifiers(base,origin.modifiers,talent?.modifiers);
}

function copyGrant(grant){
  return {silver:grant?.silver||0,items:(grant?.items||[]).map(x=>({...x})),martial:[...(grant?.martial||[])],assets:[...(grant?.assets||[])]};
}

export function createCharacter({name,originId,talentId=null,baseAttributes=rollBaseAttributes()}){
  const origin=ORIGIN_BY_ID[originId];
  if(!origin) throw Error('invalid_origin');
  const talent=talentId?TALENT_BY_ID[talentId]:null;
  if(talentId&&!talent) throw Error('invalid_talent');
  if(!validateAttributeShape(baseAttributes)) throw Error('invalid_attributes');
  const grant=copyGrant(origin.grant);
  return {
    schema:CHARACTER_SCHEMA,
    id:`pc_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    name:(name||'无名氏').trim().slice(0,10)||'无名氏',
    originId,talentId,
    baseAttributes:{...baseAttributes},
    attributes:previewCharacter(baseAttributes,originId,talentId),
    traits:[...(talent?.flags||[])],
    wallet:{silver:grant.silver},
    inventory:grant.items,
    martialKnown:grant.martial,
    originAssets:grant.assets,
    world:{country:'ming',location:'unassigned',day:1,hour:8},
    progress:{milestone:'character-created'}
  };
}
