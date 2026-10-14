import { ExternalLink } from "@/components/external-link";
import { freshnessAtRetrieval } from "@/lib/live/freshness";
import type { LiveSource } from "@/lib/live/registry";
import { documentedMeaning, isHazeTerm } from "@/lib/live/sources/datagovmy";
import { formatLocalDate } from "@/lib/live/time";
import type { ForecastSnapshot } from "@/lib/live/types";
import { EvidenceLevelTag } from "./evidence-level-tag";
import { FreshnessLabel } from "./freshness-label";
import { LinkedText } from "./linked-text";
import { LocalTime } from "./local-time";
import { StatusChip } from "./status-chip";
import { UnavailableNotice } from "./unavailable-notice";

/** A forecast value as published, in Malay, with the documented English description if there is one. */
function ForecastValue({ value }: { value: string | null }) {
  if (!value) return <span className="text-muted">None given</span>;
  const meaning = documentedMeaning(value);
  const haze = isHazeTerm(value);
  return (
    <span className={haze ? "font-semibold" : undefined}>
      <span lang="ms">{value}</span>
      {meaning ? <span className="block text-sm font-normal text-muted">{meaning}</span> : null}
      {!meaning ? <span className="block text-sm font-normal text-muted">No documented translation</span> : null}
    </span>
  );
}

interface MalaysiaForecastPanelProps {
  snapshot: ForecastSnapshot;
  source: LiveSource;
}

/**
 * MET Malaysia's general forecast for today, by state. A forecast is a
 * prediction, not a measurement, and it is labelled as one.
 */
export function MalaysiaForecastPanel({ snapshot, source }: MalaysiaForecastPanelProps) {
  if (snapshot.outcome === "unavailable" || snapshot.forecasts.length === 0) {
    return (
      <UnavailableNotice
        headline="MET Malaysia forecast unavailable."
        snapshot={snapshot}
        notMeaning="No forecast was retrieved. This says nothing about the weather or the haze."
      />
    );
  }

  const hazy = snapshot.forecasts.filter((f) =>
    [f.periods.morning, f.periods.afternoon, f.periods.night, f.summary].some(isHazeTerm),
  );
  const date = snapshot.validDate ? formatLocalDate(`${snapshot.validDate}T12:00:00+08:00`) : null;
  const policy = source.freshness;
  const fresh = policy ? freshnessAtRetrieval({ retrievedAt: snapshot.retrievedAt, latestObservedAt: null }, policy) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="label-mono inline-flex items-center gap-2 border border-ink bg-paper px-2.5 py-1 text-ink">
          Forecast, not an observation
        </span>
        <EvidenceLevelTag level="interpretation" />
      </div>
      <p className="max-w-3xl text-lg leading-relaxed">
        For {date ?? "today"}, MET Malaysia&rsquo;s general forecast uses the term{" "}
        <span lang="ms" className="font-semibold">
          Jerebu
        </span>{" "}
        or{" "}
        <span lang="ms" className="font-semibold">
          Berjerebu
        </span>{" "}
        for at least one part of the day in {hazy.length} of the {snapshot.forecasts.length} states and federal
        territories it lists.
      </p>
      <p className="max-w-3xl border-l-2 border-signal-ink pl-5 leading-relaxed">
        <strong className="font-semibold">A forecast without these terms is not a forecast of clear air.</strong>{" "}
        Each period has a single description, so a period described as, for example, thunderstorms says
        nothing either way about haze.
      </p>
      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        The data.gov.my documentation describes <span lang="ms">Berjerebu</span> as &ldquo;Hazy.&rdquo; The live
        data also uses <span lang="ms">Jerebu</span>, which the documentation does not list. A forecast is a
        meteorologist&rsquo;s prediction of conditions, not a measurement of air quality, and it does not say
        where any haze comes from.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <caption className="label-mono pb-3 text-left text-muted">
            MET Malaysia general forecast{date ? `, ${date}` : ""}, as published (in Malay)
          </caption>
          <thead>
            <tr className="label-mono border-y-2 border-ink text-muted">
              <th scope="col" className="py-3 pr-4 font-normal">
                State or territory
              </th>
              <th scope="col" className="py-3 pr-4 font-normal">
                Morning
              </th>
              <th scope="col" className="py-3 pr-4 font-normal">
                Afternoon
              </th>
              <th scope="col" className="py-3 font-normal">
                Night
              </th>
            </tr>
          </thead>
          <tbody>
            {snapshot.forecasts.map((forecast) => (
              <tr key={forecast.location.id} className="border-b border-line align-top">
                <th scope="row" className="py-3 pr-4 font-semibold">
                  {forecast.location.name}
                </th>
                <td className="py-3 pr-4">
                  <ForecastValue value={forecast.periods.morning} />
                </td>
                <td className="py-3 pr-4">
                  <ForecastValue value={forecast.periods.afternoon} />
                </td>
                <td className="py-3">
                  <ForecastValue value={forecast.periods.night} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="grid gap-x-8 gap-y-4 border-y border-line py-5 text-sm sm:grid-cols-3">
        <div>
          <dt className="label-mono text-muted">Source</dt>
          <dd className="mt-1">
            <ExternalLink href={source.officialUrl} className="font-semibold underline underline-offset-4 hover:text-signal-ink">
              {source.name}
            </ExternalLink>
            <span className="block text-muted">{source.institution}</span>
          </dd>
        </div>
        <div>
          <dt className="label-mono text-muted">Retrieved by this site</dt>
          <dd className="mt-1">{snapshot.retrievedAt ? <LocalTime iso={snapshot.retrievedAt} /> : "Not retrieved"}</dd>
        </div>
        <div>
          <dt className="label-mono text-muted">Status</dt>
          <dd className="mt-1">
            {fresh && policy ? (
              <FreshnessLabel
                basis={fresh.basis}
                basisVerb="retrieved"
                policy={{ basis: policy.basis, recentMaxMinutes: policy.recentMaxMinutes, staleAfterMinutes: policy.staleAfterMinutes }}
                atRetrieval={fresh.state}
              />
            ) : (
              <StatusChip status="unavailable" />
            )}
            <span className="mt-1 block text-muted">Forecast for {snapshot.validDate}</span>
          </dd>
        </div>
        {snapshot.issues.length > 0 ? (
          <div className="sm:col-span-3">
            <dt className="label-mono text-muted">Notes from this retrieval</dt>
            <dd className="mt-1">
              <ul className="space-y-1 leading-relaxed text-muted [overflow-wrap:anywhere]">
                {snapshot.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>
      <p className="text-sm leading-relaxed text-muted">
        <LinkedText text={source.attribution} />
      </p>
    </div>
  );
}
