uniform vec2 nearFar;
uniform vec3 small;
uniform vec3 big;
uniform vec3 nColor;
uniform sampler2D positions;
uniform float timer;

varying float size;
varying vec3 newpos;
// varying vec2 vTexCoords;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main()
{
    // gl_FragColor = vec4( small, .2 );
    // float t = map(mod(timer, 5.), 0., 5., 0., 1.);
    // float i = map(abs(sin(timer)), 0., 1., .0004, .01);
    // gl_FragColor = vec4(abs(sin(newpos.x)), abs(cos(newpos.y)), abs(tan(newpos.z)), 1.);
    // gl_FragColor = vec4(abs(.5 - gl_FragCoord.x) * 2., 0., 0., 1.);
    // if( size > 1. )
    // {
	// vec4 textureColor = texture2D(positions, gl_FragCoord.yz);

	// gl_FragColor = vec4(vec3(1.) - textureColor.rgb, 1.);
    // gl_FragColor = vec4(nColor, 1.) * vec4( big * vec3( 1. - length( gl_PointCoord.xy-vec2(.5) ) ) * 1.5, .95 );
    // gl_FragColor = vec4(vec3(1.) - gl_FragColor.rgb, 1.);
    // }

    gl_FragColor = vec4(nColor, 1.);

}