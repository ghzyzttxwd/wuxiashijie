export function createParticleSystem(){return[];}

export function spawnImpact(particles,{x,y,count=12,speed=110,lifeMs=360,spread=Math.PI*2,size=3}){
  for(let i=0;i<count;i++){
    const angle=(Math.random()-.5)*spread-Math.PI/2,velocity=speed*(.55+Math.random()*.75);
    particles.push({x,y,vx:Math.cos(angle)*velocity,vy:Math.sin(angle)*velocity,lifeMs,maxLifeMs:lifeMs,size:size*(.6+Math.random()*.8)});
  }
}

export function updateParticles(particles,dtMs){
  const dt=dtMs/1000;
  for(const p of particles){p.lifeMs-=dtMs;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=80*dt;p.vx*=.985;}
  for(let i=particles.length-1;i>=0;i--)if(particles[i].lifeMs<=0)particles.splice(i,1);
}

export function drawParticles(ctx,particles){
  ctx.save();
  for(const p of particles){
    const alpha=Math.max(0,p.lifeMs/p.maxLifeMs);
    ctx.globalAlpha=alpha;
    ctx.beginPath();ctx.arc(p.x,p.y,p.size*alpha,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.92)';ctx.fill();
  }
  ctx.restore();
}
