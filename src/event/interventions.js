import {EVENT_BY_ID,EVENT_DATA}from'../data/events/index.js';
import {advanceEventWorld,ensureEventWorld,eventPhase}from'./runtime.js';

function currentPhaseId(eventWorld,eventId){return eventWorld.entries[eventId]?.phase;}
function atRequiredPlace(character,intervention){return character.world?.location===intervention.locationId&&character.world?.scene===intervention.sceneId;}
function npcAvailable(worldState,intervention){if(!intervention.npcId)return true;const npc=worldState?.npc?.states?.[intervention.npcId];return Boolean(npc?.alive&&npc.discovered!==false&&npc.locationId===intervention.locationId&&npc.sceneId===intervention.sceneId);}
function collect(worldState,character,predicate=()=>true){const eventWorld=ensureEventWorld(worldState?.events,character.world),out=[];for(const def of EVENT_DATA){const phase=currentPhaseId(eventWorld,def.id)||def.initialPhase;for(const intervention of def.interventions||[])if(intervention.allowedPhases.includes(phase)&&atRequiredPlace(character,intervention)&&npcAvailable(worldState,intervention)&&predicate(intervention))out.push({eventId:def.id,eventName:def.name,phase,intervention});}return out;}
export function availableInterventions(worldState,character){return collect(worldState,character);}
export function availableNpcInterventions(worldState,character,npcId){return collect(worldState,character,i=>i.npcId===npcId);}
export function availableSceneInterventions(worldState,character){return collect(worldState,character,i=>!i.npcId);}
export function interveneInEvent(worldState,character,eventId,interventionId){
  const def=EVENT_BY_ID[eventId];if(!def)throw Error('unknown_event');
  let eventWorld=ensureEventWorld(worldState?.events,character.world),entry=eventWorld.entries[eventId];
  const intervention=(def.interventions||[]).find(x=>x.id===interventionId);if(!intervention)throw Error('unknown_intervention');
  if(!intervention.allowedPhases.includes(entry.phase))throw Error('intervention_not_available_in_phase');
  if(!atRequiredPlace(character,intervention))throw Error('intervention_wrong_location');
  if(!npcAvailable(worldState,intervention))throw Error('event_npc_unavailable');
  eventWorld={...eventWorld,flags:{...eventWorld.flags,...(intervention.setFlags||{})},entries:{...eventWorld.entries,[eventId]:{...entry,history:[...(entry.history||[]),{type:'intervention',id:interventionId,at:{day:character.world.day,hour:character.world.hour}}]}}};
  return advanceEventWorld({...worldState,events:eventWorld},character.world);
}
export function eventSummary(worldState){const eventWorld=ensureEventWorld(worldState?.events);return EVENT_DATA.map(def=>{const phase=eventPhase(def,eventWorld);const leads=(def.interventions||[]).filter(i=>i.allowedPhases.includes(phase.id)).map(i=>({id:i.id,name:i.name,locationId:i.locationId,sceneId:i.sceneId,npcId:i.npcId||null}));return{id:def.id,name:def.name,phase:phase.id,phaseName:phase.name,rumor:phase.rumor,terminal:Boolean(phase.terminal),leads};});}
