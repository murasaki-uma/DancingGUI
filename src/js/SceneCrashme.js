/**
 * Created by PurpleUma on 2018/01/06.
 */
'use strict'
import * as THREE from 'three'

const errorVertex = require('./GLSL/errorVertex.glsl');
const errorFragment = require('./GLSL/errorFragment.glsl');

export default class SceneCrashme{
    constructor(manager)
    {
        this.manager = manager;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,10000);
        this.time = 0;
        this.init();

        this.errorGui;
        this.errorOffsetAttribute;
    }

    init()
    {
        this.camera.position.set(0,0,100);
        this.camera.lookAt(new THREE.Vector3(0,0,0));





        let backgroundGeo = new THREE.PlaneGeometry(1000,1000);
        let backgroundMat = new THREE.MeshBasicMaterial({
            color:0x008080
        });

        let background = new THREE.Mesh(backgroundGeo,backgroundMat);

        background.position.set(0,0,-5);
        this.scene.add(background);



        let texture = new THREE.TextureLoader().load('img/errorgui.png');
        let instances = 20;
        let bufferGeometry = new THREE.BoxBufferGeometry( 36, 13, 1 );
        // copying data from a simple box geometry, but you can specify a custom geometry if you want
        let geometry = new THREE.InstancedBufferGeometry();
        geometry.index = bufferGeometry.index;
        geometry.attributes.position = bufferGeometry.attributes.position;
        geometry.attributes.uv = bufferGeometry.attributes.uv;
        // per instance data
        let offsets = [];
        let orientations = [];
        let vector = new THREE.Vector4();
        let x, y, z;

        for ( var i = 0; i < instances; i ++ ) {
            // offsets
            x = 0;
            y = 0;
            z = 0;
            vector.set( x, y, z, 0 ).normalize();
            offsets.push( x + vector.x, y + vector.y, z + vector.z );

        }
        this.errorOffsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 );
        geometry.addAttribute( 'offset', this.errorOffsetAttribute );

        let material = new THREE.ShaderMaterial( {
            uniforms: {
                map: { value: texture }
            },
            vertexShader: errorVertex,
            fragmentShader: errorFragment
        } );
        let mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );





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