// Internal visual-validation candidates. These are not yet the final art direction.
// Source: EntVista/metrixel-rigged-characters (Hugging Face)
// License: EVS Sample Assets Licence 1.0 — game use/modification/redistribution allowed;
// excluded use: generative-3D training/fine-tuning/validation datasets.
const BASE='https://huggingface.co/datasets/EntVista/metrixel-rigged-characters/resolve/main/data/';

export const TRUSTED_COMBAT_FIGHTERS=Object.freeze({
  player:{
    id:'metrixel_ancient_general',
    url:`${BASE}AncientGeneral.glb`,
    source:'EntVista/metrixel-rigged-characters',
    license:'evs-sample-assets-1.0',
    scale:1,
    drawWidth:260,
    drawHeight:390,
    offsetY:-.15,
    baseYaw:0,
    facingYaw:Math.PI/2
  },
  trainer:{
    id:'metrixel_ancient_king',
    url:`${BASE}AncientKing.glb`,
    source:'EntVista/metrixel-rigged-characters',
    license:'evs-sample-assets-1.0',
    scale:1,
    drawWidth:260,
    drawHeight:390,
    offsetY:-.15,
    baseYaw:0,
    facingYaw:Math.PI/2
  }
});

export const TRUSTED_COMBAT_FIGHTER_LICENSE={
  sourceUrl:'https://huggingface.co/datasets/EntVista/metrixel-rigged-characters',
  license:'EVS Sample Assets Licence 1.0',
  note:'Free for game/project use; do not use as generative-3D training/fine-tuning/validation data.'
};
