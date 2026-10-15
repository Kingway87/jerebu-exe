#!/usr/bin/env node
/**
 * Build the static basemap for the live evidence page.
 *
 *   node scripts/build-basemap.mjs
 *
 * Downloads Natural Earth land polygons and land boundary lines (public
 * domain), clips them to the map window, simplifies them, projects them with
 * a plate carrée projection (longitude and latitude used directly as x and
 * y), and writes compact SVG path data to src/content/geo/basemap.ts.
 *
 * The output is committed, so building the site needs no map download and
 * visitors' browsers never contact a map or tile server. Re-run this script
 * only to change the map window, the detail level or the Natural Earth
 * version, and record the change in the pull request.
 *
 * No dependencies: plain Node.js (20+). Downloaded files are parsed as JSON
 * only, never executed.
 */

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/* ───────────────────────────── Configuration ───────────────────────────── */

// Keep in step with STUDY_AREA in src/lib/live/study-area.ts.
const BOX = { west: 95, south: -6.5, east: 119.5, north: 7.5 };
// Geometry is clipped to a slightly larger box, so the cut edges fall outside
// the visible map instead of drawing straight "coastlines" along its frame.
const MARGIN = 0.5;
const CLIP = { west: BOX.west - MARGIN, south: BOX.south - MARGIN, east: BOX.east + MARGIN, north: BOX.north + MARGIN };

