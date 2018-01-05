/**
 * Created by PurpleUma on 2018/01/06.
 */
'use strict'
import * as THREE from 'three'

export default class SceneCrashme{
    constructor()
    {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50,this.width/this.height,0.1,10000);
    }

    onWindowResize(e)
    {

        let geo = new THREE.BoxGeometry(1,1,1);
        let mat = new THREE.MeshBasicMaterial({
            color:0xffffff*Math.random()
        });

        let mesh = new THREE.Mesh(geo,mat);
        this.scene.add(mesh);



    }


    update()
    {

    }
}