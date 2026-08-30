const F=(martialId,profile)=>({martialId,...profile});

export const M5_FX_PROFILES=[
  F('martial_basic_fist',{motion:'dash-punch',trail:'short',impact:'burst',screenShake:2,cameraZoom:1.015,label:'基础拳法'}),
  F('martial_basic_sword',{motion:'dash-slash',trail:'sword-arc',impact:'spark',screenShake:3,cameraZoom:1.02,label:'基础剑法'}),
  F('martial_basic_saber',{motion:'heavy-slash',trail:'saber-arc',impact:'heavy-spark',screenShake:5,cameraZoom:1.025,label:'基础刀法'}),
  F('martial_shaolin_vajra_palm',{motion:'charge-palm',trail:'qi-wave',impact:'shockwave',screenShake:9,cameraZoom:1.045,label:'大力金刚掌'})
];

export const M5_FX_BY_MARTIAL_ID=Object.fromEntries(M5_FX_PROFILES.map(x=>[x.martialId,x]));
