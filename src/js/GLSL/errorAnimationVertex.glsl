precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 modified;
uniform float scale;
void main() {
    vPosition = position;
    vPosition *= scale;
    vPosition += modified;
    vNormal = normal;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
}