// Natural Earth vector data, release v5.1.2, from the project's official
// GitHub repository. Downloads are pinned to the release's commit and checked
// against the git blob SHA-1s that GitHub lists for that commit, so the
// output is reproducible and a changed file is refused.
const NATURAL_EARTH_VERSION = "v5.1.2";
const NATURAL_EARTH_COMMIT = "f1890d9f152c896d250a77557a5751a93d494776";
const RAW = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${NATURAL_EARTH_COMMIT}/geojson`;
const LAND = {
  url: `${RAW}/ne_10m_land.geojson`,
  gitBlobSha1: "2d76878175b8054acd9c5a52917ee9ea59a36fc5",
};
const BOUNDARIES = {
  url: `${RAW}/ne_10m_admin_0_boundary_lines_land.geojson`,
  gitBlobSha1: "a4e4090820e0d95c23d55aefa6b5f1721552cc71",
};

// One SVG unit = 0.01°, about 1.1 km at the equator.
const UNITS_PER_DEGREE = 100;
// Douglas–Peucker tolerance, in degrees. 0.02° ≈ 2.2 km: invisible at the
// page's map width, and Singapore island keeps its shape.
const TOLERANCE_DEGREES = 0.02;
// Rings smaller than this many square degrees after simplification are
// dropped (tiny islets that would render as specks).
const MIN_RING_AREA = 0.0004;

const USER_AGENT = "JEREBU.EXE basemap builder (+https://github.com/Kingway87/jerebu-exe)";

/* ─────────────────────────────── Geometry ─────────────────────────────── */

/** Sutherland–Hodgman: clip a closed ring to the clip box. Returns [] if nothing is left. */
function clipRing(ring) {
  const edges = [
    { inside: (p) => p[0] >= CLIP.west, cut: (a, b) => cutX(a, b, CLIP.west) },
    { inside: (p) => p[0] <= CLIP.east, cut: (a, b) => cutX(a, b, CLIP.east) },
    { inside: (p) => p[1] >= CLIP.south, cut: (a, b) => cutY(a, b, CLIP.south) },
    { inside: (p) => p[1] <= CLIP.north, cut: (a, b) => cutY(a, b, CLIP.north) },
  ];
  let output = ring.slice(0, -1); // drop the closing point
  for (const edge of edges) {
    const input = output;
    output = [];
    if (input.length === 0) break;
    let previous = input[input.length - 1];
    for (const current of input) {
      if (edge.inside(current)) {
        if (!edge.inside(previous)) output.push(edge.cut(previous, current));
        output.push(current);
      } else if (edge.inside(previous)) {
        output.push(edge.cut(previous, current));
      }
      previous = current;
    }
  }
  return output.length >= 3 ? [...output, output[0]] : [];
}

function cutX(a, b, x) {
  const t = (x - a[0]) / (b[0] - a[0]);
  return [x, a[1] + t * (b[1] - a[1])];
}

function cutY(a, b, y) {
  const t = (y - a[1]) / (b[1] - a[1]);
  return [a[0] + t * (b[0] - a[0]), y];
}

/** Liang–Barsky: clip a segment to the clip box. Returns null if it lies outside. */
function clipSegment(a, b) {
  let t0 = 0;
  let t1 = 1;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const checks = [
    [-dx, a[0] - CLIP.west],
    [dx, CLIP.east - a[0]],
    [-dy, a[1] - CLIP.south],
    [dy, CLIP.north - a[1]],
  ];
  for (const [p, q] of checks) {
    if (p === 0) {
      if (q < 0) return null;
    } else {
      const r = q / p;
      if (p < 0) {
        if (r > t1) return null;
        if (r > t0) t0 = r;
      } else {
        if (r < t0) return null;
        if (r < t1) t1 = r;
      }
    }
  }
  return [
    [a[0] + t0 * dx, a[1] + t0 * dy],
    [a[0] + t1 * dx, a[1] + t1 * dy],
  ];
}

/** Clip a line string to the box; may split it into several pieces. */
function clipLine(line) {
  const pieces = [];
  let current = [];
  for (let i = 1; i < line.length; i += 1) {
    const segment = clipSegment(line[i - 1], line[i]);
    if (!segment) {
      if (current.length > 1) pieces.push(current);
      current = [];
      continue;
    }
    const [start, end] = segment;
    const last = current[current.length - 1];
    if (!last || last[0] !== start[0] || last[1] !== start[1]) {
      if (current.length > 1) pieces.push(current);
      current = [start];
    }
    current.push(end);
  }
  if (current.length > 1) pieces.push(current);
  return pieces;
}

/** Douglas–Peucker simplification of an open or closed point list. */
function simplify(points, tolerance) {
  if (points.length <= 2) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length > 0) {
    const [start, end] = stack.pop();
    let maxDistance = 0;
    let index = -1;
    for (let i = start + 1; i < end; i += 1) {
      const distance = perpendicularDistance(points[i], points[start], points[end]);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    if (maxDistance > tolerance && index !== -1) {
      keep[index] = 1;
      stack.push([start, index], [index, end]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function perpendicularDistance(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / Math.hypot(dx, dy);
}

function ringArea(ring) {
  let area = 0;
  for (let i = 1; i < ring.length; i += 1) {
    area += ring[i - 1][0] * ring[i][1] - ring[i][0] * ring[i - 1][1];
  }
  return Math.abs(area) / 2;
}

/** Simplify a closed ring: split it in two so the endpoints are not fixed to one place. */
function simplifyRing(ring) {
  const half = Math.floor(ring.length / 2);
  const first = simplify(ring.slice(0, half + 1), TOLERANCE_DEGREES);
  const second = simplify(ring.slice(half), TOLERANCE_DEGREES);
  return [...first, ...second.slice(1)];
}

/* ─────────────────────────────── Projection ─────────────────────────────── */

const project = ([lon, lat]) => [
  Math.round((lon - BOX.west) * UNITS_PER_DEGREE),
  Math.round((BOX.north - lat) * UNITS_PER_DEGREE),
];

/** Compact SVG path data: absolute move, then relative lines; repeated points dropped. */
function toPath(points, close) {
  const projected = [];
  for (const point of points.map(project)) {
    const last = projected[projected.length - 1];
    if (!last || last[0] !== point[0] || last[1] !== point[1]) projected.push(point);
  }
  if (close && projected.length > 1) {
    const [first] = projected;
    const last = projected[projected.length - 1];
    if (first[0] === last[0] && first[1] === last[1]) projected.pop();
  }
  if (projected.length < (close ? 3 : 2)) return "";
  let d = `M${projected[0][0]} ${projected[0][1]}`;
  for (let i = 1; i < projected.length; i += 1) {
    const dx = projected[i][0] - projected[i - 1][0];
    const dy = projected[i][1] - projected[i - 1][1];
    d += `l${dx} ${dy}`;
  }
  return close ? `${d}z` : d;
}

/* ──────────────────────────────── Build ──────────────────────────────── */

/** git's blob hash: SHA-1 of "blob <size>\0<content>". */
function gitBlobSha1(bytes) {
  return createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
}

async function download({ url, gitBlobSha1: expected }) {
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const actual = gitBlobSha1(bytes);
  if (actual !== expected) {
    throw new Error(`Checksum mismatch for ${url}: expected git blob ${expected}, got ${actual}. Refusing to use it.`);
  }
  return JSON.parse(bytes.toString("utf8"));
}

function* polygonsOf(geojson) {
  for (const feature of geojson.features) {
    const geometry = feature.geometry;
    if (!geometry) continue;
    if (geometry.type === "Polygon") yield geometry.coordinates;
    if (geometry.type === "MultiPolygon") yield* geometry.coordinates;
  }
}

/**
 * Only boundaries Natural Earth types as "Land". The same file also holds
 * "Water Indicator" lines (for example through the Johor Strait between
 * Singapore and Malaysia); they are left out so the map's legend, "land
 * boundaries", stays accurate.
 */
function* landBoundaryLinesOf(geojson) {
  for (const feature of geojson.features) {
    const geometry = feature.geometry;
    if (!geometry) continue;
    if (feature.properties?.TYPE !== "Land") continue;
    if (geometry.type === "LineString") yield geometry.coordinates;
    if (geometry.type === "MultiLineString") yield* geometry.coordinates;
  }
}

const [land, boundaries] = await Promise.all([download(LAND), download(BOUNDARIES)]);

let landPath = "";
let ringsKept = 0;
let landVertices = 0;
for (const polygon of polygonsOf(land)) {
  for (const ring of polygon) {
    const clipped = clipRing(ring);
    if (clipped.length === 0) continue;
    const simplified = simplifyRing(clipped);
    if (simplified.length < 4 || ringArea(simplified) < MIN_RING_AREA) continue;
    const d = toPath(simplified, true);
    if (!d) continue;
    landPath += d;
    ringsKept += 1;
    landVertices += simplified.length;
  }
}

let boundaryPath = "";
let boundaryLines = 0;
for (const line of landBoundaryLinesOf(boundaries)) {
  boundaryLines += 1;
  for (const piece of clipLine(line)) {
    const d = toPath(simplify(piece, TOLERANCE_DEGREES), false);
    if (d) boundaryPath += d;
  }
}

const width = Math.round((BOX.east - BOX.west) * UNITS_PER_DEGREE);
const height = Math.round((BOX.north - BOX.south) * UNITS_PER_DEGREE);
const generatedOn = new Date().toISOString().slice(0, 10); // UTC date

const output = `/**
 * Basemap for the live evidence page. GENERATED by scripts/build-basemap.mjs
 * on ${generatedOn}. Do not edit by hand; re-run the script instead.
 *
 * Source: Natural Earth ${NATURAL_EARTH_VERSION}, 1:10m land polygons and land
 * boundary lines (public domain, https://www.naturalearthdata.com), from
 * commit ${NATURAL_EARTH_COMMIT}, checked against git blob SHA-1s:
 *   ${LAND.url} (${LAND.gitBlobSha1})
 *   ${BOUNDARIES.url} (${BOUNDARIES.gitBlobSha1})
 *
 * Processing: clipped to the map window ${BOX.west}°E–${BOX.east}°E, ${Math.abs(BOX.south)}°S–${BOX.north}°N plus a ${MARGIN}° margin
 * (the margin is outside the visible map);
 * simplified (Douglas–Peucker, ${TOLERANCE_DEGREES}°); rings under ${MIN_RING_AREA} square
 * degrees dropped; plate carrée projection, ${UNITS_PER_DEGREE} units per degree,
 * so x = (longitude − ${BOX.west}) × ${UNITS_PER_DEGREE} and y = (${BOX.north} − latitude) × ${UNITS_PER_DEGREE}.
 * ${ringsKept} land rings, ${landVertices} vertices.
 *
 * Boundary lines: only features of TYPE "Land" (water indicators left out).
 * They follow Natural Earth's de facto depiction ("in fact", not "by law"),
 * are drawn only to help readers find their way, and say nothing about any
 * boundary question. Natural Earth classes them "International boundary
 * (verify)"; the absence of a "Disputed" class says nothing about disputes.
 */

export const basemap = {
  source: "Natural Earth ${NATURAL_EARTH_VERSION} (public domain)",
  sourceUrl: "https://www.naturalearthdata.com/",
  generatedOn: "${generatedOn}",
  box: { west: ${BOX.west}, south: ${BOX.south}, east: ${BOX.east}, north: ${BOX.north} },
  unitsPerDegree: ${UNITS_PER_DEGREE},
  width: ${width},
  height: ${height},
  land: "${landPath}",
  boundaries: "${boundaryPath}",
} as const;
`;

const target = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "content", "geo", "basemap.ts");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, output);
console.log(
  `Wrote ${target}: ${ringsKept} rings, ${landVertices} vertices, land ${(landPath.length / 1024).toFixed(1)} KB, ${boundaryLines} land boundary lines (${(boundaryPath.length / 1024).toFixed(1)} KB).`,
);
