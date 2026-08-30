import {MING_ROUTES} from '../data/locations/ming/routes.js';

function neighbors(node){const out=[];for(const r of MING_ROUTES){if(r.a===node)out.push({to:r.b,hours:r.hours,routeId:r.id});else if(r.b===node)out.push({to:r.a,hours:r.hours,routeId:r.id});}return out;}

export function findShortestRoute(from,to){
  if(from===to)return{hours:0,locations:[from],routeIds:[]};
  const dist=new Map([[from,0]]),prev=new Map(),unvisited=new Set([from,...MING_ROUTES.flatMap(r=>[r.a,r.b])]);
  while(unvisited.size){let current=null,best=Infinity;for(const n of unvisited){const d=dist.get(n)??Infinity;if(d<best){best=d;current=n;}}
    if(current===null||best===Infinity)break;unvisited.delete(current);if(current===to)break;
    for(const edge of neighbors(current)){if(!unvisited.has(edge.to))continue;const alt=best+edge.hours;if(alt<(dist.get(edge.to)??Infinity)){dist.set(edge.to,alt);prev.set(edge.to,{from:current,routeId:edge.routeId});}}
  }
  if(!dist.has(to))return null;
  const locations=[to],routeIds=[];let cursor=to;while(cursor!==from){const p=prev.get(cursor);if(!p)return null;routeIds.unshift(p.routeId);cursor=p.from;locations.unshift(cursor);}return{hours:dist.get(to),locations,routeIds};
}
