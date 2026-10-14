import { displayStatusLabel, type DisplayStatus } from "@/lib/live/status";

const styles: Record<DisplayStatus, string> = {
  recent: "border-ink bg-ink text-paper",
  delayed: "border-ink bg-paper text-ink",
  stale: "border-dashed border-ink bg-paper text-ink",
  undated: "border-dashed border-ink bg-paper text-muted",
  unavailable: "border-signal-ink bg-paper text-signal-ink",
  "not-configured": "border-dashed border-signal-ink bg-paper text-signal-ink",
  "not-integrated": "border-dashed border-subtle bg-paper text-muted",
};

/** A second, non-colour cue for each status. Decorative: the text carries the meaning. */
const glyphs: Record<DisplayStatus, string> = {
  recent: "●",
  delayed: "◐",
  stale: "○",
  undated: "?",
  unavailable: "×",
  "not-configured": "–",
  "not-integrated": "↗",
};

/** Source status for light surfaces. The label text carries the meaning. */
export function StatusChip({ status }: { status: DisplayStatus }) {
  return (
    <span
      className={`label-mono inline-flex items-center gap-2 border px-2.5 py-1 whitespace-nowrap ${styles[status]}`}
    >
      <span aria-hidden="true">{glyphs[status]}</span>
      {displayStatusLabel[status]}
    </span>
  );
}
