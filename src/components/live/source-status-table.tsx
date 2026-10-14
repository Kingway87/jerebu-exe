import { freshnessAtRetrieval } from "@/lib/live/freshness";
import type { LiveSource } from "@/lib/live/registry";
import type { SourceSnapshot } from "@/lib/live/types";
import { FreshnessLabel } from "./freshness-label";
import { LocalTime } from "./local-time";
import { StatusChip } from "./status-chip";

export interface StatusRow {
  source: LiveSource;
  /** What the row covers, e.g. "24-hour PSI by region". */
  shows: string;
  /** `null` for sources this site does not fetch. */
  snapshot: Pick<SourceSnapshot, "outcome" | "retrievedAt" | "latestObservedAt"> | null;
}

function Status({ row }: { row: StatusRow }) {
  const { source, snapshot } = row;
  if (!snapshot) return <StatusChip status="not-integrated" />;
  if (snapshot.outcome === "unavailable") return <StatusChip status="unavailable" />;
  if (snapshot.outcome === "not-configured") return <StatusChip status="not-configured" />;
  const policy = source.freshness;
  const fresh = policy ? freshnessAtRetrieval(snapshot, policy) : null;
  if (!policy || !fresh) return <StatusChip status="unavailable" />;
  return (
    <FreshnessLabel
      basis={fresh.basis}
      basisVerb={policy.basis === "observedAt" ? "observed" : "retrieved"}
      policy={{ basis: policy.basis, recentMaxMinutes: policy.recentMaxMinutes, staleAfterMinutes: policy.staleAfterMinutes }}
      atRetrieval={fresh.state}
    />
  );
}

/**
 * The status bar: one row per source, with what it shows, its status, the
 * time of its newest data and when this site retrieved it. Rows stack on
 * small screens.
 */
export function SourceStatusTable({ rows }: { rows: readonly StatusRow[] }) {
  return (
    <div>
      <div
        aria-hidden="true"
        className="label-mono hidden grid-cols-12 gap-x-6 border-b-2 border-ink pb-3 text-muted lg:grid"
      >
        <span className="col-span-3">Source</span>
        <span className="col-span-3">Shows</span>
        <span className="col-span-2">Status</span>
        <span className="col-span-2">Newest data</span>
        <span className="col-span-2">Retrieved</span>
      </div>
      <ul className="border-t-2 border-ink lg:border-t-0">
        {rows.map((row) => (
          <li
            key={`${row.source.id}-${row.shows}`}
            className="grid gap-x-6 gap-y-3 border-b border-line py-5 sm:grid-cols-2 lg:grid-cols-12 lg:items-center"
          >
            <div className="lg:col-span-3">
              <p className="font-semibold tracking-tight">{row.source.name}</p>
              <p className="text-sm text-muted">{row.source.institution}</p>
            </div>
            <p className="text-sm leading-relaxed lg:col-span-3">
              <span className="label-mono mr-2 text-muted lg:hidden">Shows</span>
              {row.shows}
            </p>
            <div className="lg:col-span-2">
              <span className="sr-only">Status: </span>
              <Status row={row} />
            </div>
            <p className="text-sm lg:col-span-2">
              <span className="label-mono mr-2 text-muted lg:hidden">Newest data</span>
              {row.snapshot?.latestObservedAt ? (
                <LocalTime iso={row.snapshot.latestObservedAt} />
              ) : (
                <span className="text-muted">{row.snapshot ? "None" : "Not fetched"}</span>
              )}
            </p>
            <p className="text-sm lg:col-span-2">
              <span className="label-mono mr-2 text-muted lg:hidden">Retrieved</span>
              {row.snapshot?.retrievedAt ? (
                <LocalTime iso={row.snapshot.retrievedAt} />
              ) : (
                <span className="text-muted">{row.snapshot ? "No request made" : "Not fetched"}</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
