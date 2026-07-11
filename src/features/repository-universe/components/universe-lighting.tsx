"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createStarFieldMaterial } from "../utils/shaders";

const STAR_COUNT = 3000;
const NEBULA_PARTICLE_COUNT = 800;
const SEED = 42;

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateStarPositions(): Float32Array {
  const rng = seededRandom(SEED);
  const positions = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT * 3; i += 3) {
    const radius = 30 + rng() * 70;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }
  return positions;
}

function generateNebulaData(): { positions: Float32Array; colors: Float32Array } {
  const rng = seededRandom(SEED + 1);
  const positions = new Float32Array(NEBULA_PARTICLE_COUNT * 3);
  const colors = new Float32Array(NEBULA_PARTICLE_COUNT * 3);
  for (let i = 0; i < NEBULA_PARTICLE_COUNT * 3; i += 3) {
    const radius = 15 + rng() * 35;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.3;
    positions[i + 2] = radius * Math.cos(phi);

    const tint = rng();
    colors[i] = 0.3 + tint * 0.4;
    colors[i + 1] = 0.05 + rng() * 0.15;
    colors[i + 2] = 0.4 + (1 - tint) * 0.4;
  }
  return { positions, colors };
}

export function UniverseLighting({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const starRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Points>(null);
  const startTimeRef = useRef(0);
  const initialized = useRef(false);

  const starPositions = useMemo(() => generateStarPositions(), []);
  const nebulaData = useMemo(() => generateNebulaData(), []);

  const starMaterial = useMemo(() => createStarFieldMaterial(), []);

  const nebulaMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.3,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
        sizeAttenuation: true,
      }),
    []
  );

  useEffect(() => {
    return () => {
      starMaterial.dispose();
      nebulaMaterial.dispose();
    };
  }, [starMaterial, nebulaMaterial]);

  useFrame(() => {
    if (!initialized.current) {
      startTimeRef.current = performance.now();
      initialized.current = true;
    }

    if (!reducedMotion) {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      if (starRef.current) {
        starRef.current.rotation.y = elapsed * 0.003;
        starRef.current.rotation.x = Math.sin(elapsed * 0.001) * 0.01;
      }
      if (nebulaRef.current) {
        nebulaRef.current.rotation.y = elapsed * 0.005;
        nebulaRef.current.rotation.x = Math.sin(elapsed * 0.002) * 0.02;
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#050510"]} />

      <fog attach="fog" args={[new THREE.Color("#050510"), 30, 80]} />

      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#6b3fa0", "#050510", 0.2]} />

      <directionalLight
        position={[15, 20, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <directionalLight position={[-10, -5, -15]} intensity={0.3} color="#6b3fa0" />

      <points ref={starRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <primitive object={starMaterial} attach="material" />
      </points>

      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nebulaData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[nebulaData.colors, 3]}
          />
        </bufferGeometry>
        <primitive object={nebulaMaterial} attach="material" />
      </points>
    </>
  );
}
