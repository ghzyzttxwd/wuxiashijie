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
  ctx.fillStyle='rgba(5,7,9,.82)';ctx.beginPath();ctx.moveTo(0,h*.55);ctx.lineTo(w*.12,h*.31);ctx.lineTo(w*.25,h*.54);ctx.lineTo(w*.39,h*.28);ctx.lineTo(w*.55,h*.55);ctx.lineTo(w*.69,h*.36);ctx.lineTo(w*.84,h*.56);ctx.lineTo(w,h*.34);ctx.lineTo(w,h*.72);ctx.lineTo(0,h*.72);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(28,31,35,.72)';ctx.beginPath();ctx.moveTo(0,h*.63);ctx.lineTo(w*.17,h*.48);ctx.lineTo(w*.33,h*.65);ctx.lineTo(w*.52,h*.45);ctx.lineTo(w*.71,h*.64);ctx.lineTo(w*.9,h*.5);ctx.lineTo(w,h*.61);ctx.lineTo(w,h*.76);ctx.lineTo(0,h*.76);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=2;
  for(const x of [w*.08,w*.92]){ctx.beginPath();ctx.moveTo(x,h*.44);ctx.lineTo(x,h*.76);ctx.stroke();ctx.beginPath();ctx.moveTo(x-18,h*.47);ctx.lineTo(x+18,h*.47);ctx.stroke();}
  const floor=ctx.createLinearGradient(0,h*.69,0,h);floor.addColorStop(0,'rgba(62,64,66,.38)');floor.addColorStop(1,'rgba(10,10,11,.9)');ctx.fillStyle=floor;ctx.fillRect(0,h*.69,w,h*.31);
  ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;
  for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(0,h*.73+i*18);ctx.lineTo(w,h*.73+i*7);ctx.stroke();}
  for(let i=1;i<8;i++){const x=w*i/8;ctx.beginPath();ctx.moveTo(x,h*.69);ctx.lineTo(w*.5+(x-w*.5)*1.7,h);ctx.stroke();}
  ctx.restore();
}

function drawWeapon(ctx,kind){
  ctx.save();ctx.lineCap='round';
  if(kind==='sword'){
    ctx.strokeStyle='rgba(244,248,252,.98)';ctx.lineWidth=3;ctx.shadowBlur=11;ctx.shadowColor='rgba(215,232,250,.7)';ctx.beginPath();ctx.moveTo(10,-35);ctx.lineTo(67,-73);ctx.stroke();
    ctx.strokeStyle='rgba(235,220,185,.78)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(7,-34);ctx.lineTo(18,-41);ctx.stroke();
  }
  if(kind==='saber'){
    ctx.strokeStyle='rgba(250,246,236,.97)';ctx.lineWidth=7;ctx.shadowBlur=12;ctx.shadowColor='rgba(255,225,170,.52)';ctx.beginPath();ctx.moveTo(10,-35);ctx.quadraticCurveTo(44,-51,70,-78);ctx.stroke();
  }
  ctx.restore();
}

function paletteFor(fighter,{ghost=false,flash=false}={}){
  if(flash)return{robe:'#f8fafc',robe2:'#e8edf2',trim:'#ffffff',sash:'#ffffff',skin:'#ffffff',hair:'#ffffff',boot:'#eef2f5'};
  if(ghost)return{robe:'rgba(190,205,218,.18)',robe2:'rgba(220,228,235,.11)',trim:'rgba(255,255,255,.12)',sash:'rgba(255,255,255,.08)',skin:'rgba(255,255,255,.12)',hair:'rgba(255,255,255,.1)',boot:'rgba(255,255,255,.1)'};
  if(fighter.side===1)return{robe:'#203a4b',robe2:'#162b39',trim:'#93aeba',sash:'#9d7951',skin:'#c9aa8d',hair:'#090b0f',boot:'#11161c'};
  return{robe:'#463038',robe2:'#302329',trim:'#b29699',sash:'#896849',skin:'#c3a184',hair:'#0b090a',boot:'#171214'};
}

