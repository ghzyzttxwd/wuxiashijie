import {CombatRenderer} from './renderer.js';
import {compileAnimationTimeline,activeClipAt,clipProgress} from './animationTimeline.js';
import {createCamera,kickCamera,updateCamera} from './camera.js';
import {createParticleSystem,spawnImpact,updateParticles} from './particles.js';
import {getFxProfile} from './skillFx.js';

const easeOut=t=>1-Math.pow(1-t,3);
const easeInOut=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

function combatantsBySide(state){
  const list=Object.values(state.combatants);return{left:list.find(x=>x.side==='left')||list[0],right:list.find(x=>x.side==='right')||list[1]};
}

function basePose(combatant,x,y,side){return{id:combatant.id,name:combatant.name,x,y,side,lean:0,flash:0,weapon:null,defeated:combatant.hp<=0};}
function weaponFor(martialId){return martialId.includes('sword')?'sword':martialId.includes('saber')?'saber':null;}
function contactGap(fx){return fx.motion==='charge-palm'?105:fx.motion==='heavy-slash'?124:fx.motion==='dash-slash'?116:112;}
function afterimageSet(attacker,dir,intensity=1){
  const out=[];for(let i=1;i<=3;i++)out.push({...attacker,x:attacker.x-dir*(30+i*30)*intensity,alpha:.22/i,flash:0,weapon:null});return out;
}
function dustSet(x,y,dir,power=1){return[{x:x-dir*18,y:y+57,rx:30*power,ry:7,alpha:.18},{x:x-dir*48,y:y+59,rx:18*power,ry:5,alpha:.1}];}

export function playCombatAnimation({canvas,beforeState,afterState,events,martialId,freezeAt=null}){
  const renderer=new CombatRenderer(canvas),timeline=compileAnimationTimeline(events),camera=createCamera(),particles=createParticleSystem(),before=combatantsBySide(beforeState),after=combatantsBySide(afterState),fx=getFxProfile(martialId)||{},triggered=new Set();
  const leftBase={x:165,y:renderer.height*.78},rightBase={x:renderer.width-165,y:renderer.height*.78};
  const baseDistance=Math.abs(rightBase.x-leftBase.x),travel=Math.max(150,baseDistance-contactGap(fx));
  const attackerId=events.find(x=>x.actorId)?.actorId,targetId=events.find(x=>x.targetId)?.targetId;
  let last=performance.now(),started=last;

  return new Promise(resolve=>{
    function frame(now){
      const elapsed=now-started,dt=Math.min(40,now-last);last=now;updateCamera(camera,dt);updateParticles(particles,dt);
      const clip=activeClipAt(timeline,elapsed),p=clip?clipProgress(clip,elapsed):1,event=clip?.event;
      let left=basePose(after.left,leftBase.x,leftBase.y,1),right=basePose(after.right,rightBase.x,rightBase.y,-1),impact=null,trailProgress=0,title='',afterimages=[],dust=[];
      left.weapon=left.id===attackerId?weaponFor(martialId):null;right.weapon=right.id===attackerId?weaponFor(martialId):null;
      const attacker=left.id===attackerId?left:right,target=left.id===targetId?left:right,dir=attacker.side;
      if(event){
        if(['action_start','approach','hit','miss'].includes(event.type))title=events.find(x=>x.type==='action_start')?.martialName||'';
        if(event.type==='action_start'){
          attacker.lean=-dir*(fx.motion==='charge-palm'?.12:.09);attacker.y+=4*Math.sin(Math.PI*p);dust=dustSet(attacker.x,attacker.y,dir,.7);
        }
        if(event.type==='approach'){
          const dash=easeOut(p);attacker.x+=dir*travel*dash;attacker.y-=Math.sin(Math.PI*p)*(fx.motion==='dash-slash'?18:10);attacker.lean=dir*(fx.motion==='heavy-slash'?.11:.075);trailProgress=.12+p*.48;
          afterimages=afterimageSet(attacker,dir,.82+.28*p);dust=dustSet(attacker.x,attacker.y,dir,1+p*.4);
        }
        if(event.type==='hit'){
          const drive=travel+26*Math.sin(Math.PI*p);attacker.x+=dir*drive;attacker.y-=12*Math.sin(Math.PI*p);attacker.lean=dir*(fx.motion==='charge-palm'?.2:.18);target.flash=Math.max(0,1-p*.9);trailProgress=.6+p*.4;
          afterimages=afterimageSet(attacker,dir,.82);dust=dustSet(attacker.x,attacker.y,dir,1.45);
          impact={martialId,x:target.x-dir*28,y:target.y-43,groundY:target.y+58,ageMs:p*260};
          if(!triggered.has(clip.id)){
            triggered.add(clip.id);
            const heavy=fx.impact==='shockwave'||fx.impact==='heavy-spark';
            spawnImpact(particles,{x:target.x-dir*25,y:target.y-42,count:fx.impact==='shockwave'?42:fx.impact==='heavy-spark'?30:22,speed:fx.impact==='shockwave'?255:heavy?195:170,size:fx.impact==='shockwave'?5:heavy?4:3.2,lifeMs:heavy?480:400});
            kickCamera(camera,{shake:(fx.screenShake||2)*1.45,zoom:(fx.cameraZoom||1.01)+.014});
          }
        }
        if(event.type==='miss'){
          attacker.x+=dir*travel*easeOut(p);attacker.y-=12*Math.sin(Math.PI*p);target.x+=dir*52*Math.sin(Math.PI*p);target.lean=-dir*.1*Math.sin(Math.PI*p);trailProgress=.2+p*.8;afterimages=afterimageSet(attacker,dir,.9);dust=dustSet(attacker.x,attacker.y,dir,1.1);
        }
        if(event.type==='knockback'){
          const distance=event.distance||62;attacker.x+=dir*(travel-18*easeInOut(p));target.x+=dir*distance*easeInOut(p);target.y-=9*Math.sin(Math.PI*p);target.lean=dir*.3*Math.sin(Math.PI*p);dust=[...dustSet(target.x,target.y,-dir,1.35),...dustSet(attacker.x,attacker.y,dir,.8)];
        }
        if(event.type==='recover'){
          attacker.x+=dir*travel*(1-easeInOut(p));attacker.lean=-dir*.05*(1-p);dust=p<.38?dustSet(attacker.x,attacker.y,-dir,.72):[];
        }
        if(event.type==='defeat'){target.lean=dir*(Math.PI/2)*easeOut(p);target.y+=31*easeOut(p);dust=dustSet(target.x,target.y,-dir,1.25);}
      }
      const hitClip=timeline.clips.find(x=>x.event.type==='hit'),hitStarted=Boolean(hitClip&&elapsed>=hitClip.startMs);
      const leftHp=left.id===targetId&&hitStarted?after.left.hp:before.left.hp;
      const rightHp=right.id===targetId&&hitStarted?after.right.hp:before.right.hp;
      renderer.render({camera,left,right,leftHp,rightHp,leftMaxHp:after.left.maxHp,rightMaxHp:after.right.maxHp,particles,martialId,attackerId,trailProgress,impact,title,afterimages,dust});
      const freezeEvent=freezeAt?.eventType,freezeProgress=freezeAt?.progress??.6;
      if(freezeEvent&&event?.type===freezeEvent&&p>=freezeProgress){resolve({frozen:true,eventType:event.type,progress:p});return;}
      if(elapsed<timeline.totalMs+100)requestAnimationFrame(frame);else resolve({frozen:false});
    }
    requestAnimationFrame(frame);
  });
}
