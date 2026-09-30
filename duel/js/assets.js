export const W=1280,H=720;
export async function loadAssets(){const out={};await Promise.all(['arena','fighter','dragon'].map(k=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{out[k]=im;resolve();};im.onerror=()=>reject(new Error('素材载入失败：'+k));im.src='./assets/'+(k==='fighter'?'fighter-v2':k)+'.webp';})));return out;}
export const ease=t=>1-(1-Math.max(0,Math.min(1,t)))**3;
export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const lerp=(a,b,t)=>a+(b-a)*t;
