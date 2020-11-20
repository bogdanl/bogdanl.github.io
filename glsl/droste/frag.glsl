#define PI 3.14159

vec2 cInverse(vec2 a) { return	vec2(a.x,-a.y)/dot(a,a); }
vec2 cMul(vec2 a, vec2 b) {	return vec2( a.x*b.x -  a.y*b.y,a.x*b.y + a.y * b.x); }
vec2 cDiv(vec2 a, vec2 b) {	return cMul( a,cInverse(b)); }
vec2 cExp(vec2 z) {	return vec2(exp(z.x) * cos(z.y), exp(z.x) * sin(z.y)); }
vec2 cLog(vec2 a) {	float b =  atan(a.y,a.x); if (b>0.0) b-=2.0*PI;return vec2(log(length(a)),b);}

uniform sampler2D vTexture;
uniform float time;
uniform vec2 resolution;
uniform vec2 zoomCoord;
uniform float r1;
uniform float r2;
uniform float u_colorFactor;

void main()
{
	// vec2 z = (gl_FragCoord - resolution.xy/2.)/resolution.y;
    // vec2 z = gl_FragCoord.xy / resolution.xy;
    vec2 z = gl_FragCoord.xy - resolution.xy/zoomCoord.x;
    float scale = log(r2/r1),angle = atan(scale/(2.0*PI));
    // Droste transform here
    z = cLog(z);
    z.y -= time/2.;
    z = cDiv(z, cExp(vec2(0,angle))*cos(angle)); // Twist!
    z.x = mod(z.x-time,scale);
    z = cExp(z)*r1;
    // Drawing time.
    gl_FragColor = texture2D(vTexture,.5+.5*z); 
    // z = sin(z*25.);
    gl_FragColor = vec4(mix(vec3(z.x*z.y), gl_FragColor.xyz,.85),1.);

    float grey = 0.21 * gl_FragColor.r + 0.71 * gl_FragColor.g + 0.07 * gl_FragColor.b;
    // gl_FragColor = vec4(gl_FragColor.r * u_colorFactor + grey * (1.0 - u_colorFactor), gl_FragColor.g * u_colorFactor + grey * (1.0 - u_colorFactor), gl_FragColor.b * u_colorFactor + grey * (1.0 - u_colorFactor), 1.0);
    gl_FragColor = vec4(gl_FragColor.rgb * (1.0 - u_colorFactor) + (grey * u_colorFactor), 1.0);


}