export const GU_SANTONG={
  id:'npc_gu_santong',name:'古三通',source:'天下第一',aiTier:'B',factionId:null,role:'天牢重囚',homeLocationId:'ming_capital',homeSceneId:'ming_prison_gate',
  personality:{pride:96,mischief:88,insight:91,resentment:76},publicGoals:['活下去'],hiddenGoals:['寻找传承之人','留下对朱无视过去的真相'],
  routine:[{from:0,to:24,sceneId:'ming_prison_gate',activity:'被囚于天牢深处'}],
  stateFlags:{imprisoned:true,hiddenScene:'capital_prison_ninth_floor'}
};
