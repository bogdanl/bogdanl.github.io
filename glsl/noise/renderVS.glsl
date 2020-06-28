

//float texture containing the positions of each particle
uniform sampler2D positions;
uniform float pointSize;
varying vec4 newpos;

varying float pointColor;
// varying float size;
// varying vec2 vTexCoords;

// attribute vec3 newcolor;

uniform vec3 mouse;

float rand(float n){return fract(sin(n) * 43758.5453123);}

void main() {
    vec4 pos = texture2D(positions, position.xy).xyzw;
    // newpos = pos;
    pointColor = pos.w;
    //pos now contains the position of a point in space that can be transformed
    if (abs(pos.y-mouse.y) < 1000.) {
    	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 0.);

    } else {
    	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 0.);

    }
    //size
    gl_PointSize = rand(position.x) * pointSize * rand(position.y);
    // gl_PointSize = size = max( 3., rand( step( 1. - ( 1. / 512. ), position.x ) ) * pointSize * 4.);
}