import noiseGLSL from './noiseGLSL';

// Dissolves between two project preview images along a noise field rather
// than a flat opacity fade, so the wipe edge is organic instead of a straight
// line, and each texture gets a subtle push/pull warp as it crosses that
// edge. u_progress sweeps 0 (fully u_from) -> 1 (fully u_to). u_boxAspect /
// u_fromAspect / u_toAspect do a "background-size: cover"-style UV remap per
// texture so images of different aspect ratios never look squished inside
// the fixed preview box.
const previewFragmentShader = `
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform float u_time;
uniform float u_boxAspect;
uniform float u_fromAspect;
uniform float u_toAspect;

varying vec2 vUv;

${noiseGLSL}

vec2 coverUv(vec2 uv, float boxAspect, float texAspect) {
    vec2 scale = boxAspect > texAspect ? vec2(1.0, boxAspect / texAspect) : vec2(texAspect / boxAspect, 1.0);
    return (uv - 0.5) / scale + 0.5;
}

void main() {
    float n = cnoise(vec3(vUv * 3.0, u_time * 0.2)) * 0.5 + 0.5;
    float band = 0.28;
    float threshold = mix(1.0 + band, -band, u_progress);
    float edge = smoothstep(threshold, threshold + band, n);

    vec2 warp = vec2(n - 0.5) * 0.06;
    vec2 fromUv = coverUv(vUv + warp * (1.0 - u_progress), u_boxAspect, u_fromAspect);
    vec2 toUv = coverUv(vUv - warp * u_progress, u_boxAspect, u_toAspect);

    vec4 colFrom = texture2D(u_from, clamp(fromUv, 0.0, 1.0));
    vec4 colTo = texture2D(u_to, clamp(toUv, 0.0, 1.0));

    gl_FragColor = mix(colFrom, colTo, edge);
}
`;

export default previewFragmentShader;
