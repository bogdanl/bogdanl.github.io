uniform vec2 nearFar;
uniform vec3 small;
uniform vec3 big;
uniform vec3 nColor;
uniform sampler2D positions;

varying float size;
// varying vec2 vTexCoords;
// varying vec4 nColor;

void main()
{
    // gl_FragColor = vec4( small, .2 );
    // gl_FragColor = nColor;
    // if( size > 1. )
    // {
	vec4 textureColor = texture2D(positions, gl_FragCoord.yz);

	// gl_FragColor = vec4(vec3(1.) - textureColor.rgb, 1.);
    gl_FragColor = vec4( big * vec3( 1. - length( gl_PointCoord.xy-vec2(.5) ) ) * 1.5, .95 );
    // gl_FragColor = vec4(vec3(1.) - gl_FragColor.rgb, 1.);
    // }

}