import {MING_CORE_NPC_BY_ID}from'../data/npcs/ming/index.js';import{createInitialNpcStates,routineAt}from'./runtime.js';
export function absoluteWorldHour(world){return((world.day||1)-1)*24+(world.hour??8);}
export function createNpcWorld(world){return{schema:1,simulatedTo:absoluteWorldHour(world),states:createInitialNpcStates(world.hour??8)};}
export function advanceNpcWorld(npcWorld,world){const next=npcWorld?{...npcWorld,states:{...npcWorld.states}}:createNpcWorld(world),hour=world.hour??8;for(const[id,state]of Object.entries(next.states)){const def=MING_CORE_NPC_BY_ID[id];if(!def||!state.alive)continue;const slot=routineAt(def,hour);next.states[id]={...state,locationId:slot.locationId||def.homeLocationId,sceneId:slot.sceneId,activity:slot.activity};}next.simulatedTo=absoluteWorldHour(world);return next;}
export function npcsAtLocation(npcWorld,locationId){return Object.values(npcWorld?.states||{}).filter(state=>state.alive&&state.locationId===locationId);}
