"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGalaxyMaterial } from "../utils/shaders";
import { useGalaxyStore } from "../store";
import type { GalaxyParticle } from "../types";

interface GalaxyRendererProps {
  particles: GalaxyParticle[];
  reducedMotion?: boolean;
}

export function GalaxyRenderer({ particles, reducedMotion = false }: GalaxyRendererProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = particles.length;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const brightnesses = new Float32Array(count);
    const pulsePhases = new Float32Array(count);
    const targetPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      if (!p) continue;
      const i3 = i * 3;
      positions[i3] = p.position[0];
      positions[i3 + 1] = p.position[1];
      positions[i3 + 2] = p.position[2];
      colors[i3] = p.color[0];
      colors[i3 + 1] = p.color[1];
      colors[i3 + 2] = p.color[2];
      sizes[i] = p.size;
      brightnesses[i] = p.brightness;
      pulsePhases[i] = p.pulsePhase;
      targetPositions[i3] = p.targetPosition[0];
      targetPositions[i3 + 1] = p.targetPosition[1];
      targetPositions[i3 + 2] = p.targetPosition[2];
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aBrightness", new THREE.BufferAttribute(brightnesses, 1));
    geo.setAttribute("aPulsePhase", new THREE.BufferAttribute(pulsePhases, 1));
    geo.setAttribute("aTargetPosition", new THREE.BufferAttribute(targetPositions, 3));

    return geo;
  }, [particles]);

  const material = useMemo(() => createGalaxyMaterial(), []);

  useEffect(() => {
    materialRef.current = material;
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [material, geometry]);

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    const uTime = mat.uniforms.uTime;
    if (uTime) {
      uTime.value += delta;
    }

    if (!reducedMotion) {
      const uTransition = mat.uniforms.uTransition;
      if (uTransition) {
        const target = useGalaxyStore.getState().transitionProgress;
        uTransition.value += (target - uTransition.value) * 0.03;
      }
    }
  });

  if (particles.length === 0) return null;

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
