import { basemap } from "@/content/geo/basemap";
import type { FireSummary } from "@/lib/live/sources/firms";

/**
 * The live evidence map: a static SVG drawn on the server.
 *
 * Plate carrée projection (longitude and latitude used directly as x and y):
 * within about 7.5° of the equator, as here, distances east–west are shrunk
 * by at most about 1% relative to north–south (cos 7.5° ≈ 0.991). No tiles,
 * no scripts and no third-party requests: the coastlines are committed in
 * src/content/geo/basemap.ts.
 *
 * It shows where satellites detected thermal anomalies, binned into grid
 * cells. It does not show smoke, fire perimeters, land ownership or anyone's
 * responsibility, and it shows no concession or company boundaries.
 */

const { box, unitsPerDegree: k, width, height } = basemap;

const x = (lon: number) => (lon - box.west) * k;
const y = (lat: number) => (box.north - lat) * k;

/** Fixed classes, so the legend means the same thing every day. */
export const DENSITY_CLASSES = [
  { min: 1, max: 4, label: "1–4", className: "fill-signal/30" },
  { min: 5, max: 19, label: "5–19", className: "fill-signal/60" },
  { min: 20, max: 99, label: "20–99", className: "fill-signal" },
  { min: 100, max: Infinity, label: "100 or more", className: "fill-signal-ink" },
] as const;

/** Geographic names only. No country labels: borders are drawn faintly for orientation. */
const PLACE_LABELS = [
  { name: "Sumatra", lon: 99.2, lat: 0.6 },
  { name: "Borneo", lon: 113.2, lat: 1.2 },
  { name: "Peninsular Malaysia", lon: 100.2, lat: 5.2 },
] as const;

const SINGAPORE = { lon: 103.82, lat: 1.35 };

const GRATICULE_LON = [100, 105, 110, 115];
const GRATICULE_LAT = [-5, 0, 5];

const lonLabel = (lon: number) => `${lon}°E`;
const latLabel = (lat: number) => (lat === 0 ? "0°" : `${Math.abs(lat)}°${lat < 0 ? "S" : "N"}`);

function cellPaths(summary: FireSummary): string[] {
  const size = summary.cellSizeDegrees * k;
  return DENSITY_CLASSES.map((densityClass) =>
    summary.cells
      .filter((cell) => cell.count >= densityClass.min && cell.count <= densityClass.max)
      .map((cell) => `M${Math.round(x(cell.lon))} ${Math.round(y(cell.lat + summary.cellSizeDegrees))}h${size}v${size}h${-size}z`)
      .join(""),
  );
}

interface RegionMapProps {
  /** `null` when FIRMS is unavailable: the map then shows no detection layer at all. */
  fires: FireSummary | null;
  titleId: string;
  descriptionId: string;
  description: string;
}

export function RegionMap({ fires, titleId, descriptionId, description }: RegionMapProps) {
  const paths = fires ? cellPaths(fires) : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
      className="block h-auto w-full bg-paper"
    >
      <title id={titleId}>Map of the region around Malaysia and Singapore</title>
      <desc id={descriptionId}>{description}</desc>

      {/* Graticule */}
      <g className="stroke-line" strokeWidth={2} fill="none">
        {GRATICULE_LON.map((lon) => (
          <line key={`lon-${lon}`} x1={x(lon)} y1={0} x2={x(lon)} y2={height} />
        ))}
        {GRATICULE_LAT.map((lat) => (
          <line key={`lat-${lat}`} x1={0} y1={y(lat)} x2={width} y2={y(lat)} />
        ))}
      </g>

      {/* Land and boundaries (Natural Earth, public domain) */}
      <path d={basemap.land} className="fill-paper-2 stroke-subtle" strokeWidth={2} strokeLinejoin="round" />
      <path
        d={basemap.boundaries}
        fill="none"
        className="stroke-subtle"
        strokeWidth={3}
        strokeDasharray="10 8"
        strokeLinecap="round"
      />

      {/* Detection density */}
      {paths
        ? paths.map((d, i) => (d ? <path key={DENSITY_CLASSES[i].label} d={d} className={DENSITY_CLASSES[i].className} /> : null))
        : null}

      {/* Place names */}
      <g className="fill-muted" fontFamily="var(--font-mono)" fontSize={34} letterSpacing={3}>
        {PLACE_LABELS.map((place) => (
          <text key={place.name} x={x(place.lon)} y={y(place.lat)} textAnchor="middle">
            {place.name.toUpperCase()}
          </text>
        ))}
      </g>

      {/* Singapore */}
      <g>
        <circle cx={x(SINGAPORE.lon)} cy={y(SINGAPORE.lat)} r={22} fill="none" className="stroke-ink" strokeWidth={6} />
        <circle cx={x(SINGAPORE.lon)} cy={y(SINGAPORE.lat)} r={6} className="fill-ink" />
        <text
          x={x(SINGAPORE.lon) + 34}
          y={y(SINGAPORE.lat) + 12}
          className="fill-ink"
          fontFamily="var(--font-mono)"
          fontSize={34}
          fontWeight={700}
          letterSpacing={3}
        >
          SINGAPORE
        </text>
      </g>

      {/* Coordinate labels */}
      <g className="fill-subtle" fontFamily="var(--font-mono)" fontSize={26}>
        {GRATICULE_LON.map((lon) => (
          <text key={`lon-label-${lon}`} x={x(lon) + 8} y={height - 12}>
            {lonLabel(lon)}
          </text>
        ))}
        {GRATICULE_LAT.map((lat) => (
          <text key={`lat-label-${lat}`} x={10} y={y(lat) - 10}>
            {latLabel(lat)}
          </text>
        ))}
      </g>

      {/* Frame */}
      <rect x={1} y={1} width={width - 2} height={height - 2} fill="none" className="stroke-ink" strokeWidth={4} />
    </svg>
  );
}
