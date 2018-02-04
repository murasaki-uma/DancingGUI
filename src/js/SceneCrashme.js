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


const record_cricle = require('./JSON/records/circle');
const jumpingsidetoside01 = require('./JSON/records/jumpingsidetoside01.json');
const leftuptprightdown = require('./JSON/records/leftuptprightdown.json');
const rightuptoleftdownloop = require('./JSON/records/rightuptoleftdownloop.json');

export default class SceneCrashme{
    constructor(manager)
    {
        this.manager = manager;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.manager.gui.values.cameraStartFov,window.innerWidth/window.innerHeight,0.1,10000);
        this.time = 0;
        this.isRecord = false;
        this.curlNoise = new CurlNoise();
        this.cameraLookAt = new THREE.Vector3();

        // this.camera.fov

        this.backgroundPlane;
        this.backgroundScale = {value:1.0};


        this.mails = [];
        this.errors = [];
        this.outerWalls = [];
        this.dancingErrors = [];
        this.record = [];

        this.backgroundColor = new THREE.Color(255,255,255);


        this.isAnimationStarted = false;
        this.isAnimationReset = false;
        this.isErrorIn = false;


        this.debugMesh = document.querySelector('.mesh');


        this.startCameraAnimationTiming = 0;
        this.resetCameraAnimationTiming = 0;




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



        let bgs = this.manager.gui.values.backgroundColor;
        let bge = this.manager.gui.values.backgroundEndColor;

        document.body.style.background = "linear-gradient(to right, " +
            "rgb("+ Math.floor(bgs[0]) + "," +  Math.floor(bgs[1]) + "," +  Math.floor(bgs[2]) + ")" + "0%," +
            "rgb("+ Math.floor(bge[0]) + "," +  Math.floor(bge[1]) + "," +  Math.floor(bge[2]) + ")" + "100%)"
        ;

        this.manager.gui.backgroundColor.onChange((e)=>{
            let bg = this.manager.gui.values.backgroundEndColor;

            document.body.style.background = "linear-gradient(to right, " +
                "rgb("+ Math.floor(e[0]) + "," +  Math.floor(e[1]) + "," +  Math.floor(e[2]) + ")" + "0%," +
                "rgb("+ Math.floor(bg[0]) + "," +  Math.floor(bg[1]) + "," +  Math.floor(bg[2]) + ")" + "100%)"
            ;
        });



        this.manager.gui.backgroundEndColor.onChange((e)=>{
            let bg = this.manager.gui.values.backgroundColor;

            document.body.style.background = "linear-gradient(to right, " +
                "rgb("+ Math.floor(bg[0]) + "," +  Math.floor(bg[1]) + "," +  Math.floor(bg[2]) + ")" + "0%," +
                "rgb("+ Math.floor(e[0]) + "," +  Math.floor(e[1]) + "," +  Math.floor(e[2]) + ")" + "100%)"
            ;
        });




        this.record.push(record_cricle);
        this.record.push(jumpingsidetoside01);
        // this.record.push(leftuptprightdown);
        this.record.push(rightuptoleftdownloop);
        // console.log(record_cricle);
        for(let i = 0; i <3; i++)
        {
            let r = i * Math.PI*2/3;
            let d = new DancingErrors(this.manager.gui,this.record[i],r);
            this.dancingErrors.push(d);


            this.scene.add(d.getMesh());
        }


        this.manager.gui.dancingErrorbaseWindowScale.onChange((e)=>{
            for(let i = 0; i < this.dancingErrors.length; i++)
            {
                this.dancingErrors[i].getMesh().material.uniforms.baseWindowScale.value = e;
            }

        });


        this.manager.gui.visibleDancingErrors.onChange((e)=>{
            for(let i = 0; i < this.dancingErrors.length; i++)
            {
                this.dancingErrors[i].getMesh().material.visible = e;
            }

        });

