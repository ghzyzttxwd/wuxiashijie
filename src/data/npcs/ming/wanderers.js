export const TIAN_BOGUANG={
  id:'npc_tian_boguang',name:'田伯光',source:'笑傲江湖',aiTier:'B',factionId:null,role:'流窜江湖的危险人物',homeLocationId:'ming_luoyang',homeSceneId:'ming_luoyang_inn',
  personality:{boldness:91,recklessness:86,selfPreservation:77,restlessness:95},publicGoals:['四处流窜','躲避追捕'],hiddenGoals:['寻找有利可图或能避风头的地方'],
  routine:[{from:6,to:11,locationId:'ming_luoyang',sceneId:'ming_luoyang_inn',activity:'在客栈打听风声'},{from:11,to:17,locationId:'ming_huashan',sceneId:'ming_huashan_gate',activity:'沿华山一带活动'},{from:17,to:22,locationId:'ming_fuzhou',sceneId:'ming_fuzhou_inn',activity:'换地方避风头'},{from:22,to:6,locationId:'ming_luoyang',sceneId:'ming_luoyang_inn',activity:'夜间潜回洛阳'}]
};
