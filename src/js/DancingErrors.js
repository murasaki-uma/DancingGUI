'use strict'
import * as THREE from 'three'
import CurlNoise from './curlNoise';
import {TweenMax,Power2,Power4, TimelineLite} from "gsap";
const errorVertex = require('./GLSL/errorVertex.glsl');
const errorFragment = require('./GLSL/errorFragment.glsl');
const SimplexNoise = require('../../node_modules/simplex-noise');


export default class DancingErrors
{
    constructor(gui)
    {
        this.gui = gui;
        this.curlNoise = new CurlNoise();
        this.errorGuiPos = new THREE.Vector3(0,0,0);
        this.arrayErrorGuiPos = [];
        this.instanceCount = 20;
        this.errorGuiInterval = {value:0.0};
        this.errorOffsetAttribute;
        this.backgroundScale = {value:1.0};
        this.errors = [];
        this.tmpRecord = {x:0,y:0};
        this.time = 0;
        this.isMouseMove = false;
        this.walkAreaScale  = 0.0;
        this.mousePos =  new THREE.Vector2(0.0);
        this.trackedPos = new THREE.Vector2(0.0);
        this.recordPosition = [{x:0,y:0}];
        this.recordPosCount = 0;
        this.isRecord = false;

        this.debugTextRecordX = document.querySelector('.recordX');
        this.debugTextRecordY = document.querySelector('.recordY');
        this.debugTextMouseX = document.querySelector('.mouseX');
        this.debugTextMouseY = document.querySelector('.mouseY');
        this.debugTextRecordFrame = document.querySelector('.recordFrame');
        this.debugTextRecordStatus = document.querySelector('.recordStatus');


        this.isRecordPlay = false;
        this.simplex = new SimplexNoise();
        this.ANIMATION_NUM = 1;
        this.excursionRad = Math.PI/2;

        this.init();
    }

