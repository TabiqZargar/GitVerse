"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/shared/error-boundary";

interface ThreeSceneProps {
  children?: React.ReactNode;
  cameraPosition?: [number, number, number];
}

function SceneLoader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

export function ThreeScene({ children, cameraPosition = [5, 5, 5] }: ThreeSceneProps) {
  return (
    <div className="h-[600px] w-full rounded-xl border">
      <ErrorBoundary>
        <Canvas camera={{ position: cameraPosition, fov: 60 }}>
          <Suspense fallback={<SceneLoader />}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <OrbitControls enableDamping dampingFactor={0.05} />
            {process.env.NODE_ENV === "development" && <Stats />}
            {children}
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
