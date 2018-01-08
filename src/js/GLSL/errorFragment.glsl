precision highp float;
uniform sampler2D map;
varying vec2 vUv;
varying vec3 vNormal;
uniform vec3 gradationColor;
varying float vNumber;
uniform float scale;
void main() {

    float diffuse  = clamp(dot(vNormal, vec3(0.,0.,1.)), 0.1, 1.0);
    vec3 color = vec3(1.);
//    if(diffuse > 0.1)
//    {
////        color = texture2D( map, vUv ).xyz;
//        color = vec3(0.7,1.,0.7);
//    }
//    {
//        color = vec3(1.0,0.7,0.7);
////        color = vNormal;
//    }

//gl_FragColor = texture2D( map, vUv );
    vec3 texColor = texture2D( map, vUv ).xyz;
//    vec3 gradationColor = vec3(142./255.,201./255.,219./255.);
    float per = (vNumber+1.)/20.;
    color = mix(gradationColor,texColor,per);
    color = mix(color,texColor,scale);

    gl_FragColor =vec4(color , 1.);

}