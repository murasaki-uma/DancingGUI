'use strict'
import * as THREE from 'three'
import {Power2, TweenMax} from "gsap";

const vertex = require('./GLSL/outerWallVertex.glsl');
const fragment = require('./GLSL/outerWallFragment.glsl');
export default class OuterWall{
    constructor(gui,width,height,xSize,ySize, curlNoise)
    {

        this.curlNoise = curlNoise;
        console.log(this.curlNoise);
        this.gui = gui;
        this.mesh;
        this.uniforms = {};
        this.offsetAttribute;

        this.xSize = xSize;
        this.ySize = ySize;
        this.width = width;
        this.height = height;

        this.threshold = {value:0.0};


        this.init();
    }
    init()
    {


        window.addEventListener('keydown', this.onKeyDown);
        let bufferGeometry = new THREE.PlaneBufferGeometry( 1, 1 );
        // copying data from a simple box geometry, but you can specify a custom geometry if you want
        let geometry = new THREE.InstancedBufferGeometry();
        geometry.index = bufferGeometry.index;
        geometry.attributes.position = bufferGeometry.attributes.position;
        geometry.attributes.uv = bufferGeometry.attributes.uv;
        // per instance data
        var offsets = [];
        var colors = [];
        var scales = [];
        // var orientations = [];
        // var vector = new THREE.Vector4();
        // var x, y, z, w;

        let yStep = this.height/this.ySize;

        let xStep = this.width/12/5;

        // let maxWidth = 60;
        let counter = 0;
        let time = new Date().getMilliseconds();
        for ( let y = 0; y < this.ySize; y ++ ) {
            let widthCount = 0;
            let seedStep = Math.random()*0.001;
           while (widthCount < this.width){

               counter += 0.002+seedStep;
               let _y = y*yStep - this.height/2;


               let pre = widthCount;
               let noise = this.curlNoise.getCurlNoise(new THREE.Vector3(time,_y*0.002,counter));
               // console.log(noise);
               noise.x = Math.abs(noise.x*0.5);
               // noise.y = Math.abs(noise.y);
               // noise.z = Math.abs(noise.z);
               // noise = Math.min(noise,)
               let width = Math.floor(noise.x*xStep*3);
               console.log(width);
               colors.push(Math.random(),Math.random(),Math.random());



               if(widthCount + width > this.width)
               {

                   width -= ((widthCount + width)-this.width);
               }

               if((this.width - (widthCount + width)) < Math.floor(xStep*2) )
               {

                   width += (this.width - (widthCount + width));
               }

               widthCount += width;

               let _x = pre + width/2 - this.width/2;
               let _z = 0;
               offsets.push(_x, _y, _z);
               scales.push(width,yStep);
            }
        }
        // console.log(scaleXs);
        this.offsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 );

        geometry.addAttribute( 'offset', this.offsetAttribute );
        geometry.addAttribute( 'color', new THREE.InstancedBufferAttribute( new Float32Array( colors ), 3 ));
        geometry.addAttribute( 'scales', new THREE.InstancedBufferAttribute( new Float32Array( scales ), 2 ));
        // material
        var material = new THREE.ShaderMaterial( {
            uniforms: {
                width:{value:this.width},
                threshold:this.threshold
                // map: { value: new THREE.TextureLoader().load( 'textures/crate.gif' ) }
            },
            vertexShader: vertex,
            fragmentShader: fragment
        } );
        this.mesh = new THREE.Mesh( geometry, material );

    }

    onKeyDown =(e)=>
    {
        if(e.key == 't')
        {
            TweenMax.to(this.threshold , 2.0 , {
                value:1.0,
                // delay : 2.0 ,
                ease :Power2.easeInOut,
                onUpdate:()=>{
                    console.log(this.threshold)
                }
            });
        }


        if(e.key == 'r')
        {
            TweenMax.to(this.threshold , 2.0 , {
                value:0.0,
                // delay : 2.0 ,
                ease :Power2.easeInOut
            });
        }
    }

    getMesh()
    {
        return this.mesh;
    }
    update()
    {

    }
}