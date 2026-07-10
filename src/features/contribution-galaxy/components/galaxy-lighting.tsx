"use client";

export function GalaxyLighting() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <hemisphereLight
        args={["#4a0080", "#1a0033"]}
        intensity={0.6}
        groundColor="#0d001a"
      />
      <directionalLight
        position={[5, 10, -5]}
        intensity={0.4}
        color="#a855f7"
      />
      <directionalLight
        position={[-3, -5, 8]}
        intensity={0.2}
        color="#6366f1"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={0.5}
        color="#c084fc"
        distance={20}
      />
      <fog attach="fog" args={["#0a0012", 5, 35]} />
    </>
  );
}
