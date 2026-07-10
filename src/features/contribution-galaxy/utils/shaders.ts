import * as THREE from "three";

export const galaxyVertexShader = `
  uniform float uTime;
  uniform float uTransition;
  uniform float uRevealProgress;

  attribute float aSize;
  attribute vec3 aColor;
  attribute float aBrightness;
  attribute float aPulsePhase;
  attribute vec3 aTargetPosition;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = mix(position, aTargetPosition, uTransition);

    float reveal = uRevealProgress;
    float pulse = 1.0 + 0.08 * sin(uTime * 0.8 + aPulsePhase);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * pulse * (300.0 / -mvPosition.z) * aBrightness;

    float depthFade = smoothstep(40.0, 5.0, -mvPosition.z);
    vAlpha = aBrightness * reveal * depthFade;
    vColor = aColor;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const galaxyFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    vec3 color = vColor * (1.0 + core * 0.6);

    gl_FragColor = vec4(color, glow * vAlpha);
  }
`;

export function createGalaxyMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: galaxyVertexShader,
    fragmentShader: galaxyFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uTransition: { value: 1 },
      uRevealProgress: { value: 1 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
  });
}
