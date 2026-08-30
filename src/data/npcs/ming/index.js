import {ZHU_WUSHI}from'./hulong.js';
import {DUAN_TIANYA,GUIHAI_YIDAO,SHANGGUAN_HAITANG,CHENG_SHIFEI}from'./hulongAgents.js';
import {CAO_ZHENGCHUN}from'./eastDepot.js';
import {GU_SANTONG}from'./prison.js';
import {YUE_BUQUN,LINGHU_CHONG}from'./huashan.js';
import {NING_ZHONGZE,FENG_QINGYANG}from'./huashanExtra.js';
import {ZUO_LENGCHAN}from'./songshan.js';
import {DONGFANG_BUBAI,REN_YINGYING,XIANG_WENTIAN}from'./sunmoon.js';
import {REN_WOXING,HUANG_ZHONGGONG}from'./meizhuangExtra.js';
import {LIN_PINGZHI}from'./fuwei.js';
import {LIN_ZHENNAN}from'./fuweiExtra.js';
import {TIAN_BOGUANG}from'./wanderers.js';

export const MING_CORE_NPCS=[
  ZHU_WUSHI,DUAN_TIANYA,GUIHAI_YIDAO,SHANGGUAN_HAITANG,CHENG_SHIFEI,CAO_ZHENGCHUN,GU_SANTONG,
  YUE_BUQUN,LINGHU_CHONG,NING_ZHONGZE,FENG_QINGYANG,ZUO_LENGCHAN,
  DONGFANG_BUBAI,REN_YINGYING,XIANG_WENTIAN,REN_WOXING,HUANG_ZHONGGONG,
  LIN_PINGZHI,LIN_ZHENNAN,TIAN_BOGUANG
];
export const MING_CORE_NPC_BY_ID=Object.fromEntries(MING_CORE_NPCS.map(x=>[x.id,x]));
