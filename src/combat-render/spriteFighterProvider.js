const clamp01=v=>Math.max(0,Math.min(1,Number(v)||0));

function resolveSpec(assets,fighter){
  return assets?.[fighter.id]||assets?.[fighter.side===1?'left':'right']||null;
}

function frameForState(spec,state,progress){
  const anim=spec?.animations?.[state]||spec?.animations?.idle||null;
  if(!anim)return null;
  const frames=Math.max(1,anim.frames||1);
  const index=anim.loop===false?Math.min(frames-1,Math.floor(clamp01(progress)*frames)):Math.floor(clamp01(progress)*frames)%frames;
  return{...anim,index};
}

export class SpriteFighterProvider{
  constructor({assets={},strict=true}={}){
    this.assets=assets;
    this.strict=strict;
    this.images=new Map();
    this.loading=new Map();
  }

  setAssets(assets={}){this.assets=assets;}

  preload(){
    if(typeof Image==='undefined')return Promise.resolve([]);
    const urls=[...new Set(Object.values(this.assets).map(x=>x?.url).filter(Boolean))];
    return Promise.all(urls.map(url=>this.#load(url)));
  }

  #load(url){
    if(this.images.has(url))return Promise.resolve(this.images.get(url));
    if(this.loading.has(url))return this.loading.get(url);
    const p=new Promise(resolve=>{
      const img=new Image();
      img.decoding='async';
      img.crossOrigin='anonymous';
      img.onload=()=>{this.images.set(url,img);this.loading.delete(url);resolve(img);};
      img.onerror=()=>{this.loading.delete(url);resolve(null);};
      img.src=url;
    });
    this.loading.set(url,p);return p;
  }

  drawFighter(ctx,fighter,{alpha=1,ghost=false}={}){
    const spec=resolveSpec(this.assets,fighter);
    if(!spec?.url)return this.strict;
    const img=this.images.get(spec.url);
    if(!img){this.#load(spec.url);return this.strict;}

    const frame=frameForState(spec,fighter.visualState||'idle',fighter.visualProgress||0);
    const scale=spec.scale??1;
    const flip=spec.flipWithFacing!==false?fighter.side:1;
    const opacity=(spec.opacity??1)*alpha*(fighter.defeated?.55:1)*(ghost?.4:1);
    const anchorX=spec.anchorX??.5,anchorY=spec.anchorY??1;

    let sx=0,sy=0,sw=img.naturalWidth,sh=img.naturalHeight;
    if(frame&&spec.frameWidth&&spec.frameHeight){
      sw=spec.frameWidth;sh=spec.frameHeight;
      sx=(frame.col||0)*sw+frame.index*sw;
      sy=(frame.row||0)*sh;
    }

    const dw=sw*scale,dh=sh*scale;
    ctx.save();
    ctx.translate(fighter.x,fighter.y);
    ctx.rotate(fighter.lean||0);
    ctx.scale(flip,1);
    ctx.globalAlpha=opacity;
    if(fighter.flash>0){ctx.shadowBlur=30;ctx.shadowColor='rgba(255,255,255,.95)';}
    ctx.drawImage(img,sx,sy,sw,sh,-dw*anchorX,-dh*anchorY,dw,dh);
    ctx.restore();
    return true;
  }
}

export function createStaticFighterAsset({url,scale=1,anchorX=.5,anchorY=1}={}){
  return{url,scale,anchorX,anchorY,animations:{idle:{frames:1,row:0,col:0,loop:false}}};
}
