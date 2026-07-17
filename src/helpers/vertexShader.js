import noiseGLSL from './noiseGLSL';

const vertexShader = `
uniform float u_intensity;
uniform float u_time;

varying vec2 vUv;
varying float vDisplacement;

${noiseGLSL}

void main() {
    vUv = uv;

    vDisplacement = cnoise(position + vec3(2.0 * u_time));
  
    vec3 newPosition = position + normal * (u_intensity * vDisplacement);
  
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
  
    gl_Position = projectedPosition;
}
`;

export default vertexShader;