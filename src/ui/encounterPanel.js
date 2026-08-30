import {MING_ENCOUNTER_BY_SCENE}from'../data/encounters/ming.js';
export function currentEncounter(character){return MING_ENCOUNTER_BY_SCENE[character?.world?.scene]||null;}
export function renderEncounterPanel(character){const e=currentEncounter(character);if(!e)return'';return`<section class="encounter-panel"><p class="eyebrow">固定实战点</p><h3>${e.name}</h3><p>${e.summary}</p><div class="encounter-meta"><span>难度系数 ${e.difficulty}</span><span>每场耗时 1 小时</span><span>可反复挑战</span></div><button data-start-encounter="${e.id}">进入实战</button></section>`;}
