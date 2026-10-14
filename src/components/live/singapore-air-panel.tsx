import { ExternalLink } from "@/components/external-link";
import { formatLocalDate } from "@/lib/live/time";
import type { LiveSource } from "@/lib/live/registry";
import { regionLabel } from "@/lib/live/sources/datagovsg";
import type { Observation, SourceSnapshot } from "@/lib/live/types";
import { LocalTime } from "./local-time";
import { Provenance } from "./provenance";
import { UnavailableNotice } from "./unavailable-notice";

/**
 * NEA's descriptor bands for the 24-hour PSI, as published by NEA (air
 * pollution FAQ, last updated 29 September 2026, accessed 15 October 2026).
 */
export const PSI_BANDS = [
  { max: 50, label: "Good" },
  { max: 100, label: "Moderate" },
  { max: 200, label: "Unhealthy" },
  { max: 300, label: "Very unhealthy" },
  { max: Infinity, label: "Hazardous" },
] as const;

/**
 * NEA's bands for 1-hour PM2.5 (µg/m³), from NEA's June 2026 infographic,
 * accessed 15 October 2026. NEA's FAQ gives the lower edge of Band II as 55
 * rather than 56; this page follows the infographic and says so.
 */
export const PM25_BANDS = [
  { max: 55, label: "Band I (Normal)" },
  { max: 150, label: "Band II (Elevated)" },
  { max: 250, label: "Band III (High)" },
  { max: Infinity, label: "Band IV (Very high)" },
] as const;

const SUB_INDEX_NAMES: Record<string, string> = {
  pm25_sub_index: "PM2.5",
  pm10_sub_index: "PM10",
  o3_sub_index: "Ozone",
  co_sub_index: "Carbon monoxide",
  so2_sub_index: "Sulphur dioxide",
};

export function band<T extends { max: number; label: string }>(bands: readonly T[], value: number | null): string | null {
  if (value === null) return null;
  return bands.find((b) => value <= b.max)?.label ?? null;
}

const REGION_ORDER = ["north", "south", "east", "west", "central"];

function byRegion(observations: readonly Observation[], metric: string): Map<string, Observation> {
  const map = new Map<string, Observation>();
  for (const observation of observations) {
    if (observation.metric === metric && observation.location.kind === "region") {
      map.set(observation.location.id, observation);
    }
  }
  return map;
}

/**
 * The pollutant whose sub-index equals the PSI. NEA computes the PSI as the
 * highest sub-index, so this names the pollutant setting the PSI. Returns
 * null unless exactly one published sub-index equals the published PSI.
 */
export function determiningPollutant(observations: readonly Observation[], region: string): string | null {
  const psi = observations.find(
    (o) => o.metric === "psi_24h" && o.location.kind === "region" && o.location.id === region,
  )?.value;
  if (psi === null || psi === undefined) return null;
  const matches = observations.filter(
    (o) =>
      o.metric in SUB_INDEX_NAMES &&
      o.location.kind === "region" &&
      o.location.id === region &&
      o.value === psi,
  );
  return matches.length === 1 ? SUB_INDEX_NAMES[matches[0].metric] : null;
}

/** The licence notice data.gov.sg's Open Data Licence asks for, filled in for one dataset. */
function LicenceNotice({ dataset, retrievedAt }: { dataset: string; retrievedAt: string | null }) {
  const date = retrievedAt ? formatLocalDate(retrievedAt) : null;
  return (
    <>
      Contains information from {dataset}
      {date ? ` accessed on ${date}` : null} from data.gov.sg, which is made available under the terms
      of the{" "}
      <ExternalLink href="https://data.gov.sg/open-data-licence" className="underline underline-offset-4 hover:text-signal-ink">
        Singapore Open Data Licence version 1.0
      </ExternalLink>
      .
    </>
  );
}

interface SingaporeAirPanelProps {
  psi: SourceSnapshot;
  pm25: SourceSnapshot;
  psiSource: LiveSource;
  pm25Source: LiveSource;
}

