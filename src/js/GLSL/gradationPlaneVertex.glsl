precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
}