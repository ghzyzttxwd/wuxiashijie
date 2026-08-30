import {createCombatant} from '../combat/combatant.js';
import {createBattleState,executeAction} from '../combat/battleState.js';
import {M5_COMBAT_ACTION_BY_MARTIAL_ID} from '../data/combat/m5Actions.js';
import {MARTIAL_BY_ID} from '../data/martial/index.js';
import {playCombatAnimation} from '../combat-render/battleScene.js';
import {advanceSessionHours} from '../core/sessionFactory.js';

function playerCombatant(character){
  const a=character.attributes||{},root=a.root||50,physique=a.physique||50,agility=a.agility||50;
  return createCombatant({id:'player',name:character.name,maxHp:120+physique*2,attack:30+physique*.62+root*.22,defense:22+physique*.48+root*.2,speed:28+agility*.72,maxEnergy:60+root*.8,side:'left'});
}
function instructorCombatant(){return createCombatant({id:'instructor',name:'洛阳武馆教习',maxHp:190,attack:62,defense:48,speed:50,maxEnergy:100,side:'right'});}
function supportedKnown(character){return Object.keys(character.martialState?.learned||{}).filter(id=>M5_COMBAT_ACTION_BY_MARTIAL_ID[id]);}
function hpText(battle,id){const c=battle.combatants[id];return`${Math.max(0,Math.round(c.hp))}/${Math.round(c.maxHp)}`;}

export function mountCombatPrototype(root,session,{onBack,onFinish}){
  const character=session.character,skills=supportedKnown(character);
  if(character.world.location!=='ming_luoyang'||character.world.scene!=='luoyang_martial_hall'){
    root.innerHTML='<div class="combat-empty"><h2>这里不能切磋</h2><p>先到洛阳武馆街进入武馆演武场。</p><button data-combat-back>返回</button></div>';root.querySelector('[data-combat-back]').onclick=onBack;return;
  }
  if(!skills.length){
    root.innerHTML='<div class="combat-empty"><h2>还没有可用于演武的武功</h2><p>先在洛阳武馆学一门基础拳法、剑法或刀法。</p><button data-combat-back>返回</button></div>';root.querySelector('[data-combat-back]').onclick=onBack;return;
  }

  let battle=createBattleState({left:playerCombatant(character),right:instructorCombatant()}),busy=false,boutFinished=false;
  root.innerHTML=`<section class="combat-shell"><div class="combat-heading"><div><p class="eyebrow">M5 · Canvas动态战斗原型</p><h2>洛阳武馆 · 演武切磋</h2><p>演武场提供木制刀剑。此阶段为不致死切磋，用来验证人物位移、受击、击退、Hit Stop、粒子与镜头反馈。</p></div><button data-combat-back>退出演武</button></div><canvas class="combat-canvas" data-combat-canvas></canvas><div class="combat-hud"><div><b>你：<span data-player-hp></span></b><small>选择你已经学会的武功出手。</small></div><div><b>教习：<span data-enemy-hp></span></b><small data-combat-message>双方抱拳，切磋开始。</small></div></div><div class="combat-actions">${skills.map(id=>`<button data-combat-skill="${id}">${MARTIAL_BY_ID[id]?.name||id}</button>`).join('')}<button data-combat-finish hidden>结束切磋</button></div></section>`;
  const canvas=root.querySelector('[data-combat-canvas]'),message=root.querySelector('[data-combat-message]'),finishButton=root.querySelector('[data-combat-finish]'),skillButtons=[...root.querySelectorAll('[data-combat-skill]')];
  const updateHud=()=>{root.querySelector('[data-player-hp]').textContent=hpText(battle,'player');root.querySelector('[data-enemy-hp]').textContent=hpText(battle,'instructor');skillButtons.forEach(x=>x.disabled=busy||boutFinished);};
  const close=()=>onBack();
  root.querySelector('[data-combat-back]').onclick=close;
  finishButton.onclick=()=>{const next=advanceSessionHours(session,1);onFinish(next);};

  async function animateTurn(attackerId,defenderId,martialId){
    const before=battle,out=executeAction(battle,{attackerId,defenderId,martialId});battle=out.state;
    await playCombatAnimation({canvas,beforeState:before,afterState:battle,events:out.events,martialId});
    updateHud();return out;
  }
  async function playerTurn(martialId){
    if(busy||boutFinished)return;busy=true;updateHud();message.textContent=`你使出${MARTIAL_BY_ID[martialId]?.name||martialId}。`;
    const playerOut=await animateTurn('player','instructor',martialId);
    if(battle.finished){boutFinished=true;busy=false;message.textContent='教习认输。切磋结束。';finishButton.hidden=false;updateHud();return;}
    message.textContent=playerOut.result?.hit?'教习退开半步，随即还手。':'教习避开此招，立即还手。';
    const enemyOut=await animateTurn('instructor','player','martial_basic_fist');
    busy=false;
    if(battle.finished){boutFinished=true;message.textContent='你被教习制住。切磋结束。';finishButton.hidden=false;}else message.textContent=enemyOut.result?.hit?'你受了一拳，重新站稳。':'你避开了教习的反击。';
    updateHud();
  }
  skillButtons.forEach(button=>button.onclick=()=>playerTurn(button.dataset.combatSkill));
  updateHud();
}
