'use strict'
import * as THREE from 'three'
const vertex = require('./GLSL/gradationPlaneVertex.glsl');
const fragment = require('./GLSL/gradationPlaneFrag.glsl');
import {TweenMax,Power2,Power4, TimelineLite} from "gsap";
export default class GradationPlane
{
    constructor(width,height)
    {
        this.width = width;
        this.height = height;
        this.mesh;
        this.uniforms = {};

        this.isStart= false;
        this.gradThreshold = {value:0.0};

        this.init()
    }

    init()
    {


        window.addEventListener('keydown', this.onKeyDown);
        let noisetex = new THREE.TextureLoader().load('img/noise256.png');
        noisetex.wrapS = THREE.RepeatWrapping;
        noisetex.wrapT = THREE.RepeatWrapping;
        noisetex.repeat.set(2,2);
        this.uniforms = {
            gradationTex:{value:new THREE.TextureLoader().load('img/gradationPurple.png')},
            colorNoise:{value:noisetex},
            threshold:this.gradThreshold,
            width :{value:this.width}
        };
        let geo = new THREE.PlaneGeometry(this.width,this.height);
        let mat = new THREE.ShaderMaterial({
            uniforms:this.uniforms,
            fragmentShader:fragment,
            vertexShader:vertex,
            transparent:true
        });


        this.mesh = new THREE.Mesh(geo,mat);


    }


    getMesh()
    {
        return this.mesh;
    }

    start()
    {

        console.log('threthold')


        TweenMax.to(this.gradThreshold , 2.0 , {
            value:1.0,
            // delay : 0.5 ,
            // ease :Power2.easeInOut,
            // onUpdate:()=>{console.log(this.gradThreshold.value)}
        });
    }

    reset()
    {

        TweenMax.to(this.gradThreshold , 2.0 , {
            value:0.0,
            // delay : 0.5 ,
            // ease :Power2.easeInOut
        });

    }

    onKeyDown = (e) =>
    {
        if(e.key == 't')
        {
            this.isStart = !this.isStart;
            if(this.isStart)
            {
                this.start();
            } else
            {
                this.reset();
            }
        }

    }


    update()
    {


        console.log(this.gradThreshold.value);
    }


}