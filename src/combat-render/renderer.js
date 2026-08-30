import {applyCamera} from './camera.js';
import {drawParticles} from './particles.js';
import {drawSkillTrail,drawImpactFx} from './skillFx.js';

function roundRect(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,rr):ctx.rect(x,y,w,h);}

function drawBar(ctx,{x,y,w,value,max,label,align='left'}){
  const ratio=Math.max(0,Math.min(1,max?value/max:0));
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,.58)';roundRect(ctx,x-3,y-3,w+6,18,8);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.13)';roundRect(ctx,x,y,w,12,6);ctx.fill();
  const hp=ctx.createLinearGradient(x,0,x+w,0);hp.addColorStop(0,'rgba(245,245,245,.98)');hp.addColorStop(1,'rgba(190,194,200,.92)');ctx.fillStyle=hp;roundRect(ctx,x,y,w*ratio,12,6);ctx.fill();
  ctx.font='600 13px "Noto Sans CJK SC","Microsoft YaHei",system-ui,sans-serif';ctx.fillStyle='rgba(255,255,255,.9)';ctx.textAlign=align;ctx.fillText(label,align==='right'?x+w:x,y-9);ctx.restore();
}

function drawBackdrop(ctx,w,h){
  const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#252a32');sky.addColorStop(.52,'#12161c');sky.addColorStop(1,'#08090b');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  ctx.save();
  const moon=ctx.createRadialGradient(w*.77,h*.17,2,w*.77,h*.17,78);moon.addColorStop(0,'rgba(255,255,255,.18)');moon.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=moon;ctx.beginPath();ctx.arc(w*.77,h*.17,78,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.arc(w*.77,h*.17,31,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(5,7,9,.82)';
  ctx.beginPath();ctx.moveTo(0,h*.55);ctx.lineTo(w*.12,h*.31);ctx.lineTo(w*.25,h*.54);ctx.lineTo(w*.39,h*.28);ctx.lineTo(w*.55,h*.55);ctx.lineTo(w*.69,h*.36);ctx.lineTo(w*.84,h*.56);ctx.lineTo(w,h*.34);ctx.lineTo(w,h*.72);ctx.lineTo(0,h*.72);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(28,31,35,.72)';ctx.beginPath();ctx.moveTo(0,h*.63);ctx.lineTo(w*.17,h*.48);ctx.lineTo(w*.33,h*.65);ctx.lineTo(w*.52,h*.45);ctx.lineTo(w*.71,h*.64);ctx.lineTo(w*.9,h*.5);ctx.lineTo(w,h*.61);ctx.lineTo(w,h*.76);ctx.lineTo(0,h*.76);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=2;
  for(const x of [w*.08,w*.92]){ctx.beginPath();ctx.moveTo(x,h*.44);ctx.lineTo(x,h*.76);ctx.stroke();ctx.beginPath();ctx.moveTo(x-18,h*.47);ctx.lineTo(x+18,h*.47);ctx.stroke();}
  const floor=ctx.createLinearGradient(0,h*.69,0,h);floor.addColorStop(0,'rgba(62,64,66,.38)');floor.addColorStop(1,'rgba(10,10,11,.9)');ctx.fillStyle=floor;ctx.fillRect(0,h*.69,w,h*.31);
  ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;
  for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(0,h*.73+i*18);ctx.lineTo(w,h*.73+i*7);ctx.stroke();}
  for(let i=1;i<8;i++){const x=w*i/8;ctx.beginPath();ctx.moveTo(x,h*.69);ctx.lineTo(w*.5+(x-w*.5)*1.7,h);ctx.stroke();}
  ctx.restore();
}

function drawWeapon(ctx,kind,side){
  ctx.save();ctx.lineCap='round';
  if(kind==='sword'){
    ctx.strokeStyle='rgba(255,255,255,.96)';ctx.lineWidth=3;ctx.shadowBlur=9;ctx.shadowColor='rgba(255,255,255,.5)';ctx.beginPath();ctx.moveTo(side*3,-30);ctx.lineTo(side*58,-66);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(side*1,-29);ctx.lineTo(side*12,-37);ctx.stroke();
  }
  if(kind==='saber'){
    ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=7;ctx.shadowBlur=10;ctx.shadowColor='rgba(255,255,255,.45)';ctx.beginPath();ctx.moveTo(side*4,-30);ctx.quadraticCurveTo(side*37,-48,side*62,-72);ctx.stroke();
  }
  ctx.restore();
}

function drawFighter(ctx,fighter,{alpha=1,ghost=false}={}){
  const {x,y,side=1,lean=0,flash=0,weapon=null,defeated=false}=fighter;
  ctx.save();ctx.translate(x,y);ctx.rotate(lean);ctx.scale(side,1);ctx.globalAlpha=alpha*(defeated?.55:1);
  if(flash>0){ctx.shadowBlur=28;ctx.shadowColor='rgba(255,255,255,.98)';}
  const body=flash>0?'rgba(255,255,255,.98)':ghost?'rgba(210,215,224,.22)':'rgba(17,18,22,.98)';
  const edge=flash>0?'rgba(255,255,255,1)':ghost?'rgba(255,255,255,.12)':'rgba(221,224,230,.42)';
  ctx.fillStyle=body;ctx.strokeStyle=edge;ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(0,-86,15,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.ellipse(-2,-106,8,12,-.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(-15,-70);ctx.quadraticCurveTo(-36,-48,-43,-7);ctx.lineTo(-28,2);ctx.lineTo(-18,-35);ctx.lineTo(-12,5);ctx.lineTo(14,5);ctx.lineTo(20,-39);ctx.lineTo(31,-3);ctx.lineTo(48,-12);ctx.quadraticCurveTo(38,-49,15,-70);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=ghost?'rgba(255,255,255,.08)':'rgba(100,104,112,.68)';ctx.fillRect(-15,-33,31,6);
  ctx.fillStyle=body;ctx.strokeStyle=edge;ctx.lineWidth=8;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-8,1);ctx.lineTo(-19,43);ctx.lineTo(-32,63);ctx.moveTo(8,1);ctx.lineTo(20,43);ctx.lineTo(33,61);ctx.stroke();
  ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-14,-57);ctx.lineTo(-34,-25);ctx.moveTo(14,-57);ctx.lineTo(38,-32);ctx.stroke();
  if(!ghost)drawWeapon(ctx,weapon,1);
  ctx.restore();
}

function drawAfterimages(ctx,afterimages=[]){for(const image of afterimages)drawFighter(ctx,image,{alpha:image.alpha??.18,ghost:true});}

function drawGroundFeedback(ctx,{dust=[],impact=null}={}){
  ctx.save();
  for(const d of dust){
    ctx.globalAlpha=d.alpha??.22;ctx.fillStyle='rgba(220,220,220,.5)';ctx.beginPath();ctx.ellipse(d.x,d.y,d.rx||26,d.ry||7,0,0,Math.PI*2);ctx.fill();
  }
  if(impact){const p=Math.min(1,impact.ageMs/260);ctx.globalAlpha=(1-p)*.45;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(impact.x,impact.groundY||impact.y+76,24+p*72,7+p*18,0,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

export class CombatRenderer{
  constructor(canvas){if(!canvas)throw Error('canvas_required');this.canvas=canvas;this.ctx=canvas.getContext('2d');this.width=0;this.height=0;this.resize();}
  resize(){const rect=this.canvas.getBoundingClientRect(),dpr=Math.max(1,window.devicePixelRatio||1);this.width=Math.max(640,Math.round(rect.width||900));this.height=Math.max(360,Math.round(rect.height||500));this.canvas.width=Math.round(this.width*dpr);this.canvas.height=Math.round(this.height*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);}
  render(frame){
    const {camera,left,right,leftHp,rightHp,leftMaxHp,rightMaxHp,particles=[],martialId=null,attackerId=null,trailProgress=0,impact=null,title='',afterimages=[],dust=[]}=frame,ctx=this.ctx,w=this.width,h=this.height;
    ctx.clearRect(0,0,w,h);ctx.save();applyCamera(ctx,camera,w,h);drawBackdrop(ctx,w,h);
    drawGroundFeedback(ctx,{dust,impact});drawAfterimages(ctx,afterimages);
    const attacker=left.id===attackerId?left:right,target=left.id===attackerId?right:left;
    drawSkillTrail(ctx,{martialId,attacker,target,progress:trailProgress});
    drawFighter(ctx,left);drawFighter(ctx,right);
    if(impact)drawImpactFx(ctx,{martialId:impact.martialId,x:impact.x,y:impact.y,ageMs:impact.ageMs});
    drawParticles(ctx,particles);ctx.restore();
    drawBar(ctx,{x:28,y:28,w:Math.min(310,w*.34),value:leftHp,max:leftMaxHp,label:left.name});
    drawBar(ctx,{x:w-Math.min(310,w*.34)-28,y:28,w:Math.min(310,w*.34),value:rightHp,max:rightMaxHp,label:right.name,align:'right'});
    if(title){ctx.save();ctx.font='700 28px "Noto Serif CJK SC","Songti SC",serif';ctx.textAlign='center';ctx.shadowBlur=18;ctx.shadowColor='rgba(0,0,0,.9)';ctx.fillStyle='rgba(255,255,255,.96)';ctx.fillText(title,w/2,76);ctx.restore();}
  }
}
