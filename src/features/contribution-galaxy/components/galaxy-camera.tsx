"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import * as THREE from "three";
import { useGalaxyStore } from "../store";

const IDLE_TIMEOUT = 3000;
const ZOOM_MIN = 2;
const ZOOM_MAX = 30;

export function GalaxyCamera({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const controlsRef = useRef<OrbitControlsType>(null);
  const { camera } = useThree();
  const lastInteraction = useRef(0);
  const initializing = useRef(true);
  const selectedId = useGalaxyStore((s) => s.selectedId);
  const particles = useGalaxyStore((s) => s.particles);

  useEffect(() => {
    if (selectedId) {
      const p = particles.find((p) => p.id === selectedId);
      if (p) {
        const target = new THREE.Vector3(p.position[0], p.position[1], p.position[2]);
        const controls = controlsRef.current;
        if (controls) {
          controls.target.lerp(target, 0.1);
        }
      }
    }
  }, [selectedId, particles]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "r":
        case "R":
          controls.target.set(0, 0, 0);
          camera.position.set(0, 5, 12);
          controls.update();
          break;
        case "ArrowUp":
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [camera]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (initializing.current) {
      lastInteraction.current = performance.now();
      initializing.current = false;
    }

    const now = performance.now();

    if (!reducedMotion && now - lastInteraction.current > IDLE_TIMEOUT) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.15;
    } else {
      controls.autoRotate = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={reducedMotion ? 0 : 0.08}
      minDistance={ZOOM_MIN}
      maxDistance={ZOOM_MAX}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI / 2.1}
      autoRotate={false}
      autoRotateSpeed={0.15}
      enablePan={true}
      panSpeed={0.3}
      rotateSpeed={0.4}
      zoomSpeed={0.7}
      onStart={() => {
        lastInteraction.current = performance.now();
      }}
    />
  );
}
