const T=(id,name,summary,modifiers={},flags=[],runtimeText='',effects={})=>({id,name,summary,modifiers,flags,runtimeText,effects});
export const TALENTS=[
T('sword_bone','天生剑骨','剑法学习、破招与剑意领悟大幅强化。',{insight:4},['sword_affinity'],'剑类修炼与理解 ×1.6；剑类实战命中 +8%，伤害 +12%。',{mastery:{sword:1.6},understanding:{sword:1.6},combat:{sword:{accuracyBonus:.08,damageMultiplier:1.12}}}),
T('open_meridians','百脉俱通','内功修炼与冲穴效率极高。',{root:10},['meridian_mastery'],'内功修炼与理解 ×1.6；实战真气上限 +20%。',{mastery:{internal:1.6},understanding:{internal:1.6},combat:{energyMultiplier:1.2}}),
T('martial_genius','武学奇才','所有武学理解与学习效率全面提高。',{insight:8},['all_martial_learning'],'所有武学修炼与理解 ×1.35。',{mastery:{all:1.35},understanding:{all:1.35}}),
T('effort_rewarded','天道酬勤','有效练习必有积累，任何一次认真修炼都不会完全没有进步。',{},['guaranteed_progress'],'每次有效修炼至少获得 1 点熟练度，不会出现零收益。',{guaranteedProgress:true}),
T('martial_deduction','武学推演','擅长从招式结构中找缺陷、补残篇、推后续。',{insight:5},['deduction'],'所有武学理解获取 ×1.5。',{understanding:{all:1.5}}),
T('perfect_memory','过目不忘','招式、口诀和行功细节几乎不会遗忘。',{insight:5},['combat_observation'],'所有武学理解获取 ×1.25。',{understanding:{all:1.25}}),
T('battle_enlightenment','战中悟道','越危险的实战越容易把纸面理解变成真正领悟。',{will:4},['battle_growth'],'每次完成实战后，本场使用过的武学额外获得 3 点理解。',{battleUnderstandingGain:3}),
T('divine_strength','天生神力','肉体力量远超常人，刚猛招式天然占优。',{physique:14},['super_strength'],'所有实战招式伤害额外 ×1.15。',{combat:{all:{damageMultiplier:1.15}}}),
T('pure_body','无垢道体','真气运转顺畅，体内杂气与冲突极少。',{root:8,will:3},['qi_compatibility'],'内功修炼与理解 ×1.25；实战防御 +10%，真气上限 +15%。',{mastery:{internal:1.25},understanding:{internal:1.25},combat:{defenseMultiplier:1.1,energyMultiplier:1.15}}),
T('all_methods_one','万法归一','不同路数在你身上更容易互相印证，而不是彼此拖累。',{insight:4},['cross_school_compatibility'],'所有武学修炼与理解 ×1.15，代表兼修损耗显著降低。',{mastery:{all:1.15},understanding:{all:1.15}}),
T('lucky_star','福星高照','对江湖风波和奇遇有异乎寻常的预感。',{fortune:15},['fortune_events'],'江湖志额外预示下一阶段可能出现的可介入地点。',{eventForesight:true}),
T('life_death_metamorphosis','生死蜕变','真正被逼到极限并活下来后，身体与心志会留下永久蜕变。',{will:5},['near_death_growth'],'切磋落败后永久根骨 +1、定力 +1，最多触发 3 次。',{lossGrowth:{root:1,will:1,maxTriggers:3}}),
T('blade_heart','天生刀心','刀法学习、刀意与杀伐路线大幅强化。',{insight:4},['blade_affinity'],'刀类修炼与理解 ×1.6；刀类实战命中 +8%，伤害 +12%。',{mastery:{saber:1.6},understanding:{saber:1.6},combat:{saber:{accuracyBonus:.08,damageMultiplier:1.12}}}),
T('innocent_heart','赤子之心','心境纯粹，练功时更少杂念，临敌也更不易失衡。',{will:14},['pure_mind'],'所有武学理解 ×1.2；实战防御 +5%。',{understanding:{all:1.2},combat:{defenseMultiplier:1.05}}),
T('peerless_insight','绝世悟性','对武学原理的理解速度远超常人。',{insight:18},['insight_cap_up'],'所有武学理解获取 ×1.65。',{understanding:{all:1.65}})];
export const TALENT_BY_ID=Object.fromEntries(TALENTS.map(t=>[t.id,t]));
