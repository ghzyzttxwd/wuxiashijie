export const REN_WOXING={
  id:'npc_ren_woxing',name:'任我行',source:'笑傲江湖',aiTier:'S',factionId:'faction_sunmoon',role:'被囚的日月神教前教主',homeLocationId:'ming_meizhuang',homeSceneId:'ming_meizhuang_prison',
  personality:{ambition:96,dominance:97,vengeance:94,patience:78},publicGoals:['脱离囚禁'],hiddenGoals:['重夺日月神教','清算东方不败'],
  routine:[{from:0,to:24,sceneId:'ming_meizhuang_prison',activity:'被囚于梅庄地牢'}],
  stateFlags:{imprisoned:true}
};

export const HUANG_ZHONGGONG={
  id:'npc_huang_zhonggong',name:'黄钟公',source:'笑傲江湖',aiTier:'B',factionId:'faction_meizhuang',role:'江南四友之首',homeLocationId:'ming_meizhuang',homeSceneId:'ming_meizhuang_hall',
  personality:{caution:83,artistry:94,loyalty:78,conflictAvoidance:72},publicGoals:['守住梅庄','避免外人探知地牢秘密'],hiddenGoals:['维持眼前清静生活'],
  routine:[{from:6,to:12,sceneId:'ming_meizhuang_hall',activity:'抚琴会客'},{from:12,to:18,sceneId:'ming_meizhuang_gate',activity:'查看来客与庄务'},{from:18,to:23,sceneId:'ming_meizhuang_hall',activity:'与兄弟议事'},{from:23,to:6,sceneId:'ming_meizhuang_hall',activity:'休息'}]
};