function drawFighter(ctx,fighter,{alpha=1,ghost=false}={}){
  const {x,y,side=1,lean=0,flash=0,weapon=null,defeated=false}=fighter,colors=paletteFor(fighter,{ghost,flash:flash>0});
  ctx.save();ctx.translate(x,y);ctx.rotate(lean);ctx.scale(side*1.12,1.12);ctx.globalAlpha=alpha*(defeated?.55:1);
  if(flash>0){ctx.shadowBlur=30;ctx.shadowColor='rgba(255,255,255,.96)';}
  ctx.save();ctx.scale(1/side,1);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,61,44,10,0,0,Math.PI*2);ctx.fill();ctx.restore();

  ctx.fillStyle=colors.skin;ctx.strokeStyle=colors.trim;ctx.lineWidth=1.6;
  ctx.beginPath();ctx.moveTo(-12,-102);ctx.quadraticCurveTo(-17,-88,-10,-77);ctx.quadraticCurveTo(0,-70,10,-77);ctx.quadraticCurveTo(17,-89,11,-102);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=colors.hair;ctx.beginPath();ctx.arc(0,-96,14,Math.PI,Math.PI*2);ctx.lineTo(10,-88);ctx.quadraticCurveTo(2,-92,-11,-88);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(-2,-114,7,11,-.15,0,Math.PI*2);ctx.fill();
  if(!ghost&&flash<=0){ctx.fillStyle='rgba(20,16,14,.85)';ctx.fillRect(5,-91,2,1.4);}
  ctx.fillStyle=colors.skin;ctx.fillRect(-5,-76,10,8);

  ctx.fillStyle=colors.robe;ctx.strokeStyle=colors.trim;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-19,-70);ctx.quadraticCurveTo(-31,-52,-28,-20);ctx.lineTo(-18,8);ctx.lineTo(20,8);ctx.lineTo(29,-23);ctx.quadraticCurveTo(30,-54,18,-70);ctx.quadraticCurveTo(0,-61,-19,-70);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=colors.robe2;ctx.beginPath();ctx.moveTo(-4,-68);ctx.lineTo(7,-51);ctx.lineTo(-1,-28);ctx.lineTo(-13,-53);ctx.closePath();ctx.fill();
  ctx.strokeStyle=colors.trim;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-4,-68);ctx.lineTo(7,-51);ctx.lineTo(1,-32);ctx.stroke();

  ctx.fillStyle=colors.robe;ctx.strokeStyle=colors.trim;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-18,-62);ctx.quadraticCurveTo(-34,-54,-43,-29);ctx.lineTo(-35,-18);ctx.lineTo(-21,-39);ctx.lineTo(-12,-49);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(17,-62);ctx.quadraticCurveTo(34,-53,43,-32);ctx.lineTo(35,-21);ctx.lineTo(20,-42);ctx.lineTo(10,-50);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=colors.skin;ctx.beginPath();ctx.arc(-38,-18,4.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(38,-21,4.2,0,Math.PI*2);ctx.fill();

  ctx.fillStyle=colors.sash;roundRect(ctx,-22,-30,44,8,3);ctx.fill();
  ctx.fillStyle=colors.robe2;ctx.strokeStyle=colors.trim;ctx.lineWidth=1.7;
  ctx.beginPath();ctx.moveTo(-20,-22);ctx.lineTo(21,-22);ctx.lineTo(33,27);ctx.lineTo(10,42);ctx.lineTo(1,6);ctx.lineTo(-7,42);ctx.lineTo(-31,28);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.16)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(1,-20);ctx.lineTo(1,27);ctx.stroke();

  ctx.fillStyle=colors.boot;ctx.strokeStyle=colors.trim;ctx.lineWidth=1.8;
  ctx.beginPath();ctx.moveTo(-13,23);ctx.lineTo(-4,25);ctx.lineTo(-13,59);ctx.lineTo(-31,69);ctx.lineTo(-38,62);ctx.lineTo(-24,48);ctx.lineTo(-22,26);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(12,23);ctx.lineTo(4,25);ctx.lineTo(13,58);ctx.lineTo(30,67);ctx.lineTo(37,60);ctx.lineTo(24,47);ctx.lineTo(22,26);ctx.closePath();ctx.fill();ctx.stroke();

  if(!ghost)drawWeapon(ctx,weapon);
  ctx.restore();
}

