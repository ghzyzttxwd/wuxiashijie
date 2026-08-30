import {M5_FX_BY_MARTIAL_ID} from './m5FxProfiles.js';

function drawArc(ctx,{x,y,radius,start,end,width=5}){ctx.beginPath();ctx.arc(x,y,radius,start,end);ctx.lineWidth=width;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.stroke();}
function drawWave(ctx,{x,y,radius,alpha=.7}){ctx.save();ctx.globalAlpha=alpha;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.lineWidth=6;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.stroke();ctx.restore();}

export function drawSkillTrail(ctx,{martialId,attacker,target,progress}){
  const fx=M5_FX_BY_MARTIAL_ID[martialId];if(!fx)return;
  ctx.save();
  if(fx.trail==='short'){
    ctx.globalAlpha=.65*(1-progress);ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(attacker.x-34,attacker.y-4,56*progress+10,8);
  }else if(fx.trail==='sword-arc'){
    drawArc(ctx,{x:target.x-18,y:target.y-26,radius:54,start:-1.9,end:-.15,width:4});
  }else if(fx.trail==='saber-arc'){
    drawArc(ctx,{x:target.x-8,y:target.y-18,radius:72,start:-2.25,end:.18,width:8});
  }else if(fx.trail==='qi-wave'){
    drawWave(ctx,{x:attacker.x+(target.x-attacker.x)*progress,y:target.y-22,radius:18+42*progress,alpha:.35+.5*progress});
  }
  ctx.restore();
}

export function drawImpactFx(ctx,{martialId,x,y,ageMs}){
  const fx=M5_FX_BY_MARTIAL_ID[martialId];if(!fx)return;
  const p=Math.min(1,ageMs/220);
  ctx.save();
  if(fx.impact==='burst'||fx.impact==='spark'||fx.impact==='heavy-spark'){
    const rays=fx.impact==='heavy-spark'?12:fx.impact==='spark'?9:6,length=(fx.impact==='heavy-spark'?70:46)*(1-p*.4);
    ctx.globalAlpha=1-p;ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=fx.impact==='heavy-spark'?5:3;
    for(let i=0;i<rays;i++){const a=i/rays*Math.PI*2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*length,y+Math.sin(a)*length);ctx.stroke();}
  }else if(fx.impact==='shockwave'){
    for(let i=0;i<3;i++)drawWave(ctx,{x,y,radius:28+p*(55+i*20),alpha:(1-p)*(.75-i*.16)});
  }
  ctx.restore();
}

export function getFxProfile(martialId){return M5_FX_BY_MARTIAL_ID[martialId]||null;}
