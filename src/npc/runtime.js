import {MING_CORE_NPCS}from'../data/npcs/ming/index.js';

function matches(hour,{from,to}){return from<to?(hour>=from&&hour<to):(hour>=from||hour<to);}
export function routineAt(npc,hour){return npc.routine.find(slot=>matches(hour,slot))||npc.routine[0];}
export function createNpcState(npc,hour=8){const slot=routineAt(npc,hour);return{id:npc.id,alive:true,health:100,locationId:slot.locationId||npc.homeLocationId,sceneId:slot.sceneId,activity:slot.activity,currentGoal:npc.publicGoals[0]||null,flags:{}};}
export function createInitialNpcStates(hour=8){return Object.fromEntries(MING_CORE_NPCS.map(npc=>[npc.id,createNpcState(npc,hour)]));}
