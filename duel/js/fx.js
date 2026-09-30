import{clamp,ease,lerp}from'./assets.js';
export class Effects{
 constructor(){this.particles=[];this.rings=[];this.numbers=[];this.shake=0;this.flash=0;this.hitstop=0;}
 clear(){this.particles=[];this.rings=[];this.numbers=[];this.shake=0;this.flash=0;this.hitstop=0;}
 burst(x,y,n=30,color='gold',power=1){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=(70+Math.random()*260)*power;this.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-60,life:.4+Math.random()*.55,max:1,color,size:1+Math.random()*3});}if(this.particles.length>550)this.particles.splice(0,this.particles.length-550);}
 ring(x,y,color='gold',max=180){this.rings.push({x,y,color,r:0,max,life:.7});}
 damage(x,y,n,color='gold'){this.numbers.push({x,y,n,life:1.1,color});}
 update(dt){this.shake*=Math.exp(-8*dt);this.flash=Math.max(0,this.flash-dt*2.5);this.hitstop=Math.max(0,this.hitstop-dt);for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=140*dt;p.life-=dt;}this.particles=this.particles.filter(p=>p.life>0);for(const r of this.rings){r.r+=r.max*dt*1.5;r.life-=dt;}this.rings=this.rings.filter(r=>r.life>0);for(const n of this.numbers){n.y-=65*dt;n.life-=dt;}this.numbers=this.numbers.filter(n=>n.life>0);}
 draw(ctx){ctx.save();ctx.globalCompositeOperation='lighter';for(const r of this.rings){ctx.globalAlpha=clamp(r.life);ctx.strokeStyle=r.color==='gold'?'#ffcd7a':'#9defff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(r.x,r.y,r.r,r.r*.48,0,0,Math.PI*2);ctx.stroke();}for(const p of this.particles){ctx.globalAlpha=clamp(p.life*1.7);ctx.fillStyle=p.color==='gold'?'#ffd889':'#91dfff';ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();}ctx.restore();for(const n of this.numbers){ctx.save();ctx.globalAlpha=clamp(n.life*2);ctx.fillStyle=n.color==='gold'?'#ffde9b':'#c2f4ff';ctx.strokeStyle='#122035';ctx.lineWidth=4;ctx.font='bold 34px serif';ctx.textAlign='center';ctx.strokeText('-'+n.n,n.x,n.y);ctx.fillText('-'+n.n,n.x,n.y);ctx.restore();}}
}
// One detailed blade is reused at different depths; the glow never replaces its silhouette.
export function sword(ctx,x,y,angle,length=80,alpha=1){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;
 ctx.globalCompositeOperation='lighter';const trail=ctx.createLinearGradient(-length*2.8,0,length*.55,0);trail.addColorStop(0,'#4a9cff00');trail.addColorStop(.75,'#63cfff44');trail.addColorStop(1,'#e9ffffaa');ctx.fillStyle=trail;ctx.beginPath();ctx.moveTo(length*.6,0);ctx.lineTo(-length*2.8,-length*.065);ctx.lineTo(-length*2.1,0);ctx.lineTo(-length*2.8,length*.065);ctx.closePath();ctx.fill();
 ctx.globalCompositeOperation='source-over';const metal=ctx.createLinearGradient(0,-length*.038,0,length*.038);metal.addColorStop(0,'#74a9c4');metal.addColorStop(.45,'#e9faff');metal.addColorStop(.52,'#ffffff');metal.addColorStop(1,'#437da5');ctx.fillStyle=metal;ctx.beginPath();ctx.moveTo(length*.64,0);ctx.lineTo(length*.43,-length*.035);ctx.lineTo(-length*.3,-length*.043);ctx.lineTo(-length*.3,length*.043);ctx.lineTo(length*.43,length*.035);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#d7f4ff';ctx.lineWidth=Math.max(.7,length*.011);ctx.beginPath();ctx.moveTo(-length*.3,0);ctx.lineTo(length*.6,0);ctx.stroke();ctx.strokeStyle='#b5c4db';ctx.lineWidth=Math.max(1,length*.028);ctx.beginPath();ctx.moveTo(-length*.32,-length*.095);ctx.quadraticCurveTo(-length*.37,0,-length*.32,length*.095);ctx.stroke();ctx.strokeStyle='#416888';ctx.lineWidth=length*.04;ctx.beginPath();ctx.moveTo(-length*.34,0);ctx.lineTo(-length*.5,0);ctx.stroke();ctx.fillStyle='#c5ddeb';ctx.beginPath();ctx.arc(-length*.51,0,length*.029,0,Math.PI*2);ctx.fill();ctx.restore();
}
export function makeSwordField(){return Array.from({length:180},(_,i)=>({phase:(i%36)/36*Math.PI*2,ring:Math.floor(i/36),depth:(i%7)/6,delay:(i%15)*.019+Math.random()*.018,bend:(Math.random()-.5)*110}));}
export function drawSwordField(ctx,field,t){
 let launched=0;const gather=clamp(t/.48);
 for(const s of field){const angle=s.phase+t*1.8,r=105+s.ring*58,appear=clamp((t-.06-s.ring*.032)*7),flight=clamp((t-.48-s.delay)/(.34+s.depth*.06));if(!appear||flight>=1)continue;
 const orbitX=325+Math.cos(angle)*r*gather,orbitY=335+Math.sin(angle)*r*.64*gather;
 // Freeze each orbit at its launch time so the moving sword follows a continuous path.
 const launchAngle=s.phase+(.48+s.delay)*1.8,sx=325+Math.cos(launchAngle)*r,sy=335+Math.sin(launchAngle)*r*.64;
 const p=flight*flight,curve=Math.sin(flight*Math.PI)*s.bend,x=flight>0?lerp(sx,1045,p):orbitX,y=flight>0?lerp(sy,445,p)+curve:orbitY;
 const heading=flight>0?Math.atan2((445-sy)*2*flight+Math.PI*Math.cos(flight*Math.PI)*s.bend,(1045-sx)*2*flight):angle+Math.PI/2;
 const alpha=appear*(flight>.88?(1-flight)/.12:1);sword(ctx,x,y,heading,27+s.depth*43,alpha);if(flight>0)launched++;
 }return launched;
}
// Deform the existing dragon along a moving spine, rather than translating a rigid picture.
export function dragonSpine(f,t,enemyX){
 const grow=ease(clamp((t-.14)/.3)),flight=clamp((t-.3)/.68),length=lerp(290,760,grow),headX=lerp(350,enemyX+90,flight*flight),headY=405-Math.sin(flight*Math.PI)*85;
 const sway=Math.sin(f*Math.PI*2.5-t*15)*57*(1-f)**.75*grow,coil=Math.sin(f*Math.PI)*(1-flight)*-55;
 return{x:headX-length*(1-f),y:headY+sway+coil,length,grow,flight};
}
export function drawDragon(ctx,img,t,enemyX){
 if(t<.14||t>1.5)return;const head=dragonSpine(1,t,enemyX),alpha=head.grow*clamp((1.5-t)/.4),height=head.length*.333;
 ctx.save();ctx.globalAlpha=alpha;ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#ffbd4566';ctx.lineWidth=height*.25;ctx.lineCap='round';ctx.beginPath();for(let i=0;i<=40;i++){const p=dragonSpine(i/40,t,enemyX);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}ctx.stroke();
 const strips=80;for(let i=0;i<strips;i++){const f=i/strips,next=(i+1)/strips,p=dragonSpine(f,t,enemyX),q=dragonSpine(next,t,enemyX),sw=img.width/strips,scale=head.length/img.width,slope=(q.y-p.y)/sw;
 ctx.save();ctx.translate(p.x,p.y);ctx.transform(scale,slope,0,height/img.height,0,0);ctx.drawImage(img,img.width*f,0,Math.min(sw+2,img.width-img.width*f),img.height,0,-img.height*.5,Math.min(sw+2,img.width-img.width*f),img.height);ctx.restore();}
 // Narrow hot wake and flying sparks make the acceleration readable.
 ctx.strokeStyle='#fff0bbaa';ctx.lineWidth=2;for(let j=0;j<3;j++){ctx.beginPath();for(let i=0;i<=30;i++){const f=i/30,p=dragonSpine(f,t-j*.013,enemyX),y=p.y+Math.sin(f*12-t*21+j)*17; if(i===0)ctx.moveTo(p.x,y);else ctx.lineTo(p.x,y);}ctx.stroke();}ctx.restore();
}
