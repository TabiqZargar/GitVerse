"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { CelestialBody } from "../types";

interface OrbitConnectionsProps {
  bodies: CelestialBody[];
}

export function OrbitConnections({ bodies }: OrbitConnectionsProps) {
  const bodyMap = useMemo(() => {
    const map = new Map<string, CelestialBody>();
    for (const b of bodies) map.set(b.id, b);
    return map;
  }, [bodies]);

  const positions = useMemo(() => {
    const result: number[] = [];
    const processed = new Set<string>();

    for (const body of bodies) {
      for (const connId of body.connections) {
        const key = [body.id, connId].sort().join(":");
        if (processed.has(key)) continue;
        processed.add(key);

        const target = bodyMap.get(connId);
        if (!target) continue;

        const [x1, y1, z1] = body.position;
        const [x2, y2, z2] = target.position;
        result.push(x1, y1 || 0, z1, x2, y2 || 0, z2);
      }
    }

    return new Float32Array(result);
  }, [bodies, bodyMap]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  if (positions.length === 0) return null;

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#6b3fa0"
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
