const M=(id,name,martialId)=>({id,name,type:'manual',martialId});
export const MING_MARTIAL_MANUALS=[
M('manual_huashan_basic_sword','《华山基础剑谱》','martial_huashan_basic_sword'),
M('manual_zixia_gong','《紫霞秘笈》','martial_zixia_gong'),
M('manual_shaolin_vajra_palm','《大力金刚掌谱》','martial_shaolin_vajra_palm')
];
export const MING_MARTIAL_MANUAL_BY_ID=Object.fromEntries(MING_MARTIAL_MANUALS.map(x=>[x.id,x]));
