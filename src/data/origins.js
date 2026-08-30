const O=(id,name,tier,modifiers,summary,starter=[])=>({id,name,tier,modifiers,summary,starter});
export const ORIGINS=[
O('beggar','乞儿','底层',{fortune:5,agility:3},'三教九流消息灵通，丐帮与黑市事件更多。',['破旧衣物']),
O('farmer','农家子','底层',{physique:6,root:3},'体魄扎实，出身普通稳定。',['粗布衣']),
O('hunter','猎户之子','底层',{physique:5,agility:5},'擅长山林生存与弓猎。',['猎弓','猎刀']),
O('healer_family','医馆子弟','平民',{insight:5,will:4},'熟悉药理、医术与经脉常识。',['基础医术']),
O('scholar_family','书香门第','平民',{insight:8,will:4,charm:2},'读秘籍、残篇和典籍更有优势。',['经史典籍']),
O('merchant_family','商贾之家','平民',{charm:5,fortune:2},'有经商关系与较宽裕现金。',['银两×120']),
O('wealthy_heir','富商独子','富裕',{charm:6},'有钱能解决绝大多数普通麻烦，但买不到真正绝学。',['银两×800','好马','家仆']),
O('escort_heir','镖局少主','富裕',{physique:4,agility:3,charm:3},'有江湖人脉、兵器与基础武功。',['长刀','基础内功','马匹']),
O('dojo_heir','武馆少主','富裕',{root:4,physique:4},'开局已经正式习武。',['基础内功','两门普通武学']),
O('fallen_martial_clan','没落武林世家嫡子','武林',{root:4,insight:5},'祖产里可能藏着残篇、古兵与旧仇。',['祖传旧物']),
O('martial_clan_heir','武林世家嫡子','武林',{root:6,insight:5,charm:4},'家传武学、庄园、人脉和护卫齐备。',['家传内功','优质兵器']),
O('elder_descendant','大派长老后人','门派',{root:5,insight:5},'天然靠近大型门派正式传承。',['门派信物']),
O('sect_master_kin','掌门亲族','门派',{root:7,insight:6,charm:4},'高阶门派开局，也会直接卷入门内权争。',['高级门派身份']),
O('military_house','将门之后','权贵',{physique:8,root:4,will:4},'可走江湖、军旅、朝廷三线。',['战马','甲胄','刀枪基础']),
O('official_heir','高官嫡子','权贵',{charm:8,will:3},'财富、官府关系和朝堂入口都在手里。',['护卫','官府人脉']),
O('hereditary_marquis','世袭侯门','顶级权贵',{charm:9,will:4,root:3},'府邸、家兵、武师与朝堂关系俱全。',['侯府','家兵','高级护卫']),
O('prince_heir','王府世子','顶级权贵',{charm:10,will:5,root:4},'极高起点，同时伴随监视、暗杀和政治责任。',['王府','高级武师','大量银两']),
O('imperial_clan','皇室宗亲','皇室',{charm:10,will:6,fortune:3},'能够接触皇室资源、武库和国家级人物。',['宗室身份','皇室关系']),
O('imperial_child','皇子 / 公主','皇室',{charm:12,will:7,root:5,fortune:4},'权力中心开局，天然包含夺嫡、朝争与国战。',['皇室核心身份','宫廷资源'])];
export const ORIGIN_BY_ID=Object.fromEntries(ORIGINS.map(o=>[o.id,o]));
