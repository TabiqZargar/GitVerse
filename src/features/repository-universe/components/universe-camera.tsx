"use client";

import { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import * as THREE from "three";
import { useUniverseStore } from "../store";

const IDLE_TIMEOUT = 4000;
const FOCUS_SPEED = 0.04;
const IDLE_ROTATE_SPEED = 0.1;

export function UniverseCamera({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const controlsRef = useRef<OrbitControlsType>(null);
  const cameraTarget = useUniverseStore((s) => s.cameraTarget);
  const focusedId = useUniverseStore((s) => s.focusedId);

  const lastInteraction = useRef(0);
  const isIdle = useRef(false);
  const targetPosition = useRef<THREE.Vector3 | null>(null);
  const initializing = useRef(true);
  const dirVec = useRef(new THREE.Vector3());
  const { camera } = useThree();

  const handleStart = useCallback(() => {
    lastInteraction.current = performance.now();
    isIdle.current = false;
  }, []);

  useFrame(() => {
    if (initializing.current) {
      lastInteraction.current = performance.now();
      initializing.current = false;
    }

    const controls = controlsRef.current;
    if (!controls) return;

    const now = performance.now();

    if (!reducedMotion && now - lastInteraction.current > IDLE_TIMEOUT) {
      if (!isIdle.current) {
        isIdle.current = true;
      }
      controls.autoRotate = true;
      controls.autoRotateSpeed = IDLE_ROTATE_SPEED;
    } else {
      controls.autoRotate = false;
    }

    if (targetPosition.current) {
      const target = targetPosition.current;
      const distance = camera.position.distanceTo(target);
      if (distance > 0.05) {
        const dir = dirVec.current.copy(target).sub(camera.position).normalize();
        const speed = Math.min(distance * FOCUS_SPEED + 0.01, 0.5);
        camera.position.add(dir.multiplyScalar(speed));
        controls.target.lerp(target, FOCUS_SPEED * 1.5);
      } else {
        targetPosition.current = null;
      }
      controls.update();
    }
  });

  useEffect(() => {
    if (cameraTarget) {
      targetPosition.current = new THREE.Vector3(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
      lastInteraction.current = performance.now();
      isIdle.current = false;
    }
  }, [cameraTarget]);

  useEffect(() => {
    if (focusedId) {
      const body = useUniverseStore.getState().bodies.find((b) => b.id === focusedId);
      if (body) {
        const pos = new THREE.Vector3(body.position[0], body.position[1], body.position[2]);
        targetPosition.current = pos;
        lastInteraction.current = performance.now();
        isIdle.current = false;
      }
    }
  }, [focusedId]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      dampingFactor={0.06}
      minDistance={3}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={0.05}
      zoomSpeed={0.8}
      rotateSpeed={0.4}
      onStart={handleStart}
      autoRotate={false}
      autoRotateSpeed={IDLE_ROTATE_SPEED}
    />
  );
}
