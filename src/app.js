import {initCharacterCreation} from './ui/characterCreation.js';
import {initWorldMap} from './ui/worldMap.js';

document.addEventListener('DOMContentLoaded',()=>{
  initCharacterCreation();
  document.addEventListener('jiuzhou:enter-world',event=>initWorldMap(event.detail.slot));
});
