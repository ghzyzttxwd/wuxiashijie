export const MING_TRAINING_ENCOUNTERS=[
  {id:'encounter_luoyang_bandits',locationId:'ming_luoyang',sceneId:'ming_luoyang_outskirts',name:'洛阳城郊 · 剪径匪徒',summary:'几个拦路抢钱的地痞和惯匪，适合刚入江湖的人反复实战。',difficulty:.8,enemy:{name:'剪径匪徒',maxHp:150,attack:48,defense:34,speed:42,maxEnergy:80},reward:{silver:5}},
  {id:'encounter_fuzhou_ruffians',locationId:'ming_fuzhou',sceneId:'ming_fuzhou_outskirts',name:'福州山道 · 江湖悍匪',summary:'福州城外山道不太平，来往镖队常遇见有些功夫的劫道客。',difficulty:1.15,enemy:{name:'山道悍匪',maxHp:210,attack:68,defense:50,speed:54,maxEnergy:100},reward:{silver:9}},
  {id:'encounter_songshan_road',locationId:'ming_songshan',sceneId:'ming_songshan_foothill',name:'嵩山山麓 · 亡命客',summary:'在五岳势力交错的山道上讨生活的亡命之徒，实战经验明显更足。',difficulty:1.55,enemy:{name:'山麓亡命客',maxHp:285,attack:88,defense:68,speed:66,maxEnergy:120},reward:{silver:14}}
];
export const MING_ENCOUNTER_BY_ID=Object.fromEntries(MING_TRAINING_ENCOUNTERS.map(x=>[x.id,x]));
export const MING_ENCOUNTER_BY_SCENE=Object.fromEntries(MING_TRAINING_ENCOUNTERS.map(x=>[x.sceneId,x]));
