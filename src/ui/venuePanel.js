import {LUOYANG_BASIC_LESSON_COST,LUOYANG_BASIC_MARTIAL_IDS,canUseLuoyangHall}from'../martial/venues/luoyangHall.js';
import {MARTIAL_BY_ID}from'../data/martial/index.js';
import {hasMartial}from'../martial/state.js';
export function renderVenuePanel(session){if(!canUseLuoyangHall(session))return'';const unlearned=LUOYANG_BASIC_MARTIAL_IDS.filter(id=>!hasMartial(session.character,id));return`<section class="venue-panel"><p class="eyebrow">洛阳武馆</p><h3>普通教习</h3><p>这里才显示当前地点真正能学的武功。未学武功不会塞进你的个人武学页。</p>${unlearned.length?`<div class="venue-actions">${unlearned.map(id=>`<button data-venue-learn="${id}">学习${MARTIAL_BY_ID[id]?.name||id} · ${LUOYANG_BASIC_LESSON_COST}两</button>`).join('')}</div>`:'<small>这里能教的基础武功你都已经学过了。</small>'}</section>`;}
export function bindVenuePanel(root,onLearn){root.querySelectorAll('[data-venue-learn]').forEach(button=>button.onclick=()=>onLearn?.(button.dataset.venueLearn));}
