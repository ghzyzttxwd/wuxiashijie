import {EVENT_DATA}from'../data/events/index.js';
import {conditionMatches}from'./conditions.js';
import {applyEventEffects}from'./effects.js';

export const EVENT_WORLD_SCHEMA=1;
const phaseOf=(def,id)=>def.phases.find(x=>x.id===id)||def.phases[0];
const stamp=world=>({day:world.day??1,hour:world.hour??8});

function createEntry(def,world){const phase=phaseOf(def,def.initialPhase);return{id:def.id,phase:phase.id,terminal:Boolean(phase.terminal),updatedAt:stamp(world),history:[]};}
export function createEventWorld(world={day:1,hour:8}){return{schema:EVENT_WORLD_SCHEMA,flags:{},entries:Object.fromEntries(EVENT_DATA.map(def=>[def.id,createEntry(def,world)]))};}
export function ensureEventWorld(eventWorld,world={day:1,hour:8}){
  const base=eventWorld?.schema===EVENT_WORLD_SCHEMA?eventWorld:createEventWorld(world),entries={...(base.entries||{})};
  for(const def of EVENT_DATA)if(!entries[def.id])entries[def.id]=createEntry(def,world);
  return{...base,schema:EVENT_WORLD_SCHEMA,flags:{...(base.flags||{})},entries};
}

function nextTransition(def,entry,context){const phase=phaseOf(def,entry.phase);return[...(phase.transitions||[])].sort((a,b)=>(b.priority||0)-(a.priority||0)).find(t=>conditionMatches(t.when,context))||null;}

export function advanceEventWorld(worldState,world){
  let next={...worldState,events:ensureEventWorld(worldState?.events,world)};
  for(const def of EVENT_DATA){
    let guard=0;
    while(guard++<16){
      const entry=next.events.entries[def.id]||createEntry(def,world),phase=phaseOf(def,entry.phase);
      if(phase.terminal){next.events.entries={...next.events.entries,[def.id]:{...entry,terminal:true}};break;}
      const transition=nextTransition(def,entry,{world,flags:next.events.flags,npcStates:next.npc?.states||{}});
      if(!transition)break;
      const from=entry.phase;
      if(transition.effects)next=applyEventEffects(next,transition.effects);
      const target=phaseOf(def,transition.to),history=[...(entry.history||[]),{type:'transition',from,to:target.id,at:stamp(world)}];
      next.events={...next.events,entries:{...next.events.entries,[def.id]:{...entry,phase:target.id,terminal:Boolean(target.terminal),updatedAt:stamp(world),history}}};
      if(target.terminal)break;
    }
  }
  return next;
}

export function eventPhase(def,eventWorld){return phaseOf(def,eventWorld?.entries?.[def.id]?.phase||def.initialPhase);}
export function activeRumors(eventWorld){const ew=ensureEventWorld(eventWorld);return EVENT_DATA.map(def=>{const phase=eventPhase(def,ew);return{id:def.id,name:def.name,phase:phase.id,phaseName:phase.name,rumor:phase.rumor,terminal:Boolean(phase.terminal)};});}
