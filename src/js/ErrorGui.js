'use strict'
import * as THREE from 'three'
const vertex = require('./GLSL/errorAnimationVertex.glsl');
const fragment = require('./GLSL/errorAnimationFragment.glsl');
const fragment_color = require('./GLSL/errorAnimationColorFragment.glsl');
import {TweenMax,Power2,Power4, TimelineLite} from "gsap";


class ErrorGuiAnimationSettings {
    constructor()
    {
        this.map = new Map();
        this.init();
    }

    init()
    {
        this.map.set('Loiter',false);
        // this.map.set('Restart',true);
        this.map.set('ScaleDown',true);

    }

    set(name,value)
    {
        this.map.set(name,value);
    }

    get(name)
    {
        return this.map.get(name);
    }

}
export default class ErrorGui
{
    constructor(width,height, gui, texture,grad)
    {
        this.gui = gui;
        this.width = width;
        this.height = height;
        this.mesh;
        this.uniforms = {};

        this.radian = 0.0;

        this.isStart= false;
        this.gradThreshold = {value:0.0};

        this.scale = {value:1.0};

        this.guiTexture = texture;
        this.gradTexture = grad;
        this.posisiton = new THREE.Vector3();
        this.isWire = {value:true};
        this.posisition = {value:new THREE.Vector3()};
        this.scale = {value:0};
        this.animationSettings = new ErrorGuiAnimationSettings();
        this.isLoiter = false;
        this.modifiedPos = {value:new THREE.Vector3()};
        this.sideColor = {value:new THREE.Color()};

        this.isAnimationLoop = true;


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
            height:{value:this.height},
            modified:this.modifiedPos,
            scale:{value:0.0},
        };
        let geo = new THREE.BoxGeometry(this.width,this.height, 1);
        let mat = new THREE.ShaderMaterial({
            uniforms:this.uniforms,
            fragmentShader:fragment,
            vertexShader:vertex,
            transparent:true,
            visible:this.gui.values.visibleErrors,

        });


        this.sideColor.value.setRGB(
            this.gui.values.errorGuiSide[0]/255,
            this.gui.values.errorGuiSide[1]/255,
            this.gui.values.errorGuiSide[2]/255,
        );

        let sideUniforms = {
            map:{value:this.guiTexture},
            gradMap:{value:this.gradTexture},
            threshold:this.gradThreshold,
            isWire:this.isWire,
            width :{value:this.width},
            height:{value:this.height},
            modified:this.modifiedPos,
            scale:{value:1.0},
            u_color:this.sideColor
        };

        let matSides = new THREE.ShaderMaterial({
            uniforms:sideUniforms,
            fragmentShader:fragment_color,
            vertexShader:vertex,
            visible:this.gui.values.visibleErrors,
        });

        let mats = [
            matSides,
            matSides,
            matSides,
            matSides,
            mat,
            matSides,//ura
        ]


        this.mesh = new THREE.Mesh(geo,mats);





        this.gui.gradThreshold.onChange((e)=>{
            this.gradThreshold.value = e;
        });



        console.log(this.mesh);

