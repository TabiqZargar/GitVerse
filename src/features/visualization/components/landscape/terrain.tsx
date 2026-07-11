"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  getTileHeight,
  getElevationColor,
  getTilePosition,
  TILE_WIDTH,
  TILE_DEPTH,
  easeOutCubic,
  smoothstep,
} from "./utils";
import type { TileData } from "./types";

interface TerrainProps {
  tiles: TileData[];
  totalWeeks: number;
  maxCount: number;
  reducedMotion?: boolean;
  currentDate?: Date;
  onTileHover: (tile: TileData | null) => void;
  onTileClick?: (tile: TileData) => void;
}

function getRevealProgress(tileDate: string, currentDate: Date | undefined): number {
  if (!currentDate) return 1;
  const diffMs = currentDate.getTime() - new Date(tileDate).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays >= 1.5) return 1;
  if (diffDays <= -1.5) return 0;
  const t = (diffDays + 1.5) / 3;
  return smoothstep(t);
}

export function Terrain({
  tiles,
  totalWeeks,
  maxCount,
  reducedMotion = false,
  currentDate,
  onTileHover,
  onTileClick,
}: TerrainProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const startTime = useRef(0);
  const hoveredIndexRef = useRef(-1);
  const animInit = useRef(false);
  const prevCurrentDateRef = useRef<string | undefined>(undefined);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const instanceData = useMemo(() => {
    return tiles.map((tile, i) => {
      const [x, , z] = getTilePosition(tile.week, tile.dayOfWeek, totalWeeks);
      const targetHeight = getTileHeight(tile.count, maxCount);
      const color = getElevationColor(tile.count);
      return { x, z, targetHeight, color, tile, index: i };
    });
  }, [tiles, totalWeeks, maxCount]);

  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(TILE_WIDTH, 1, TILE_DEPTH, 2, 2, 2);
    geo.translate(0, 0.5, 0);
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        metalness: 0.08,
        roughness: 0.7,
        envMapIntensity: 0.4,
      }),
    []
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const useReplayMode = currentDate !== undefined;
    const currentDateStr = currentDate?.toISOString().split("T")[0];

    if (!animInit.current) {
      animInit.current = true;
      startTime.current = performance.now();
      prevCurrentDateRef.current = currentDateStr;
    }

    for (let i = 0; i < instanceData.length; i++) {
      const inst = instanceData[i];
      if (!inst) continue;

      let reveal: number;
      if (useReplayMode && currentDateStr) {
        reveal = getRevealProgress(inst.tile.date, currentDate);
      } else if (!reducedMotion) {
        const elapsed = performance.now() - startTime.current;
        const progress = Math.min(elapsed / 2200, 1);
        const delay = inst.tile.week * 0.012 + inst.tile.dayOfWeek * 0.003;
        const rawP = Math.max(0, progress - delay);
        const clampedP = Math.min(rawP / Math.max(1 - delay, 0.001), 1);
        reveal = easeOutCubic(clampedP);
      } else {
        reveal = 1;
      }

      const currentH = reveal * inst.targetHeight;

      dummy.position.set(inst.x, currentH / 2, inst.z);
      dummy.scale.set(1, Math.max(currentH, 0.001), 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      tempColor.copy(inst.color);
      if (hoveredIndexRef.current === i) {
        tempColor.lerp(new THREE.Color("#ffffff"), 0.15);
      }
      mesh.setColorAt(i, tempColor);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  });

  const handlePointerMove = useCallback(
    (e: THREE.Event & { instanceId?: number }) => {
      if (e.instanceId === undefined) return;
      const idx = e.instanceId;
      hoveredIndexRef.current = idx;
      onTileHover(tiles[idx] ?? null);
    },
    [tiles, onTileHover]
  );

  const handlePointerLeave = useCallback(() => {
    hoveredIndexRef.current = -1;
    onTileHover(null);
  }, [onTileHover]);

  const handleClick = useCallback(
    (e: THREE.Event & { instanceId?: number }) => {
      if (e.instanceId === undefined) return;
      const tile = tiles[e.instanceId];
      if (tile) onTileClick?.(tile);
    },
    [tiles, onTileClick]
  );

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, tiles.length]}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      frustumCulled
    />
  );
}
