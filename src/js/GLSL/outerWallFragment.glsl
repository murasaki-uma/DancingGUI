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




vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}


vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



void main() {

    vec3 color = vec3(1.);

    float d = vOffset.x / (threshold*width)+0.5;
    color = mix(green,purple,d);
    if(vOffset.x > threshold*width - width/2.)
    {
        discard;
    }

    float th = sin(-time*0.2+vOffset.x*0.01) + cos(-time*0.2 + vOffset.y*0.01)*0.5;
    if( 0.0> th && th < 0.5)
    {
        discard;
    }


    if(vPosition.x > 0.)
    {
//        color *= 0.8;
    } else
    {
        color *= 1.7;
    }

//    vec3 hsv = rgb2hsv(color);
//    hsv.z *= 2.0;
//
//    color = hsv2rgb(color);

    gl_FragColor =vec4(color , 1.);

}