        this.reset();


    }


    getMesh()
    {
        return this.mesh;
    }

    start()
    {

        // this.posisition.set(
        //     Math.random() * (this.gui.values.errorPopUpRangeX_max-this.gui.values.errorPopUpRangeX_min)+this.gui.values.errorPopUpRangeX_min,
        //     Math.random() * (this.gui.values.errorPopUpRangeY_max-this.gui.values.errorPopUpRangeY_min)+this.gui.values.errorPopUpRangeY_min,
        //     Math.random() * (this.gui.values.errorPopUpRangeZ_max-this.gui.values.errorPopUpRangeZ_min)+this.gui.values.errorPopUpRangeZ_min
        // );
        //
        // this.mesh.position.set(
        //     this.posisition.x,
        //     this.posisition.y,
        //     this.posisition.z
        // );
        this.radian += Math.random()-0.5;

        let vec = new THREE.Vector3(
            Math.random()*0.1 - 0.05,
            Math.random()*0.7 + 0.3,
            Math.random()*0.1 - 0.05,
        );

        // vec.multiplyScalar(Math.random());
        let delay = 0.5*Math.random();

        TweenMax.to(this.posisition.value , this.gui.values.errorPopUpDuration+delay*0.1 , {
            x:this.gui.values.diffErrorPosX*vec.y * Math.sin((this.radian) + vec.x),
            y:this.gui.values.diffErrorPosY*vec.y * Math.cos((this.radian) + vec.z),
            z:Math.random()*0.1,
            // value:1.0,
            delay : delay,
            // ease :Power2.easeInOut,
            onUpdate:()=>{

            },
            onStart:()=>{
                this.uniforms.isWire.value = true;
            }
        });

        // console.log('threthold')

        // TweenMax.to(this.gradThreshold , this.gui.values.gradThresholdDulation+delay*0.1 , {
        //     value:1.0,
        //     delay : delay,
        //     // ease :Power2.easeInOut,
        //     // onUpdate:()=>{console.log(this.gradThreshold.value)}
        // });
        TweenMax.to(this.scale , this.gui.values.errorPopUpDuration+delay*0.1 , {
            value:1.0,
            delay : delay,
            onComplete:()=>{




                this.uniforms.isWire.value = false;
                if(this.animationSettings.get("Loiter"))
                {
                    if(this.isAnimationLoop) {
                        this.start();
                    }

                }

                if(this.animationSettings.get("ScaleDown"))
                {
                    // setTimeout(()=>{

                        // this.reset();
                        // this.start();
                        this.scaleDown();
                    // }, 1000*Math.random());

                    // this.uniforms.isWire.value = true;
                }


            }
            // ease :Power2.easeInOut
        });

        this.animationSettings.set("Loiter",this.gui.values.errorsLoiter);
        this.gui.errorsLoiter.onChange((e)=>{
            this.animationSettings.set("Loiter",e);
        });


    }

    scaleDown()
    {
        TweenMax.to(this.posisition.value , 1.0 , {
            z:-Math.random() * 10 - 50,
            // value:1.0,
            delay : 0,
            // ease :Power2.easeInOut,
            onUpdate:()=>{

            },
            onStart:()=>{
                // this.uniforms.isWire.value = true;
            }
        });

        TweenMax.to(this.scale , 2.0 + Math.random() , {
            value : 0.001,
            // delay : 0.5,
            onComplete:()=>{
                this.reset();

                if(this.isAnimationLoop) {

                    this.start();
                }
            }

        });
    }

    reset()
    {

        // this.uniforms.isWire.value = false;
        // if(this.gui.values.errorsLoiter != false)
        // {
        //     this.isLoiter = this.gui.values.errorsLoiter;
        // }
        //
        //
        // this.scale.value = 0.0001;


        // this.mesh.translate(
        //
        //     -1,
        //     this.posisition
        // );



        this.posisition.value.set(
            Math.random() * (this.gui.values.errorPopUpRangeX_max-this.gui.values.errorPopUpRangeX_min)+this.gui.values.errorPopUpRangeX_min,
            Math.random() * (this.gui.values.errorPopUpRangeY_max-this.gui.values.errorPopUpRangeY_min)+this.gui.values.errorPopUpRangeY_min,
            Math.random() * (this.gui.values.errorPopUpRangeZ_max-this.gui.values.errorPopUpRangeZ_min)+this.gui.values.errorPopUpRangeZ_min
        );



    }

    onKeyDown = (e) =>
    {
        if(e.key == 't')
        {
            // this.isStart = !this.isStart;
            // if(this.isStart)
            // {
                this.start();
            // } else
            // {
                // this.reset();
            // }
        }



        if(e.key == 'a')
        {
            // TweenMax.to(this.mesh.position , 2.5, {
            //     z : 0,
            //     // delay : 0.5,
            //     ease :Power2.easeInOut
            // });
            //
            //
            // TweenMax.to(this.scale , 3.0, {
            //     value : 0.001,
            //     // delay : 0.5,
            //     ease :Power2.easeInOut,
            //     onUpdate:()=>{
            //         this.mesh.scale.set(
            //             this.scale.value,
            //             this.scale.value,
            //             this.scale.value
            //         );
            //     },
            //
            // });
        }

        if(e.key == 'r')
        {
            this.reset();

        }

        if(e.key== 'l')
        {
            this.isAnimationLoop = false;
        }

    }


    update(frame)
    {

        // if(frame%4 == 0)
        // {
            this.modifiedPos.value.set(
                this.posisition.value.x,
                this.posisition.value.y,
                this.posisition.value.z,

            );

            for(let m of this.mesh.material)
            {
                m.uniforms.scale.value = this.scale.value;
            }

        //     this.posisition.normalize();
        //     this.mesh.translation.set(
        //
        //     );
        //     // this.mesh.translateY(this.posisition.y);
        //     // this.mesh.translateZ(this.posisition.z);
        //
        //     this.mesh.scale.set(
        //         this.scale.value,
        //         this.scale.value,
        //         this.scale.value
        //     );
        }


        // console.log(this.gradThreshold.value);
    // }


}