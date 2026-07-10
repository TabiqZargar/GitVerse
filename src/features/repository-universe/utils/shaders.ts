import * as THREE from "three";

export function createPlanetMaterial(color: string, glowIntensity: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 0.3,
    roughness: 0.6,
    envMapIntensity: 0.5 + glowIntensity * 0.5,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.05 + glowIntensity * 0.15,
  });
}

export function createAtmosphereMaterial(color: string, glowIntensity: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float intensity;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 viewDir = normalize(-vPosition);
        float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
        rim = pow(rim, 3.0);
        float alpha = rim * 0.6 * intensity;
        gl_FragColor = vec4(glowColor, alpha);
      }
    `,
    uniforms: {
      glowColor: { value: new THREE.Color(color) },
      intensity: { value: 0.3 + glowIntensity * 0.7 },
    },
    transparent: true,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

export function createConnectionMaterial(color: string, opacity: number): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: opacity * 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

export function createSelectionRingMaterial(color: string): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

export function createStarFieldMaterial(): THREE.PointsMaterial {
  return new THREE.PointsMaterial({
    size: 0.03,
    color: "#ffffff",
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    depthWrite: false,
  });
}
