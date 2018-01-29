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
uniform float time;
varying vec3 vColor;
varying vec3 vPosition;
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

    if( 0.0> sin(-time*0.2+vOffset.x*0.01))
    {
        discard;
    }


    if(vPosition.x > 0.)
    {
        color *= 0.8;
    }
    gl_FragColor =vec4(color , 1.);

}