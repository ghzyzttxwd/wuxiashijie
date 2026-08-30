const M=(id,name,type)=>({id,name,type});
export const STARTER_MARTIAL=[
M('skill_wilderness_survival','山林生存','skill'),M('skill_basic_medicine','基础医术','skill'),M('martial_basic_internal','基础内功','internal'),M('martial_basic_weapon_pair','两门普通武学','package'),M('martial_family_internal','家传内功','internal'),M('skill_saber_spear_basics','刀枪基础','skill')];
export const STARTER_MARTIAL_BY_ID=Object.fromEntries(STARTER_MARTIAL.map(x=>[x.id,x]));
