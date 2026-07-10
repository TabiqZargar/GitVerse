import type { Repository } from "@/features/github/types/domain";
import type { CelestialBody } from "./types";
import { getLanguageColor, getGlowIntensity, getPlanetSize, getRotationSpeed, getOrbitRadius, getOrbitAngle } from "./utils/colors";

export function adaptReposToBodies(repos: Repository[]): CelestialBody[] {
  const sorted = [...repos].sort((a, b) => b.stars - a.stars);
  const total = sorted.length;

  const languageMap = new Map<string, Set<string>>();

  for (const repo of sorted) {
    if (repo.primaryLanguage) {
      const set = languageMap.get(repo.primaryLanguage) ?? new Set();
      set.add(repo.id);
      languageMap.set(repo.primaryLanguage, set);
    }
  }

  return sorted.map((repo, index) => {
    const importance = repo.stars * 3 + repo.forks * 2 + repo.size * 0.001;
    const orbitRadius = getOrbitRadius(importance, index, total);
    const orbitAngle = getOrbitAngle(index);

    const x = orbitRadius * Math.cos(orbitAngle);
    const z = orbitRadius * Math.sin(orbitAngle);

    const connectionIds: string[] = [];
    let connectionStrength = 0;

    if (repo.primaryLanguage) {
      const siblings = languageMap.get(repo.primaryLanguage);
      if (siblings) {
        for (const sid of siblings) {
          if (sid !== repo.id && !connectionIds.includes(sid)) {
            connectionIds.push(sid);
            connectionStrength += 1;
          }
        }
      }
    }

    return {
      id: repo.id,
      repo,
      position: [x, 0, z],
      size: getPlanetSize(repo.size),
      color: getLanguageColor(repo.primaryLanguage),
      glowIntensity: getGlowIntensity(repo.stars, repo.forks),
      rotationSpeed: getRotationSpeed(0),
      orbitRadius,
      orbitAngle,
      connections: connectionIds.slice(0, 8),
      connectionStrength: Math.min(connectionStrength / 10, 1),
    };
  });
}

export function computeRepoImportance(repo: Repository): number {
  return repo.stars * 3 + repo.forks * 2 + repo.size * 0.001;
}
