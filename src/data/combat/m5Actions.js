const A=(martialId,{power,accuracy,startupMs,activeMs,recoveryMs,range,knockback,hitStopMs,hitCount=1,energyCost=0})=>({martialId,power,accuracy,startupMs,activeMs,recoveryMs,range,knockback,hitStopMs,hitCount,energyCost});

export const M5_COMBAT_ACTIONS=[
  A('martial_basic_fist',{power:20,accuracy:.9,startupMs:180,activeMs:120,recoveryMs:260,range:72,knockback:18,hitStopMs:55}),
  A('martial_basic_sword',{power:27,accuracy:.92,startupMs:210,activeMs:150,recoveryMs:290,range:104,knockback:24,hitStopMs:70}),
  A('martial_basic_saber',{power:32,accuracy:.86,startupMs:280,activeMs:170,recoveryMs:340,range:96,knockback:34,hitStopMs:90}),
  A('martial_shaolin_vajra_palm',{power:52,accuracy:.88,startupMs:420,activeMs:190,recoveryMs:520,range:120,knockback:72,hitStopMs:140,energyCost:18})
];

export const M5_COMBAT_ACTION_BY_MARTIAL_ID=Object.fromEntries(M5_COMBAT_ACTIONS.map(x=>[x.martialId,x]));
