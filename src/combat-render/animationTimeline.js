const EVENT_DEFAULT_MS={action_start:180,approach:160,miss:180,hit:150,knockback:180,recover:260,defeat:400};

function eventDuration(event){
  if(event.type==='hit') return Math.max(120,(event.hitStopMs||0)+110);
  return Math.max(0,event.durationMs??EVENT_DEFAULT_MS[event.type]??120);
}

export function compileAnimationTimeline(events){
  let cursor=0;
  const clips=events.map((event,index)=>{
    const durationMs=eventDuration(event),clip={id:`clip_${index}`,event,startMs:cursor,durationMs,endMs:cursor+durationMs};
    cursor+=durationMs;
    return clip;
  });
  return{clips,totalMs:cursor};
}

export function activeClipAt(timeline,timeMs){
  return timeline.clips.find(clip=>timeMs>=clip.startMs&&timeMs<clip.endMs)||null;
}

export function clipProgress(clip,timeMs){
  if(!clip||clip.durationMs<=0)return 1;
  return Math.max(0,Math.min(1,(timeMs-clip.startMs)/clip.durationMs));
}
