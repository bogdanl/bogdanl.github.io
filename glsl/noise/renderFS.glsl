uniform vec2 nearFar;
uniform vec3 small;
uniform vec3 big;
uniform vec3 nColor;
uniform sampler2D positions;
uniform float timer;

varying float size;
varying vec4 newpos;
// varying vec2 vTexCoords;
// varying float pointColor;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// value between 0 and 1 (percent)   
vec3 toRGB(float value) {
    vec3 rgb = vec3(0.);

    if (0. <= value && value <= 1./8.) {
        rgb.x = 0.;
        rgb.y = 0.;
        rgb.z = 4.*value + .5; // .5 - 1 // b = 1/2
    } else if (1./8. < value && value <= 3./8.) {
        rgb.x = 0.;
        rgb.y = 4.*value - .5; // 0 - 1 // b = - 1/2
        rgb.z = 1.; // small fix
    } else if (3./8. < value && value <= 5./8.) {
        rgb.x = 4.*value - 1.5; // 0 - 1 // b = - 3/2
        rgb.y = 1.;
        rgb.z = -4.*value + 2.5; // 1 - 0 // b = 5/2
    } else if (5./8. < value && value <= 7./8.) {
        rgb.x = 1.;
        rgb.y = -4.*value + 3.5; // 1 - 0 // b = 7/2
        rgb.z = 0.;
    } else if (7./8. < value && value <= 1.) {
        rgb.x = -4.*value + 4.5; // 1 - .5 // b = 9/2
        rgb.y = 0.;
        rgb.z = 0.;
    } else {    // should never happen - value > 1
        rgb.x = .5;
        rgb.y = 0.;
        rgb.z = 0.;
    }
    return rgb;
}

void main()
{   

    // int colR = colInt / 255;
    // float colG = map(mod(pointColor, .3), 1. / 3., 2. / 3., 0., 255.);
    // float colB = map(pointColor, 2. / 3., 1., 0., 255.);

    // gl_FragColor = vec4(toRGB(pointColor), 1.);
    // gl_FragColor = vec4(pointColor, 0., 0., 1.);

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