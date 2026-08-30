import {MING_CORE_NPC_BY_ID}from'../data/npcs/ming/index.js';
import {npcsAtLocation}from'../npc/simulation.js';
import {relationWith}from'../npc/relationships.js';
import {availableNpcInterventions}from'../event/interventions.js';

function sceneName(location,sceneId){return location.scenes.find(x=>x.id===sceneId)?.name||sceneId;}
export function renderNpcPanel(location,session,{message=''}={}){
  const states=npcsAtLocation(session.worldState.npc,location.id);
  if(!states.length)return`<div class="npc-section"><h3>此刻人物</h3>${message?`<p>${message}</p>`:''}<p>此刻没有已知核心人物在此活动。</p></div>`;
  return`<div class="npc-section"><h3>此刻人物</h3>${message?`<p class="npc-message">${message}</p>`:''}<div class="npc-grid">${states.map(npcState=>{const def=MING_CORE_NPC_BY_ID[npcState.id],sameScene=npcState.sceneId===session.character.world.scene,relation=relationWith(session.worldState,npcState.id),story=sameScene?availableNpcInterventions(session.worldState,session.character,npcState.id):[];return`<article class="npc-card"><b>${def?.name||npcState.id}</b><span>${def?.role||''}</span><small>${sceneName(location,npcState.sceneId)} · ${npcState.activity}</small><em>关系 ${relation>=0?'+':''}${relation}</em>${sameScene?`<div class="npc-actions"><button data-talk-npc="${npcState.id}">交谈</button>${story.map(x=>`<button class="story-action" data-event-id="${x.eventId}" data-intervention-id="${x.intervention.id}">${x.intervention.name}</button>`).join('')}</div>`:'<small>不在同一场景</small>'}</article>`;}).join('')}</div></div>`;
}
export function bindNpcPanel(root,{onTalk,onIntervene}={}){root.querySelectorAll('[data-talk-npc]').forEach(button=>button.onclick=()=>onTalk?.(button.dataset.talkNpc));root.querySelectorAll('[data-intervention-id]').forEach(button=>button.onclick=()=>onIntervene?.(button.dataset.eventId,button.dataset.interventionId));}
