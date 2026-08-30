import {createNpcWorld,advanceNpcWorld}from'../npc/simulation.js';import{travelCharacter}from'../world/travel.js';
export const SESSION_SCHEMA=1;
export function createSession(character){return{schema:SESSION_SCHEMA,character,worldState:{npc:createNpcWorld(character.world),events:{},factions:{}}};}
export function ensureSession(session){if(!session?.character)throw Error('invalid_session');if(session.worldState?.npc)return session;return{...session,worldState:{events:{},factions:{},...(session.worldState||{}),npc:createNpcWorld(session.character.world)}};}
export function syncSessionWorld(session){const s=ensureSession(session);return{...s,worldState:{...s.worldState,npc:advanceNpcWorld(s.worldState.npc,s.character.world)}};}
export function travelSession(session,destinationId){const s=ensureSession(session),character=travelCharacter(s.character,destinationId);return{...s,character,worldState:{...s.worldState,npc:advanceNpcWorld(s.worldState.npc,character.world)}};}
