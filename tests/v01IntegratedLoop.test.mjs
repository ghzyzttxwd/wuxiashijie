import test from'node:test';import assert from'node:assert/strict';
import{createCharacter}from'../src/player/characterFactory.js';
import{createSession,ensureSession,travelSession,advanceSessionHours,interveneEventSession}from'../src/core/sessionFactory.js';
import{learnAtLuoyangHall}from'../src/martial/venues/luoyangHall.js';import{hasMartial}from'../src/martial/state.js';
import{talkToNpc}from'../src/npc/interactions.js';import{relationWith}from'../src/npc/relationships.js';
import{createCombatant}from'../src/combat/combatant.js';import{createBattleState,executeAction}from'../src/combat/battleState.js';import{compileAnimationTimeline}from'../src/combat-render/animationTimeline.js';
import{saveSession,loadSession}from'../src/save/saveManager.js';import{initWorldMap}from'../src/ui/worldMap.js';
const BASE={root:60,insight:60,physique:60,agility:60,will:60,fortune:50,charm:50};
const memoryStorage=()=>{const m=new Map();return{getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}};
const setScene=(s,scene)=>({...s,character:{...s.character,world:{...s.character.world,scene}}});

test('V0.1闭环：建角→旅行→NPC→学武→动态战斗→事件→时间→存档重载',()=>{
  const storage=memoryStorage();let s=createSession(createCharacter({name:'江湖试客',originId:'hunter',talentId:'sword_bone',baseAttributes:BASE}));
  assert.equal(s.character.world.location,'ming_luoyang');
  s=setScene(s,'ming_luoyang_martial_hall');s=learnAtLuoyangHall(s,'martial_basic_sword');assert.ok(hasMartial(s.character,'martial_basic_sword'));
  s=travelSession(s,'ming_huashan');const linghu=s.worldState.npc.states.npc_linghu_chong;assert.equal(linghu.locationId,'ming_huashan');s=setScene(s,linghu.sceneId);
  const talked=talkToNpc(s,'npc_linghu_chong');s=talked.session;assert.ok(relationWith(s.worldState,'npc_linghu_chong')>0);assert.ok(talked.result.message.includes('令狐冲'));
  s=setScene(s,'ming_huashan_hall');s=interveneEventSession(s,'event_wuyue_merger','prepare_huashan');assert.equal(s.worldState.events.flags.huashan_prepared,true);
  s=travelSession(s,'ming_luoyang');s=setScene(s,'ming_luoyang_martial_hall');
  const battle=createBattleState({left:createCombatant({id:'player',name:s.character.name,attack:60,defense:45,speed:58,maxEnergy:100,energy:100,side:'left'}),right:createCombatant({id:'trainer',name:'武馆教习',attack:46,defense:40,speed:44,side:'right'})});
  const strike=executeAction(battle,{attackerId:'player',defenderId:'trainer',martialId:'martial_basic_sword',rng:()=>0});assert.equal(strike.result.hit,true);assert.ok(strike.state.combatants.trainer.hp<battle.combatants.trainer.hp);const timeline=compileAnimationTimeline(strike.events);assert.ok(timeline.clips.some(x=>x.event.type==='approach'));assert.ok(timeline.clips.some(x=>x.event.type==='hit'));assert.ok(timeline.totalMs>700);
  const beforeHour=(s.character.world.day-1)*24+s.character.world.hour;s=advanceSessionHours(s,1);const afterHour=(s.character.world.day-1)*24+s.character.world.hour;assert.equal(afterHour,beforeHour+1);
  saveSession(0,s,storage);const reloaded=ensureSession(loadSession(0,storage));assert.ok(hasMartial(reloaded.character,'martial_basic_sword'));assert.ok(relationWith(reloaded.worldState,'npc_linghu_chong')>0);assert.equal(reloaded.worldState.events.flags.huashan_prepared,true);assert.equal((reloaded.character.world.day-1)*24+reloaded.character.world.hour,afterHour);
});

test('主世界UI模块在M9仍可加载',()=>{assert.equal(typeof initWorldMap,'function')});
