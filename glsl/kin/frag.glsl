
uniform sampler2D map;

varying vec2 vUv;

void main() {

    vec4 color = texture2D( map, vUv );
    if (color.r > 0.65 && color.g > 0.65 && color.b > 0.65)
        discard;
    gl_FragColor = vec4( color.r, color.g, color.b, 0.2 );

}
