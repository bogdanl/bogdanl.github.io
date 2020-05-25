

//float texture containing the positions of each particle
uniform sampler2D positions;
uniform vec2 nearFar;
uniform float pointSize;

varying float size;
// varying vec4 nColor;
varying vec3 vPosition;

// attribute vec3 newcolor;

float rand(float n){return fract(sin(n) * 43758.5453123);}

void main() {
	// nColor = vec4(newcolor, 1.);
    //the mesh is a normalized square so the uvs = the xy positions of the vertices
    vec3 pos = texture2D( positions, position.xy ).xyz;
    //pos now contains the position of a point in space taht can be transformed
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    //size
    gl_PointSize = size = rand(position.x) * pointSize * rand(position.y);
    // gl_PointSize = size = max( 3., rand( step( 1. - ( 1. / 512. ), position.x ) ) * pointSize * 4.);


}