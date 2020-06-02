

//float texture containing the positions of each particle
uniform sampler2D positions;
uniform vec2 nearFar;
uniform float pointSize;

// varying float size;
// varying vec2 vTexCoords;

// attribute vec3 newcolor;

float rand(float n){return fract(sin(n) * 43758.5453123);}

void main() {
    vec3 pos = texture2D(positions, position.xy).xyz;
    //pos now contains the position of a point in space taht can be transformed
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    //size
    gl_PointSize = rand(position.x) * pointSize * rand(position.y);
    // gl_PointSize = size = max( 3., rand( step( 1. - ( 1. / 512. ), position.x ) ) * pointSize * 4.);
}