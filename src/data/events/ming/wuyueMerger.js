export const WUYUE_MERGER={
  id:'event_wuyue_merger',name:'五岳并派',scope:'ming',initialPhase:'plotting',summary:'左冷禅持续推动五岳并派。事件不会强制照原著发生：关键人物死亡、阴谋曝光或玩家站队都会改变结局。',
  phases:[
    {id:'plotting',name:'嵩山谋局',rumor:'嵩山派近来与各派往来频繁，似乎在筹划一件影响五岳格局的大事。',transitions:[{to:'collapsed',priority:100,when:{npcDead:['npc_zuo_lengchan']}},{to:'exposed',priority:90,when:{flagsAll:['songshan_scheme_exposed']}},{to:'pressure',priority:10,when:{minDay:5}}]},
    {id:'pressure',name:'威逼合流',rumor:'五岳各派开始感受到嵩山压力，并派之议逐渐摆到台面上。',transitions:[{to:'collapsed',priority:100,when:{npcDead:['npc_zuo_lengchan']}},{to:'exposed',priority:90,when:{flagsAll:['songshan_scheme_exposed']}},{to:'huashan_rises',priority:80,when:{npcDead:['npc_zuo_lengchan'],flagsAll:['huashan_prepared']}},{to:'conference',priority:10,when:{minDay:11}}]},
    {id:'exposed',name:'阴谋曝光',rumor:'嵩山暗中的手段已被部分江湖人知晓，五岳内部对并派的态度急剧分裂。',transitions:[{to:'blocked',priority:80,when:{flagsAll:['player_blocks_merger']}},{to:'conference',priority:10,when:{minDay:13}}]},
    {id:'conference',name:'五岳大会',rumor:'五岳各派已准备正面决定未来归属，嵩山与华山都在争夺主动。',transitions:[{to:'collapsed',priority:100,when:{npcDead:['npc_zuo_lengchan']}},{to:'huashan_rises',priority:90,when:{flagsAll:['support_huashan']}},{to:'blocked',priority:85,when:{flagsAll:['player_blocks_merger']}},{to:'songshan_dominates',priority:10,when:{minDay:16},effects:{setFlags:{wuyue_under_songshan:true}}}]},
    {id:'songshan_dominates',name:'嵩山得势',terminal:true,rumor:'并派大势暂时倒向嵩山，五岳格局被强行改写。'},
    {id:'huashan_rises',name:'华山夺势',terminal:true,rumor:'华山在五岳局势中夺得主导权，但新的权力格局同样埋着后患。'},
    {id:'blocked',name:'并派受阻',terminal:true,rumor:'五岳并派计划被打断，各派暂时维持分立。'},
    {id:'collapsed',name:'嵩山失主',terminal:true,rumor:'左冷禅已无法继续推动原计划，五岳历史进入全新的分支。'}
  ],
  interventions:[
    {id:'expose_songshan_scheme',name:'公开嵩山暗中动作',locationId:'ming_huashan',sceneId:'ming_huashan_hall',allowedPhases:['plotting','pressure'],setFlags:{songshan_scheme_exposed:true}},
    {id:'prepare_huashan',name:'协助华山提前应对并派',locationId:'ming_huashan',sceneId:'ming_huashan_hall',allowedPhases:['plotting','pressure','exposed'],setFlags:{huashan_prepared:true,support_huashan:true}},
    {id:'oppose_merger',name:'公开反对五岳并派',locationId:'ming_songshan',sceneId:'ming_songshan_hall',allowedPhases:['pressure','exposed','conference'],setFlags:{player_blocks_merger:true}}
  ]
};
