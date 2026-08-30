import {EVENT_BY_ID,EVENT_DATA}from'../data/events/index.js';
import {advanceEventWorld,ensureEventWorld,eventPhase}from'./runtime.js';

function currentPhaseId(eventWorld,eventId){return eventWorld.entries[eventId]?.phase;}
function atRequiredPlace(character,intervention){return character.world?.location===intervention.locationId&&character.world?.scene===intervention.sceneId;}
export function availableInterventions(worldState,character){
  const eventWorld=ensureEventWorld(worldState?.events,character.world),out=[];
  for(const def of EVENT_DATA){const phase=currentPhaseId(eventWorld,def.id)||def.initialPhase;for(const intervention of def.interventions||[])if(intervention.allowedPhases.includes(phase)&&atRequiredPlace(character,intervention))out.push({eventId:def.id,eventName:def.name,phase,intervention});}
  return out;
}
export function interveneInEvent(worldState,character,eventId,interventionId){
  const def=EVENT_BY_ID[eventId];if(!def)throw Error('unknown_event');
  let eventWorld=ensureEventWorld(worldState?.events,character.world),entry=eventWorld.entries[eventId];
  const intervention=(def.interventions||[]).find(x=>x.id===interventionId);if(!intervention)throw Error('unknown_intervention');
  if(!intervention.allowedPhases.includes(entry.phase))throw Error('intervention_not_available_in_phase');
  if(!atRequiredPlace(character,intervention))throw Error('intervention_wrong_location');
  eventWorld={...eventWorld,flags:{...eventWorld.flags,...(intervention.setFlags||{})},entries:{...eventWorld.entries,[eventId]:{...entry,history:[...(entry.history||[]),{type:'intervention',id:interventionId,at:{day:character.world.day,hour:character.world.hour}}]}}};
  return advanceEventWorld({...worldState,events:eventWorld},character.world);
}
export function eventSummary(worldState){const eventWorld=ensureEventWorld(worldState?.events);return EVENT_DATA.map(def=>{const phase=eventPhase(def,eventWorld);return{id:def.id,name:def.name,phase:phase.id,phaseName:phase.name,rumor:phase.rumor,terminal:Boolean(phase.terminal)};});}
