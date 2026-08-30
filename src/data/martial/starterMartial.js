import {MARTIAL_BY_ID} from './index.js';

const M=(id,name,type)=>({id,name,type});

// 这里只保留尚未进入正式武学引擎的背景能力/未来传承占位。
// 已正式实现的武功（例如基础拳/剑/刀）必须只由 MARTIAL_BY_ID 提供，禁止复制第二份定义。
export const STARTER_BACKGROUND_ABILITIES=[
  M('skill_wilderness_survival','山林生存','skill'),
  M('skill_basic_medicine','基础医术','skill'),
  M('martial_basic_internal','基础内功','future-martial'),
  M('martial_family_internal','家传内功','future-martial'),
  M('skill_saber_spear_basics','刀枪基础','skill')
];

export const STARTER_MARTIAL=[...STARTER_BACKGROUND_ABILITIES,...Object.values(MARTIAL_BY_ID)];
export const STARTER_MARTIAL_BY_ID={
  ...Object.fromEntries(STARTER_BACKGROUND_ABILITIES.map(x=>[x.id,x])),
  ...MARTIAL_BY_ID
};
