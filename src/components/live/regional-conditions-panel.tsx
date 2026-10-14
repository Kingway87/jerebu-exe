import type { ReactNode } from "react";
import { ExternalLink } from "@/components/external-link";
import type { LiveSource } from "@/lib/live/registry";
import { formatLocalDate } from "@/lib/live/time";
import type { Observation, SourceSnapshot } from "@/lib/live/types";
import { LocalTime } from "./local-time";
import { Provenance } from "./provenance";
import { UnavailableNotice } from "./unavailable-notice";

const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

/** 16-point compass name for a direction in degrees (0° and 360° are north). */
export function compassPoint(degrees: number): string {
  const index = Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16;
  return COMPASS[index];
}

interface StationRow {
  id: string;
  name: string;
  direction: number | null;
  speed: number | null;
}

function stationRows(direction: readonly Observation[], speed: readonly Observation[]): StationRow[] {
  const rows = new Map<string, StationRow>();
  for (const [list, key] of [
    [direction, "direction"],
    [speed, "speed"],
  ] as const) {
    for (const observation of list) {
      if (observation.location.kind !== "station") continue;
      const { id, name } = observation.location;
      const row = rows.get(id) ?? { id, name, direction: null, speed: null };
      row[key] = observation.value;
      rows.set(id, row);
    }
  }
  return [...rows.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function LicenceNotice({ datasets, retrievedAt }: { datasets: string; retrievedAt: string | null }) {
  const date = retrievedAt ? formatLocalDate(retrievedAt) : null;
  return (
    <p className="text-sm leading-relaxed text-muted">
      Contains information from {datasets}
      {date ? ` accessed on ${date}` : null} from data.gov.sg, which is made available under the terms of
      the{" "}
      <ExternalLink href="https://data.gov.sg/open-data-licence" className="underline underline-offset-4 hover:text-signal-ink">
        Singapore Open Data Licence version 1.0
      </ExternalLink>
      . JEREBU.EXE is not affiliated with, or endorsed by, the National Environment Agency or data.gov.sg.
    </p>
  );
}

interface RegionalConditionsPanelProps {
  windDirection: SourceSnapshot;
  windSpeed: SourceSnapshot;
  rainfall: SourceSnapshot;
  sources: { windDirection: LiveSource; windSpeed: LiveSource; rainfall: LiveSource };
  /** Regional sources this page names but does not copy, e.g. ASMC. */
  regionalContext: ReactNode;
}

export function RegionalConditionsPanel({
  windDirection,
  windSpeed,
  rainfall,
  sources,
  regionalContext,
}: RegionalConditionsPanelProps) {
  const directionOk = windDirection.outcome === "ok";
  const speedOk = windSpeed.outcome === "ok";
  const windOk = directionOk || speedOk;
  const rows = stationRows(directionOk ? windDirection.observations : [], speedOk ? windSpeed.observations : []);
  const directionTime = directionOk ? windDirection.latestObservedAt : null;
  const speedTime = speedOk ? windSpeed.latestObservedAt : null;

  const rainOk = rainfall.outcome === "ok";
  const rainReadings = rainOk ? rainfall.observations.filter((o) => o.value !== null) : [];
  const raining = rainReadings.filter((o) => (o.value ?? 0) > 0).sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  const rainMissing = rainOk ? rainfall.observations.length - rainReadings.length : 0;
  const wettest = raining[0];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Wind at Singapore weather stations</h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          Each value is the mean wind over 10 minutes at one station, as published by the Meteorological
          Service Singapore. It describes the air at that place and time. It cannot show where smoke came
          from: that needs transport modelling over hours to days.
        </p>

        {windOk && !directionOk ? (
          <div className="mt-6">
            <UnavailableNotice
              headline="Singapore wind direction readings unavailable."
              snapshot={windDirection}
              notMeaning="The direction column is empty because nothing was retrieved, not because the air is calm."
            />
          </div>
        ) : null}
        {windOk && !speedOk ? (
          <div className="mt-6">
            <UnavailableNotice
              headline="Singapore wind speed readings unavailable."
              snapshot={windSpeed}
              notMeaning="The speed column is empty because nothing was retrieved, not because the air is calm."
            />
          </div>
        ) : null}
        {windOk ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left">
              <caption className="label-mono pb-3 text-left text-muted">
                {directionTime && speedTime && directionTime !== speedTime ? (
                  <>
                    Direction readings for <LocalTime iso={directionTime} />; speed readings for{" "}
                    <LocalTime iso={speedTime} />
                  </>
                ) : directionTime ?? speedTime ? (
                  <>
                    Readings for <LocalTime iso={(directionTime ?? speedTime) as string} />
                  </>
                ) : (
                  "Reading time unavailable"
                )}
              </caption>
              <thead>
                <tr className="label-mono border-y-2 border-ink text-muted">
                  <th scope="col" className="py-3 pr-4 font-normal">
                    Station
                  </th>
                  <th scope="col" className="py-3 pr-4 font-normal">
                    Direction
                  </th>
                  <th scope="col" className="py-3 font-normal">
                    Speed (knots)
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-line">
                    <th scope="row" className="py-2.5 pr-4 font-semibold">
                      {row.name} <span className="font-mono text-xs font-normal text-muted">{row.id}</span>
                    </th>
                    <td className="py-2.5 pr-4 font-mono tabular-nums">
                      {row.direction === null ? (
                        <span className="font-sans text-muted">{directionOk ? "No reading" : "Not retrieved"}</span>
                      ) : (
                        <>
                          {row.direction}° <span className="text-muted">({compassPoint(row.direction)})</span>
                        </>
                      )}
                    </td>
                    <td className="py-2.5 font-mono tabular-nums">
                      {row.speed === null ? (
                        <span className="font-sans text-muted">{speedOk ? "No reading" : "Not retrieved"}</span>
                      ) : (
                        row.speed
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <UnavailableNotice
              headline="Singapore wind readings unavailable."
              snapshot={windDirection}
              notMeaning="This is not calm air. No wind reading was retrieved."
            />
            {windSpeed.failure?.message !== windDirection.failure?.message ? (
              <UnavailableNotice
                headline="The wind speed readings could not be retrieved either."
                snapshot={windSpeed}
                notMeaning="Nothing was retrieved, so nothing can be said about wind speed from this page."
              />
            ) : null}
          </div>
        )}
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          Compass points are given for degrees as published, read in the usual meteorological way (the
          direction the wind blows from). The dataset&rsquo;s own documentation does not state the
          convention.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight">Rainfall at Singapore weather stations</h3>
        {rainOk ? (
          <p className="mt-3 max-w-3xl text-lg leading-relaxed">
            In the 5-minute rainfall totals for{" "}
            {rainfall.latestObservedAt ? <LocalTime iso={rainfall.latestObservedAt} /> : "the latest reading"},{" "}
            {raining.length === 0 ? (
              <>none of the {rainReadings.length} stations that reported a value recorded rain.</>
            ) : (
              <>
                {raining.length} of the {rainReadings.length} stations that reported a value recorded rain
                {wettest && wettest.location.kind === "station" ? (
                  <>
                    , most at {wettest.location.name} ({wettest.value} mm)
                  </>
                ) : null}
                .
              </>
            )}{" "}
            {rainMissing > 0 ? (
              <span className="text-muted">
                {rainMissing} listed {rainMissing === 1 ? "station" : "stations"} gave no value.
              </span>
            ) : null}
          </p>
        ) : (
          <div className="mt-6">
            <UnavailableNotice
              headline="Singapore rainfall readings unavailable."
              snapshot={rainfall}
              notMeaning="This is not a report of dry weather. No rainfall reading was retrieved."
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Provenance source={sources.windDirection} snapshot={windDirection} observedLabel="Wind direction reading for" />
        <Provenance source={sources.windSpeed} snapshot={windSpeed} observedLabel="Wind speed reading for" />
        <Provenance source={sources.rainfall} snapshot={rainfall} observedLabel="Rainfall reading for" />
        <LicenceNotice
          datasets="Wind Direction across Singapore, Wind Speed across Singapore and Rainfall across Singapore"
          retrievedAt={windDirection.retrievedAt ?? rainfall.retrievedAt}
        />
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight">Regional context</h3>
        <div className="mt-6">{regionalContext}</div>
      </div>
    </div>
  );
}
