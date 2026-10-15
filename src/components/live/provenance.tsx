import { ExternalLink } from "@/components/external-link";
import type { LiveSource } from "@/lib/live/registry";
import { snapshotStatus } from "@/lib/live/status";
import type { SourceSnapshot } from "@/lib/live/types";
import { FreshnessLabel } from "./freshness-label";
import { LocalTime } from "./local-time";
import { StatusChip } from "./status-chip";

interface ProvenanceProps {
  source: LiveSource;
  snapshot: Pick<SourceSnapshot, "outcome" | "retrievedAt" | "latestObservedAt" | "issues">;
  /** What the observation time is, e.g. "Reading for" or "Newest detection". */
  observedLabel?: string;
  /** Set to false where the same notes are already shown in a notice above. */
  showIssues?: boolean;
}

/**
 * Where a block of data came from and how old it is: source, observation
 * time, retrieval time and status, and any notes from validation (for
 * example, a value rejected as implausible, or a response that may be a
 * cached copy). Shown next to every live dataset. When the retrieval failed,
 * it says so: the time is when it was attempted, and nothing was retrieved.
 */
export function Provenance({ source, snapshot, observedLabel = "Observed", showIssues = true }: ProvenanceProps) {
  const policy = source.freshness;
  const status = snapshotStatus(snapshot, policy);
  const failed = status.kind === "unavailable" || status.kind === "not-configured";
  const basisVerb = policy?.basis === "observedAt" ? "observed" : "retrieved";

  return (
    <dl className="grid gap-x-8 gap-y-4 border-y border-line py-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
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
        <dt className="label-mono text-muted">{observedLabel}</dt>
        <dd className="mt-1">
          {failed ? (
            <span className="text-muted">Not retrieved</span>
          ) : snapshot.latestObservedAt ? (
            <LocalTime iso={snapshot.latestObservedAt} />
          ) : (
            <span className="text-muted">None</span>
          )}
        </dd>
      </div>
      <div>
        <dt className="label-mono text-muted">{failed ? "Attempted by this site" : "Retrieved by this site"}</dt>
        <dd className="mt-1">
          {snapshot.retrievedAt ? <LocalTime iso={snapshot.retrievedAt} /> : <span className="text-muted">No request made</span>}
        </dd>
      </div>
      <div>
        <dt className="label-mono text-muted">Status</dt>
        <dd className="mt-1">
          {status.kind === "freshness" && policy ? (
            <FreshnessLabel
              basis={status.basis}
              basisVerb={basisVerb}
              policy={{
                basis: policy.basis,
                recentMaxMinutes: policy.recentMaxMinutes,
                staleAfterMinutes: policy.staleAfterMinutes,
              }}
              atRetrieval={status.state}
            />
          ) : (
            <StatusChip status={status.kind === "freshness" ? "undated" : status.kind} />
          )}
          {snapshot.outcome === "partial" ? (
            <span className="mt-1 block text-signal-ink">
              Partial: {showIssues ? "see the notes below." : "see the notice above."}
            </span>
          ) : null}
        </dd>
      </div>
      {showIssues && snapshot.issues.length > 0 ? (
        <div className="sm:col-span-2 lg:col-span-4">
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
  );
}
