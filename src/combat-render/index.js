// Canvas表现层：动画、粒子、镜头、技能FX与战斗规则彻底分离。
export const COMBAT_RENDER_VERSION=2;
export {FIGHTER_VISUAL_STATES,createVisualState,visualStatesForEvent,applyVisualState} from './fighterVisualState.js';
export {SpriteFighterProvider,createStaticFighterAsset} from './spriteFighterProvider.js';
