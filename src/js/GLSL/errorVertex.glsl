precision highp float;

attribute vec4 offset;
attribute vec3 discreate;

varying float vNumber;
varying vec2 vUv;
varying vec3 vNormal;

uniform float scale;
uniform float baseWindowScale;


void main() {
    vec3 vPosition = position;
    vPosition *= baseWindowScale;
    vPosition *= scale;
    vNormal = normal;
    vNumber = offset.w;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( offset.xyz + vPosition, 1.0 );
}