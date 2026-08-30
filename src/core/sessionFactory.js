import {createNpcWorld,advanceNpcWorld}from'../npc/simulation.js';
import {createEventWorld,ensureEventWorld,advanceEventWorld}from'../event/runtime.js';
import {interveneInEvent}from'../event/interventions.js';
import {travelCharacter,advanceWorldTime}from'../world/travel.js';
import {learnMartial}from'../martial/learning.js';
import {trainMartial}from'../martial/training.js';
import {ensureMartialState}from'../martial/state.js';
export const SESSION_SCHEMA=1;
function syncWorldState(worldState,world){const npc=advanceNpcWorld(worldState.npc,world);return advanceEventWorld({...worldState,npc,events:ensureEventWorld(worldState.events,world)},world);}
export function createSession(character){const normalized=ensureMartialState(character),worldState={npc:createNpcWorld(normalized.world),events:createEventWorld(normalized.world),factions:{}};return{schema:SESSION_SCHEMA,character:normalized,worldState:advanceEventWorld(worldState,normalized.world)};}
export function ensureSession(session){if(!session?.character)throw Error('invalid_session');const character=ensureMartialState(session.character),raw=session.worldState||{},worldState={events:ensureEventWorld(raw.events,character.world),factions:raw.factions||{},...raw,npc:raw.npc||createNpcWorld(character.world)};const normalized={...session,character,worldState};return syncSessionWorld(normalized);}
export function syncSessionWorld(session){if(!session?.character)throw Error('invalid_session');return{...session,worldState:syncWorldState(session.worldState,session.character.world)};}
export function advanceSessionHours(session,hours){if(!Number.isFinite(hours)||hours<0)throw Error('invalid_hours');const s=ensureSession(session),world=advanceWorldTime(s.character.world,hours),character={...s.character,world};return{...s,character,worldState:syncWorldState(s.worldState,world)};}
export function travelSession(session,destinationId){const s=ensureSession(session),character=travelCharacter(s.character,destinationId);return{...s,character,worldState:syncWorldState(s.worldState,character.world)};}
export function learnMartialSession(session,martialId,context={}){const s=ensureSession(session),character=learnMartial(s.character,martialId,{...context,worldTime:{...s.character.world}});return{...s,character};}
export function trainMartialSession(session,martialId,hours=2){const s=ensureSession(session),trained=trainMartial(s.character,martialId,hours),world=advanceWorldTime(trained.character.world,hours),character={...trained.character,world};return{session:{...s,character,worldState:syncWorldState(s.worldState,world)},result:trained.result};}
export function interveneEventSession(session,eventId,interventionId){const s=ensureSession(session);return{...s,worldState:interveneInEvent(s.worldState,s.character,eventId,interventionId)};}
