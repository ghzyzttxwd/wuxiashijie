import test from'node:test';import assert from'node:assert/strict';
import{EVENT_DATA}from'../src/data/events/index.js';import{MING_LOCATION_BY_ID}from'../src/data/locations/ming/index.js';import{MING_CORE_NPC_BY_ID}from'../src/data/npcs/ming/index.js';
import{createCharacter}from'../src/player/characterFactory.js';import{createSession,advanceSessionHours,interveneEventSession,syncSessionWorld}from'../src/core/sessionFactory.js';
const BASE={root:60,insight:60,physique:60,agility:60,will:60,fortune:50,charm:50};
const hunter=()=>createCharacter({originId:'hunter',baseAttributes:BASE});
function phase(s,id){return s.worldState.events.entries[id].phase;}
function place(s,location,scene){return{...s,character:{...s.character,world:{...s.character.world,location,scene}}};}

test('M8锁定三条动态事件且稳定引用完整',()=>{assert.equal(EVENT_DATA.length,3);for(const def of EVENT_DATA){const phaseIds=new Set(def.phases.map(x=>x.id));assert.ok(phaseIds.has(def.initialPhase));for(const p of def.phases)for(const t of p.transitions||[]){assert.ok(phaseIds.has(t.to),`${def.id} transition ${t.to}`);for(const id of [...(t.when?.npcDead||[]),...(t.when?.npcAlive||[]),...(t.effects?.killNpcIds||[])])assert.ok(MING_CORE_NPC_BY_ID[id],`${def.id} npc ${id}`);}for(const i of def.interventions||[]){const loc=MING_LOCATION_BY_ID[i.locationId];assert.ok(loc,`${def.id} location ${i.locationId}`);assert.ok(loc.scenes.some(s=>s.id===i.sceneId),`${def.id} scene ${i.sceneId}`);for(const p of i.allowedPhases)assert.ok(phaseIds.has(p),`${def.id} phase ${p}`);}}});

test('玩家完全不管福威镖局会随时间恶化并影响NPC生死',()=>{let s=createSession(hunter());assert.equal(phase(s,'event_fuwei_crisis'),'calm');s=advanceSessionHours(s,24*9);assert.equal(phase(s,'event_fuwei_crisis'),'shattered');assert.equal(s.worldState.npc.states.npc_lin_zhennan.alive,false);assert.equal(s.worldState.events.flags.fuwei_fallen,true)});

test('提前提醒并支援林家可以改写默认覆局',()=>{let s=createSession(hunter());s=place(s,'ming_fuzhou','ming_fuwei_escort');s=interveneEventSession(s,'event_fuwei_crisis','warn_lin_family');assert.equal(phase(s,'event_fuwei_crisis'),'prepared');s=interveneEventSession(s,'event_fuwei_crisis','support_fuwei');s=advanceSessionHours(s,24*6);assert.equal(phase(s,'event_fuwei_crisis'),'survived');assert.equal(s.worldState.npc.states.npc_lin_zhennan.alive,true)});

test('五岳线中华山已准备时左冷禅死亡可触发华山夺势',()=>{let s=createSession(hunter());s=advanceSessionHours(s,24*5);assert.equal(phase(s,'event_wuyue_merger'),'pressure');s.worldState.events.flags.huashan_prepared=true;s.worldState.npc.states.npc_zuo_lengchan={...s.worldState.npc.states.npc_zuo_lengchan,alive:false,health:0};s=syncSessionWorld(s);assert.equal(phase(s,'event_wuyue_merger'),'huashan_rises')});

test('朝廷暗战会因曹正淳提前死亡直接改线',()=>{let s=createSession(hunter());s.worldState.npc.states.npc_cao_zhengchun={...s.worldState.npc.states.npc_cao_zhengchun,alive:false,health:0};s=syncSessionWorld(s);assert.equal(phase(s,'event_hulong_dongchang_conflict'),'hulong_wins')});

test('事件干预必须本人到正确场景',()=>{const s=createSession(hunter());assert.throws(()=>interveneEventSession(s,'event_hulong_dongchang_conflict','leak_dongchang_intel'),/intervention_wrong_location/)});
