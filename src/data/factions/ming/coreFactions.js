const F=(id,name,type,homeLocationId)=>({id,name,type,homeLocationId});
export const MING_CORE_FACTIONS=[
F('faction_hulong','护龙山庄','court-jianghu','ming_capital'),
F('faction_huashan','华山派','sect','ming_huashan'),
F('faction_songshan','嵩山派','sect','ming_songshan'),
F('faction_shaolin','少林','sect','ming_songshan'),
F('faction_fuwei','福威镖局','escort','ming_fuzhou')
];
export const MING_CORE_FACTION_BY_ID=Object.fromEntries(MING_CORE_FACTIONS.map(x=>[x.id,x]));
