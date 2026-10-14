import type { LiveSource } from "@/lib/live/registry";
import { snapshotStatus } from "@/lib/live/status";
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
  /** What to show as the newest data when the source has no observation time, e.g. "Forecast for 15 Oct 2026". */
  newestText?: string;
  /** When the data stops being current regardless of its age, e.g. the end of a forecast's day. */
  expiresAt?: string | null;
  /** What to say once `expiresAt` has passed. */
  expiredText?: string;
}

function failed(snapshot: StatusRow["snapshot"]): boolean {
  return snapshot !== null && (snapshot.outcome === "unavailable" || snapshot.outcome === "not-configured");
}

function Status({ row }: { row: StatusRow }) {
  const { source, snapshot } = row;
  if (!snapshot) return <StatusChip status="not-integrated" />;
  const policy = source.freshness;
  const status = snapshotStatus(snapshot, policy);
  if (status.kind !== "freshness" || !policy) {
    return (
      <>
        <StatusChip status={status.kind === "freshness" ? "undated" : status.kind} />
        {snapshot.outcome === "partial" ? <PartialNote /> : null}
      </>
    );
  }
  return (
    <>
      <FreshnessLabel
        basis={status.basis}
        basisVerb={policy.basis === "observedAt" ? "observed" : "retrieved"}
        policy={{ basis: policy.basis, recentMaxMinutes: policy.recentMaxMinutes, staleAfterMinutes: policy.staleAfterMinutes }}
        atRetrieval={status.state}
        expiresAt={row.expiresAt}
        expiredText={row.expiredText}
      />
      {snapshot.outcome === "partial" ? <PartialNote /> : null}
    </>
  );
}

function PartialNote() {
  return <span className="mt-1 block text-sm text-signal-ink">Partial: part of this source could not be retrieved</span>;
}

/**
 * The status bar: one row per source, with what it shows, its status, the
 * time of its newest data and when this site retrieved it (or tried to).
 * Rows stack on small screens; on wide screens the labels stay available to
 * screen readers.
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
        {rows.map((row) => {
          const isFailed = failed(row.snapshot);
          return (
            <li
              key={`${row.source.id}-${row.shows}`}
              className="grid gap-x-6 gap-y-3 border-b border-line py-5 sm:grid-cols-2 lg:grid-cols-12 lg:items-center"
            >
              <div className="lg:col-span-3">
                <p className="font-semibold tracking-tight">{row.source.name}</p>
                <p className="text-sm text-muted">{row.source.institution}</p>
              </div>
              <p className="text-sm leading-relaxed lg:col-span-3">
                <span className="label-mono mr-2 text-muted lg:sr-only">Shows</span>
                {row.shows}
              </p>
              <div className="lg:col-span-2">
                <span className="sr-only">Status: </span>
                <Status row={row} />
              </div>
              <p className="text-sm lg:col-span-2">
                <span className="label-mono mr-2 text-muted lg:sr-only">Newest data</span>
                {isFailed ? (
                  <span className="text-muted">Not retrieved</span>
                ) : row.snapshot?.latestObservedAt ? (
                  <LocalTime iso={row.snapshot.latestObservedAt} />
                ) : (
                  <span className="text-muted">{row.snapshot ? (row.newestText ?? "None") : "Not fetched"}</span>
                )}
              </p>
              <p className="text-sm lg:col-span-2">
                <span className="label-mono mr-2 text-muted lg:sr-only">{isFailed ? "Attempted" : "Retrieved"}</span>
                {row.snapshot?.retrievedAt ? (
                  <>
                    {isFailed ? (
                      <span aria-hidden="true" className="hidden text-muted lg:inline">
                        Attempted{" "}
                      </span>
                    ) : null}
                    <LocalTime iso={row.snapshot.retrievedAt} />
                  </>
                ) : (
                  <span className="text-muted">{row.snapshot ? "No request made" : "Not fetched"}</span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
