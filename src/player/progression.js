import {MARTIAL_BY_ID} from '../data/martial/index.js';

export const PROGRESSION_SCHEMA=1;
export const JIANGHU_RANKS=[
  {id:'unranked',name:'不入流',min:0,minMastery:0,minInner:0,minUnderstanding:0},
  {id:'third_rate',name:'三流',min:100,minMastery:200,minInner:0,minUnderstanding:0},
  {id:'second_rate',name:'二流',min:1000,minMastery:4000,minInner:450,minUnderstanding:12},
  {id:'first_rate',name:'一流',min:3500,minMastery:7000,minInner:1200,minUnderstanding:25},
  {id:'top',name:'顶尖',min:9000,minMastery:9000,minInner:3000,minUnderstanding:45},
  {id:'peerless',name:'绝顶',min:20000,minMastery:10000,minInner:7000,minUnderstanding:70}
];
export const INNER_STAGES=[
  {id:'none',name:'未成内息',min:0,capacity:0},
  {id:'breath',name:'初窥内息',min:120,capacity:40},
  {id:'minor_cycle',name:'小周天',min:450,capacity:90},
  {id:'major_cycle',name:'大周天',min:1200,capacity:160},
  {id:'deep_qi',name:'内息浑厚',min:3000,capacity:260},
  {id:'round_cycle',name:'周天圆融',min:7000,capacity:400}
];

function baseProgression(){return{schema:PROGRESSION_SCHEMA,experience:0,innerExperience:0,lossGrowthTriggers:0,battles:0,wins:0};}
export function ensureProgression(character){const existing=character.progressionState||{},p=existing?.schema===PROGRESSION_SCHEMA?existing:{...existing,schema:PROGRESSION_SCHEMA};return{...character,progressionState:{...baseProgression(),...p}};}
function learnedEntries(character){return Object.values(character.martialState?.learned||{});}
function martialPeak(character){const entries=learnedEntries(character);return{mastery:entries.reduce((m,x)=>Math.max(m,x.mastery||0),0),understanding:entries.reduce((m,x)=>Math.max(m,x.understanding||0),0)};}
export function powerScore(character){const c=ensureProgression(character),top=learnedEntries(c).map(x=>x.mastery||0).sort((a,b)=>b-a).slice(0,3),martialScore=top.reduce((a,b)=>a+b,0)*.15,innerScore=(c.progressionState.innerExperience||0)*.22;return Math.round((c.progressionState.experience||0)+martialScore+innerScore);}
export function rankRequirements(character,rank){const c=ensureProgression(character),peak=martialPeak(c),score=powerScore(c),inner=c.progressionState.innerExperience||0;return{score:{value:score,required:rank.min,ok:score>=rank.min},mastery:{value:peak.mastery,required:rank.minMastery||0,ok:peak.mastery>=(rank.minMastery||0)},inner:{value:inner,required:rank.minInner||0,ok:inner>=(rank.minInner||0)},understanding:{value:peak.understanding,required:rank.minUnderstanding||0,ok:peak.understanding>=(rank.minUnderstanding||0)}};}
export function qualifiesForRank(character,rank){return Object.values(rankRequirements(character,rank)).every(x=>x.ok);}
export function jianghuRank(character){return [...JIANGHU_RANKS].reverse().find(rank=>qualifiesForRank(character,rank))||JIANGHU_RANKS[0];}
export function innerStage(character){const exp=ensureProgression(character).progressionState.innerExperience||0;return [...INNER_STAGES].reverse().find(x=>exp>=x.min)||INNER_STAGES[0];}
export function characterVitals(character){const c=ensureProgression(character),a=c.attributes||{},inner=innerStage(c),maxHp=Math.round(100+(a.physique||50)*2.1+(a.root||50)*.8),maxQi=Math.round(30+(a.root||50)*.75+inner.capacity);return{maxHp,maxQi,hp:maxHp,qi:maxQi,rank:jianghuRank(c),inner,score:powerScore(c)};}
export function addProgress(character,{experience=0,innerExperience=0,battle=false,win=false}={}){const c=ensureProgression(character),p=c.progressionState;return{...c,progressionState:{...p,experience:Math.max(0,p.experience+experience),innerExperience:Math.max(0,p.innerExperience+innerExperience),battles:p.battles+(battle?1:0),wins:p.wins+(win?1:0)}};}
export function applyTrainingProgress(character,martialId,hours){const martial=MARTIAL_BY_ID[martialId],days=hours/24,inner=martial?.category==='internal'?Math.max(1,Math.round(90*days)):0;return addProgress(character,{experience:Math.max(1,Math.round(12*days)),innerExperience:inner});}
export function applyBattleProgress(character,{difficulty=1,win=false}={}){return addProgress(character,{experience:Math.max(1,Math.round((win?6:3)*Math.max(.5,difficulty))),battle:true,win});}
export function nextRank(character){const current=jianghuRank(character),index=JIANGHU_RANKS.findIndex(x=>x.id===current.id);return JIANGHU_RANKS[index+1]||null;}
export function nextInnerStage(character){const exp=ensureProgression(character).progressionState.innerExperience;return INNER_STAGES.find(x=>x.min>exp)||null;}
