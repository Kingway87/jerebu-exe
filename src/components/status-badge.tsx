import { statusLabel, type ExperimentStatus } from "@/content/experiments";

const styles: Record<ExperimentStatus, string> = {
  planned: "border-line text-muted",
  "in-progress": "border-ink text-ink",
  complete: "border-ink bg-ink text-paper",
};

const dot: Record<ExperimentStatus, string> = {
  planned: "border border-subtle",
  "in-progress": "bg-signal",
  complete: "bg-paper",
};

/** Experiment status. The text label carries the meaning; colour is secondary. */
export function StatusBadge({ status }: { status: ExperimentStatus }) {
  return (
    <span
      className={`label-mono inline-flex items-center gap-2 border px-2.5 py-1 whitespace-nowrap ${styles[status]}`}
    >
      <span aria-hidden="true" className={`size-2 rounded-full ${dot[status]}`} />
      {statusLabel[status]}
    </span>
  );
}
