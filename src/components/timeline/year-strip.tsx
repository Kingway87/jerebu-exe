import Link from "next/link";
import { yearIndex } from "@/content/haze-history";
import { episodeHref } from "./links";

/**
 * Every year of the study period at a glance: which years hold an episode in
 * this timeline, and which hold a legal or policy milestone. A blank year is
 * not a year without haze; it is a year with no episode that met the
 * timeline's criteria in the sources searched. The text carries the meaning;
 * the fill is secondary.
 */
export function YearStrip() {
  const years = yearIndex();
  return (
    <div>
      <ol className="grid grid-cols-5 border-t border-l border-ink sm:grid-cols-10">
        {years.map(({ year, events, milestones }) => {
          // A year normally holds at most one episode; if two start in one
          // year, the square links to the first and says how many there are.
          const event = events[0];
          const ongoing = events.some((e) => e.ongoing);
          const hasMilestone = milestones.length > 0;
          const description = [
            events.length === 0
              ? "no episode in this timeline"
              : events.length === 1
                ? "haze episode in this timeline"
                : `${events.length} haze episodes in this timeline`,
            ongoing ? "ongoing at the time of research" : null,
            hasMilestone ? `${milestones.length} milestone${milestones.length > 1 ? "s" : ""}` : null,
          ]
            .filter(Boolean)
            .join(", ");
          const body = (
            <>
              <span className="font-mono text-sm font-semibold tabular-nums">{year}</span>
              <span aria-hidden="true" className="flex items-center gap-1.5 font-mono text-xs leading-none">
                {event ? <span>■</span> : null}
                {ongoing ? <span>…</span> : null}
                {hasMilestone ? <span>◆</span> : null}
              </span>
              <span className="sr-only">: {description}</span>
            </>
          );
          return (
            <li key={year} className="border-r border-b border-ink">
              {event ? (
                <Link
                  href={episodeHref(event.id)}
                  className="flex h-full min-h-16 flex-col justify-between gap-2 bg-ink p-2 text-paper hover:bg-graphite sm:min-h-20 sm:p-3"
                >
                  {body}
                </Link>
              ) : (
                <span
                  className={`flex h-full min-h-16 flex-col justify-between gap-2 p-2 sm:min-h-20 sm:p-3 ${
                    hasMilestone ? "text-ink" : "text-muted"
                  }`}
                >
                  {body}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <ul aria-label="Key" className="label-mono mt-4 flex flex-wrap gap-x-6 gap-y-2 text-muted">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-flex size-4 items-center justify-center bg-ink text-[0.625rem] text-paper">
            ■
          </span>
          Episode in this timeline
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="font-mono">
            ◆
          </span>
          Milestone (law, policy, institution, diplomacy or measurement)
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="font-mono">
            …
          </span>
          Ongoing at the time of research
        </li>
      </ul>
    </div>
  );
}
