import { ExternalLink } from "@/components/external-link";
import type { LiveSource } from "@/lib/live/registry";
import type { FireSummary } from "@/lib/live/sources/firms";
import { describeBox } from "@/lib/live/study-area";
import { fireZeroIsReported, missingParts } from "@/lib/live/summaries";
import type { SourceSnapshot } from "@/lib/live/types";
import { LinkedText } from "./linked-text";
import { LocalTime } from "./local-time";
import { Provenance } from "./provenance";
import { DENSITY_CLASSES, RegionMap } from "./region-map";
import { UnavailableNotice } from "./unavailable-notice";

const SATELLITE_NAMES: Record<string, string> = {
  N20: "NOAA-20",
  N21: "NOAA-21",
  N: "Suomi NPP",
  // FIRMS's earlier codes for NOAA-20 and NOAA-21 (FIRMS news).
  "1": "NOAA-20",
  "2": "NOAA-21",
};

const number = new Intl.NumberFormat("en-GB");

function satelliteName(code: string): string {
  return Object.hasOwn(SATELLITE_NAMES, code) ? SATELLITE_NAMES[code] : code;
}

function cellLabel(cell: { lon: number; lat: number }, size: number): string {
  const lat = (v: number) => `${Math.abs(v).toFixed(1)}°${v < 0 ? "S" : "N"}`;
  const lon = (v: number) => `${v.toFixed(1)}°E`;
  return `${lat(cell.lat)}–${lat(cell.lat + size)}, ${lon(cell.lon)}–${lon(cell.lon + size)}`;
}

/** A plain-language description of the map, for screen readers and as a caption. */
function mapDescription(summary: FireSummary | null, zeroReported: boolean, missing: string[]): string {
  const base = "Coastlines of Peninsular Malaysia, Singapore, Sumatra and Borneo.";
  const incomplete =
    missing.length > 0 ? ` Data from ${missing.join(" and ")} could not be retrieved, so the map is incomplete.` : "";
  if (!summary) {
    return `${base} No satellite detections are drawn, because NASA FIRMS data could not be retrieved.`;
  }
  if (summary.total === 0) {
    return zeroReported
      ? `${base} NASA FIRMS reported no detections inside the map window for this period.`
      : `${base} No detections are drawn: the FIRMS files retrieved contained none inside the map window, but this page cannot confirm that they were complete and current.${incomplete}`;
  }
  return `${base} ${number.format(summary.total)} NASA FIRMS satellite detections are counted in ${number.format(summary.cells.length)} grid cells of ${summary.cellSizeDegrees}° (about 11 km). Darker cells contain more detections. The table below the map lists the cells with the most detections.${incomplete}`;
}

export interface FirePanelProps {
  snapshot: Omit<SourceSnapshot, "observations">;
  summary: FireSummary | null;
  source: LiveSource;
}

