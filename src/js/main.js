'use strict'
import SceneManager from "./SceneManager";
import BpmManager from './BpmManager';
import Monitor from './Monitor';
import BpmCalculater from "./BpmCalculater";
const css = require('../styl/main.styl');
window.addEventListener('DOMContentLoaded',() => {
    console.log('awake');


    const sceneManager = new SceneManager(bpmCalculater);
    const bpm = new BpmManager(sceneManager);
    const monitor = new Monitor(sceneManager);
    const bpmCalculater = new BpmCalculater(sceneManager);
});