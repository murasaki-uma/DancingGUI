'use strict'


const css = require('../styl/main.styl');

import SceneManager from './SceneManager';
import SceneCrashme from './SceneCrashme';
window.addEventListener('DOMContentLoaded',() => {
    console.log('awake');

    const manager = new SceneManager();
    const sceneCrashme = new SceneCrashme(manager);

    manager.addScene(sceneCrashme);
    manager.update();
});