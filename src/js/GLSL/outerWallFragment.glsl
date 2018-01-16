precision highp float;
uniform sampler2D map;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vOffset;
uniform vec3 gradationColor;
varying float vNumber;
uniform float width;
uniform float threshold;
//uniform float scale;
varying vec3 vColor;

const vec3 green = vec3(27./255.,225./255.,173./255.);
const vec3 purple = vec3(125./255.,31./255.,164./255.);
void main() {

    vec3 color = vec3(1.);

    float d = vOffset.x / (threshold*width)+0.5;
    color = mix(green,purple,d);
    if(vOffset.x > threshold*width - width/2.)
    {
        discard;
    }
    gl_FragColor =vec4(color , 1.);

}