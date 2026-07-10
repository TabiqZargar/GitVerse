"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import {
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
  const idleAngle = useRef(0);

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
