import test from'node:test';
import assert from'node:assert/strict';
import {M5_COMBAT_ACTIONS,M5_COMBAT_ACTION_BY_MARTIAL_ID} from'../src/data/combat/m5Actions.js';
import {MARTIAL_BY_ID} from'../src/data/martial/index.js';
import {M5_FX_BY_MARTIAL_ID} from'../src/combat-render/m5FxProfiles.js';
import {createCombatant} from'../src/combat/combatant.js';
import {createBattleState,executeAction} from'../src/combat/battleState.js';
import {compileAnimationTimeline} from'../src/combat-render/animationTimeline.js';
import {mountCombatPrototype} from'../src/ui/combatPrototype.js';

const makeBattle=(energy=100)=>createBattleState({left:createCombatant({id:'a',name:'甲',attack:60,defense:40,speed:55,maxEnergy:100,energy,side:'left'}),right:createCombatant({id:'b',name:'乙',attack:50,defense:42,speed:48,side:'right'})});

test('M5四个动作都引用正式武学且视觉语言不同',()=>{
  assert.equal(M5_COMBAT_ACTIONS.length,4);
  const motions=new Set();
  for(const action of M5_COMBAT_ACTIONS){assert.ok(MARTIAL_BY_ID[action.martialId],action.martialId);assert.ok(M5_FX_BY_MARTIAL_ID[action.martialId],`fx ${action.martialId}`);motions.add(M5_FX_BY_MARTIAL_ID[action.martialId].motion);}
  assert.equal(motions.size,4);
});

test('命中会真实扣血并产生前冲命中击退收势事件',()=>{
  const before=makeBattle(),out=executeAction(before,{attackerId:'a',defenderId:'b',martialId:'martial_basic_sword',rng:()=>0});
  assert.ok(out.result.hit);assert.ok(out.state.combatants.b.hp<before.combatants.b.hp);
  assert.deepEqual(out.events.slice(0,5).map(x=>x.type),['action_start','approach','hit','knockback','recover']);
});

test('闪避不会凭空扣血',()=>{
  const before=makeBattle(),out=executeAction(before,{attackerId:'a',defenderId:'b',martialId:'martial_basic_fist',rng:()=>1});
  assert.equal(out.result.hit,false);assert.equal(out.state.combatants.b.hp,before.combatants.b.hp);assert.ok(out.events.some(x=>x.type==='miss'));
});

test('大力金刚掌比基础拳拥有明显更强击退与Hit Stop',()=>{
  const fist=M5_COMBAT_ACTION_BY_MARTIAL_ID.martial_basic_fist,palm=M5_COMBAT_ACTION_BY_MARTIAL_ID.martial_shaolin_vajra_palm;
  assert.ok(palm.power>fist.power*2);assert.ok(palm.knockback>fist.knockback*3);assert.ok(palm.hitStopMs>fist.hitStopMs*2);
});

test('内力不足不能强行发动金刚掌',()=>{
  const before=makeBattle(5),out=executeAction(before,{attackerId:'a',defenderId:'b',martialId:'martial_shaolin_vajra_palm',rng:()=>0});
  assert.equal(out.result.ok,false);assert.equal(out.result.reason,'energy');assert.equal(out.state.turn,0);
});

test('动画时间线保留Hit Stop而不是瞬间跳伤害',()=>{
  const out=executeAction(makeBattle(),{attackerId:'a',defenderId:'b',martialId:'martial_basic_saber',rng:()=>0}),timeline=compileAnimationTimeline(out.events),hit=timeline.clips.find(x=>x.event.type==='hit');
  assert.ok(hit.durationMs>=M5_COMBAT_ACTION_BY_MARTIAL_ID.martial_basic_saber.hitStopMs);assert.ok(timeline.totalMs>700);
});

test('战斗UI模块依赖图可正常加载',()=>{assert.equal(typeof mountCombatPrototype,'function');});
