import Link from "next/link";
import { experiments } from "@/content/experiments";
import { StatusBadge } from "./status-badge";

/**
 * One line per experiment: ID, name, status. Rows link to the matching
 * record on /experiments.
 */
export function ExperimentLog() {
  return (
    <ol className="border-t-2 border-ink">
      {experiments.map((experiment) => (
        <li key={experiment.id} className="border-b border-line">
          <Link
            href={`/experiments#exp-${experiment.id}`}
            className="group grid grid-cols-[3.5rem_1fr] items-center gap-x-4 gap-y-2 py-5 sm:grid-cols-[4.5rem_1fr_auto]"
          >
            <span className="font-mono text-sm text-muted">{experiment.id}</span>
            <span className="font-semibold tracking-tight uppercase group-hover:underline group-hover:underline-offset-4 sm:text-lg">
              {experiment.name}
            </span>
            <span className="col-start-2 sm:col-start-auto">
              <StatusBadge status={experiment.status} />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
