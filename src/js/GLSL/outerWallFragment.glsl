precision highp float;
uniform sampler2D map;
varying vec2 vUv;
varying vec3 vNormal;
uniform vec3 gradationColor;
varying float vNumber;
uniform float scale;
void main() {

    vec3 color = vec3(1.);

    gl_FragColor =vec4(color , 1.);

}