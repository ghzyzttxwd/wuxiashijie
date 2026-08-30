const M=(id,name,category,grade,summary,training,combatTags)=>({id,name,source:'通用江湖',category,grade,summary,requirements:{attributes:{}},learnSources:[{type:'common'}],training,combatTags});
export const BASIC_FIST=M('martial_basic_fist','基础拳法','fist','入门','最朴素的拳脚根基，强调站稳、出拳和收势。',{difficulty:12,masteryRate:1.2,understandingRate:.45},['unarmed','close','direct']);
export const BASIC_SWORD=M('martial_basic_sword','基础剑法','sword','入门','剑术最基本的刺、削、劈、撩与步法配合。',{difficulty:14,masteryRate:1.1,understandingRate:.5},['weapon','sword','balanced']);
export const BASIC_SABER=M('martial_basic_saber','基础刀法','saber','入门','以劈、斩、撩为主的基础实战刀法。',{difficulty:13,masteryRate:1.15,understandingRate:.42},['weapon','saber','power']);
