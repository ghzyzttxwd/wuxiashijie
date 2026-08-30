export const CAO_ZHENGCHUN={
  id:'npc_cao_zhengchun',name:'曹正淳',source:'天下第一',aiTier:'S',factionId:'faction_east_depot',role:'东厂督主',homeLocationId:'ming_capital',homeSceneId:'ming_east_depot',
  personality:{ambition:91,scheming:93,cruelty:82,patience:84},publicGoals:['扩张东厂权势','打压护龙山庄'],hiddenGoals:['控制更多朝堂与江湖情报渠道'],
  routine:[{from:6,to:12,sceneId:'ming_east_depot',activity:'处理东厂密报'},{from:12,to:18,sceneId:'ming_capital_street',activity:'巡视并布置眼线'},{from:18,to:24,sceneId:'ming_east_depot',activity:'审阅抓捕名单'},{from:0,to:6,sceneId:'ming_east_depot',activity:'闭门练功'}]
};
