import {BASIC_FIST,BASIC_SWORD,BASIC_SABER}from'./common/basic.js';
import {HUASHAN_BASIC_SWORD,ZIXIA_GONG}from'./ming/huashan.js';
import {SHAOLIN_VAJRA_PALM}from'./ming/shaolin.js';

export const MARTIAL_DATA=[BASIC_FIST,BASIC_SWORD,BASIC_SABER,HUASHAN_BASIC_SWORD,ZIXIA_GONG,SHAOLIN_VAJRA_PALM];
export const MARTIAL_BY_ID=Object.fromEntries(MARTIAL_DATA.map(x=>[x.id,x]));
