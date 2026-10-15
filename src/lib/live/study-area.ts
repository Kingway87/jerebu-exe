/**
 * The map window for the live evidence page.
 *
 * A rectangle around Peninsular Malaysia, Singapore, Sumatra and Borneo,
 * chosen by the AI that built Experiment 003 so that the two jurisdictions
 * the project starts with appear together with nearby land on every side.
 *
 * It is a display window, not a claim about where smoke comes from or where
 * fires matter. Satellite detections outside it exist and are not shown.
 * Changing it is a human decision, and the page and docs/LIVE_EVIDENCE.md
 * should change with it.
 */
export const STUDY_AREA = {
  west: 95,
  south: -6.5,
  east: 119.5,
  north: 7.5,
} as const;

export type BoundingBox = { west: number; south: number; east: number; north: number };

export function isInside(lat: number, lon: number, box: BoundingBox = STUDY_AREA): boolean {
  return lat >= box.south && lat <= box.north && lon >= box.west && lon <= box.east;
}

/** "95°E–119.5°E, 6.5°S–7.5°N" */
export function describeBox(box: BoundingBox = STUDY_AREA): string {
  const lon = (v: number) => `${Math.abs(v)}°${v < 0 ? "W" : "E"}`;
  const lat = (v: number) => `${Math.abs(v)}°${v < 0 ? "S" : "N"}`;
  return `${lon(box.west)}–${lon(box.east)}, ${lat(box.south)}–${lat(box.north)}`;
}
