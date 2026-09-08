const THREE_MODULE_URL='https://esm.sh/three@0.181.1';
const GLTF_LOADER_URL='https://esm.sh/three@0.181.1/examples/jsm/loaders/GLTFLoader.js';
const FBX_LOADER_URL='https://esm.sh/three@0.181.1/examples/jsm/loaders/FBXLoader.js';
const SKELETON_UTILS_URL='https://esm.sh/three@0.181.1/examples/jsm/utils/SkeletonUtils.js';

function clamp01(v){return Math.max(0,Math.min(1,Number(v)||0));}
function byFighter(assets,fighter){return assets?.[fighter.id]||assets?.[fighter.side===1?'left':'right']||null;}
function nameMatch(clips,requested,{fallback=false}={}){
  if(!clips?.length)return null;
  const names=Array.isArray(requested)?requested:[requested].filter(Boolean);
  for(const wanted of names){const exact=clips.find(c=>c.name.toLowerCase()===String(wanted).toLowerCase());if(exact)return exact;}
  for(const wanted of names){const key=String(wanted).toLowerCase();const fuzzy=clips.find(c=>c.name.toLowerCase().includes(key));if(fuzzy)return fuzzy;}
  return fallback?clips[0]||null:null;
}
function extensionOf(url=''){const clean=String(url).split('?')[0].split('#')[0];return clean.slice(clean.lastIndexOf('.')+1).toLowerCase();}

const DEFAULT_CLIP_HINTS=Object.freeze({
  idle:['idle','stand','breath'],windup:['ready','stance','prepare','idle'],run:['run','dash','walk'],attack:['attack','slash','swing','punch','kick'],evade:['dodge','evade','back','run'],hit:['hit','hurt','damage'],knockback:['hit','hurt','knockback'],recover:['recover','idle','stance'],defeat:['death','die','dead','fall']
});

export class ModelFighterProvider{
  constructor({assets={},strict=true,renderWidth=420,renderHeight=560,moduleUrls={}}={}){
    this.assets=assets;this.strict=strict;this.renderWidth=renderWidth;this.renderHeight=renderHeight;
    this.moduleUrls={three:moduleUrls.three||THREE_MODULE_URL,gltf:moduleUrls.gltf||GLTF_LOADER_URL,fbx:moduleUrls.fbx||FBX_LOADER_URL,skeleton:moduleUrls.skeleton||SKELETON_UTILS_URL};
    this.ready=false;this.failed=false;this.records=new Map();this.loading=null;
  }
  setAssets(assets={}){this.assets=assets;return this;}
  async preload(){if(this.ready)return true;if(this.loading)return this.loading;this.loading=this.#init();return this.loading;}

  async #init(){
    if(typeof document==='undefined')return false;
    try{
      const [THREE,{GLTFLoader},{FBXLoader},SkeletonUtils]=await Promise.all([import(this.moduleUrls.three),import(this.moduleUrls.gltf),import(this.moduleUrls.fbx),import(this.moduleUrls.skeleton)]);
      this.THREE=THREE;this.SkeletonUtils=SkeletonUtils;this.loader=new GLTFLoader();this.fbxLoader=new FBXLoader();
      this.canvas=document.createElement('canvas');
      this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,alpha:true,antialias:true,premultipliedAlpha:true});
      this.renderer.setPixelRatio(1);this.renderer.setSize(this.renderWidth,this.renderHeight,false);this.renderer.setClearColor(0x000000,0);
      this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(28,this.renderWidth/this.renderHeight,.01,100);this.camera.position.set(0,1.25,5.2);this.camera.lookAt(0,1.05,0);
      const hemi=new THREE.HemisphereLight(0xf3f0e8,0x25303a,2.35);this.scene.add(hemi);
      const key=new THREE.DirectionalLight(0xffffff,2.5);key.position.set(3,5,4);this.scene.add(key);
      const rim=new THREE.DirectionalLight(0x9fb9d7,1.2);rim.position.set(-4,3,-2);this.scene.add(rim);
      await Promise.all(Object.entries(this.assets).filter(([,s])=>s?.url).map(([key,spec])=>this.#loadRecord(key,spec)));
      this.ready=true;return true;
    }catch(error){console.warn('[ModelFighterProvider] preload failed',error);this.failed=true;return false;}
  }

