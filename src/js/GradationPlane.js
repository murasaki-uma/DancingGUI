'use strict'
import * as THREE from 'three'
const vertex = require('./GLSL/gradationPlaneVertex.glsl');
const fragment = require('./GLSL/gradationPlaneFrag.glsl');
import {TweenMax,Power2,Power4, TimelineLite} from "gsap";
export default class GradationPlane
{
    constructor(width,height, gui)
    {
        this.gui = gui;
        this.width = width;
        this.height = height;
        this.mesh;
        this.uniforms = {};

        this.isStart= false;
        this.gradThreshold = {value:0.0};

        this.scale = {value:1.0};
        this.init()
    }

    init()
    {


        window.addEventListener('keydown', this.onKeyDown);
        let noisetex = new THREE.TextureLoader().load('img/noise256.png');
        noisetex.wrapS = THREE.RepeatWrapping;
        noisetex.wrapT = THREE.RepeatWrapping;
        noisetex.repeat.set(20,20);
        this.uniforms = {
            gradationTex:{value:new THREE.TextureLoader().load('img/gradationGreen_Purple.png')},
            map:{value:new THREE.TextureLoader().load('img/mail.png')},
            colorNoise:{value:noisetex},
            threshold:this.gradThreshold,
            width :{value:this.width}
        };
        let geo = new THREE.PlaneGeometry(this.width,this.height);
        let mat = new THREE.ShaderMaterial({
            uniforms:this.uniforms,
            fragmentShader:fragment,
            vertexShader:vertex,
            transparent:true,
            visible:this.gui.values.visibleMail

        });


        this.mesh = new THREE.Mesh(geo,mat);


        // this.mesh.position.set(
        //     300,
        //     0,
        //     -1000
        // );
        //
        // this.mesh.rotateY(-Math.PI/2);



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
                value : 0.01,
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


        console.log(this.gradThreshold.value);
    }


}