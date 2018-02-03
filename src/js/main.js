'use strict'


const css = require('../styl/main.styl');

import SceneManager from './SceneManager';
import SceneCrashme from './SceneCrashme';
import CanvasPaint from  './CancasPaint';
window.addEventListener('DOMContentLoaded',() => {
    console.log('awake');


    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = ()=> {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.response);


                const manager = new SceneManager(xhr.response);
                const sceneCrashme = new SceneCrashme(manager);
                const paint = new CanvasPaint();
                manager.addScene(sceneCrashme);
                manager.update();

            } else {
                console.log("status = " + xhr.status);
            }
        }
    };

    xhr.open("GET", './JSON/gui.json');
    xhr.responseType = "json";
    xhr.send();


});