export const ATTRIBUTE_DEFS=[{id:'root',name:'根骨'},{id:'insight',name:'悟性'},{id:'physique',name:'体魄'},{id:'agility',name:'身法'},{id:'will',name:'定力'},{id:'fortune',name:'福缘'},{id:'charm',name:'魅力'}];
export function rollOne(rng=Math.random){const rare=rng()<.05,min=rare?76:35,max=rare?90:75;return Math.floor(rng()*(max-min+1))+min}
export function rollBaseAttributes(rng=Math.random){return Object.fromEntries(ATTRIBUTE_DEFS.map(({id})=>[id,rollOne(rng)]))}
