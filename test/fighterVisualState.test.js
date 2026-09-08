import test from 'node:test';
import assert from 'node:assert/strict';
import {FIGHTER_VISUAL_STATES,visualStatesForEvent} from '../src/combat-render/fighterVisualState.js';

test('hit maps attacker to attack and target to hit',()=>{
  const state=visualStatesForEvent('hit',.5);
  assert.equal(state.actor.state,FIGHTER_VISUAL_STATES.ATTACK);
  assert.equal(state.target.state,FIGHTER_VISUAL_STATES.HIT);
  assert.equal(state.actor.progress,.5);
});

test('approach maps actor to run',()=>{
  const state=visualStatesForEvent('approach',.25);
  assert.equal(state.actor.state,FIGHTER_VISUAL_STATES.RUN);
  assert.equal(state.target.state,FIGHTER_VISUAL_STATES.IDLE);
});

test('defeat maps target to defeat',()=>{
  const state=visualStatesForEvent('defeat',1);
  assert.equal(state.target.state,FIGHTER_VISUAL_STATES.DEFEAT);
});

test('progress is clamped',()=>{
  assert.equal(visualStatesForEvent('hit',4).actor.progress,1);
  assert.equal(visualStatesForEvent('hit',-2).actor.progress,0);
});
