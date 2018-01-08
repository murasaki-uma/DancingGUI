/**
 * Created by PurpleUma on 2018/01/06.
 */
'use strict'
import * as THREE from 'three'
import CurlNoise from './curlNoise';
const errorVertex = require('./GLSL/errorVertex.glsl');
const errorFragment = require('./GLSL/errorFragment.glsl');
// const
import {TweenMax,Power2,Power4, TimelineLite} from "gsap";
export default class SceneCrashme{
    constructor(manager)
    {
        this.manager = manager;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,10000);
        this.time = 0;


        this.errorGui;
        this.errorOffsetAttribute;

        this.curlNoise = new CurlNoise();

        this.errorGuiPos = new THREE.Vector3(0,0,0);
        this.arrayErrorGuiPos = [];
        this.instanceCount = 20;

        this.cameraLookAt = new THREE.Vector3();

        this.errorGuiInterval = {value:0.0};
        this.backgroundPlane;
        this.backgroundScale = {value:1.0};

        this.init();
    }

    init()
    {
        this.camera.position.set(0,0,100);
        this.camera.lookAt(new THREE.Vector3(0,0,0));





        let backgroundGeo = new THREE.PlaneGeometry(1000,1000);
        let backgroundMat = new THREE.MeshBasicMaterial({
            color:0x008080
        });

        this.backgroundPlane = new THREE.Mesh(backgroundGeo,backgroundMat);

        this.backgroundPlane.position.set(0,0,-5);
        this.scene.add(this.backgroundPlane);



        let texture = new THREE.TextureLoader().load('img/errorgui.png');
        let instances = this.instanceCount;
        let bufferGeometry = new THREE.BoxBufferGeometry( 36, 13, 1 );
        // copying data from a simple box geometry, but you can specify a custom geometry if you want
        let geometry = new THREE.InstancedBufferGeometry();
        geometry.index = bufferGeometry.index;
        geometry.attributes.position = bufferGeometry.attributes.position;
        geometry.attributes.uv = bufferGeometry.attributes.uv;
        let normal = bufferGeometry.attributes.normal.clone();
        console.log(geometry.attributes);
        // per instance data
        let offsets = [];
        let number = [];
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
            number.push(i);
            // this.arrayErrorGuiPos.push(new THREE.Vector3(0,0,0));

        }
        this.errorOffsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 );

        let numberAttribute = new THREE.InstancedBufferAttribute( new Float32Array( number ), 1 );

        geometry.addAttribute( 'offset', this.errorOffsetAttribute );
        geometry.addAttribute('normal', normal);
        geometry.addAttribute('number', numberAttribute);
        let material = new THREE.ShaderMaterial( {
            uniforms: {
                map: { value: texture }
            },
            vertexShader: errorVertex,
            fragmentShader: errorFragment
        } );

        var materials = [
            new THREE.MeshLambertMaterial( { color: 0xff0000 } ),
            new THREE.MeshLambertMaterial( { color: 0xff0000 } ),
            new THREE.MeshLambertMaterial( { color: 0xff0000 } ),
            new THREE.MeshLambertMaterial( { color: 0xff0000 } ),
            new THREE.MeshLambertMaterial( { color: 0xff0000 } ),
            new THREE.MeshLambertMaterial( { color: 0xff0000 } ),
        ];
        let mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );


    }

    resetAnimation()
    {
        TweenMax.to(this.camera.position , 1.0 , {
            x : 0,
            y : 0,
            z : 100,
            // delay : 2.0 ,
            ease :Power2.easeInOut
        });

        TweenMax.to(this.cameraLookAt , 1.0 , {
            x : 0,
            y : 0,
            z : 0,
            // delay : 0.5 ,
            ease :Power2.easeInOut
        });

        TweenMax.to(this.errorGuiInterval , 1.0 , {
            value : 1.0,
            ease :Power2.easeInOut
        });

        TweenMax.to(this.backgroundPlane.position , 1.0 , {
            x : 0,
            y : 0,
            z : 0,
            // delay : 1.0 ,
            ease :Power2.easeInOut
        });


        TweenMax.to(this.backgroundScale , 4.0 , {
            value : 1.0,
            // delay : 0.5,
            ease :Power2.easeInOut
        });
    }

    cameraAnimation()
    {
        TweenMax.to(this.camera.position , 1.0 , {
            x : this.manager.gui.values.cameraAnimeation01PosX,
            y : this.manager.gui.values.cameraAnimeation01PosY,
            z : this.manager.gui.values.cameraAnimeation01PosZ,
            // delay : 0.5 ,
            ease :Power2.easeInOut
        });

        TweenMax.to(this.cameraLookAt , 1.0 , {
            x : this.manager.gui.values.cameraAnimeation01LookX,
            y : this.manager.gui.values.cameraAnimeation01LookY,
            z : this.manager.gui.values.cameraAnimeation01LookZ,
            // delay : 0.5,
            ease :Power2.easeInOut
        });


        TweenMax.to(this.backgroundPlane.position , 2.5, {
            x : this.manager.gui.values.backgroundAnimationX,
            y : this.manager.gui.values.backgroundAnimationY,
            z : this.manager.gui.values.backgroundAnimationZ,
            // delay : 0.5,
            ease :Power2.easeInOut
        });


        TweenMax.to(this.errorGuiInterval , 1.5 , {
            value : this.manager.gui.values.errorGuiInterval,
            // delay : 0.5,
            ease :Power2.easeInOut
        });

        TweenMax.to(this.backgroundScale , 4.0 , {
            value : 0.0,
            // delay : 0.5,
            ease :Power2.easeInOut
        });

    }


    onKeyDown(e)
    {
        if(e.key == 'a')
        {
            this.cameraAnimation();
        }


        if(e.key == 'r')
        {
            this.resetAnimation();
        }
    }

    onClick(e)
    {

    }

    onWindowResize(e)
    {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

    }


    update()
    {


        this.camera.lookAt(this.cameraLookAt);

        this.camera.updateProjectionMatrix();
        this.time ++;
        let p = this.curlNoise.getCurlNoise(new THREE.Vector3(
            this.errorOffsetAttribute.array[0]*0.011,
            this.errorOffsetAttribute.array[1]*0.011,
            this.time*0.005
        ));
        // p.multiplyScalar(1.1);

        this.errorGuiPos.set(
            p.x * 5,
            p.z * 5,
            0
        );


        this.arrayErrorGuiPos.unshift(this.errorGuiPos.clone());

        // console.log(this.arrayErrorGuiPos.length);
        if(this.arrayErrorGuiPos.length > this.instanceCount){
            this.arrayErrorGuiPos.pop();
        }
        // console.log(this.arrayErrorGuiPos);
        // this.arrayErrorGuiPos.pop();

        for(let i = 0; i < this.arrayErrorGuiPos.length; i++ )
        {

            this.errorOffsetAttribute.array[(19-i)*3] = this.arrayErrorGuiPos[i].x;
            this.errorOffsetAttribute.array[(19-i)*3+1] = this.arrayErrorGuiPos[i].y;
            this.errorOffsetAttribute.array[(19-i)*3+2] = -(this.errorGuiInterval.value  / this.arrayErrorGuiPos.length)*i;

            // console.log(-(this.errorGuiInterval.value  / this.arrayErrorGuiPos.length)*i);



        }

        this.backgroundPlane.scale.set(
            this.backgroundScale.value,
            this.backgroundScale.value,
            this.backgroundScale.value
        );
        this.errorOffsetAttribute.needsUpdate = true;
        // console.log(this.errorOffsetAttribute.array);


    }
}