        this.manager.gui.errorGuiColor.onChange((e)=>{
            for(let i = 0; i < this.dancingErrors.length; i++) {
                this.dancingErrors[i].getMesh().material.uniforms.gradationColor.value.r = e[0] / 255;
                this.dancingErrors[i].getMesh().material.uniforms.gradationColor.value.g = e[1] / 255;
                this.dancingErrors[i].getMesh().material.uniforms.gradationColor.value.b = e[2] / 255;
            }
        });







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


        this.manager.gui.errorBaseWindowScale.onChange((e)=>{
            for(let i = 0; i < this.errors.length; i++)
            {
                this.errors[i].getMesh().scale.set(e,e,e);
            }
        });


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
        let radius = 800;
        let group = new THREE.Group();
        for(let i = 0; i < 4; i++)
        {

            let r = rad * i;
            let y = Math.cos(r) * radius;
            let z = Math.sin(r) * radius;
            let x = 0;


            let o = new OuterWall(this.manager.gui,radius*8,radius*2,400,120,this.curlNoise);
            this.outerWalls.push(o);
            o.getMesh().material.visible = this.manager.gui.values.visibleOuterWalls;
            o.getMesh().position.set(x,y,z);
            o.getMesh().rotateX(r+Math.PI/2);
            group.add(o.getMesh());

        }

        group.rotateY(Math.PI/2);
        group.position.set(
            this.manager.gui.values.outerWallPositionX,
            this.manager.gui.values.outerWallPositionY,
            this.manager.gui.values.outerWallPositionZ
        );

        this.manager.gui.outerWallPositionX.onChange((e)=>{
            group.position.set(
                this.manager.gui.values.outerWallPositionX,
                this.manager.gui.values.outerWallPositionY,
                this.manager.gui.values.outerWallPositionZ
            );
        });

        this.manager.gui.outerWallPositionY.onChange((e)=>{
            group.position.set(
                this.manager.gui.values.outerWallPositionX,
                this.manager.gui.values.outerWallPositionY,
                this.manager.gui.values.outerWallPositionZ
            );
        });


        this.manager.gui.outerWallPositionZ.onChange((e)=>{
            group.position.set(
                this.manager.gui.values.outerWallPositionX,
                this.manager.gui.values.outerWallPositionY,
                this.manager.gui.values.outerWallPositionZ
            );
        });


        this.scene.add(group);

        this.manager.gui.visibleOuterWalls.onChange((e)=>{
            for(let i = 0; i < this.outerWalls.length; i++)
            {
                this.outerWalls[i].getMesh().material.visible = e;
            }

        });

        this.manager.gui.outerEndColor.onChange((e)=>{
            for(let i = 0; i < this.outerWalls.length; i++)
            {
                this.outerWalls[i].startColor.value.setRGB(
                    e[0]/255,
                    e[1]/255,
                    e[2]/255,
                );
            }

        });


        this.manager.gui.outerStartColor.onChange((e)=>{
            for(let i = 0; i < this.outerWalls.length; i++)
            {
                this.outerWalls[i].endColor.value.setRGB(
                    e[0]/255,
                    e[1]/255,
                    e[2]/255,
                );
            }

        });



