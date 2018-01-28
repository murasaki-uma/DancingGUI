/**
 * Created by PurpleUma on 2018/01/06.
 */
'use strict'
import * as THREE from 'three'
import CurlNoise from './curlNoise';
import ErrorGui from './ErrorGui';
import OuterWall from './OuterWall';
import DancingErrors from './DancingErrors';
// const errorVertex = require('./GLSL/errorVertex.glsl');
// const errorFragment = require('./GLSL/errorFragment.glsl');
// const
import MailGui from './MailGui';

import {TweenMax,Power2,Power4, TimelineLite} from "gsap";
export default class SceneCrashme{
    constructor(manager)
    {
        this.manager = manager;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,10000);
        this.time = 0;



        this.curlNoise = new CurlNoise();
        this.mails = [];

        this.cameraLookAt = new THREE.Vector3();

        this.backgroundPlane;
        this.backgroundScale = {value:1.0};

        this.errors = [];
        this.outerWalls = [];

        this.dancingErrors = new DancingErrors(this.manager.gui);





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


        this.manager.gui.visibleBackground.onChange((e)=>{
            this.backgroundPlane.material.visible = e;
        })


        this.scene.add(this.dancingErrors.getMesh());




        let gp = new MailGui(47.3,22.8,this.manager.gui);
        this.mails.push(gp);

        this.scene.add(gp.getMesh());

        this.manager.gui.visibleMail.onChange((e)=>{
            for(let m of this.mails)
            {
                m.getMesh().material.visible = e;
            }
        });


        let errorTex = new THREE.TextureLoader().load('./img/errorgui.png');

        let gradTex = new THREE.TextureLoader().load('./img/gradationGreen_Purple.png');


        let errorsize= 10;
        for(let i = 0; i < errorsize; i++)
        {
            let error = new ErrorGui(36,13,this.manager.gui,errorTex,gradTex);
            this.errors.push(error);
            error.radian = (Math.PI*2 / errorsize) *  i;
            this.scene.add(error.getMesh());
        }


        this.manager.gui.errorGuiSide.onChange((e)=>{
            for(let error of this.errors)
            {
                error.sideColor.value.setRGB(
                    e[0]/255,
                    e[1]/255,
                    e[2]/255,
                );
            }

        });


        this.manager.gui.visibleErrors.onChange((e)=>{
            for(let error of this.errors)
            {
                for(let m of error.mesh.material)
                {
                    m.visible = e;
                }

            }

        });




        let rad = Math.PI*2/4;
        let radius = 100;
        for(let i = 0; i < 4; i++)
        {

            let r = rad * i;
            let y = Math.cos(r) * radius;
            let z = Math.sin(r) * radius;
            let x = 0;


            let o = new OuterWall(this.manager.gui,radius*4,radius*2,60,30,this.curlNoise);
            this.outerWalls.push(o);
            o.getMesh().material.visible = this.manager.gui.values.visibleOuterWalls;
            o.getMesh().position.set(x,y,z);
            o.getMesh().rotateX(r+Math.PI/2);

            this.scene.add(o.getMesh());



        }

        this.manager.gui.visibleOuterWalls.onChange((e)=>{
            for(let i = 0; i < this.outerWalls.length; i++)
            {
                this.outerWalls[i].getMesh().material.visible = e;
            }

        });





    }

    mouseMove =(e)=>
    {

    }

    resetAnimation()
    {

        this.dancingErrors.resetAnimation();
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

        this.dancingErrors.animationStart();
        TweenMax.to(this.camera.position , 1.0 , {
            x : this.manager.gui.values.cameraAnimeation01PosX,
            y : this.manager.gui.values.cameraAnimeation01PosY,
            z : this.manager.gui.values.cameraAnimeation01PosZ,
            delay : 0.5 ,
            ease :Power2.easeInOut
        });

        TweenMax.to(this.cameraLookAt , 1.0 , {
            x : this.manager.gui.values.cameraAnimeation01LookX,
            y : this.manager.gui.values.cameraAnimeation01LookY,
            z : this.manager.gui.values.cameraAnimeation01LookZ,
            delay : 0.5,
            ease :Power2.easeInOut
        });


        TweenMax.to(this.backgroundPlane.position , 2.5, {
            x : this.manager.gui.values.backgroundAnimationX,
            y : this.manager.gui.values.backgroundAnimationY,
            z : this.manager.gui.values.backgroundAnimationZ,
            // delay : 0.5,
            ease :Power2.easeInOut
        });



        TweenMax.to(this.backgroundScale , 4.0 , {
            value : 0.00001,
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


    update(frame)
    {



        for(let e of this.errors)
        {
            e.update(frame);
        }
        this.camera.lookAt(this.cameraLookAt);

        this.camera.updateProjectionMatrix();


        this.time ++;

        this.dancingErrors.update();



        this.backgroundPlane.scale.set(
            this.backgroundScale.value,
            this.backgroundScale.value,
            this.backgroundScale.value
        );
        // this.errorOffsetAttribute.needsUpdate = true;
        // console.log(this.errorOffsetAttribute.array);


    }
}