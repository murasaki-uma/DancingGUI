'use strict'
import * as THREE from 'three'

const vertex = require('./GLSL/outerWallVertex.glsl');
const fragment = require('./GLSL/outerWallFragment.glsl');
export default class OuterWall{
    constructor(gui)
    {

        this.gui = gui;
        this.mesh;
        this.uniforms = {};
        this.offsetAttribute;

        this.init();
    }
    init()
    {


        let xSize = 20;
        let ySize = 20;
        let instances = xSize*ySize;
        let bufferGeometry = new THREE.PlaneBufferGeometry( 1, 1 );
        // copying data from a simple box geometry, but you can specify a custom geometry if you want
        let geometry = new THREE.InstancedBufferGeometry();
        geometry.index = bufferGeometry.index;
        geometry.attributes.position = bufferGeometry.attributes.position;
        geometry.attributes.uv = bufferGeometry.attributes.uv;
        // per instance data
        var offsets = [];
        // var orientations = [];
        // var vector = new THREE.Vector4();
        // var x, y, z, w;
        for ( var x = 0; x < xSize; x ++ ) {
            for (var y = 0; y < ySize; y++) {
                // offsets
                let _x = -xSize/2 + (x);
                let _y = -ySize/2 + (y);
                let _z = 0;

                offsets.push(_x, _y, _z);

            }
        }
        this.offsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 );

        geometry.addAttribute( 'offset', this.offsetAttribute );
        // material
        var material = new THREE.ShaderMaterial( {
            uniforms: {
                // map: { value: new THREE.TextureLoader().load( 'textures/crate.gif' ) }
            },
            vertexShader: vertex,
            fragmentShader: fragment
        } );
        this.mesh = new THREE.Mesh( geometry, material );

    }

    getMesh()
    {
        return this.mesh;
    }
    update()
    {

    }
}