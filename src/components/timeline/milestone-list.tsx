import {
  formatDate,
  getEvent,
  jurisdictionName,
  milestoneKindName,
  reviewStageName,
  type Milestone,
} from "@/content/haze-history";
import Link from "next/link";
import { ClaimList } from "./claim-list";
import { episodeHref, milestoneAnchor } from "./links";

/** Milestone kind tag. The text carries the meaning. */
export function KindTag({ kind }: { kind: Milestone["kind"] }) {
  return (
    <span className="label-mono inline-flex bg-ink px-2 py-0.5 whitespace-nowrap text-paper">
      {milestoneKindName[kind]}
    </span>
  );
}

/**
 * Legal, policy, institutional and diplomatic milestones, in date order.
 * Kept separate from the haze episodes on purpose: an agreement, a law, an
 * enforcement action and a court outcome are different things, and none of
 * them is an environmental event.
 */
export function MilestoneList({ milestones }: { milestones: readonly Milestone[] }) {
  return (
    <ol className="border-t-2 border-ink">
      {milestones.map((m) => {
        const anchor = milestoneAnchor(m.id);
        const events = m.relatedEvents.map((id) => getEvent(id)).filter((e) => e !== undefined);
        return (
          <li
            key={m.id}
            id={anchor}
            className="grid gap-x-10 gap-y-3 border-b border-line py-8 md:grid-cols-12"
          >
            <div className="md:col-span-3">
              <p className="font-mono text-sm font-semibold">{formatDate(m.date)}</p>
              <p className="mt-2 flex flex-wrap gap-1.5">
                <KindTag kind={m.kind} />
              </p>
              <p className="label-mono mt-2 text-muted">
                {m.jurisdictions.map((j) => jurisdictionName[j]).join(" · ")}
              </p>
            </div>
            <div className="min-w-0 md:col-span-9">
              <h2 className="text-xl leading-snug font-semibold tracking-tight">{m.title}</h2>
              <details className="group/statements mt-4">
                <summary className="label-mono inline-flex min-h-11 cursor-pointer list-none items-center gap-2 underline-offset-4 hover:text-signal-ink hover:underline [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true" className="font-mono group-open/statements:hidden">
                    +
                  </span>
                  <span aria-hidden="true" className="hidden font-mono group-open/statements:inline">
                    −
                  </span>
                  <span className="group-open/statements:hidden">Show</span>
                  <span className="hidden group-open/statements:inline">Hide</span>{" "}
                  {m.claims.length === 1 ? "the sourced statement" : `the ${m.claims.length} sourced statements`}
                  <span className="sr-only"> for: {m.title}</span>
                </summary>
                <div className="mt-3">
                  <ClaimList claims={m.claims} />
                </div>
              </details>
              <p className="label-mono mt-5 flex flex-wrap gap-x-4 gap-y-1 text-muted">
                <span>Review: {reviewStageName[m.review.stage]}</span>
                {events.length ? (
                  <span>
                    Related episode{events.length > 1 ? "s" : ""}:{" "}
                    {events.map((e, i) => (
                      <span key={e.id}>
                        {i > 0 ? ", " : null}
                        <Link
                          href={episodeHref(e.id)}
                          className="text-ink underline underline-offset-4 hover:text-signal-ink"
                        >
                          {e.period.label}
                        </Link>
                      </span>
                    ))}
                  </span>
                ) : null}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
