'use strict'
import * as THREE from 'three';
const SimplexNoise = require('../../node_modules/simplex-noise/simplex-noise');
// console.log(SimplexNoise);
export default class Curlnoise {

    constructor(){
        this.snoise = new SimplexNoise();
    }

    snoiseVec3(x) {

        let s = this.snoise.noise3D(x.x, x.y, x.z);
        let s1 = this.snoise.noise3D(x.y - 19.1, x.z + 33.4, x.x + 47.2);
        let s2 = this.snoise.noise3D(x.z + 74.2, x.x - 124.5, x.y + 99.4);
        let c = new THREE.Vector3(s, s1, s2);
        return c;

    }

    getCurlNoise(p) {

        let e = 0.1;
        let dx = new THREE.Vector3(e, 0.0, 0.0);
        let dy = new THREE.Vector3(0.0, e, 0.0);
        let dz = new THREE.Vector3(0.0, 0.0, e);


        var _p = new THREE.Vector3(p.x, p.y, p.z).sub(dx);
        let p_x0 = this.snoiseVec3(_p);

        _p = new THREE.Vector3(p.x, p.y, p.z).add(dx);
        let p_x1 = this.snoiseVec3(_p);

        _p = new THREE.Vector3(p.x, p.y, p.z).sub(dy);
        let p_y0 = this.snoiseVec3(_p);

        _p = new THREE.Vector3(p.x, p.y, p.z).add(dy);
        let p_y1 = this.snoiseVec3(_p);

        _p = new THREE.Vector3(p.x, p.y, p.z).sub(dz);
        let p_z0 = this.snoiseVec3(_p);

        _p = new THREE.Vector3(p.x, p.y, p.z).add(dz);
        let p_z1 = this.snoiseVec3(_p);

        let x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
        let y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
        let z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

        //console.log(p_z0);
        let divisor = 1.0 / ( 2.0 * e );
        let noisevec = new THREE.Vector3(x, y, z);
        noisevec.multiplyScalar(divisor);
        return noisevec;

    }
}