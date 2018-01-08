precision highp float;
//uniform mat4 modelViewMatrix;
//uniform mat4 projectionMatrix;
//attribute vec3 position;
attribute vec4 offset;
//attribute vec3 normal;
//attribute int number;
varying float vNumber;
//attribute vec2 uv;
varying vec2 vUv;
varying vec3 vNormal;
void main() {
    vec3 vPosition = position;
    vNormal = normal;
    vNumber = offset.w;
//    vec3 vcV = cross( orientation.xyz, vPosition );
//    vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( offset.xyz + vPosition, 1.0 );
}