'use strict'


const css = require('../styl/main.styl');

import SceneManager from './SceneManager';
import SceneCrashme from './SceneCrashme';
import CanvasPaint from  './CancasPaint';
window.addEventListener('DOMContentLoaded',() => {
    console.log('awake');

    const manager = new SceneManager();
    const sceneCrashme = new SceneCrashme(manager);
    const paint = new CanvasPaint();
    manager.addScene(sceneCrashme);
    manager.update();
});