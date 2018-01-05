/**
 * Created by PurpleUma on 2018/01/06.
 */
'use strict'
import * as THREE from 'three'

export default class SceneCrashme{
    constructor()
    {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,10000);
        this.time = 0;
        this.init();
    }

    init()
    {
        this.camera.position.set(0,0,10);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        let geo = new THREE.BoxGeometry(1,1,1);
        let mat = new THREE.MeshBasicMaterial({
            color:0xffffff*Math.random()
        });

        let mesh = new THREE.Mesh(geo,mat);
        this.scene.add(mesh);
        this.scene.background = new THREE.Color( 0xcce0ff );

    }

    onClick(e)
    {

    }

    onWindowResize(e)
    {




    }


    update()
    {

        this.time ++;

        // this.camera.position.set(
        //     0,
        //     0,
        //     Math.sin(this.time*0.01) * 10
        // );
        //
        // this.camera.lookAt(new THREE.Vector3(0,0,0));

    }
}