import test from 'node:test';
import assert from 'node:assert/strict';
import {createModelFighterAsset,ModelFighterProvider} from '../src/combat-render/modelFighterProvider.js';

test('model asset factory keeps render and animation config',()=>{
  const asset=createModelFighterAsset({url:'https://example.com/hero.glb',scale:1.2,drawWidth:260,animations:{attack:'SwordSlash'},motionUrls:{hit:'https://example.com/hit.fbx'},retargetOptions:{hip:'Hips'}});
  assert.equal(asset.url,'https://example.com/hero.glb');
  assert.equal(asset.scale,1.2);
  assert.equal(asset.drawWidth,260);
  assert.equal(asset.animations.attack,'SwordSlash');
  assert.equal(asset.motionUrls.hit,'https://example.com/hit.fbx');
  assert.equal(asset.retargetOptions.hip,'Hips');
});

test('provider can be constructed without browser globals',()=>{
  const provider=new ModelFighterProvider({assets:{},strict:true});
  assert.equal(provider.ready,false);
  assert.equal(provider.strict,true);
});
