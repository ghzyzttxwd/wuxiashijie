export const LIN_ZHENNAN={
  id:'npc_lin_zhennan',name:'林震南',source:'笑傲江湖',aiTier:'B',factionId:'faction_fuwei',role:'福威镖局总镖头',homeLocationId:'ming_fuzhou',homeSceneId:'ming_fuwei_escort',
  personality:{family:96,reputation:86,caution:73,pragmatism:82},publicGoals:['维持福威镖局生意','保护林家'],hiddenGoals:['避免家传旧事招来灭门之祸'],
  routine:[{from:6,to:12,sceneId:'ming_fuwei_escort',activity:'处理镖局事务'},{from:12,to:17,sceneId:'ming_fuzhou_street',activity:'拜访商户与打点关系'},{from:17,to:22,sceneId:'ming_fuwei_escort',activity:'与镖师议事'},{from:22,to:6,sceneId:'ming_fuwei_escort',activity:'回府休息'}]
};
