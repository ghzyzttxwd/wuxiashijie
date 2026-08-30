export const SAVE_SCHEMA=1;

function normalizeSlots(slots,count){
  const result=Array.from({length:count},()=>null);
  for(let i=0;i<Math.min(count,Array.isArray(slots)?slots.length:0);i++) result[i]=slots[i]??null;
  return result;
}

export function migrateSaveEnvelope(raw,slotCount){
  if(!raw||typeof raw!=='object') return null;
  if(raw.schema===1&&Array.isArray(raw.slots)) return {schema:SAVE_SCHEMA,updatedAt:typeof raw.updatedAt==='string'?raw.updatedAt:null,slots:normalizeSlots(raw.slots,slotCount)};
  return null;
}
