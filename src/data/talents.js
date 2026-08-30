const T=(id,name,summary,modifiers={},flags=[])=>({id,name,summary,modifiers,flags});
export const TALENTS=[
T('sword_bone','天生剑骨','剑法学习、破招与剑意领悟大幅强化。',{insight:4},['sword_affinity']),
T('open_meridians','百脉俱通','内功修炼与冲穴效率极高。',{root:10},['meridian_mastery']),
T('martial_genius','武学奇才','所有武学理解与学习效率全面提高。',{insight:8},['all_martial_learning']),
T('effort_rewarded','天道酬勤','有效练习必有积累，低阶武学练至极致可质变。',{},['guaranteed_progress']),
T('martial_deduction','武学推演','修残篇、推后续、找缺陷，后期可融合武学。',{insight:5},['deduction']),
T('perfect_memory','过目不忘','秘籍与招式几乎不会遗忘，更容易观察偷学。',{insight:5},['combat_observation']),
T('battle_enlightenment','战中悟道','越危险的实战越容易临阵突破。',{will:4},['battle_growth']),
T('divine_strength','天生神力','肉体力量远超常人，适合重兵器与刚猛武学。',{physique:14},['super_strength']),
T('pure_body','无垢道体','内功兼容、真气调和与内伤恢复能力极强。',{root:8,will:3},['qi_compatibility']),
T('all_methods_one','万法归一','不同门派武学之间冲突显著降低。',{insight:4},['cross_school_compatibility']),
T('lucky_star','福星高照','隐藏奇遇、贵人、宝物和绝处逢生事件显著增加。',{fortune:15},['fortune_events']),
T('life_death_metamorphosis','生死蜕变','真正濒死并活下来后，有机会永久蜕变。',{will:5},['near_death_growth']),
T('blade_heart','天生刀心','刀法学习、刀意与杀伐路线大幅强化。',{insight:4},['blade_affinity']),
T('innocent_heart','赤子之心','心境纯粹，定力、心魔抗性和顿悟突出。',{will:14},['pure_mind']),
T('peerless_insight','绝世悟性','把悟性上限拉到异常层级。',{insight:18},['insight_cap_up'])];
export const TALENT_BY_ID=Object.fromEntries(TALENTS.map(t=>[t.id,t]));
