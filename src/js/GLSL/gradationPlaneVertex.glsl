precision highp float;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec3 vPosition = position;
    vNormal = normal;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( offset.xyz + vPosition, 1.0 );
}