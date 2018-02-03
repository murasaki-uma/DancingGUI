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


                var _xhr = new XMLHttpRequest();

                _xhr.onreadystatechange = ()=> {
                    if (_xhr.readyState === 4) {
                        if (_xhr.status === 200) {
                            console.log(_xhr.response);


                            const manager = new SceneManager(xhr.response);
                            const sceneCrashme = new SceneCrashme(manager);
                            const paint = new CanvasPaint();
                            manager.addScene(sceneCrashme);
                            manager.update();
                        }
                    }
                }


                _xhr.open("GET", './JSON/animationsetting.json');
                _xhr.responseType = "json";
                _xhr.send();



            }
        }
    };

    xhr.open("GET", './JSON/gui.json');
    xhr.responseType = "json";
    xhr.send();


});