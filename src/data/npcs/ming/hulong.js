export const ZHU_WUSHI={
  id:'npc_zhu_wushi',name:'朱无视',source:'天下第一',aiTier:'S',factionId:'faction_hulong',role:'护龙山庄庄主',homeLocationId:'ming_capital',homeSceneId:'ming_hulong_gate',
  personality:{ambition:95,patience:96,control:98,loyaltyMask:90},
  publicGoals:['维护皇室威严','压制东厂'],hiddenGoals:['扩张私人势力','积累功力','清除政治障碍'],
  routine:[{from:6,to:11,sceneId:'ming_hulong_gate',activity:'处理山庄事务'},{from:11,to:18,sceneId:'ming_capital_street',activity:'调度情报与密探'},{from:18,to:24,sceneId:'ming_hulong_gate',activity:'密议与修炼'},{from:0,to:6,sceneId:'ming_hulong_gate',activity:'闭门休息'}]
};
