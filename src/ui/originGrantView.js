import {STARTER_ITEM_BY_ID} from '../data/items/starterItems.js';
import {ORIGIN_ASSET_BY_ID} from '../data/assets/originAssets.js';
import {STARTER_MARTIAL_BY_ID} from '../data/martial/starterMartial.js';

export function formatOriginGrant(grant={}){
  const parts=[];
  if(grant.silver) parts.push(`银两 ${grant.silver}`);
  const items=(grant.items||[]).map(({id,qty=1})=>{const name=STARTER_ITEM_BY_ID[id]?.name||id;return qty===1?name:`${name}×${qty}`;});
  if(items.length) parts.push(items.join('、'));
  const martial=(grant.martial||[]).map(id=>STARTER_MARTIAL_BY_ID[id]?.name||id);
  if(martial.length) parts.push(`武学/能力：${martial.join('、')}`);
  const assets=(grant.assets||[]).map(id=>ORIGIN_ASSET_BY_ID[id]?.name||id);
  if(assets.length) parts.push(`身份资源：${assets.join('、')}`);
  return parts.join(' · ')||'无额外起始资源';
}
