precision highp float;

attribute vec3 offset;
attribute vec3 color;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vColor;
attribute vec2 scales;
varying vec3 vOffset;


void main() {
    vec3 vPosition = position;
    vPosition.x *= scales.x;
    vPosition.y *= scales.y;
    vNormal = normal;
    vOffset = offset;
//    vNumber = offset.w;
    vColor = color;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( offset.xyz + vPosition, 1.0 );
}