import {CombatRenderer} from './renderer.js';
import {compileAnimationTimeline,activeClipAt,clipProgress} from './animationTimeline.js';
import {createCamera,kickCamera,updateCamera} from './camera.js';
import {createParticleSystem,spawnImpact,updateParticles} from './particles.js';
import {getFxProfile} from './skillFx.js';

const easeOut=t=>1-Math.pow(1-t,3);

function combatantsBySide(state){
  const list=Object.values(state.combatants);return{left:list.find(x=>x.side==='left')||list[0],right:list.find(x=>x.side==='right')||list[1]};
}

function basePose(combatant,x,y,side){return{id:combatant.id,name:combatant.name,x,y,side,lean:0,flash:0,weapon:null,defeated:combatant.hp<=0};}
function weaponFor(martialId){return martialId.includes('sword')?'sword':martialId.includes('saber')?'saber':null;}

export function playCombatAnimation({canvas,beforeState,afterState,events,martialId}){
  const renderer=new CombatRenderer(canvas),timeline=compileAnimationTimeline(events),camera=createCamera(),particles=createParticleSystem(),before=combatantsBySide(beforeState),after=combatantsBySide(afterState),fx=getFxProfile(martialId)||{},triggered=new Set();
  const leftBase={x:150,y:renderer.height*.78},rightBase={x:renderer.width-150,y:renderer.height*.78};
  const attackerId=events.find(x=>x.actorId)?.actorId,targetId=events.find(x=>x.targetId)?.targetId;
  let last=performance.now(),started=last;

  return new Promise(resolve=>{
    function frame(now){
      const elapsed=now-started,dt=Math.min(40,now-last);last=now;updateCamera(camera,dt);updateParticles(particles,dt);
      const clip=activeClipAt(timeline,elapsed),p=clip?clipProgress(clip,elapsed):1,event=clip?.event;
      let left=basePose(after.left,leftBase.x,leftBase.y,1),right=basePose(after.right,rightBase.x,rightBase.y,-1),impact=null,trailProgress=0,title='';
      left.weapon=left.id===attackerId?weaponFor(martialId):null;right.weapon=right.id===attackerId?weaponFor(martialId):null;
      const attacker=left.id===attackerId?left:right,target=left.id===targetId?left:right,dir=attacker.side;
      const travel=120;
      if(event){
        if(['action_start','approach','hit','miss'].includes(event.type))title=events.find(x=>x.type==='action_start')?.martialName||'';
        if(event.type==='action_start')attacker.lean=-dir*.08;
        if(event.type==='approach'){attacker.x+=dir*travel*easeOut(p);attacker.lean=dir*.05;trailProgress=p*.55;}
        if(event.type==='hit'){
          attacker.x+=dir*(travel+18*Math.sin(Math.PI*p));attacker.lean=dir*.12;target.flash=Math.max(0,1-p);trailProgress=.55+p*.45;
          impact={martialId,x:target.x-dir*18,y:target.y-35,ageMs:p*220};
          if(!triggered.has(clip.id)){triggered.add(clip.id);spawnImpact(particles,{x:target.x-dir*18,y:target.y-35,count:fx.impact==='shockwave'?24:fx.impact==='heavy-spark'?18:12,speed:fx.impact==='shockwave'?190:130,size:fx.impact==='shockwave'?4:3});kickCamera(camera,{shake:fx.screenShake||2,zoom:fx.cameraZoom||1.01});}
        }
        if(event.type==='miss'){attacker.x+=dir*travel*easeOut(p);target.x+=dir*38*Math.sin(Math.PI*p);trailProgress=p;}
        if(event.type==='knockback'){attacker.x+=dir*travel*(1-p*.55);target.x+=dir*event.distance*easeOut(p);target.lean=dir*.2*p;}
        if(event.type==='recover')attacker.x+=dir*travel*(1-p);
        if(event.type==='defeat'){target.lean=dir*(Math.PI/2)*easeOut(p);target.y+=25*easeOut(p);}
      }
      const hitClip=timeline.clips.find(x=>x.event.type==='hit'),hitStarted=Boolean(hitClip&&elapsed>=hitClip.startMs);
      const leftHp=left.id===targetId&&hitStarted?after.left.hp:before.left.hp;
      const rightHp=right.id===targetId&&hitStarted?after.right.hp:before.right.hp;
      renderer.render({camera,left,right,leftHp,rightHp,leftMaxHp:after.left.maxHp,rightMaxHp:after.right.maxHp,particles,martialId,trailProgress,impact,title});
      if(elapsed<timeline.totalMs+80)requestAnimationFrame(frame);else resolve();
    }
    requestAnimationFrame(frame);
  });
}
