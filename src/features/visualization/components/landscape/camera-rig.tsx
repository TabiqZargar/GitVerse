"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import * as THREE from "three";
import {
  CAMERA_DEFAULT,
  CAMERA_IDLE_SPEED,
  CAMERA_ZOOM_MIN,
  CAMERA_ZOOM_MAX,
  CAMERA_ORBIT_MIN_POLAR,
  CAMERA_ORBIT_MAX_POLAR,
} from "./utils";

interface CameraRigProps {
  reducedMotion?: boolean;
}

export function CameraRig({ reducedMotion = false }: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsType>(null);
  const { camera } = useThree();
  const idleAngle = useRef(0);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const defaultPos = new THREE.Vector3(...CAMERA_DEFAULT);

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "r":
        case "R":
          controls.target.set(0, 0, 0);
          camera.position.copy(defaultPos);
          controls.update();
          break;
        case "+":
        case "=":
          camera.position.multiplyScalar(1 / 1.1);
          controls.update();
          break;
        case "-":
        case "_":
          camera.position.multiplyScalar(1.1);
          controls.update();
          break;
        case "ArrowLeft": {
          controls.target.set(0, 0, 0);
          const leftPos = camera.position.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.1);
          camera.position.copy(leftPos);
          controls.update();
          break;
        }
        case "ArrowRight": {
          controls.target.set(0, 0, 0);
          const rightPos = camera.position.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.1);
          camera.position.copy(rightPos);
          controls.update();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [camera]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || reducedMotion) return;

    idleAngle.current += delta * CAMERA_IDLE_SPEED * 0.25;
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={reducedMotion ? 0 : 0.08}
      minDistance={CAMERA_ZOOM_MIN}
      maxDistance={CAMERA_ZOOM_MAX}
      minPolarAngle={CAMERA_ORBIT_MIN_POLAR}
      maxPolarAngle={CAMERA_ORBIT_MAX_POLAR}
      autoRotate={!reducedMotion}
      autoRotateSpeed={0.4}
      enablePan={false}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
    />
  );
}
