import {SAVE_SCHEMA,migrateSaveEnvelope}from'./migrations.js';
export const SAVE_KEY='jiuzhou_wuxia_save_v1',SLOT_COUNT=5;
const empty=()=>Array.from({length:SLOT_COUNT},()=>null),envelope=slots=>({schema:SAVE_SCHEMA,updatedAt:new Date().toISOString(),slots});
function readSessions(storage=localStorage){try{const raw=JSON.parse(storage.getItem(SAVE_KEY)||'null'),migrated=migrateSaveEnvelope(raw,SLOT_COUNT);return migrated?migrated.slots:empty();}catch{return empty();}}
function writeSessions(slots,storage){storage.setItem(SAVE_KEY,JSON.stringify(envelope(slots)));return slots;}
export function getSlots(storage=localStorage){return readSessions(storage).map(session=>session?.character??null);}
export function loadSession(index,storage=localStorage){if(index<0||index>=SLOT_COUNT)throw Error('invalid_slot');return readSessions(storage)[index]??null;}
export function saveSession(index,session,storage=localStorage){if(index<0||index>=SLOT_COUNT)throw Error('invalid_slot');const slots=readSessions(storage);slots[index]=session;writeSessions(slots,storage);return slots;}
export function saveCharacter(index,character,storage=localStorage){if(index<0||index>=SLOT_COUNT)throw Error('invalid_slot');const slots=readSessions(storage),old=slots[index];slots[index]=old?{...old,character}:{schema:1,character,worldState:null};writeSessions(slots,storage);return getSlots(storage);}
export function loadCharacter(index,storage=localStorage){return loadSession(index,storage)?.character??null;}
export function deleteSlot(index,storage=localStorage){if(index<0||index>=SLOT_COUNT)throw Error('invalid_slot');const slots=readSessions(storage);slots[index]=null;writeSessions(slots,storage);return getSlots(storage);}
