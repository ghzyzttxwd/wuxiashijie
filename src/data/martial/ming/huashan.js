export const HUASHAN_BASIC_SWORD={
  id:'martial_huashan_basic_sword',name:'华山基础剑法',source:'笑傲江湖',category:'sword',grade:'普通',summary:'华山门人的正式剑术根基，重基础剑理、身法配合与招式衔接。',
  requirements:{attributes:{agility:40,insight:38}},learnSources:[{type:'faction',factionId:'faction_huashan',minRelation:0},{type:'teacher',npcId:'npc_linghu_chong'},{type:'manual',itemId:'manual_huashan_basic_sword'}],
  training:{difficulty:24,masteryRate:1,understandingRate:.62},combatTags:['weapon','sword','huashan','flow']
};
export const ZIXIA_GONG={
  id:'martial_zixia_gong',name:'紫霞神功',source:'笑傲江湖',category:'internal',grade:'上乘',summary:'华山派上乘内功。重根基、内息质量与持续运转，不是单纯增加一截攻击力。',
  requirements:{attributes:{root:58,will:52,insight:48},prerequisites:['martial_huashan_basic_sword']},learnSources:[{type:'teacher',npcId:'npc_yue_buqun',minRelation:60},{type:'manual',itemId:'manual_zixia_gong'}],
  training:{difficulty:68,masteryRate:.52,understandingRate:.48},combatTags:['internal','huashan','qi-quality','sustain']
};
