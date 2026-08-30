import {createCombatant}from'../src/combat/combatant.js';
import {createBattleState,executeAction}from'../src/combat/battleState.js';
import {playCombatAnimation}from'../src/combat-render/battleScene.js';

const canvas=document.querySelector('#combat-canvas'),status=document.querySelector('#status');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const params=new URLSearchParams(location.search),freezeImpact=params.get('freeze')==='impact';
function freshBattle(){return createBattleState({left:createCombatant({id:'player',name:'江湖试客',maxHp:120,hp:120,attack:72,defense:48,speed:66,maxEnergy:120,energy:120,side:'left'}),right:createCombatant({id:'trainer',name:'洛阳武馆教习',maxHp:150,hp:150,attack:55,defense:46,speed:52,maxEnergy:100,energy:100,side:'right'})});}
async function animate(martialId,label,{freezeAt=null}={}){
  status.textContent=label;const before=freshBattle(),out=executeAction(before,{attackerId:'player',defenderId:'trainer',martialId,rng:()=>0});
  return playCombatAnimation({canvas,beforeState:before,afterState:out.state,events:out.events,martialId,freezeAt});
}
async function loop(){while(true){await animate('martial_basic_sword','基础剑法 · 快速剑光');await sleep(180);await animate('martial_shaolin_vajra_palm','大力金刚掌 · 重掌冲击');await sleep(180);}}
async function captureImpact(){const result=await animate('martial_basic_sword','基础剑法 · 命中瞬间',{freezeAt:{eventType:'hit',progress:.6}});document.body.dataset.visualReady=result?.frozen?'impact':'failed';}
if(freezeImpact)captureImpact();else loop();
