import {applyCamera} from './camera.js';
import {drawParticles} from './particles.js';
import {drawSkillTrail,drawImpactFx} from './skillFx.js';

function roundRect(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,rr):ctx.rect(x,y,w,h);}

function drawBar(ctx,{x,y,w,value,max,label,align='left'}){
  const ratio=Math.max(0,Math.min(1,max?value/max:0));
  ctx.save();ctx.fillStyle='rgba(0,0,0,.45)';roundRect(ctx,x,y,w,12,6);ctx.fill();ctx.fillStyle='rgba(244,244,244,.88)';roundRect(ctx,x,y,w*ratio,12,6);ctx.fill();ctx.font='12px system-ui';ctx.fillStyle='rgba(255,255,255,.86)';ctx.textAlign=align;ctx.fillText(label,align==='right'?x+w:x,y-7);ctx.restore();
}

function drawWeapon(ctx,kind,side){
  ctx.save();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineCap='round';
  if(kind==='sword'){ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(side*42,-42);ctx.stroke();}
  if(kind==='saber'){ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,-4);ctx.quadraticCurveTo(side*26,-28,side*46,-48);ctx.stroke();}
  ctx.restore();
}

function drawFighter(ctx,fighter){
  const {x,y,side=1,lean=0,flash=0,weapon=null,defeated=false}=fighter;
  ctx.save();ctx.translate(x,y);ctx.rotate(lean);ctx.globalAlpha=defeated?.55:1;
  if(flash>0){ctx.shadowBlur=22;ctx.shadowColor='rgba(255,255,255,.95)';}
  ctx.fillStyle=flash>0?'rgba(255,255,255,.98)':'rgba(20,20,22,.96)';
  ctx.beginPath();ctx.arc(0,-72,17,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(-17,-54);ctx.lineTo(17,-54);ctx.lineTo(23,-4);ctx.lineTo(-23,-4);ctx.closePath();ctx.fill();
  ctx.lineWidth=11;ctx.strokeStyle=ctx.fillStyle;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-11,-45);ctx.lineTo(-side*30,-16);ctx.moveTo(11,-45);ctx.lineTo(side*31,-22);ctx.moveTo(-10,-2);ctx.lineTo(-18,42);ctx.moveTo(10,-2);ctx.lineTo(18,42);ctx.stroke();
  drawWeapon(ctx,weapon,side);ctx.restore();
}

export class CombatRenderer{
  constructor(canvas){if(!canvas)throw Error('canvas_required');this.canvas=canvas;this.ctx=canvas.getContext('2d');this.width=0;this.height=0;this.resize();}
  resize(){const rect=this.canvas.getBoundingClientRect(),dpr=Math.max(1,window.devicePixelRatio||1);this.width=Math.max(640,Math.round(rect.width||900));this.height=Math.max(360,Math.round(rect.height||500));this.canvas.width=Math.round(this.width*dpr);this.canvas.height=Math.round(this.height*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);}
  render(frame){
    const {camera,left,right,leftHp,rightHp,leftMaxHp,rightMaxHp,particles=[],martialId=null,attackerId=null,trailProgress=0,impact=null,title=''}=frame,ctx=this.ctx,w=this.width,h=this.height;
    ctx.clearRect(0,0,w,h);ctx.save();applyCamera(ctx,camera,w,h);
    const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#181a1d');grad.addColorStop(1,'#090a0b');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(0,h*.72+i*10);ctx.lineTo(w,h*.72+i*2);ctx.stroke();}
    ctx.fillStyle='rgba(255,255,255,.04)';ctx.beginPath();ctx.arc(w*.18,h*.22,80,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w*.82,h*.18,58,0,Math.PI*2);ctx.fill();
    const attacker=left.id===attackerId?left:right,target=left.id===attackerId?right:left;
    drawSkillTrail(ctx,{martialId,attacker,target,progress:trailProgress});
    drawFighter(ctx,left);drawFighter(ctx,right);
    if(impact)drawImpactFx(ctx,{martialId:impact.martialId,x:impact.x,y:impact.y,ageMs:impact.ageMs});
    drawParticles(ctx,particles);ctx.restore();
    drawBar(ctx,{x:28,y:26,w:Math.min(300,w*.34),value:leftHp,max:leftMaxHp,label:left.name});
    drawBar(ctx,{x:w-Math.min(300,w*.34)-28,y:26,w:Math.min(300,w*.34),value:rightHp,max:rightMaxHp,label:right.name,align:'right'});
    if(title){ctx.save();ctx.font='700 27px serif';ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,.94)';ctx.fillText(title,w/2,72);ctx.restore();}
  }
}
