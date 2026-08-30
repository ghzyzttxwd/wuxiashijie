export const FUWEI_CRISIS={
  id:'event_fuwei_crisis',name:'福威镖局风波',scope:'ming',initialPhase:'calm',summary:'围绕林家旧宅、辟邪剑谱与福威镖局逐渐逼近的危机。默认历史会恶化，但玩家和NPC都能改变结果。',
  phases:[
    {id:'calm',name:'暗流初起',rumor:'福州近来多了些打听林家旧事的陌生江湖人。',transitions:[{to:'prepared',priority:90,when:{flagsAll:['fuwei_warned']}},{to:'pressure',priority:10,when:{minDay:3}}]},
    {id:'pressure',name:'窥伺加剧',rumor:'福威镖局已察觉有人盯梢，林家上下仍未弄清真正来意。',transitions:[{to:'diverted',priority:100,when:{flagsAll:['bixie_clue_removed']}},{to:'prepared',priority:90,when:{flagsAll:['fuwei_warned']}},{to:'shattered',priority:85,when:{npcDead:['npc_lin_zhennan']}},{to:'assault',priority:10,when:{minDay:6}}]},
    {id:'prepared',name:'林家戒备',rumor:'林家似乎提前得了风声，福威镖局开始收缩人手。',transitions:[{to:'shattered',priority:100,when:{npcDead:['npc_lin_zhennan']}},{to:'survived',priority:90,when:{flagsAll:['fuwei_supported'],minDay:7}},{to:'assault',priority:10,when:{minDay:9}}]},
    {id:'assault',name:'危机爆发',rumor:'福州江湖风声骤紧，福威镖局已到了生死关口。',transitions:[{to:'survived',priority:100,when:{flagsAll:['fuwei_supported']}},{to:'shattered',priority:10,when:{minDay:10},effects:{killNpcIds:['npc_lin_zhennan'],setFlags:{fuwei_fallen:true}}}]},
    {id:'diverted',name:'线索转移',terminal:true,rumor:'真正的剑谱线索已不在原处，盯着林家的势力开始彼此猜疑。'},
    {id:'survived',name:'林家暂保',terminal:true,rumor:'福威镖局熬过了这一轮围猎，但辟邪剑谱引出的风波远未彻底结束。'},
    {id:'shattered',name:'福威覆局',terminal:true,rumor:'福威镖局遭逢大变，林家命运已经偏离最初轨迹。'}
  ],
  interventions:[
    {id:'warn_lin_family',name:'提醒林家有人窥伺',locationId:'ming_fuzhou',sceneId:'ming_fuwei_escort',allowedPhases:['calm','pressure'],setFlags:{fuwei_warned:true}},
    {id:'remove_bixie_clue',name:'转移向阳巷旧宅线索',locationId:'ming_fuzhou',sceneId:'ming_xiangyang_lane',allowedPhases:['calm','pressure'],setFlags:{bixie_clue_removed:true}},
    {id:'support_fuwei',name:'在危局中帮助福威镖局',locationId:'ming_fuzhou',sceneId:'ming_fuwei_escort',allowedPhases:['prepared','assault'],setFlags:{fuwei_supported:true}}
  ]
};