function drawAfterimages(ctx,afterimages=[]){for(const image of afterimages)drawFighter(ctx,image,{alpha:image.alpha??.18,ghost:true});}

function drawGroundFeedback(ctx,{dust=[],impact=null}={}){
  ctx.save();
  for(const d of dust){ctx.globalAlpha=d.alpha??.22;ctx.fillStyle='rgba(220,220,220,.5)';ctx.beginPath();ctx.ellipse(d.x,d.y,d.rx||26,d.ry||7,0,0,Math.PI*2);ctx.fill();}
  if(impact){const p=Math.min(1,impact.ageMs/260);ctx.globalAlpha=(1-p)*.45;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(impact.x,impact.groundY||impact.y+76,24+p*72,7+p*18,0,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

function drawDamagePopup(ctx,popup){
  if(!popup||!popup.damage)return;const p=Math.max(0,Math.min(1,popup.progress??0)),rise=20+36*p,alpha=Math.max(.25,1-p*.58);
  ctx.save();ctx.globalAlpha=alpha;ctx.textAlign='center';ctx.font='900 27px "Noto Sans CJK SC","Microsoft YaHei",system-ui,sans-serif';ctx.lineWidth=5;ctx.strokeStyle='rgba(0,0,0,.78)';ctx.fillStyle=popup.tone==='taken'?'#ff8f8f':'#ffe39b';const text=`-${Math.round(popup.damage)}`;ctx.strokeText(text,popup.x,popup.y-rise);ctx.fillText(text,popup.x,popup.y-rise);ctx.restore();
}

export class CombatRenderer{
  constructor(canvas){if(!canvas)throw Error('canvas_required');this.canvas=canvas;this.ctx=canvas.getContext('2d');this.width=0;this.height=0;this.resize();}
  resize(){const rect=this.canvas.getBoundingClientRect(),dpr=Math.max(1,window.devicePixelRatio||1);this.width=Math.max(640,Math.round(rect.width||900));this.height=Math.max(360,Math.round(rect.height||500));this.canvas.width=Math.round(this.width*dpr);this.canvas.height=Math.round(this.height*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);}
  render(frame){
    const {camera,left,right,leftHp,rightHp,leftMaxHp,rightMaxHp,particles=[],martialId=null,attackerId=null,trailProgress=0,impact=null,damagePopup=null,title='',afterimages=[],dust=[]}=frame,ctx=this.ctx,w=this.width,h=this.height;
    ctx.clearRect(0,0,w,h);ctx.save();applyCamera(ctx,camera,w,h);drawBackdrop(ctx,w,h);
    drawGroundFeedback(ctx,{dust,impact});drawAfterimages(ctx,afterimages);
    const attacker=left.id===attackerId?left:right,target=left.id===attackerId?right:left;
    drawSkillTrail(ctx,{martialId,attacker,target,progress:trailProgress});
    drawFighter(ctx,left);drawFighter(ctx,right);
    if(impact)drawImpactFx(ctx,{martialId:impact.martialId,x:impact.x,y:impact.y,ageMs:impact.ageMs});
    drawParticles(ctx,particles);drawDamagePopup(ctx,damagePopup);ctx.restore();
    drawBar(ctx,{x:28,y:28,w:Math.min(310,w*.34),value:leftHp,max:leftMaxHp,label:left.name});
    drawBar(ctx,{x:w-Math.min(310,w*.34)-28,y:28,w:Math.min(310,w*.34),value:rightHp,max:rightMaxHp,label:right.name,align:'right'});
    if(title){ctx.save();ctx.font='700 28px "Noto Serif CJK SC","Songti SC",serif';ctx.textAlign='center';ctx.shadowBlur=18;ctx.shadowColor='rgba(0,0,0,.9)';ctx.fillStyle='rgba(255,255,255,.96)';ctx.fillText(title,w/2,76);ctx.restore();}
  }
}
