import test from'node:test';
import assert from'node:assert/strict';
import {MING_CORE_NPCS,MING_CORE_NPC_BY_ID} from'../src/data/npcs/ming/index.js';
import {MING_CORE_FACTION_BY_ID} from'../src/data/factions/ming/coreFactions.js';
import {MING_LOCATION_BY_ID} from'../src/data/locations/ming/index.js';
import {createNpcWorld,advanceNpcWorld,npcsAtLocation,discoverNpc} from'../src/npc/simulation.js';

const world=hour=>({day:1,hour});

test('M6大明核心动态NPC固定为20人且ID唯一',()=>{
  assert.equal(MING_CORE_NPCS.length,20);
  assert.equal(new Set(MING_CORE_NPCS.map(x=>x.id)).size,20);
  assert.equal(Object.keys(MING_CORE_NPC_BY_ID).length,20);
});

test('20名NPC的势力、地点与日程场景全部引用真实稳定ID',()=>{
  for(const npc of MING_CORE_NPCS){
    if(npc.factionId)assert.ok(MING_CORE_FACTION_BY_ID[npc.factionId],`${npc.id} faction ${npc.factionId}`);
    assert.ok(MING_LOCATION_BY_ID[npc.homeLocationId],`${npc.id} home ${npc.homeLocationId}`);
    assert.ok(Array.isArray(npc.routine)&&npc.routine.length,`${npc.id} routine`);
    for(const slot of npc.routine){
      const locationId=slot.locationId||npc.homeLocationId,location=MING_LOCATION_BY_ID[locationId];
      assert.ok(location,`${npc.id} routine location ${locationId}`);
      assert.ok(location.scenes.some(scene=>scene.id===slot.sceneId),`${npc.id} scene ${slot.sceneId} not in ${locationId}`);
    }
  }
});

test('NPC世界初始化包含20个独立状态',()=>{
  const npcWorld=createNpcWorld(world(8));
  assert.equal(Object.keys(npcWorld.states).length,20);
  assert.equal(npcWorld.states.npc_gu_santong.flags.imprisoned,true);
  assert.equal(npcWorld.states.npc_ren_woxing.flags.imprisoned,true);
});

test('田伯光会真实跨地点流窜而不是只换场景',()=>{
  let npcWorld=createNpcWorld(world(8));
  assert.equal(npcWorld.states.npc_tian_boguang.locationId,'ming_luoyang');
  npcWorld=advanceNpcWorld(npcWorld,world(13));assert.equal(npcWorld.states.npc_tian_boguang.locationId,'ming_huashan');
  npcWorld=advanceNpcWorld(npcWorld,world(19));assert.equal(npcWorld.states.npc_tian_boguang.locationId,'ming_fuzhou');
});

test('上官海棠和向问天的高机动日程可跨城运行',()=>{
  let npcWorld=createNpcWorld(world(8));
  npcWorld=advanceNpcWorld(npcWorld,world(14));
  assert.equal(npcWorld.states.npc_shangguan_haitang.locationId,'ming_luoyang');
  assert.equal(npcWorld.states.npc_xiang_wentian.locationId,'ming_meizhuang');
});

test('隐藏人物默认不出现在普通地图人物列表',()=>{
  const npcWorld=createNpcWorld(world(10));
  assert.ok(!npcsAtLocation(npcWorld,'ming_huashan').some(x=>x.id==='npc_feng_qingyang'));
  assert.ok(!npcsAtLocation(npcWorld,'ming_capital').some(x=>x.id==='npc_gu_santong'));
  assert.ok(!npcsAtLocation(npcWorld,'ming_meizhuang').some(x=>x.id==='npc_ren_woxing'));
  assert.ok(npcsAtLocation(npcWorld,'ming_huashan',{includeHidden:true}).some(x=>x.id==='npc_feng_qingyang'));
});

test('发现隐藏人物后会进入正常可见世界状态',()=>{
  const npcWorld=createNpcWorld(world(10)),discovered=discoverNpc(npcWorld,'npc_feng_qingyang');
  assert.equal(discovered.states.npc_feng_qingyang.flags.discovered,true);
  assert.ok(npcsAtLocation(discovered,'ming_huashan').some(x=>x.id==='npc_feng_qingyang'));
  assert.equal(npcWorld.states.npc_feng_qingyang.flags.discovered,false,'发现操作不能原地污染旧状态');
});
