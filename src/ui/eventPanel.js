import {eventSummary}from'../event/interventions.js';
import {MING_LOCATION_BY_ID}from'../data/locations/ming/index.js';
import {MING_CORE_NPC_BY_ID}from'../data/npcs/ming/index.js';
import {hasEventForesight}from'../player/talentRuntime.js';

function leadText(lead){const loc=MING_LOCATION_BY_ID[lead.locationId],scene=loc?.scenes.find(x=>x.id===lead.sceneId),npc=lead.npcId?MING_CORE_NPC_BY_ID[lead.npcId]:null;return`${loc?.name||lead.locationId} · ${scene?.name||lead.sceneId}${npc?` · 找${npc.name}`:''}`;}
export function renderEventPanel(root,session,{onBack}={}){
  const events=eventSummary(session.worldState),foresight=hasEventForesight(session.character);
  root.innerHTML=`<div class="section-head"><div><p class="eyebrow">江湖不会等你</p><h2>江湖志</h2><p>这里只记录正在发生的大事，不在这里接任务。真正的剧情入口都在对应地点、场景和人物身上。</p></div><button data-event-back>返回</button></div><div class="event-grid">${events.map(e=>`<article class="event-card ${e.terminal?'terminal':''}"><div class="event-card-head"><b>${e.name}</b><span>${e.terminal?'已定局':'进行中'}</span></div><h3>${e.phaseName}</h3><p>${e.rumor}</p>${!e.terminal&&e.leads.length?`<div class="event-leads"><b>${foresight?'福缘预感 · 可追查方向':'可追查方向'}</b>${e.leads.map(x=>`<span>${leadText(x)}</span>`).join('')}</div>`:''}</article>`).join('')}</div>`;
  root.querySelector('[data-event-back]').onclick=()=>onBack?.();
}
