import{W,H,clamp}from'./assets.js';
import{drawDragon,drawSwordField,sword}from'./fx.js';
const TAU=Math.PI*2;
export class Renderer{
 constructor(canvas,assets){this.ctx=canvas.getContext('2d');this.assets=assets;}
 draw(g,time){const c=this.ctx,{fx}=g;c.clearRect(0,0,W,H);c.save();if(fx.shake>0)c.translate((Math.random()-.5)*fx.shake,(Math.random()-.5)*fx.shake*.65);c.drawImage(this.assets.arena,0,0,W,H);const shade=c.createLinearGradient(0,450,0,H);shade.addColorStop(0,'#07131f00');shade.addColorStop(1,'#030b17cc');c.fillStyle=shade;c.fillRect(0,450,W,H);this.ambient(time);const action=g.action;if(action?.kind==='swords'){c.fillStyle=`rgba(5,18,42,${.28*clamp(action.t*2)})`;c.fillRect(0,0,W,H);this.aura(g.hero.x,430,action.t,'blue');}
 if(action?.kind==='dragon'&&action.t<.75)this.aura(g.hero.x+60,425,action.t,'gold');
 this.fighter(g.hero,time,true);this.fighter(g.enemy,time,false);
 if(action?.kind==='dragon')drawDragon(c,this.assets.dragon,action.t,g.enemy.baseX);
 if(action?.kind==='swords')drawSwordField(c,action.field,action.t);
 if(action?.kind==='palm'&&action.t>.25&&action.t<.65){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=Math.sin((action.t-.25)/.4*Math.PI);c.strokeStyle='#e3c690';c.lineWidth=5;c.beginPath();c.ellipse(g.hero.x+100,440,45,70,0,-1.4,1.4);c.stroke();c.restore();}
 fx.draw(c);c.restore();if(fx.flash>0){c.fillStyle=`rgba(255,232,179,${fx.flash*.36})`;c.fillRect(0,0,W,H);}if(g.combo>1&&action){c.save();c.textAlign='right';c.fillStyle='#cef2ff';c.font='italic 42px serif';c.fillText(g.combo+' 连击',1160,210);c.restore();}}
 ambient(t){const c=this.ctx;c.save();for(let i=0;i<22;i++){const x=(i*137+t*(5+i%3))%W,y=110+(i*67)%380+Math.sin(t*.7+i)*15;c.globalAlpha=.15+.12*Math.sin(t+i);c.fillStyle='#dde9c6';c.beginPath();c.arc(x,y,1.2,0,TAU);c.fill();}c.restore();}
 aura(x,y,t,color){const c=this.ctx;c.save();c.globalCompositeOperation='lighter';const gold=color==='gold';const r=75+Math.sin(t*10)*8,g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,gold?'#ffe3a866':'#a1e4ff55');g.addColorStop(1,'#00000000');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.strokeStyle=gold?'#ffcd7b':'#a2e9ff';c.lineWidth=2;for(let i=0;i<3;i++){c.globalAlpha=.3;c.beginPath();c.ellipse(x,y,r+i*13,(r+i*13)*.7,t*.8+i,.1,TAU);c.stroke();}c.restore();}
 fighter(f,time,isHero){const c=this.ctx,img=this.assets.fighter,cellX=img.width/4,cellY=img.height/4;let row=0,col=Math.floor(time*4)%4;if(f.pose==='palm'){row=1;col=f.frame;}if(f.pose==='sword'){row=2;col=f.frame;}if(f.pose==='hurt'){row=3;col=f.frame;}const size=294,bob=f.pose==='idle'?Math.sin(time*2.5+(isHero?0:2))*2:0;c.save();c.fillStyle='#020b1890';c.beginPath();c.ellipse(f.x,565,90,13,0,0,TAU);c.fill();c.translate(f.x,570+bob);c.scale(isHero?1:-1,1);if(!isHero)c.filter='sepia(.35) hue-rotate(325deg) saturate(.9)';if(f.flash>0)c.filter='brightness(2.3) saturate(.6)';c.rotate(f.lean);if(f.ghost>0){c.save();c.globalAlpha=.2;c.drawImage(img,col*cellX,row*cellY,cellX,cellY,-size*.5-24,-size,size,size);c.restore();}c.drawImage(img,col*cellX,row*cellY,cellX,cellY,-size*.5,-size,size,size);c.restore();}
}