  async #loadRecord(key,spec){
    try{
      const gltf=await this.loader.loadAsync(spec.url);const root=this.SkeletonUtils?.clone?this.SkeletonUtils.clone(gltf.scene):gltf.scene.clone(true);root.visible=false;this.scene.add(root);
      const record={root,mixer:new this.THREE.AnimationMixer(root),clips:[...(gltf.animations||[])],externalClips:{},action:null,clipName:null,spec};this.records.set(key,record);
      await this.#loadExternalMotions(record,spec);
    }catch(error){console.warn(`[ModelFighterProvider] asset failed: ${key}`,error);this.records.set(key,{error,spec});}
  }

  async #loadExternalMotions(record,spec){
    const motionUrls=spec.motionUrls||{};const entries=Object.entries(motionUrls).filter(([,url])=>url);
    await Promise.all(entries.map(async([state,url])=>{
      try{
        const source=await this.#loadMotionSource(url);if(!source?.root||!source.clip)return;
        const options={...(spec.retargetOptions||{}),...(spec.motionRetargetOptions?.[state]||{})};
        const retargeted=this.SkeletonUtils?.retargetClip?this.SkeletonUtils.retargetClip(record.root,source.root,source.clip,options):null;
        if(retargeted){retargeted.name=`external:${state}:${source.clip.name||'motion'}`;record.externalClips[state]=retargeted;record.clips.push(retargeted);}
      }catch(error){console.warn(`[ModelFighterProvider] motion failed: ${state}`,error);}
    }));
  }

  async #loadMotionSource(url){
    const ext=extensionOf(url);
    if(ext==='fbx'){
      const root=await this.fbxLoader.loadAsync(url);const clip=root.animations?.[0]||null;return{root,clip};
    }
    const gltf=await this.loader.loadAsync(url);const clip=gltf.animations?.[0]||null;return{root:gltf.scene,clip};
  }

  #recordFor(fighter,spec){const key=this.assets?.[fighter.id]===spec?fighter.id:(this.assets?.left===spec?'left':this.assets?.right===spec?'right':null);return key?this.records.get(key):null;}
  #clipForState(record,state){
    if(record.externalClips?.[state])return record.externalClips[state];
    const custom=record.spec?.animations?.[state];
    const requested=custom||DEFAULT_CLIP_HINTS[state]||DEFAULT_CLIP_HINTS.idle;
    let clip=nameMatch(record.clips,requested);
    if(!clip&&state!=='idle')clip=nameMatch(record.clips,record.spec?.animations?.idle||DEFAULT_CLIP_HINTS.idle);
    return clip||nameMatch(record.clips,[],{fallback:true});
  }
  #applyAnimation(record,fighter){
    if(!record?.mixer||!record.clips?.length)return;const state=fighter.visualState||'idle',clip=this.#clipForState(record,state);if(!clip)return;
    if(record.clipName!==clip.name){record.action?.stop();record.action=record.mixer.clipAction(clip);record.action.enabled=true;record.action.play();record.action.paused=true;record.clipName=clip.name;}
    record.action.time=clamp01(fighter.visualProgress)*Math.max(.001,clip.duration-.001);record.mixer.update(0);
  }
  #frameModel(record,fighter){
    const root=record.root,spec=record.spec||{};root.visible=true;root.scale.setScalar(spec.scale??1);root.position.set(spec.offsetX||0,spec.offsetY||0,spec.offsetZ||0);
    const baseYaw=spec.baseYaw??0,facingYaw=spec.facingYaw??Math.PI/2;root.rotation.set(spec.pitch||0,baseYaw+(fighter.side===1?facingYaw:-facingYaw),spec.roll||0);
  }
  drawFighter(ctx,fighter,{alpha=1,ghost=false}={}){
    const spec=byFighter(this.assets,fighter);if(!spec?.url)return this.strict;if(!this.ready){this.preload();return this.strict;}
    const record=this.#recordFor(fighter,spec);if(!record?.root)return this.strict;for(const r of this.records.values())if(r?.root)r.root.visible=false;
    this.#frameModel(record,fighter);this.#applyAnimation(record,fighter);this.renderer.render(this.scene,this.camera);
    const drawW=(spec.drawWidth||240)*(spec.screenScale||1),drawH=(spec.drawHeight||320)*(spec.screenScale||1),anchorY=spec.anchorY??1,anchorX=spec.anchorX??.5;
    ctx.save();ctx.translate(fighter.x,fighter.y);ctx.rotate(fighter.lean||0);ctx.globalAlpha=(spec.opacity??1)*alpha*(ghost?.32:1)*(fighter.defeated?.6:1);if(fighter.flash>0){ctx.shadowBlur=28;ctx.shadowColor='rgba(255,255,255,.95)';}
    ctx.drawImage(this.canvas,-drawW*anchorX,-drawH*anchorY,drawW,drawH);ctx.restore();return true;
  }
}

export function createModelFighterAsset({url,scale=1,drawWidth=240,drawHeight=320,baseYaw=0,facingYaw=Math.PI/2,animations={},motionUrls={},retargetOptions={}}={}){
  return{url,scale,drawWidth,drawHeight,baseYaw,facingYaw,animations,motionUrls,retargetOptions};
}
