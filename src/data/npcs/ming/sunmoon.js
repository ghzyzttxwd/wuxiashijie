export const DONGFANG_BUBAI={
  id:'npc_dongfang_bubai',name:'东方不败',source:'笑傲江湖',aiTier:'S',factionId:'faction_sunmoon',role:'日月神教教主',homeLocationId:'ming_heimuya',homeSceneId:'ming_heimuya_inner',
  personality:{control:94,detachment:88,pride:96,decisiveness:91},publicGoals:['维持黑木崖统治'],hiddenGoals:['隔绝教内威胁','确保自身绝对安全'],
  routine:[{from:6,to:12,sceneId:'ming_heimuya_inner',activity:'处理教内密务'},{from:12,to:18,sceneId:'ming_heimuya_inner',activity:'闭门修炼'},{from:18,to:24,sceneId:'ming_heimuya_gate',activity:'秘密巡视总坛'},{from:0,to:6,sceneId:'ming_heimuya_inner',activity:'深居不出'}]
};

export const REN_YINGYING={
  id:'npc_ren_yingying',name:'任盈盈',source:'笑傲江湖',aiTier:'A',factionId:'faction_sunmoon',role:'日月神教圣姑',homeLocationId:'ming_heimuya',homeSceneId:'ming_heimuya_inner',
  personality:{intelligence:91,loyalty:84,independence:88,empathy:72},publicGoals:['维持教中人脉','掌握江湖消息'],hiddenGoals:['关注任我行下落','保留自己的行动空间'],
  routine:[{from:6,to:10,sceneId:'ming_heimuya_inner',activity:'处理教中来信'},{from:10,to:17,locationId:'ming_luoyang',sceneId:'ming_luoyang_inn',activity:'以隐秘身份接触江湖人'},{from:17,to:22,locationId:'ming_luoyang',sceneId:'ming_luoyang_black_market',activity:'交换情报'},{from:22,to:6,sceneId:'ming_heimuya_inner',activity:'返回黑木崖'}]
};

export const XIANG_WENTIAN={
  id:'npc_xiang_wentian',name:'向问天',source:'笑傲江湖',aiTier:'A',factionId:'faction_sunmoon',role:'日月神教高手',homeLocationId:'ming_luoyang',homeSceneId:'ming_luoyang_inn',
  personality:{loyalty:95,caution:86,resourcefulness:90,boldness:82},publicGoals:['躲避神教耳目'],hiddenGoals:['营救任我行','寻找可靠帮手'],
  routine:[{from:6,to:11,locationId:'ming_luoyang',sceneId:'ming_luoyang_inn',activity:'暗中物色帮手'},{from:11,to:17,locationId:'ming_meizhuang',sceneId:'ming_meizhuang_gate',activity:'踩探梅庄守备'},{from:17,to:23,locationId:'ming_luoyang',sceneId:'ming_luoyang_black_market',activity:'购买情报与物资'},{from:23,to:6,locationId:'ming_luoyang',sceneId:'ming_luoyang_inn',activity:'隐藏行踪'}]
};
