import {eventSummary,availableInterventions}from'../event/interventions.js';

export function renderEventPanel(root,session,{message='',onBack,onIntervene}={}){
  const events=eventSummary(session.worldState),actions=availableInterventions(session.worldState,session.character),byEvent=Object.groupBy?Object.groupBy(actions,x=>x.eventId):actions.reduce((m,x)=>((m[x.eventId]??=[]).push(x),m),{});
  root.innerHTML=`<div class="section-head"><div><p class="eyebrow">江湖不会等你</p><h2>江湖志</h2><p>这里记录正在自行推进的大事。你只有身处相关地点时，才可能真正插手。</p></div><button data-event-back>返回</button></div>${message?`<p class="event-message">${message}</p>`:''}<div class="event-grid">${events.map(e=>`<article class="event-card ${e.terminal?'terminal':''}"><div class="event-card-head"><b>${e.name}</b><span>${e.terminal?'已定局':'进行中'}</span></div><h3>${e.phaseName}</h3><p>${e.rumor}</p><div class="event-actions">${(byEvent[e.id]||[]).map(a=>`<button data-event-id="${e.id}" data-intervention-id="${a.intervention.id}">${a.intervention.name}</button>`).join('')||'<small>你当前所在位置没有可直接干预的机会。</small>'}</div></article>`).join('')}</div>`;
  root.querySelector('[data-event-back]').onclick=()=>onBack?.();
  root.querySelectorAll('[data-intervention-id]').forEach(button=>button.onclick=()=>onIntervene?.(button.dataset.eventId,button.dataset.interventionId));
}
