import {createNpcWorld,advanceNpcWorld}from'../npc/simulation.js';
import {travelCharacter,advanceWorldTime}from'../world/travel.js';
import {learnMartial}from'../martial/learning.js';
import {trainMartial}from'../martial/training.js';
export const SESSION_SCHEMA=1;
export function createSession(character){return{schema:SESSION_SCHEMA,character,worldState:{npc:createNpcWorld(character.world),events:{},factions:{}}};}
export function ensureSession(session){if(!session?.character)throw Error('invalid_session');if(session.worldState?.npc)return session;return{...session,worldState:{events:{},factions:{},...(session.worldState||{}),npc:createNpcWorld(session.character.world)}};}
export function syncSessionWorld(session){const s=ensureSession(session);return{...s,worldState:{...s.worldState,npc:advanceNpcWorld(s.worldState.npc,s.character.world)}};}
export function advanceSessionHours(session,hours){if(!Number.isFinite(hours)||hours<0)throw Error('invalid_hours');const s=ensureSession(session),world=advanceWorldTime(s.character.world,hours),character={...s.character,world};return{...s,character,worldState:{...s.worldState,npc:advanceNpcWorld(s.worldState.npc,world)}};}
export function travelSession(session,destinationId){const s=ensureSession(session),character=travelCharacter(s.character,destinationId);return{...s,character,worldState:{...s.worldState,npc:advanceNpcWorld(s.worldState.npc,character.world)}};}
export function learnMartialSession(session,martialId,context={}){const s=ensureSession(session),character=learnMartial(s.character,martialId,{...context,worldTime:{...s.character.world}});return{...s,character};}
export function trainMartialSession(session,martialId,hours=2){const s=ensureSession(session),trained=trainMartial(s.character,martialId,hours),world=advanceWorldTime(trained.character.world,hours),character={...trained.character,world};return{session:{...s,character,worldState:{...s.worldState,npc:advanceNpcWorld(s.worldState.npc,world)}},result:trained.result};}
