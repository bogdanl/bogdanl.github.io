//basic simulation: displays the particles in place.
uniform sampler2D texture;
varying vec2 vUv;
void main() {

    vec3 pos = texture2D( texture, vUv ).rgb;
    gl_FragColor = vec4( pos,1.0 );
}