        this.initCameraAnimationStartTiming();





    }


    initCameraAnimationStartTiming()
    {
        let timing01 = this.manager.gui.values.animationDulation01*60;
        let timing02 = timing01 + this.manager.gui.values.animationDulation02*60;
        let timing03 = timing02 + this.manager.gui.values.animationDulation03*60;
        let timing04 = timing03 + this.manager.gui.values.animationDulation04*60;
        let cameraDulation = this.manager.gui.values.cameraAnimationDulation * 60;
        console.log(Math.random() * timing04);
        this.startCameraAnimationTiming = Math.floor(Math.random() * timing04*10);
        if(timing04-cameraDulation-60 < this.startCameraAnimationTiming)
        {
            this.startCameraAnimationTiming = timing04 - cameraDulation -60;
        }
        this.resetCameraAnimationTiming = this.startCameraAnimationTiming + cameraDulation;

    }

    mouseMove =(e)=>
    {
        for(let i = 0; i < this.dancingErrors.length; i++)
        {
            this.dancingErrors[i].mouseMove(e);
        }


    }

    resetAnimation()
    {

        TweenMax.to(this.camera , 1.0 , {
            fov : this.manager.gui.values.cameraStartFov,
            // delay : 0.5,
            ease :Power2.easeInOut
        });

        for(let i = 0; i < this.dancingErrors.length; i++)
        {
            this.dancingErrors[i].resetAnimation();
            TweenMax.to(this.camera.position , 1.0 , {
                x : 0,
                y : 0,
                z : 100,
                // delay : 2.0 ,
                ease :Power2.easeInOut
            });
        }


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


        // TweenMax.to(this.backgroundColor , 4.0 , {
        //     r : 255,
        //     g : 255,
        //     b : 255,
        //     delay : 0.5,
        //     onUpdate:()=>{
        //         document.body.style.background = "rgb("+this.backgroundColor.r + "," + this.backgroundColor.g + "," + this.backgroundColor.b + ")" ;
        //     },
        //     ease :Power1.easeInOut
        // });
    }

    cameraAnimation()
    {

        for(let i = 0; i < this.dancingErrors.length; i++) {
            this.dancingErrors[i].animationStart();
        }
        TweenMax.to(this.camera.position , 2.5 , {
            x : this.manager.gui.values.cameraAnimeation01PosX,
            y : this.manager.gui.values.cameraAnimeation01PosY,
            z : this.manager.gui.values.cameraAnimeation01PosZ,
            // delay : 0.5 ,
            ease :Power1.easeInOut
        });

        TweenMax.to(this.camera , 2.5 , {
            fov : this.manager.gui.values.cameraAfterFov,
            // delay : 0.5,
            // ease :Power1.easeInOut
        });


        TweenMax.to(this.cameraLookAt , 2.5 , {
            x : this.manager.gui.values.cameraAnimeation01LookX,
            y : this.manager.gui.values.cameraAnimeation01LookY,
            z : this.manager.gui.values.cameraAnimeation01LookZ,
            // delay : 0.5,
            ease :Power1.easeInOut
        });


        TweenMax.to(this.backgroundPlane.position , 2.5, {
            x : this.manager.gui.values.backgroundAnimationX,
            y : this.manager.gui.values.backgroundAnimationY,
            z : this.manager.gui.values.backgroundAnimationZ,
            // delay : 0.5,
            ease :Power1.easeInOut
        });


1
        TweenMax.to(this.backgroundScale , 4.0 , {
            value : 0.0001,
            // delay : 0.5,
            ease :Power1.easeInOut
        });


        // TweenMax.to(this.backgroundColor , 4.0 , {
        //     r : this.manager.gui.values.backgroundColor[0],
        //     g : this.manager.gui.values.backgroundColor[1],
        //     b : this.manager.gui.values.backgroundColor[2],
        //     delay : 0.5,
        //     onUpdate:()=>{
        //         // console.log(this.backgroundColor.getHex())
        //         document.body.style.background = "rgb("+this.backgroundColor.r + "," + this.backgroundColor.g + "," + this.backgroundColor.b + ")" ;
        //     },
        //     ease :Power1.easeInOut
        // });

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


        if(e.code == "Space")
        {
            console.log('space');
            this.isRecord = !this.isRecord;

            if(this.isRecord)
            {
                // for(let i = 0; i < this.dancingErrors.length; i++) {
                    this.dancingErrors[0].recordBegin();
                // }
            } else {
                // for(let i = 0; i < this.dancingErrors.length; i++) {
                    this.dancingErrors[0].recordEnd();
                // }
            }
        }


    }

    onClick(e)
    {

    }

    onWindowResize(e)
    {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        //
        // this.debugMesh.style.width = window.innerWidth-1 + 'px';
        // this.debugMesh.style.height = window.innerHeight-1 + 'px';


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

        for(let i = 0; i < this.dancingErrors.length; i++) {
            this.dancingErrors[i].update();
        }

        for(let i = 0; i < this.outerWalls.length; i++)
        {
            this.outerWalls[i].update();
        }


        this.backgroundPlane.scale.set(
            this.backgroundScale.value,
            this.backgroundScale.value,
            this.backgroundScale.value
        );


        let timing01 = this.manager.gui.values.animationDulation01*60;
        let timing02 = timing01 + this.manager.gui.values.animationDulation02*60;
        let timing03 = timing02 + this.manager.gui.values.animationDulation03*60;
        let timing04 = timing03 + this.manager.gui.values.animationDulation04*60;


        // console.log(this.time);
        // console.log(timing01);
        // console.log(timing02);
        // console.log(timing03);



        if(this.isAnimationStarted == false)
        {

            // this.isAnimationReset = false;
            // this.cameraAnimation();
            // this.isAnimationStarted = true;
        }



        if(timing01 > this.time && 0 < this.time)
        {
            for(let i = 0; i < this.dancingErrors.length; i++) {
                this.dancingErrors[i].ANIMATION_NUM = 1;
            }


            console.log('scene 01')


        }

        if(timing02 > this.time && timing01 <= this.time)
        {


            for(let i = 0; i < this.dancingErrors.length; i++) {
                this.dancingErrors[i].valueInit();
                this.dancingErrors[i].ANIMATION_NUM = 2;
            }




            console.log('scene 02')

        }

        if(timing03 > this.time && timing02 <= this.time)
        {

            // if(timing02 + 10 > this.time && this.isAnimationReset == false)
            // {
            //     console.log('reset');
            //     this.resetAnimation();
            //
            //     this.isAnimationReset = true;
            //
            // }


            // this.isAnimationStarted = false;
            for(let i = 0; i < this.dancingErrors.length; i++) {
                this.dancingErrors[i].valueInit();
                this.dancingErrors[i].ANIMATION_NUM = 3;
            }
            // this.time = 0;

            console.log('scene 03')
        }


        if(timing04 > this.time && timing03 <= this.time)
        {

            if(this.time < timing03+2)
            {
                for(let i = 0; i < this.dancingErrors.length; i++) {
                    this.dancingErrors[i].valueInit();
                    this.dancingErrors[i].ANIMATION_NUM = 0;
                    this.dancingErrors[i].scaleDown();
                }
            }


            console.log('scene 04')

            if(this.time > timing04 -10)
            {
                for(let i = 0; i < this.dancingErrors.length; i++) {
                    this.dancingErrors[i].valueInit();
                    this.time = 0;
                    // this.isAnimationStarted = false;

                }
            }
        }



        console.log(this.time);
        console.log(this.startCameraAnimationTiming);


        let camerastart = this.manager.gui.values.cameraAnimationStartTiming*60;
        let cameraend = this.manager.gui.values.cameraAnimationStartTiming*60 + this.manager.gui.values.cameraAnimationDulation * 60;
        if(this.time >= camerastart && this.time < cameraend)
        {

            console.log('true');
            if(!this.isAnimationStarted)
            {
                this.cameraAnimation();
                this.isAnimationStarted = true;
            }

        }


        if(this.time >= cameraend )
        {
            // console.log('false');
            if(this.isAnimationStarted)
            {
                this.resetAnimation();
            }
            this.isAnimationStarted = false;
        }




        let errorOut = this.manager.gui.values.errorInTIming*60 + this.manager.gui.values.errorOutTiming * 60;
        let errorIn = this.manager.gui.values.errorInTIming*60;
        if(this.time >= errorIn && this.time < errorOut)
        {

            if(!this.isErrorIn)
            {
                for(let i =0; i < this.errors.length; i++)
                {
                    this.errors[i].start();
                }
            }

            this.isErrorIn = true;

        }


        if(this.time >= errorOut)
        {

            if(this.isErrorIn)
            {
                for(let i =0; i < this.errors.length; i++)
                {
                    this.errors[i].isAnimationLoop = false;
                }
            }

            this.isErrorIn = false;

        }


    }
}