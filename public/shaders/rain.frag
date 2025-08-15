precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 vUv;

float hash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
    vec2 uv = vUv;
    uv.y += u_time * 0.8; // falling speed

    // Create many streaks by repeating space
    uv.y *= 20.0; 
    uv.x *= 20.0;

    vec2 gv = fract(uv) - 0.5; // cell space [-0.5, 0.5]

    float drop = smoothstep(0.02, 0.0, abs(gv.x)) // thin vertical line
               * smoothstep(0.5, 0.45, gv.y);     // length of drop

    // Random flicker so drops don't all fall at same speed
    float cellId = floor(uv.x) + floor(uv.y) * 100.0;
    float rnd = hash(cellId);
    drop *= step(rnd, 0.5); 

    if (drop < 0.01) discard; // transparent background

    gl_FragColor = vec4(0.7, 0.8, 1.0, drop); // bluish rain
}
