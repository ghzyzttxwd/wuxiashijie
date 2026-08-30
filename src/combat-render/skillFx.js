import {M5_FX_BY_MARTIAL_ID} from './m5FxProfiles.js';

function drawArc(ctx,{x,y,radius,start,end,width=5,alpha=.9}){
  ctx.save();ctx.globalAlpha=alpha;ctx.lineCap='round';ctx.shadowBlur=18;ctx.shadowColor='rgba(255,255,255,.55)';ctx.beginPath();ctx.arc(x,y,radius,start,end);ctx.lineWidth=width;ctx.strokeStyle='rgba(255,255,255,.96)';ctx.stroke();ctx.restore();
}
function drawWave(ctx,{x,y,radius,alpha=.7,width=6}){ctx.save();ctx.globalAlpha=alpha;ctx.shadowBlur=18;ctx.shadowColor='rgba(255,255,255,.45)';ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.lineWidth=width;ctx.strokeStyle='rgba(255,255,255,.94)';ctx.stroke();ctx.restore();}
function drawSlashRibbon(ctx,{attacker,target,progress,width=18,offsetY=-30}){
  const x1=attacker.x+attacker.side*18,y1=attacker.y+offsetY,x2=target.x-target.side*12,y2=target.y+offsetY-12;
  const t=Math.max(.05,Math.min(1,progress)),cx=x1+(x2-x1)*t,cy=y1+(y2-y1)*t;
  const grad=ctx.createLinearGradient(x1,y1,cx,cy);grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(.65,'rgba(255,255,255,.2)');grad.addColorStop(1,'rgba(255,255,255,.9)');
  ctx.save();ctx.globalAlpha=.35+.45*t;ctx.strokeStyle=grad;ctx.lineWidth=width;ctx.lineCap='round';ctx.shadowBlur=20;ctx.shadowColor='rgba(255,255,255,.55)';ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo((x1+cx)/2,cy-26,cx,cy);ctx.stroke();ctx.restore();
}

export function drawSkillTrail(ctx,{martialId,attacker,target,progress}){
  const fx=M5_FX_BY_MARTIAL_ID[martialId];if(!fx)return;
  const p=Math.max(0,Math.min(1,progress));if(p<=.01)return;ctx.save();
  if(fx.trail==='short'){
    const dir=attacker.side,x=attacker.x-dir*70,y=attacker.y-32;
    const grad=ctx.createLinearGradient(x,y,attacker.x,y);grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(1,'rgba(255,255,255,.72)');ctx.globalAlpha=.25+.45*(1-p);ctx.fillStyle=grad;ctx.fillRect(Math.min(x,attacker.x),y,Math.abs(attacker.x-x),10);
  }else if(fx.trail==='sword-arc'){
    drawSlashRibbon(ctx,{attacker,target,progress:p,width:10,offsetY:-42});
    const hitAlpha=Math.max(0,Math.min(1,(p-.52)*2.7));
    if(hitAlpha>0){drawArc(ctx,{x:target.x-target.side*18,y:target.y-34,radius:70,start:-2.12,end:.05,width:7,alpha:.78*hitAlpha});drawArc(ctx,{x:target.x-target.side*11,y:target.y-34,radius:57,start:-2,end:-.12,width:2,alpha:.55*hitAlpha});}
  }else if(fx.trail==='saber-arc'){
    drawSlashRibbon(ctx,{attacker,target,progress:p,width:17,offsetY:-38});
    const hitAlpha=Math.max(0,Math.min(1,(p-.5)*2.5));
    if(hitAlpha>0){drawArc(ctx,{x:target.x-target.side*10,y:target.y-24,radius:88,start:-2.35,end:.22,width:12,alpha:.82*hitAlpha});drawArc(ctx,{x:target.x-target.side*2,y:target.y-19,radius:74,start:-2.2,end:.05,width:3,alpha:.5*hitAlpha});}
  }else if(fx.trail==='qi-wave'){
    const x=attacker.x+(target.x-attacker.x)*p,y=target.y-30;
    drawWave(ctx,{x,y,radius:24+54*p,alpha:.38+.45*p,width:7});
    drawWave(ctx,{x,y,radius:12+31*p,alpha:.2+.35*p,width:3});
    ctx.globalAlpha=.32+.35*p;ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.ellipse(x,y,28+46*p,11+16*p,0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

export function drawImpactFx(ctx,{martialId,x,y,ageMs}){
  const fx=M5_FX_BY_MARTIAL_ID[martialId];if(!fx)return;
  const p=Math.min(1,ageMs/260),fade=1-p;ctx.save();ctx.globalCompositeOperation='screen';
  if(fx.impact==='burst'||fx.impact==='spark'||fx.impact==='heavy-spark'){
    const rays=fx.impact==='heavy-spark'?16:fx.impact==='spark'?12:8,length=(fx.impact==='heavy-spark'?92:62)*(1-p*.25);
    ctx.globalAlpha=fade;ctx.strokeStyle='rgba(255,255,255,.98)';ctx.lineWidth=fx.impact==='heavy-spark'?6:4;ctx.shadowBlur=22;ctx.shadowColor='rgba(255,255,255,.7)';
    for(let i=0;i<rays;i++){const a=i/rays*Math.PI*2+(i%2?0.08:-0.08),inner=8+p*12;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*inner,y+Math.sin(a)*inner);ctx.lineTo(x+Math.cos(a)*length,y+Math.sin(a)*length);ctx.stroke();}
    ctx.globalAlpha=.5*fade;ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.arc(x,y,18+24*(1-p),0,Math.PI*2);ctx.fill();
    drawWave(ctx,{x,y,radius:22+p*48,alpha:.55*fade,width:3});
  }else if(fx.impact==='shockwave'){
    ctx.globalAlpha=.28*fade;ctx.fillStyle='rgba(255,255,255,.72)';ctx.beginPath();ctx.arc(x,y,26+30*(1-p),0,Math.PI*2);ctx.fill();
    for(let i=0;i<4;i++)drawWave(ctx,{x,y,radius:30+p*(64+i*25),alpha:fade*(.9-i*.14),width:7-i});
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;ctx.globalAlpha=.45*fade;ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*18,y+Math.sin(a)*18);ctx.lineTo(x+Math.cos(a)*(76-20*p),y+Math.sin(a)*(76-20*p));ctx.stroke();}
  }
  ctx.restore();
}

export function getFxProfile(martialId){return M5_FX_BY_MARTIAL_ID[martialId]||null;}
