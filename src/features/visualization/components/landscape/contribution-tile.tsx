"use client";

import { useRef, useMemo, memo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { getTileHeight, getElevationColor, TILE_WIDTH, TILE_DEPTH, easeOutCubic } from "./utils";
import type { TileData } from "./types";

interface ContributionTileProps {
  tile: TileData;
  position: [number, number, number];
  maxCount: number;
  isHovered: boolean;
  entranceProgress: number;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onClick: () => void;
}

export const ContributionTile = memo(function ContributionTile({
  tile,
  position,
  maxCount,
  isHovered,
  entranceProgress,
  onPointerEnter,
  onPointerLeave,
  onClick,
}: ContributionTileProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetHeight = getTileHeight(tile.count, maxCount);

  const color = useMemo(() => getElevationColor(tile.count), [tile.count]);

  const delayedProgress = Math.max(0, Math.min(1, (entranceProgress - tile.week * 0.008) / (1 - tile.week * 0.008)));
  const animatedHeight = easeOutCubic(Math.max(0, delayedProgress)) * targetHeight;
  const scaleY = isHovered ? 1 + 0.15 * (1 - delayedProgress) : 1;

  const emissiveColor = useMemo(() => {
    if (tile.isCurrentStreak) return new THREE.Color("#fbbf24");
    return new THREE.Color(0, 0, 0);
  }, [tile.isCurrentStreak]);

  return (
    <RoundedBox
      ref={meshRef}
      position={[position[0], animatedHeight / 2, position[2]]}
      scale={[1, scaleY, 1]}
      args={[TILE_WIDTH, Math.max(animatedHeight, 0.01), TILE_DEPTH]}
      radius={0.04}
      smoothness={3}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      <meshStandardMaterial
        color={color}
        metalness={0.1}
        roughness={0.7}
        emissive={emissiveColor}
        emissiveIntensity={tile.isCurrentStreak ? (isHovered ? 0.6 : 0.25) : 0}
      />
    </RoundedBox>
  );
});
