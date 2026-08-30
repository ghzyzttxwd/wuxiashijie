export const RELATIONSHIP_SCHEMA=1;
export function ensureRelationships(worldState){return worldState?.relationships?.schema===RELATIONSHIP_SCHEMA?worldState.relationships:{schema:RELATIONSHIP_SCHEMA,values:{...(worldState?.relationships?.values||{})}};}
export function relationWith(worldState,npcId){return ensureRelationships(worldState).values[npcId]??0;}
export function changeRelation(worldState,npcId,delta){const relationships=ensureRelationships(worldState),current=relationships.values[npcId]??0,value=Math.max(-100,Math.min(100,current+delta));return{...worldState,relationships:{...relationships,values:{...relationships.values,[npcId]:value}}};}
