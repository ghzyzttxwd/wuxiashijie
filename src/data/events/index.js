import {FUWEI_CRISIS}from'./ming/fuweiCrisis.js';
import {WUYUE_MERGER}from'./ming/wuyueMerger.js';
import {HULONG_DONGCHANG_CONFLICT}from'./ming/hulongDongchangConflict.js';

export const EVENT_DATA=[FUWEI_CRISIS,WUYUE_MERGER,HULONG_DONGCHANG_CONFLICT];
export const EVENT_BY_ID=Object.fromEntries(EVENT_DATA.map(x=>[x.id,x]));
