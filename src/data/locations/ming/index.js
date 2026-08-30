import {MING_CAPITAL} from './capital.js';import {MING_LUOYANG} from './luoyang.js';import {MING_HUASHAN} from './huashan.js';import {MING_SONGSHAN} from './songshan.js';import {MING_FUZHOU} from './fuzhou.js';import {MING_MEIZHUANG} from './meizhuang.js';import {MING_HEIMUYA} from './heimuya.js';
export const MING_LOCATIONS=[MING_CAPITAL,MING_LUOYANG,MING_HUASHAN,MING_SONGSHAN,MING_FUZHOU,MING_MEIZHUANG,MING_HEIMUYA];
export const MING_LOCATION_BY_ID=Object.fromEntries(MING_LOCATIONS.map(x=>[x.id,x]));
