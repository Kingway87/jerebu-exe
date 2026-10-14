import { Fragment } from "react";
import { ExternalLink } from "@/components/external-link";
import {
  jurisdictionLabel,
  sourcesByJurisdiction,
  type SourceStatus,
} from "@/content/sources";

/**
 * Status wording, in parts. The first part names the status; the rest say
 * what it means. Every source in V0 is a candidate.
 */
const statusParts: Record<SourceStatus, readonly string[]> = {
  candidate: ["Candidate", "not evaluated", "not integrated"],
  evaluated: ["Evaluated", "not integrated"],
  integrated: ["Integrated"],
};

/** Parts joined by " · ". Wraps only between parts, keeping the dot at the line end. */
function Parts({ parts }: { parts: readonly string[] }) {
  return parts.map((part, i) => (
    <Fragment key={part}>
      {i > 0 ? " " : null}
      <span className="whitespace-nowrap">
        {part}
        {i < parts.length - 1 ? " ·" : null}
      </span>
    </Fragment>
  ));
}

/**
 * Candidate public sources, grouped by jurisdiction. Stacked rows rather
 * than a table so the list stays readable on narrow screens.
 */
export function CandidateSourceList() {
  const groups = sourcesByJurisdiction().filter((group) => group.sources.length > 0);

  return (
    <div className="space-y-14">
      {groups.map(({ jurisdiction, sources }) => {
        // When every source in a group shares a status, its meaning is stated
        // once in the group header and each row shows only the status name.
        const shared = sources.every((source) => source.status === sources[0].status)
          ? sources[0].status
          : null;
        const count = `${sources.length} ${sources.length === 1 ? "candidate" : "candidates"}`;

        return (
          <div key={jurisdiction}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-ink pb-3">
              <h3 id={`sources-${jurisdiction}`} className="text-2xl font-bold tracking-tight">
                {jurisdictionLabel[jurisdiction]}
              </h3>
              <p className="label-mono text-muted">
                <Parts parts={shared ? [count, ...statusParts[shared].slice(1)] : [count]} />
              </p>
            </div>
            <ul aria-labelledby={`sources-${jurisdiction}`}>
              {sources.map((source) => (
                <li
                  key={source.name}
                  className="grid gap-x-8 gap-y-3 border-b border-line py-6 md:grid-cols-12"
                >
                  <div className="md:col-span-5">
                    <p className="label-mono text-muted">{source.kind}</p>
                    <p className="mt-2 text-lg leading-snug font-semibold tracking-tight">
                      <ExternalLink
                        href={source.url}
                        className="underline decoration-1 underline-offset-4 hover:decoration-2"
                      >
                        {source.name}
                      </ExternalLink>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{source.operator}</p>
                  </div>
                  {source.note ? (
                    <p className="text-sm leading-relaxed text-muted md:col-span-4">{source.note}</p>
                  ) : null}
                  <p className="label-mono text-subtle md:col-span-3 md:col-start-10 md:text-right">
                    <span className="sr-only">Status: </span>
                    <Parts
                      parts={
                        shared ? statusParts[source.status].slice(0, 1) : statusParts[source.status]
                      }
                    />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
