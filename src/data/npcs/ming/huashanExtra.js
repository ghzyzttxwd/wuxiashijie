export const NING_ZHONGZE={
  id:'npc_ning_zhongze',name:'宁中则',source:'笑傲江湖',aiTier:'B',factionId:'faction_huashan',role:'华山派重要长辈',homeLocationId:'ming_huashan',homeSceneId:'ming_huashan_hall',
  personality:{upright:92,kindness:88,discipline:76,independence:81},publicGoals:['维持华山秩序','照看门中弟子'],hiddenGoals:['在门派利益与家人之间保持底线'],
  routine:[{from:6,to:11,sceneId:'ming_huashan_hall',activity:'处理门内事务'},{from:11,to:17,sceneId:'ming_huashan_gate',activity:'指导弟子'},{from:17,to:22,sceneId:'ming_huashan_hall',activity:'与门中长辈议事'},{from:22,to:6,sceneId:'ming_huashan_hall',activity:'休息'}]
};

export const FENG_QINGYANG={
  id:'npc_feng_qingyang',name:'风清扬',source:'笑傲江湖',aiTier:'B',factionId:'faction_huashan',role:'隐世剑客',homeLocationId:'ming_huashan',homeSceneId:'ming_huashan_back',
  personality:{freedom:96,pride:86,insight:98,worldWeariness:83},publicGoals:['隐居不问门派俗务'],hiddenGoals:['寻找真正值得传剑的人'],
  routine:[{from:5,to:9,sceneId:'ming_huashan_back',activity:'独行山间'},{from:9,to:15,sceneId:'ming_huashan_cliff',activity:'远观后辈练剑'},{from:15,to:21,sceneId:'ming_huashan_cave',activity:'隐居参剑'},{from:21,to:5,sceneId:'ming_huashan_back',activity:'避人休息'}],
  visibility:{hidden:true,requiresDiscovery:true}
};
