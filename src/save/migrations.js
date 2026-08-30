export const SAVE_SCHEMA=2;

function wrapLegacySlot(slot){
  if(!slot)return null;
  if(slot.character)return slot;
  return{schema:1,character:slot,worldState:null};
}
function normalizeSlots(slots,count,wrap=false){const result=Array.from({length:count},()=>null);for(let i=0;i<Math.min(count,Array.isArray(slots)?slots.length:0);i++)result[i]=wrap?wrapLegacySlot(slots[i]):slots[i]??null;return result;}

export function migrateSaveEnvelope(raw,slotCount){
  if(!raw||typeof raw!=='object')return null;
  if(raw.schema===SAVE_SCHEMA&&Array.isArray(raw.slots))return{schema:SAVE_SCHEMA,updatedAt:typeof raw.updatedAt==='string'?raw.updatedAt:null,slots:normalizeSlots(raw.slots,slotCount)};
  if(raw.schema===1&&Array.isArray(raw.slots))return{schema:SAVE_SCHEMA,updatedAt:typeof raw.updatedAt==='string'?raw.updatedAt:null,slots:normalizeSlots(raw.slots,slotCount,true)};
  return null;
}