export function FirePanel({ snapshot, summary, source }: FirePanelProps) {
  const unavailable = snapshot.outcome === "unavailable" || snapshot.outcome === "not-configured" || !summary;
  const mode = snapshot.meta.mode;
  const outsideArea = typeof snapshot.meta.outsideArea === "number" ? snapshot.meta.outsideArea : null;
  const outsideWindow = typeof snapshot.meta.outsideWindow === "number" ? snapshot.meta.outsideWindow : null;
  const zeroReported = fireZeroIsReported(snapshot, source.freshness);
  const missing = snapshot.outcome === "partial" ? missingParts(snapshot) : [];
  const mapNotice = unavailable ? "NO DATA RETRIEVED" : summary.total === 0 && !zeroReported ? "ZERO NOT CONFIRMED" : null;
  const topCells = summary ? [...summary.cells].sort((a, b) => b.count - a.count).slice(0, 10) : [];
  const fileTimes = snapshot.requests
    .filter((r): r is typeof r & { lastModified: string } => typeof r.lastModified === "string")
    .map((r) => ({ label: r.label, lastModified: r.lastModified }));

  return (
    <div className="space-y-10">
      {unavailable ? (
        <UnavailableNotice
          headline="NASA FIRMS data currently unavailable."
          snapshot={snapshot}
          notMeaning="This is not a finding of “no fires detected”. No satellite data was retrieved, so nothing can be said about fires from this page."
        >
          <p>
            NASA&rsquo;s own fire map may still be available:{" "}
            <ExternalLink href="https://firms.modaps.eosdis.nasa.gov/map/" className="underline underline-offset-4 hover:text-signal-ink">
              FIRMS Fire Map
            </ExternalLink>
            .
          </p>
        </UnavailableNotice>
      ) : (
        <>
          <dl className="grid gap-px border-2 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-paper p-5">
              <dt className="label-mono text-muted">Detections in the map window, in the files retrieved</dt>
              <dd className="mt-2 font-mono text-4xl font-bold tabular-nums">{number.format(summary.total)}</dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="label-mono text-muted">By satellite</dt>
              <dd className="mt-2 space-y-1">
                {Object.keys(summary.bySatellite).length === 0 ? (
                  <span className="text-muted">None</span>
                ) : (
                  Object.entries(summary.bySatellite).map(([code, count]) => (
                    <span key={code} className="block">
                      {satelliteName(code)}: <span className="font-mono tabular-nums">{number.format(count)}</span>
                    </span>
                  ))
                )}
              </dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="label-mono text-muted">Detection confidence (NASA)</dt>
              <dd className="mt-2 space-y-1">
                <span className="block">High: <span className="font-mono tabular-nums">{number.format(summary.byConfidence.high)}</span></span>
                <span className="block">Nominal: <span className="font-mono tabular-nums">{number.format(summary.byConfidence.nominal)}</span></span>
                <span className="block">Low: <span className="font-mono tabular-nums">{number.format(summary.byConfidence.low)}</span></span>
              </dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="label-mono text-muted">Acquired between</dt>
              <dd className="mt-2 space-y-1">
                {summary.earliest && summary.latest ? (
                  <>
                    <LocalTime iso={summary.earliest} className="block" />
                    <span className="block text-muted">and</span>
                    <LocalTime iso={summary.latest} className="block" />
                  </>
                ) : (
                  <span className="text-muted">No detections in this window</span>
                )}
              </dd>
            </div>
          </dl>

          {summary.total === 0 && zeroReported ? (
            <p className="max-w-3xl border-l-2 border-signal-ink pl-5 text-lg leading-relaxed">
              <strong className="font-semibold">NASA FIRMS reported no detections inside the map window for this period.</strong>{" "}
              That is a report of zero detections, not of zero fires: clouds, thick smoke, the timing of
              satellite passes and small or short-lived fires can all mean that burning goes undetected.
            </p>
          ) : summary.total === 0 ? (
            <p className="max-w-3xl border-l-2 border-signal-ink pl-5 text-lg leading-relaxed">
              <strong className="font-semibold">
                The FIRMS files retrieved contained no detections inside the map window, but this is not a report
                of zero detections.
              </strong>{" "}
              {snapshot.outcome === "partial"
                ? "Part of NASA’s data could not be retrieved."
                : snapshot.counts.rejected > 0
                  ? "Some rows in NASA’s files could not be read (see the notes for this source)."
                  : "Nothing in the files shows that NASA’s feed was current when this page retrieved them."}{" "}
              Nothing can be said about detections in the map window from this retrieval.
            </p>
          ) : (
            <p className="max-w-3xl leading-relaxed text-muted">
              <strong className="font-semibold text-ink">Detections are not fires.</strong> One fire can
              produce many detections across neighbouring pixels, successive passes and both satellites, and
              fires can burn without being detected. Counts describe what the satellites recorded, not how
              many fires there were.
            </p>
          )}

          {snapshot.outcome === "partial" ? (
            <div className="border-2 border-dashed border-signal-ink p-5">
              <p className="font-semibold">Partial data: part of the FIRMS data could not be retrieved.</p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {snapshot.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}

      <figure>
        <div className="border-2 border-ink">
          <RegionMap
            fires={unavailable ? null : summary}
            titleId="fire-map-title"
            descriptionId="fire-map-desc"
            description={mapDescription(unavailable ? null : summary, zeroReported, missing)}
            notice={mapNotice}
          />
        </div>
        <figcaption className="mt-4 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {mapNotice ? (
              <p className="text-sm leading-relaxed font-semibold">
                {unavailable
                  ? "No detections are drawn because no FIRMS data was retrieved."
                  : "No detections are drawn, and this page cannot confirm that NASA’s files were complete and current."}{" "}
                An empty map here is not a map of no fires.
              </p>
            ) : (
              <>
                <p className="label-mono text-muted">Detections per cell of {summary?.cellSizeDegrees ?? 0.1}° (about 11 km)</p>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {DENSITY_CLASSES.map((densityClass) => (
                    <li key={densityClass.label} className="flex items-center gap-2">
                      <svg aria-hidden="true" viewBox="0 0 10 10" className="size-3.5">
                        <rect width="10" height="10" className={densityClass.className} />
                      </svg>
                      {densityClass.label}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <p className="text-sm leading-relaxed text-muted lg:col-span-7">
            Map window {describeBox()}. It is a display window, not a claim about where smoke comes from:
            detections outside it are not drawn
            {outsideArea !== null && !unavailable ? ` (${number.format(outsideArea)} in this retrieval)` : ""}.
            Coastlines and dashed land boundaries: made with Natural Earth (public domain), drawn for
            orientation only; boundaries follow Natural Earth&rsquo;s de facto depiction and are not a
            statement on any boundary question. NASA likewise states that its fire data imply no opinion on
            any frontier or boundary. The map shows no smoke, no fire perimeters, and no land ownership,
            concession or company boundaries.
          </p>
        </figcaption>
      </figure>

      {!unavailable && topCells.length > 0 ? (
        <details className="group border-y border-line">
          <summary className="label-mono flex min-h-11 cursor-pointer items-center gap-2 text-muted hover:text-ink">
            <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-90">
              ›
            </span>
            The {topCells.length} cells with the most detections (table)
          </summary>
          <div className="overflow-x-auto pb-4">
            <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
              <thead>
                <tr className="label-mono border-b-2 border-ink text-muted">
                  <th scope="col" className="py-2 pr-4 font-normal">
                    Cell (latitude, longitude)
                  </th>
                  <th scope="col" className="py-2 font-normal">
                    Detections
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCells.map((cell) => (
                  <tr key={`${cell.lon}:${cell.lat}`} className="border-b border-line">
                    <td className="py-2 pr-4 font-mono">{cellLabel(cell, summary.cellSizeDegrees)}</td>
                    <td className="py-2 font-mono tabular-nums">{number.format(cell.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-muted">
              Coordinates only. A grid cell with many detections says where the satellites recorded heat, not
              why, and not on whose land.
            </p>
          </div>
        </details>
      ) : null}

      <Provenance
        source={source}
        snapshot={snapshot}
        observedLabel="Newest detection in NASA’s files"
        showIssues={snapshot.outcome !== "partial"}
      />
      <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted">
        <p>
          {mode === "area-api"
            ? `Retrieved from the FIRMS area API for the map window, keeping detections acquired in the 24 hours before retrieval${
                outsideWindow ? ` (${number.format(outsideWindow)} older detections in the map window were left out)` : ""
              }.`
            : "Retrieved from NASA’s openly downloadable “South East Asia” files labelled “24h”, for VIIRS on NOAA-20 and NOAA-21, then limited to the map window. Despite the label, these files can include detections more than a day old; the range shown above is what they contained."}
        </p>
        {fileTimes.length > 0 ? (
          <p>
            NASA&rsquo;s server last rewrote the files at{" "}
            {fileTimes.map((file, i) => (
              <span key={file.label}>
                {i > 0 ? " and " : null}
                <LocalTime iso={file.lastModified} /> ({file.label})
              </span>
            ))}
            . It rewrites them about hourly, often unchanged, so this is not the time of the newest detection.
          </p>
        ) : null}
        <p>
          <LinkedText text={source.attribution} />
          {source.licence.url ? (
            <>
              {" "}
              <ExternalLink href={source.licence.url} className="underline underline-offset-4 hover:text-signal-ink">
                NASA&rsquo;s data use guidance and disclaimer for FIRMS
              </ExternalLink>
              .
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
