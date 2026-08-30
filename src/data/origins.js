const G=(silver=0,items=[],martial=[],assets=[])=>({silver,items,martial,assets});
const Q=(id,qty=1)=>({id,qty});
const O=(id,name,tier,modifiers,summary,grant=G())=>({id,name,tier,modifiers,summary,grant});
export const ORIGINS=[
O('beggar','乞儿','底层',{fortune:5,agility:3},'三教九流消息灵通，丐帮与黑市事件更多。',G(2,[Q('item_worn_clothes')],[],['asset_black_market_contacts'])),
O('farmer','农家子','底层',{physique:6,root:3},'体魄扎实，出身普通稳定。',G(15,[Q('item_common_clothes')])),
O('hunter','猎户之子','底层',{physique:5,agility:5},'擅长山林生存与弓猎。',G(25,[Q('weapon_hunting_bow'),Q('weapon_hunting_knife')],['skill_wilderness_survival'])),
O('healer_family','医馆子弟','平民',{insight:5,will:4},'熟悉药理、医术与经脉常识。',G(80,[],['skill_basic_medicine'])),
O('scholar_family','书香门第','平民',{insight:8,will:4,charm:2},'读秘籍、残篇和典籍更有优势。',G(60,[Q('book_classics')])),
O('merchant_family','商贾之家','平民',{charm:5,fortune:2},'有经商关系与较宽裕现金。',G(200,[],[],['asset_trade_contacts'])),
O('wealthy_heir','富商独子','富裕',{charm:6},'有钱能解决绝大多数普通麻烦，但买不到真正绝学。',G(1200,[Q('mount_good_horse')],[],['asset_servants','asset_trade_contacts'])),
O('escort_heir','镖局少主','富裕',{physique:4,agility:3,charm:3},'有江湖人脉、兵器与基础武功。',G(300,[Q('weapon_long_saber'),Q('mount_horse')],['martial_basic_internal','martial_basic_saber'],['asset_escort_network'])),
O('dojo_heir','武馆少主','富裕',{root:4,physique:4},'开局已经正式习武。',G(250,[],['martial_basic_internal','martial_basic_fist','martial_basic_sword'],['asset_martial_school'])),
O('fallen_martial_clan','没落武林世家嫡子','武林',{root:4,insight:5},'祖产里可能藏着残篇、古兵与旧仇。',G(80,[Q('item_ancestral_keepsake')],[],['asset_hidden_family_legacy'])),
O('martial_clan_heir','武林世家嫡子','武林',{root:6,insight:5,charm:4},'家传武学、庄园、人脉和护卫齐备。',G(500,[Q('weapon_quality')],['martial_family_internal','martial_basic_fist'],['asset_family_manor','asset_clan_guards'])),
O('elder_descendant','大派长老后人','门派',{root:5,insight:5},'天然靠近大型门派正式传承。',G(350,[Q('token_sect')],[],['asset_sect_access'])),
O('sect_master_kin','掌门亲族','门派',{root:7,insight:6,charm:4},'高阶门派开局，也会直接卷入门内权争。',G(600,[],[],['asset_high_sect_status','asset_sect_access'])),
O('military_house','将门之后','权贵',{physique:8,root:4,will:4},'可走江湖、军旅、朝廷三线。',G(500,[Q('mount_warhorse'),Q('armor_field')],['skill_saber_spear_basics','martial_basic_saber'],['asset_military_network'])),
O('official_heir','高官嫡子','权贵',{charm:8,will:3},'财富、官府关系和朝堂入口都在手里。',G(1200,[],[],['asset_official_network','asset_guard_retinue'])),
O('hereditary_marquis','世袭侯门','顶级权贵',{charm:9,will:4,root:3},'府邸、家兵、武师与朝堂关系俱全。',G(3000,[],[],['asset_marquis_manor','asset_house_troops','asset_elite_guards','asset_official_network'])),
O('prince_heir','王府世子','顶级权贵',{charm:10,will:5,root:4},'极高起点，同时伴随监视、暗杀和政治责任。',G(5000,[],[],['asset_prince_manor','asset_senior_instructor','asset_elite_guards','asset_official_network'])),
O('imperial_clan','皇室宗亲','皇室',{charm:10,will:6,fortune:3},'能够接触皇室资源、武库和国家级人物。',G(6000,[],[],['asset_imperial_clan_status','asset_imperial_connections','asset_elite_guards'])),
O('imperial_child','皇子 / 公主','皇室',{charm:12,will:7,root:5,fortune:4},'权力中心开局，天然包含夺嫡、朝争与国战。',G(10000,[],[],['asset_imperial_core_status','asset_palace_resources','asset_elite_guards','asset_imperial_connections']))];
export const ORIGIN_BY_ID=Object.fromEntries(ORIGINS.map(o=>[o.id,o]));
