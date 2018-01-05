'use strict'


const css = require('../styl/main.styl');

import SceneManager from './SceneManager';
import SceneCrashme from './SceneCrashme';
window.addEventListener('DOMContentLoaded',() => {
    console.log('awake');

    const main = new SceneManager();
    const sceneCrashme = new SceneCrashme();

    main.addScene(sceneCrashme);
    main.update();
});