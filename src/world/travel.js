import {findShortestRoute} from './routePlanner.js';

export function advanceWorldTime(world,hours){const total=(world.day-1)*24+(world.hour??8)+hours;return{...world,day:Math.floor(total/24)+1,hour:total%24};}

export function travelCharacter(character,destinationId){
  const from=character.world?.location;
  const route=findShortestRoute(from,destinationId);
  if(!route)throw Error('route_not_found');
  const world=advanceWorldTime(character.world,route.hours);
  return {...character,world:{...world,country:'ming',location:destinationId},lastTravel:{from,to:destinationId,hours:route.hours,routeIds:route.routeIds}};
}
