import {SAVE_SCHEMA,migrateSaveEnvelope} from './migrations.js';

export const SAVE_KEY='jiuzhou_wuxia_save_v1';
export const SLOT_COUNT=5;

const empty=()=>Array.from({length:SLOT_COUNT},()=>null);
const envelope=slots=>({schema:SAVE_SCHEMA,updatedAt:new Date().toISOString(),slots});

export function getSlots(storage=localStorage){
  try{
    const raw=JSON.parse(storage.getItem(SAVE_KEY)||'null');
    const migrated=migrateSaveEnvelope(raw,SLOT_COUNT);
    return migrated?migrated.slots:empty();
  }catch{return empty();}
}

export function saveCharacter(index,character,storage=localStorage){
  if(index<0||index>=SLOT_COUNT) throw Error('invalid_slot');
  const slots=getSlots(storage);slots[index]=character;
  storage.setItem(SAVE_KEY,JSON.stringify(envelope(slots)));
  return slots;
}

export function loadCharacter(index,storage=localStorage){
  if(index<0||index>=SLOT_COUNT) throw Error('invalid_slot');
  return getSlots(storage)[index]??null;
}

export function deleteSlot(index,storage=localStorage){
  if(index<0||index>=SLOT_COUNT) throw Error('invalid_slot');
  const slots=getSlots(storage);slots[index]=null;
  storage.setItem(SAVE_KEY,JSON.stringify(envelope(slots)));
  return slots;
}
