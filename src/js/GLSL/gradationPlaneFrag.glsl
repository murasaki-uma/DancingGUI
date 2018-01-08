precision highp float;
varying vec2 vUv;
uniform sampler2D gradationTex;
uniform sampler2D colorNoise;
uniform float threshold;
uniform float width;
varying vec3 vPosition;
void main() {


    vec4 grad = texture2D( gradationTex, vUv );
 	float zr = 1.0-texture2D( gradationTex, vUv ).x;

    // sample neighbor pixels
	float ao = 0.0;
	for( int i=0; i<8; i++ )
	{
        vec2 off = -1.0 + 2.0*texture2D( colorNoise, (gl_FragCoord.xy + 23.71*float(i))/vec2(256.,256.) ).xz;

        float z = 1.0-texture2D( gradationTex, (gl_FragCoord.xy + floor(off*16.0))/vec2(50.,25).xy ).x;
        ao += clamp( (zr-z)/0.1, 0.0, 1.0);
	}
    // average down the occlusion
    ao = clamp( 1.0 - ao/8.0, 0.1, 0.5 );

	vec3 col = vec3(ao);


    vec4 noisetex = 1.0-texture2D( colorNoise, vUv*4. );



    if(noisetex.x > 0.5)
    {
        noisetex.x = 0.2;
    }


    if(vPosition.x < -(threshold)*width*2. +width)
    {
        discard;
    }





    gl_FragColor =vec4(grad.xyz+noisetex.x*0.3,1.0);

}