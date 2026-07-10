export { LandscapeScene } from "./landscape-scene";
export { Tooltip } from "./tooltip";
export { Terrain } from "./terrain";
export { CameraRig } from "./camera-rig";
export { Particles } from "./particles";
export { LandscapeLighting } from "./lighting";
export { LandscapeControls } from "./landscape-controls";
export { ContributionTile } from "./contribution-tile";

export type { TileData, TooltipState, TerrainGrid, LandscapeSceneProps, ElevationLevel } from "./types";

export {
  getElevationColor,
  getElevationColorHex,
  getTileHeight,
  getTilePosition,
  buildTerrainGrid,
  TILE_WIDTH,
  TILE_DEPTH,
  TILE_GAP,
} from "./utils";