export function SingaporeAirPanel({ psi, pm25, psiSource, pm25Source }: SingaporeAirPanelProps) {
  const psiByRegion = byRegion(psi.observations, "psi_24h");
  const pm25ByRegion = byRegion(pm25.observations, "pm25_1h");
  const psiOk = psi.outcome === "ok" || psi.outcome === "partial";
  const pm25Ok = pm25.outcome === "ok" || pm25.outcome === "partial";
  // The five regions NEA currently reports, in a fixed order, then any other region the source lists.
  const listed = new Set([...psiByRegion.keys(), ...pm25ByRegion.keys()]);
  const regions = [
    ...REGION_ORDER.filter((r) => listed.has(r)),
    ...[...listed].filter((r) => !REGION_ORDER.includes(r)).sort(),
  ];

  if (!psiOk && !pm25Ok) {
    return (
      <div className="space-y-8">
        <UnavailableNotice
          headline="Singapore air-quality source unavailable."
          snapshot={psi}
          notMeaning="This is not a reading of clean or of polluted air. No reading was retrieved."
        />
        <UnavailableNotice
          headline="The 1-hour PM2.5 readings could not be retrieved either."
          snapshot={pm25}
          notMeaning="Nothing was retrieved, so nothing can be said about PM2.5 from this page."
        />
        <Provenance source={psiSource} snapshot={psi} observedLabel="PSI reading for" />
        <Provenance source={pm25Source} snapshot={pm25} observedLabel="PM2.5 reading for" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <caption className="label-mono pb-3 text-left text-muted">
            Singapore, by NEA reporting region. Reading times are below the table.
          </caption>
          <thead>
            <tr className="label-mono border-y-2 border-ink text-muted">
              <th scope="col" className="py-3 pr-4 font-normal">
                Region
              </th>
              <th scope="col" className="py-3 pr-4 font-normal">
                24-hour PSI
              </th>
              <th scope="col" className="py-3 pr-4 font-normal">
                NEA band
              </th>
              <th scope="col" className="py-3 pr-4 font-normal">
                Set by
              </th>
              <th scope="col" className="py-3 pr-4 font-normal">
                1-hour PM2.5 <span className="normal-case">(µg/m³)</span>
              </th>
              <th scope="col" className="py-3 font-normal">
                NEA band
              </th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => {
              const psiValue = psiOk ? (psiByRegion.get(region)?.value ?? null) : null;
              const pm25Value = pm25Ok ? (pm25ByRegion.get(region)?.value ?? null) : null;
              return (
                <tr key={region} className="border-b border-line">
                  <th scope="row" className="py-3 pr-4 font-semibold">
                    {regionLabel(region)}
                  </th>
                  <td className="py-3 pr-4 font-mono text-2xl font-bold tabular-nums">
                    {psiValue ?? (
                      <span className="text-base font-normal text-muted">{psiOk ? "No reading" : "Not retrieved"}</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">{band(PSI_BANDS, psiValue) ?? "—"}</td>
                  <td className="py-3 pr-4 text-muted">{psiOk ? (determiningPollutant(psi.observations, region) ?? "—") : "—"}</td>
                  <td className="py-3 pr-4 font-mono text-2xl font-bold tabular-nums">
                    {pm25Value ?? (
                      <span className="text-base font-normal text-muted">{pm25Ok ? "No reading" : "Not retrieved"}</span>
                    )}
                  </td>
                  <td className="py-3">{band(PM25_BANDS, pm25Value) ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <dl className="grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="label-mono text-muted">24-hour PSI reading for</dt>
          <dd className="mt-1">
            {psi.latestObservedAt ? <LocalTime iso={psi.latestObservedAt} /> : "Unavailable"}
            {typeof psi.meta.sourceUpdatedAt === "string" ? (
              <span className="block text-muted">
                Updated on data.gov.sg <LocalTime iso={psi.meta.sourceUpdatedAt} />
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="label-mono text-muted">1-hour PM2.5 reading for</dt>
          <dd className="mt-1">
            {pm25.latestObservedAt ? <LocalTime iso={pm25.latestObservedAt} /> : "Unavailable"}
            {typeof pm25.meta.sourceUpdatedAt === "string" ? (
              <span className="block text-muted">
                Updated on data.gov.sg <LocalTime iso={pm25.meta.sourceUpdatedAt} />
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        <strong className="font-semibold text-ink">Real-time values.</strong> data.gov.sg provides them &ldquo;as
        is&rdquo;, and whether NEA later revises them is not documented in the pages read for this site.
      </p>

      {!psiOk ? (
        <UnavailableNotice
          headline="The 24-hour PSI could not be retrieved."
          snapshot={psi}
          notMeaning="The PSI column is empty because nothing was retrieved, not because the PSI is zero."
        />
      ) : null}
      {!pm25Ok ? (
        <UnavailableNotice
          headline="The 1-hour PM2.5 readings could not be retrieved."
          snapshot={pm25}
          notMeaning="The PM2.5 column is empty because nothing was retrieved, not because PM2.5 is zero."
        />
      ) : null}

      <Provenance source={psiSource} snapshot={psi} observedLabel="PSI reading for" />
      <Provenance source={pm25Source} snapshot={pm25} observedLabel="PM2.5 reading for" />

      <p className="text-sm leading-relaxed text-muted">
        <LicenceNotice dataset="Pollutant Standards Index (PSI)" retrievedAt={psi.retrievedAt} />{" "}
        <LicenceNotice dataset="PM2.5" retrievedAt={pm25.retrievedAt} /> JEREBU.EXE is not affiliated
        with, or endorsed by, the National Environment Agency or data.gov.sg.
      </p>
    </div>
  );
}
