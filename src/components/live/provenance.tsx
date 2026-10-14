import { ExternalLink } from "@/components/external-link";
import { freshnessAtRetrieval } from "@/lib/live/freshness";
import type { LiveSource } from "@/lib/live/registry";
import type { SourceSnapshot } from "@/lib/live/types";
import { FreshnessLabel } from "./freshness-label";
import { LocalTime } from "./local-time";
import { StatusChip } from "./status-chip";

interface ProvenanceProps {
  source: LiveSource;
  snapshot: Pick<SourceSnapshot, "outcome" | "retrievedAt" | "latestObservedAt" | "issues">;
  /** What the observation time is, e.g. "Reading for" or "Newest detection". */
  observedLabel?: string;
  /** Set to false where the same notes are already shown nearby. */
  showIssues?: boolean;
}

/**
 * Where a block of data came from and how old it is: source, observation
 * time, retrieval time and status, and any notes from validation (for
 * example, a value rejected as implausible, or a response that may be a
 * cached copy). Shown next to every live dataset.
 */
export function Provenance({ source, snapshot, observedLabel = "Observed", showIssues = true }: ProvenanceProps) {
  const policy = source.freshness;
  const fresh = policy ? freshnessAtRetrieval(snapshot, policy) : null;
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
          {snapshot.latestObservedAt ? <LocalTime iso={snapshot.latestObservedAt} /> : <span className="text-muted">None</span>}
        </dd>
      </div>
      <div>
        <dt className="label-mono text-muted">Retrieved by this site</dt>
        <dd className="mt-1">
          {snapshot.retrievedAt ? <LocalTime iso={snapshot.retrievedAt} /> : <span className="text-muted">Not retrieved</span>}
        </dd>
      </div>
      <div>
        <dt className="label-mono text-muted">Status</dt>
        <dd className="mt-1">
          {snapshot.outcome === "unavailable" || snapshot.outcome === "not-configured" ? (
            <StatusChip status={snapshot.outcome === "unavailable" ? "unavailable" : "not-configured"} />
          ) : fresh && policy ? (
            <FreshnessLabel
              basis={fresh.basis}
              basisVerb={basisVerb}
              policy={{
                basis: policy.basis,
                recentMaxMinutes: policy.recentMaxMinutes,
                staleAfterMinutes: policy.staleAfterMinutes,
              }}
              atRetrieval={fresh.state}
            />
          ) : (
            <StatusChip status="unavailable" />
          )}
          {snapshot.outcome === "partial" ? <span className="mt-1 block text-signal-ink">Partial: see notes below.</span> : null}
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