    init()
    {


        let texture = new THREE.TextureLoader().load('img/errorgui.png');
        let instances = this.instanceCount;
        let bufferGeometry = new THREE.BoxBufferGeometry( 36*0.7, 13*0.7, 1 );
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
            vector.set( x, y, z, i ).normalize();
            offsets.push( x + vector.x, y + vector.y, z + vector.z, i );
            number.push(i);
            // this.arrayErrorGuiPos.push(new THREE.Vector3(0,0,0));

        }
        this.errorOffsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 4 );

        // let numberAttribute = new THREE.InstancedBufferAttribute( new Int32Array( number ), 1 );

        geometry.addAttribute( 'offset', this.errorOffsetAttribute );
        geometry.addAttribute('normal', normal);
        // geometry.addAttribute('number', numberAttribute);
        let material = new THREE.ShaderMaterial( {
            uniforms: {
                map: { value: texture },
                gradationColor:{value : new THREE.Color(
                        this.gui.values.errorGuiColor[0]/255,
                        this.gui.values.errorGuiColor[1]/255,
                        this.gui.values.errorGuiColor[2]/255
                    )},
                scale:this.backgroundScale
            },
            // side:THREE.DoubleSide,
            vertexShader: errorVertex,
            fragmentShader: errorFragment,
            visible:this.gui.values.visibleDancingErrors
        } );



        this.errorGui = new THREE.Mesh( geometry, material );
        // this.scene.add( this.errorGui );


        this.gui.errorGuiColor.onChange((e)=>{
            this.errorGui.material.uniforms.gradationColor.value.r = e[0]/255;
            this.errorGui.material.uniforms.gradationColor.value.g = e[1]/255;
            this.errorGui.material.uniforms.gradationColor.value.b = e[2]/255;
        });


        this.gui.visibleErrors.onChange((e)=>{
            for(let error of this.errors)
            {
                for(let m of error.mesh.material)
                {
                    m.visible = e;
                }

            }

        });


        this.gui.visibleDancingErrors.onChange((e)=>{
            this.errorGui.material.visible = e;
        });

    }

    mouseMove(e)
    {
        let x = (e.x / window.innerWidth -0.5)*2;
        let y = (e.y / window.innerHeight - 0.5)*2;
        // console.log(x,y);

        this.mousePos.x = x;
        this.mousePos.y = y;


        this.isMouseMove = true;
    }

    resetAnimation()
    {
        TweenMax.to(this.errorGuiInterval , 1.0 , {
            value : 1.0,
            ease :Power2.easeInOut
        });

        TweenMax.to(this.backgroundScale , 4.0 , {
            value : 1.0,
            // delay : 0.5,
            ease :Power2.easeInOut
        });
    }

    animationStart()
    {
        TweenMax.to(this.errorGuiInterval , 1.5 , {
            value : this.gui.values.errorGuiInterval,
            // delay : 0.5,
            ease :Power2.easeInOut
        });

        TweenMax.to(this.backgroundScale , 4.0 , {
            value : 0.001,
            // delay : 0.5,
            ease :Power2.easeInOut
        });
    }

    getMesh()
    {
        return this.errorGui;
    }

    recordBegin()
    {
        this.recordPosCount = 0;
        this.recordPosition = [];
        this.isRecord = true;
    }

    recordEnd()
    {

        console.log('end');
        this.isRecord = false;

        this.saveJson(this.recordPosition);


    }


    saveJson=(storageObj)=>
    {
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj))
        let downloadLink = document.createElement('a')
        downloadLink.setAttribute("href",dataStr)
        downloadLink.setAttribute("download", "data" + new Date().getMilliseconds() +".json")
        downloadLink.click()
    }


    update()
    {


        this.trackedPos.x += (this.mousePos.x - this.trackedPos.x) * 0.05;
        this.trackedPos.y += (this.mousePos.y - this.trackedPos.y) * 0.05;


        if(this.isRecord)
        {
            this.recordPosition.push({x:this.trackedPos.x,y:this.trackedPos.y});
        }



        if(this.isMouseMove)
        {
            this.walkAreaScale +=(0.0 - this.walkAreaScale) * 0.1;
        }
        else {
            this.walkAreaScale +=(1.0 - this.walkAreaScale) * 0.1;
        }
        this.time ++;
        let xyscale = 0.010;
        let p = this.curlNoise.getCurlNoise(new THREE.Vector3(
            this.errorOffsetAttribute.array[0] * this.gui.values.dancingErrorNoiseScaleX,
            this.errorOffsetAttribute.array[1] * this.gui.values.dancingErrorNoiseScaleY,
            this.time*0.002
        ));







        let mousex = this.trackedPos.x * this.gui.values.dancingErrorTrackAreaWidth;
        let mousey = -this.trackedPos.y * this.gui.values.dancingErrorTrackAreaHeight;


        if(this.isRecordPlay) {

            if (this.isRecord) {
                this.errorGuiPos.set(
                    // px * this.walkAreaScale + mousex,
                    // py * this.walkAreaScale + mousey,
                    mousex,
                    mousey,
                    0
                );
            } else {


                if (this.recordPosition.length > 0) {


                    if (this.recordPosCount < this.recordPosition.length) {


                        this.tmpRecord.x = this.recordPosition[this.recordPosCount].x;
                        this.tmpRecord.y = this.recordPosition[this.recordPosCount].y;
                        this.recordPosCount++;

                    } else {

                        let last = new THREE.Vector2(this.tmpRecord.x, this.tmpRecord.y);
                        let first = new THREE.Vector2(this.recordPosition[0].x, this.recordPosition[0].y);
                        console.log(first, last);
                        if (first.distanceTo(last) > 0.01) {
                            this.tmpRecord.x += (first.x - this.tmpRecord.x) * 0.1;
                            this.tmpRecord.y += (first.y - this.tmpRecord.y) * 0.1;
                        }
                        else {
                            this.recordPosCount = 0;
                        }


                    }


                    this.errorGuiPos.set(
                        // px * this.walkAreaScale + mousex,
                        // py * this.walkAreaScale + mousey,
                        this.tmpRecord.x * this.gui.values.dancingErrorTrackAreaWidth,
                        -this.tmpRecord.y * this.gui.values.dancingErrorTrackAreaHeight,
                        0
                    );
                }
            }
        }
        else
        {
            /************ animation 0 **********/
            if(this.ANIMATION_NUM == 0)
            {

                let px =  p.x * this.gui.values.dancingErrorWorkAreaWidth + this.gui.values.dancingErrorOffsetX;
                let py = p.z * this.gui.values.dancingErrorWorkAreaHeight + this.gui.values.dancingErrorOffsetY;


                this.errorGuiPos.set(
                    // px * this.walkAreaScale + mousex,
                    // py * this.walkAreaScale + mousey,
                    px,
                    py,
                    // this.tmpRecord.x * this.gui.values.dancingErrorTrackAreaWidth,
                    // -this.tmpRecord.y * this.gui.values.dancingErrorTrackAreaHeight,
                    0
                );
            }

            /************ animation 1 **********/


            if(this.ANIMATION_NUM == 1)
            {

                // this.curlNoise.snoise

                let n = this.simplex.noise2D(this.errorOffsetAttribute.array[0]*0.04+this.excursionRad, this.time*0.001);
                console.log(n);
                let rad = this.gui.values.dancingErrorWorkAreaWidth*0.1 * n;

                let px = Math.cos(this.time*0.02+ this.excursionRad) * (rad+this.gui.values.dancingErrorWorkAreaWidth);
                let py = Math.sin(this.time*0.02+ this.excursionRad) * (rad+this.gui.values.dancingErrorWorkAreaHeight);


                this.errorGuiPos.set(
                    // px * this.walkAreaScale + mousex,
                    // py * this.walkAreaScale + mousey,
                    px,
                    py,
                    // this.tmpRecord.x * this.gui.values.dancingErrorTrackAreaWidth,
                    // -this.tmpRecord.y * this.gui.values.dancingErrorTrackAreaHeight,
                    0
                );
            }

        }



        this.arrayErrorGuiPos.unshift(this.errorGuiPos.clone());

        // console.log(this.arrayErrorGuiPos.length);
        if(this.arrayErrorGuiPos.length > this.instanceCount){
            this.arrayErrorGuiPos.pop();
        }


        if(this.time % 2 == 0)
        {
            for(let i = 0; i < this.arrayErrorGuiPos.length; i++ )
            {

                this.errorOffsetAttribute.array[(19-i)*4] = this.arrayErrorGuiPos[i].x;
                this.errorOffsetAttribute.array[(19-i)*4+1] = this.arrayErrorGuiPos[i].y;
                this.errorOffsetAttribute.array[(19-i)*4+2] = -(this.errorGuiInterval.value  / this.arrayErrorGuiPos.length)*i;

            }
        }



        this.debugTextRecordFrame.innerHTML = "record frame: " + this.recordPosCount;
        this.debugTextRecordStatus.innerHTML = "isRecording: " + this.isRecord;
        // if()
        // {
        //
        // }
        this.debugTextRecordX.innerHTML = Math.floor(this.tmpRecord.x*100)/100;
        this.debugTextRecordY.innerHTML = Math.floor(this.tmpRecord.y*100)/100;

        this.debugTextMouseX.innerHTML = Math.floor(this.trackedPos.x*100)/100;
        this.debugTextMouseY.innerHTML = Math.floor(this.trackedPos.y*100)/100;


        this.errorOffsetAttribute.needsUpdate = true;

        this.isMouseMove = false;



    }


}