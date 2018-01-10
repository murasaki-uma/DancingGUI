'use strict'
import * as THREE from 'three'
const vertex = require('./GLSL/errorAnimationVertex.glsl');
const fragment = require('./GLSL/errorAnimationFragment.glsl');
import {TweenMax,Power2,Power4, TimelineLite} from "gsap";

export default class ErrorGui
{
    constructor(width,height, gui, texture,grad)
    {
        this.gui = gui;
        this.width = width;
        this.height = height;
        this.mesh;
        this.uniforms = {};

        this.isStart= false;
        this.gradThreshold = {value:0.0};

        this.scale = {value:1.0};

        this.guiTexture = texture;
        this.gradTexture = grad;
        this.posisiton = new THREE.Vector3();
        this.isWire = {value:true};
        this.init()
    }

    init()
    {


        window.addEventListener('keydown', this.onKeyDown);

        this.uniforms = {
            map:{value:this.guiTexture},
            gradMap:{value:this.gradTexture},
            threshold:this.gradThreshold,
            isWire:this.isWire,
            width :{value:this.width},
            height:{value:this.height}
        };
        let geo = new THREE.PlaneGeometry(this.width,this.height);
        let mat = new THREE.ShaderMaterial({
            uniforms:this.uniforms,
            fragmentShader:fragment,
            vertexShader:vertex,
            transparent:true,
            visible:false,

        });
        
        this.mesh = new THREE.Mesh(geo,mat);

        this.gui.gradThreshold.onChange((e)=>{
            this.gradThreshold.value = e;
        })


    }


    getMesh()
    {
        return this.mesh;
    }

    start()
    {

        // console.log('threthold')

        TweenMax.to(this.gradThreshold , this.gui.values.gradThresholdDulation , {
            value:1.0,
            // delay : 0.5 ,
            // ease :Power2.easeInOut,
            // onUpdate:()=>{console.log(this.gradThreshold.value)}
        });


    }

    reset()
    {

        TweenMax.to(this.gradThreshold , this.gui.values.gradThresholdDulation , {
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

        if(e.key == 'a')
        {
            TweenMax.to(this.mesh.position , 2.5, {
                z : 0,
                // delay : 0.5,
                ease :Power2.easeInOut
            });


            TweenMax.to(this.scale , 4.0, {
                value : 0.001,
                // delay : 0.5,
                ease :Power2.easeInOut,
                onUpdate:()=>{
                    this.mesh.scale.set(
                        this.scale.value,
                        this.scale.value,
                        this.scale.value
                    );
                }
            });
        }

        if(e.key == 'r')
        {
            TweenMax.to(this.mesh.position , 2.5, {
                z : 0,
                // delay : 0.5,
                ease :Power2.easeInOut
            });


            TweenMax.to(this.scale , 4.0, {
                value : 1,
                // delay : 0.5,
                ease :Power2.easeInOut,
                onUpdate:()=>{
                    this.mesh.scale.set(
                        this.scale.value,
                        this.scale.value,
                        this.scale.value
                    );
                }
            });

        }

    }


    update()
    {


        // console.log(this.gradThreshold.value);
    }


}