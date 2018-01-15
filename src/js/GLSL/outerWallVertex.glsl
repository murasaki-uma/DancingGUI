precision highp float;

attribute vec4 offset;
varying vec2 vUv;
varying vec3 vNormal;
void main() {
    vec3 vPosition = position;
    vNormal = normal;
//    vNumber = offset.w;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( offset.xyz + vPosition, 1.0 );
}