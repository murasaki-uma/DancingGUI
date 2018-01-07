precision highp float;
uniform sampler2D map;
varying vec2 vUv;
varying vec3 vNormal;
void main() {

    float diffuse  = clamp(dot(vNormal, vec3(0.,0.,1.)), 0.1, 1.0);
    vec3 color = vec3(1.);
    if(diffuse > 0.1)
    {
//        color = texture2D( map, vUv ).xyz;
        color = vec3(0.7,1.,0.7);
    }
    {
        color = vec3(1.0,0.7,0.7);
//        color = vNormal;
    }

//gl_FragColor = texture2D( map, vUv );

    gl_FragColor =vec4(texture2D( map, vUv ).xyz , 1.);

}