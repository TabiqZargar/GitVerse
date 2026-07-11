"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PARTICLE_COUNT } from "./utils";

interface ParticlesProps {
  reducedMotion?: boolean;
}

export function Particles({ reducedMotion = false }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const startTime = useRef(0);
  const initialized = useRef(false);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const velocitiesRef = useRef(new Float32Array(PARTICLE_COUNT));

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    const positionAttr = points.geometry.attributes.position;
    if (!positionAttr) return;
    const pos = positionAttr.array as Float32Array;

    if (!initialized.current) {
      const vel = velocitiesRef.current;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 6 + Math.random() * 14;
        const idx3 = i * 3;
        pos[idx3] = Math.sin(phi) * Math.cos(theta) * radius;
        pos[idx3 + 1] = Math.abs(Math.sin(phi) * Math.sin(theta)) * radius * 0.3 + 1;
        pos[idx3 + 2] = Math.cos(phi) * radius;
        vel[i] = 0.005 + Math.random() * 0.015;
      }
      positionAttr.needsUpdate = true;
      initialized.current = true;
    }

    if (startTime.current === 0 && !reducedMotion) startTime.current = performance.now();

    const elapsed = startTime.current > 0 ? performance.now() - startTime.current : 99999;
    const opacityT = reducedMotion ? 1 : Math.min(elapsed / 2000, 1);
    const opacity = opacityT * 0.4;

    if (points.material instanceof THREE.PointsMaterial) {
      points.material.opacity = opacity;
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx3 = i * 3;
      pos[idx3] = (pos[idx3] ?? 0) + Math.sin(elapsed * 0.0001 + i) * delta * 0.1;
      pos[idx3 + 1] = (pos[idx3 + 1] ?? 0) + Math.sin(elapsed * 0.0002 + i * 0.5) * delta * 0.05;
      pos[idx3 + 2] = (pos[idx3 + 2] ?? 0) + Math.cos(elapsed * 0.0001 + i * 1.3) * delta * 0.1;
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#6b3fa0"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
