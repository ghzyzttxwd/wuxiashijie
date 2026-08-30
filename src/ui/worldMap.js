import {MING_COUNTRY} from '../data/countries/ming.js';
import {MING_LOCATIONS,MING_LOCATION_BY_ID} from '../data/locations/ming/index.js';
import {findShortestRoute} from '../world/routePlanner.js';
import {travelCharacter} from '../world/travel.js';
import {loadCharacter,saveCharacter} from '../save/saveManager.js';

const OTHER_COUNTRIES=['大唐','大宋','大清','大理','辽','西夏','蒙古','神州','西域诸国','海外'];
const state={slot:0,character:null,view:'world',focusLocationId:null};
const $=q=>document.querySelector(q);

function currentLocation(){return MING_LOCATION_BY_ID[state.character?.world?.location]||null;}
function formatTime(){const w=state.character.world;return `第 ${w.day} 日 · ${String(w.hour).padStart(2,'0')}:00`;}
function routeText(location){if(location.id===state.character.world.location)return'当前所在';const route=findShortestRoute(state.character.world.location,location.id);return route?`约 ${route.hours} 小时`:'道路未通';}

function renderShell(){
  const root=$('#world-root');
  root.hidden=false;$('#creation-root').hidden=true;
  root.innerHTML=`<section class="world-top panel"><div><p class="eyebrow">九州武侠 · M2</p><h1 id="world-character-name"></h1><p id="world-character-meta"></p></div><div class="world-status"><b id="world-location"></b><span id="world-time"></span><span id="world-silver"></span></div></section><nav class="world-nav panel"><button data-world-home>天下列国</button><button data-country="ming">大明</button><button data-return-create>返回角色页</button></nav><section id="world-content" class="panel world-content"></section>`;
  root.querySelector('#world-character-name').textContent=state.character.name;
  root.querySelector('#world-character-meta').textContent='江湖初行 · 大明';
  root.querySelector('[data-world-home]').onclick=()=>{state.view='world';state.focusLocationId=null;renderContent();};
  root.querySelector('[data-country]').onclick=()=>{state.view='country';state.focusLocationId=null;renderContent();};
  root.querySelector('[data-return-create]').onclick=()=>{root.hidden=true;$('#creation-root').hidden=false;};
  renderContent();
}

function renderHeader(){const loc=currentLocation();$('#world-location').textContent=loc?`当前位置：${loc.name}`:'当前位置：未知';$('#world-time').textContent=formatTime();$('#world-silver').textContent=`银两：${state.character.wallet?.silver??0}`;}

function renderWorld(){const content=$('#world-content');content.innerHTML=`<div class="section-head"><div><p class="eyebrow">天下列国图</p><h2>天下</h2><p>各国同时存在于这个架空融合时代。V0.1 先把大明做活，其余国域暂不开放。</p></div></div><div class="country-grid"><button class="country-card active-country" data-open-ming><b>大明</b><span>已开放 · 当前首发国域</span></button>${OTHER_COUNTRIES.map(name=>`<button class="country-card" disabled><b>${name}</b><span>后续开放</span></button>`).join('')}</div>`;content.querySelector('[data-open-ming]').onclick=()=>{state.view='country';renderContent();};}

function renderCountry(){const content=$('#world-content');content.innerHTML=`<div class="section-head"><div><p class="eyebrow">国域</p><h2>${MING_COUNTRY.name}</h2><p>${MING_COUNTRY.description}</p></div></div><div class="location-grid">${MING_LOCATIONS.map(loc=>`<button class="location-card ${loc.id===state.character.world.location?'current':''}" data-location="${loc.id}"><span class="risk">风险 ${loc.risk}</span><b>${loc.name}</b><small>${loc.summary}</small><em>${routeText(loc)}</em></button>`).join('')}</div>`;content.querySelectorAll('[data-location]').forEach(button=>button.onclick=()=>{state.focusLocationId=button.dataset.location;state.view='location';renderContent();});}

function renderLocation(){const location=MING_LOCATION_BY_ID[state.focusLocationId];if(!location){state.view='country';renderContent();return;}const here=location.id===state.character.world.location,route=here?{hours:0,locations:[location.id]}:findShortestRoute(state.character.world.location,location.id);const content=$('#world-content');content.innerHTML=`<div class="section-head"><div><p class="eyebrow">${location.kind}</p><h2>${location.name}</h2><p>${location.summary}</p></div><button data-back-country>返回大明地图</button></div>${here?`<p class="arrival">你当前就在这里。</p>`:`<div class="travel-box"><b>行程：${route?route.locations.map(id=>MING_LOCATION_BY_ID[id]?.name||id).join(' → '):'道路未通'}</b><span>${route?`预计 ${route.hours} 小时`:'暂不可达'}</span><button data-travel ${route?'':'disabled'}>启程前往</button></div>`}<div class="scene-grid">${here?location.scenes.map(scene=>`<button data-scene="${scene.id}"><b>${scene.name}</b><span>进入场景</span></button>`).join(''):'<p>抵达后才能进入具体场景。</p>'}</div>`;content.querySelector('[data-back-country]').onclick=()=>{state.view='country';renderContent();};const travel=content.querySelector('[data-travel]');if(travel)travel.onclick=()=>{state.character=travelCharacter(state.character,location.id);saveCharacter(state.slot,state.character);renderContent();};content.querySelectorAll('[data-scene]').forEach(button=>button.onclick=()=>{state.character={...state.character,world:{...state.character.world,scene:button.dataset.scene}};saveCharacter(state.slot,state.character);content.querySelectorAll('[data-scene]').forEach(x=>x.classList.toggle('selected-scene',x.dataset.scene===button.dataset.scene));});}

function renderContent(){renderHeader();if(state.view==='world')renderWorld();else if(state.view==='country')renderCountry();else renderLocation();}

export function initWorldMap(slot){const character=loadCharacter(slot);if(!character)throw Error('empty_slot');state.slot=slot;state.character=character;state.view='world';state.focusLocationId=null;renderShell();}
