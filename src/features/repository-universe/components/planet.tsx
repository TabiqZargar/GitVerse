"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { CelestialBody } from "../types";

interface PlanetProps {
  body: CelestialBody;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  reducedMotion: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

export function Planet({
  body,
  isSelected,
  isHovered,
  isDimmed,
  reducedMotion,
  onHover,
  onClick,
  onDoubleClick,
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(body.color),
        metalness: 0.3,
        roughness: 0.6,
        envMapIntensity: 0.5 + body.glowIntensity * 0.5,
        emissive: new THREE.Color(body.color),
        emissiveIntensity: 0.05 + body.glowIntensity * 0.15,
      }),
    [body.color, body.glowIntensity]
  );

  const atmosphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
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
          glowColor: { value: new THREE.Color(body.color) },
          intensity: { value: 0.3 + body.glowIntensity * 0.7 },
        },
        transparent: true,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [body.color, body.glowIntensity]
  );

  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: body.color,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [body.color]
  );

  const ringGeo = useMemo(() => {
    const geo = new THREE.RingGeometry(body.size * 1.4, body.size * 1.8, 32);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [body.size]);

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(body.size, 32, 32), [body.size]);
  const atmosphereGeo = useMemo(() => new THREE.SphereGeometry(body.size * 1.12, 24, 24), [body.size]);

  useEffect(() => {
    return () => {
      sphereGeo.dispose();
      atmosphereGeo.dispose();
      ringGeo.dispose();
      mat.dispose();
      atmosphereMat.dispose();
      ringMat.dispose();
    };
  }, [sphereGeo, atmosphereGeo, ringGeo, mat, atmosphereMat, ringMat]);

  const handleClick = useCallback(() => onClick(body.id), [onClick, body.id]);
  const handleDoubleClick = useCallback(() => onDoubleClick(body.id), [onDoubleClick, body.id]);
  const handlePointerOver = useCallback(() => onHover(body.id), [onHover, body.id]);
  const handlePointerOut = useCallback(() => onHover(null), [onHover]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const material = mesh?.material as THREE.MeshStandardMaterial | undefined;
    if (!mesh || !material) return;

    if (!reducedMotion) {
      mesh.rotation.y += delta * body.rotationSpeed;
      mesh.rotation.x += delta * body.rotationSpeed * 0.1;

      if (atmosphereRef.current) {
        atmosphereRef.current.rotation.y += delta * body.rotationSpeed * 0.5;
      }

      if (ringRef.current) {
        ringRef.current.rotation.z += delta * 0.1;
      }

      pulseRef.current += delta;
    }

    if (ringRef.current) {
      ringRef.current.visible = isSelected || isHovered;
      if (isSelected) {
        (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
          0.2 + Math.sin(pulseRef.current * 2) * 0.1;
      }
    }

    const scale = isHovered ? 1.15 : isSelected ? 1.1 : 1;
    if (mesh.scale.x !== scale) {
      mesh.scale.setScalar(scale);
    }

    const targetEmissive = isHovered
      ? 0.3 + body.glowIntensity * 0.3
      : isSelected
        ? 0.2 + body.glowIntensity * 0.2
        : 0.05 + body.glowIntensity * 0.15;
    material.emissiveIntensity = targetEmissive;
    material.opacity = isDimmed ? 0.2 : 1;

    const atmosphere = atmosphereRef.current;
    const atmoMat = atmosphere?.material as THREE.ShaderMaterial | undefined;
    if (atmoMat) {
      atmoMat.uniforms.intensity!.value = (0.3 + body.glowIntensity * 0.7) * (isDimmed ? 0.2 : 1);
    }
  });

  return (
    <group position={body.position}>
      <mesh
        ref={meshRef}
        geometry={sphereGeo}
        material={mat}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
      />

      <mesh
        ref={atmosphereRef}
        geometry={atmosphereGeo}
        material={atmosphereMat}
      />

      <mesh
        ref={ringRef}
        geometry={ringGeo}
        material={ringMat}
        visible={false}
      />
    </group>
  );
}
