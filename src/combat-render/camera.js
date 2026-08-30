export function createCamera(){return{shake:0,zoom:1,shakeX:0,shakeY:0};}

export function kickCamera(camera,{shake=0,zoom=1}){
  camera.shake=Math.max(camera.shake,shake);
  camera.zoom=Math.max(camera.zoom,zoom);
}

export function updateCamera(camera,dtMs,rng=Math.random){
  const decay=Math.pow(.001,dtMs/1000);
  camera.shake*=decay;
  camera.zoom=1+(camera.zoom-1)*Math.pow(.03,dtMs/1000);
  camera.shakeX=(rng()*2-1)*camera.shake;
  camera.shakeY=(rng()*2-1)*camera.shake*.65;
  if(camera.shake<.05)camera.shake=0;
  if(Math.abs(camera.zoom-1)<.001)camera.zoom=1;
  return camera;
}

export function applyCamera(ctx,camera,width,height){
  ctx.translate(width/2+camera.shakeX,height/2+camera.shakeY);
  ctx.scale(camera.zoom,camera.zoom);
  ctx.translate(-width/2,-height/2);
}
