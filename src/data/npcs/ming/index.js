import {ZHU_WUSHI}from'./hulong.js';import{YUE_BUQUN,LINGHU_CHONG}from'./huashan.js';import{ZUO_LENGCHAN}from'./songshan.js';import{LIN_PINGZHI}from'./fuwei.js';
export const MING_CORE_NPCS=[ZHU_WUSHI,YUE_BUQUN,LINGHU_CHONG,ZUO_LENGCHAN,LIN_PINGZHI];
export const MING_CORE_NPC_BY_ID=Object.fromEntries(MING_CORE_NPCS.map(x=>[x.id,x]));
