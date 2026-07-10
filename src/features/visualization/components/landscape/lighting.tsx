"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

interface LandscapeLightingProps {
  reducedMotion?: boolean;
}

export function LandscapeLighting({ reducedMotion = false }: LandscapeLightingProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const startTime = useRef(0);

  useFrame(() => {
    if (reducedMotion) {
      if (dirLightRef.current) dirLightRef.current.intensity = 1.2;
      if (ambientRef.current) ambientRef.current.intensity = 0.3;
      return;
    }

    if (startTime.current === 0) startTime.current = performance.now();

    const elapsed = performance.now() - startTime.current;
    const t = Math.min(elapsed / 1500, 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    if (dirLightRef.current) dirLightRef.current.intensity = eased * 1.2;
    if (ambientRef.current) ambientRef.current.intensity = eased * 0.3;
  });

  return (
    <>
      <Environment preset="night" />
      <directionalLight
        ref={dirLightRef}
        position={[8, 12, 6]}
        intensity={0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.001}
        shadow-camera-far={30}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <ambientLight ref={ambientRef} intensity={0} />
      <fog attach="fog" args={[new THREE.Color("#0a0a1a"), 8, 25]} />
      <hemisphereLight args={["#6b3fa0", "#0a1628", 0.15]} />
    </>
  );
}
