precision highp float;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
uniform bool isWire;
uniform float width;

uniform float height;
uniform vec3 modified;
uniform float scale;
uniform vec3 u_color;
void main() {


    if(isWire)
    {
        discard;

    }
    gl_FragColor =vec4(u_color , 1.);

}