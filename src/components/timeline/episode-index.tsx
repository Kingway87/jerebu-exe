import Link from "next/link";
import {
  confidenceName,
  criterionName,
  hazeEvents,
  jurisdictionName,
} from "@/content/haze-history";
import { episodeHref } from "./links";

/**
 * The episodes in one list: when, where, which selection criteria each met,
 * and how confident the record is. A table would need sideways scrolling on a
 * phone, so each row is a small grid that reflows instead.
 */
export function EpisodeIndex() {
  return (
    <ol className="border-t-2 border-ink">
      {hazeEvents.map((event) => (
        <li
          key={event.id}
          className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-line py-4 sm:grid-cols-[5rem_minmax(0,1fr)_auto]"
        >
          <span className="font-mono text-lg font-bold tabular-nums">
            {event.period.start.slice(0, 4)}
          </span>
          <div className="min-w-0">
            <Link
              href={episodeHref(event.id)}
              className="font-semibold underline underline-offset-4 hover:text-signal-ink"
            >
              {event.title}
            </Link>
            <p className="mt-1 text-sm text-muted">
              {event.period.label}
              {event.ongoing ? " · ongoing at the time of research" : ""} ·{" "}
              {event.jurisdictions.map((code) => jurisdictionName[code]).join(", ")}
            </p>
          </div>
          <dl className="col-start-2 flex flex-wrap gap-x-6 gap-y-1 text-sm sm:col-start-3 sm:justify-end sm:text-right">
            <div>
              <dt className="label-mono text-muted">Criteria met</dt>
              <dd className="mt-0.5 font-mono">
                {event.selection.criteria.map((c, i) => (
                  <span key={c.criterion}>
                    {i > 0 ? " · " : ""}
                    <abbr title={criterionName[c.criterion]} className="no-underline">
                      {c.criterion}
                    </abbr>
                    <span className="sr-only"> ({criterionName[c.criterion]})</span>
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="label-mono text-muted">Confidence</dt>
              <dd className="mt-0.5 font-semibold">{confidenceName[event.confidence.level]}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}
