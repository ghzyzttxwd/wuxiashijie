export const DUAN_TIANYA={
  id:'npc_duan_tianya',name:'段天涯',source:'天下第一',aiTier:'A',factionId:'faction_hulong',role:'护龙山庄密探',homeLocationId:'ming_capital',homeSceneId:'ming_hulong_gate',
  personality:{calm:90,loyalty:91,discipline:88,mercy:62},publicGoals:['执行护龙山庄任务','调查江湖异动'],hiddenGoals:['保护重要同伴'],
  routine:[{from:6,to:11,sceneId:'ming_hulong_gate',activity:'回山庄复命'},{from:11,to:18,locationId:'ming_luoyang',sceneId:'ming_luoyang_inn',activity:'乔装调查江湖消息'},{from:18,to:24,sceneId:'ming_capital_inn',activity:'整理情报'},{from:0,to:6,sceneId:'ming_hulong_gate',activity:'休息'}]
};

export const GUIHAI_YIDAO={
  id:'npc_guihai_yidao',name:'归海一刀',source:'天下第一',aiTier:'A',factionId:'faction_hulong',role:'护龙山庄密探',homeLocationId:'ming_capital',homeSceneId:'ming_hulong_gate',
  personality:{discipline:84,vengeance:91,restraint:64,killingIntent:55},publicGoals:['追查旧案','磨炼刀法'],hiddenGoals:['查明父仇真相','压制阿鼻道杀意'],
  routine:[{from:6,to:12,sceneId:'ming_hulong_gate',activity:'校场练刀'},{from:12,to:18,sceneId:'ming_capital_street',activity:'查访旧案线索'},{from:18,to:24,sceneId:'ming_hulong_gate',activity:'独自练功'},{from:0,to:6,sceneId:'ming_hulong_gate',activity:'静坐压制杀意'}]
};

export const SHANGGUAN_HAITANG={
  id:'npc_shangguan_haitang',name:'上官海棠',source:'天下第一',aiTier:'A',factionId:'faction_hulong',role:'天下第一庄庄主兼密探',homeLocationId:'ming_capital',homeSceneId:'ming_hulong_gate',
  personality:{intelligence:92,social:94,loyalty:88,curiosity:84},publicGoals:['经营情报网','招揽江湖人才'],hiddenGoals:['核验朱无视交办的隐秘情报'],
  routine:[{from:6,to:10,sceneId:'ming_hulong_gate',activity:'汇总天下第一庄情报'},{from:10,to:17,locationId:'ming_luoyang',sceneId:'ming_luoyang_market',activity:'接触江湖线人'},{from:17,to:22,locationId:'ming_luoyang',sceneId:'ming_luoyang_inn',activity:'暗中观察江湖人士'},{from:22,to:6,sceneId:'ming_hulong_gate',activity:'秘密回京'}]
};

export const CHENG_SHIFEI={
  id:'npc_cheng_shifei',name:'成是非',source:'天下第一',aiTier:'B',factionId:null,role:'市井青年',homeLocationId:'ming_capital',homeSceneId:'ming_capital_street',
  personality:{clever:79,playful:94,greed:63,courage:71},publicGoals:['混口饭吃','躲开麻烦'],hiddenGoals:['寻找改变命运的机会'],
  routine:[{from:7,to:13,sceneId:'ming_capital_street',activity:'在街头厮混'},{from:13,to:20,sceneId:'ming_capital_inn',activity:'打听发财门路'},{from:20,to:24,sceneId:'ming_prison_gate',activity:'因意外靠近天牢区域'},{from:0,to:7,sceneId:'ming_capital_inn',activity:'借宿'}]
};
