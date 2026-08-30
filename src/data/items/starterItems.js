const I=(id,name,type)=>({id,name,type});
export const STARTER_ITEMS=[
I('item_worn_clothes','破旧衣物','clothing'),I('item_common_clothes','粗布衣','clothing'),I('weapon_hunting_bow','猎弓','weapon'),I('weapon_hunting_knife','猎刀','weapon'),I('book_classics','经史典籍','book'),I('mount_good_horse','好马','mount'),I('weapon_long_saber','长刀','weapon'),I('mount_horse','马匹','mount'),I('weapon_quality','优质兵器','weapon'),I('mount_warhorse','战马','mount'),I('armor_field','甲胄','armor'),I('token_sect','门派信物','token'),I('item_ancestral_keepsake','祖传旧物','quest')];
export const STARTER_ITEM_BY_ID=Object.fromEntries(STARTER_ITEMS.map(x=>[x.id,x]));
