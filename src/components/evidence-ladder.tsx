import { evidenceLadder } from "@/content/evidence";

interface EvidenceLadderProps {
  /** "compact" for summaries; "full" adds the example and what each level requires. */
  variant?: "compact" | "full";
}

/**
 * Observation → interpretation → attribution → legal responsibility.
 * Each level demands more evidence than the one before it.
 */
/** Decorative meter: how much evidence a level demands, relative to the others. */
function EvidenceMeter({ level, total }: { level: number; total: number }) {
  return (
    <span aria-hidden="true" className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-2 w-4 ${i < level ? "bg-signal-ink" : "border border-subtle"}`}
        />
      ))}
    </span>
  );
}

export function EvidenceLadder({ variant = "compact" }: EvidenceLadderProps) {
  const full = variant === "full";

  return (
    <ol className={`grid gap-0 border-t-2 border-ink ${full ? "" : "md:grid-cols-4"}`}>
      {evidenceLadder.map((level, i) => (
        <li
          key={level.id}
          id={full ? level.id : undefined}
          className={`border-b-2 border-ink py-6 ${
            full ? "grid gap-6 md:grid-cols-12" : "md:border-r-2 md:px-5 md:last:border-r-0 md:first:pl-0"
          }`}
        >
          <div className={full ? "md:col-span-4" : ""}>
            <p className="label-mono flex items-center justify-between gap-4 text-muted">
              <span>
                Level {i + 1}
                <span className="sr-only"> of {evidenceLadder.length}</span>
              </span>
              <EvidenceMeter level={i + 1} total={evidenceLadder.length} />
            </p>
            <h3 className={`mt-3 font-bold tracking-tight ${full ? "text-3xl" : "text-2xl"}`}>
              {level.name}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">{level.definition}</p>
          </div>
          {full ? (
            <dl className="grid gap-5 md:col-span-8 md:grid-cols-2">
              <div className="bg-paper-2 p-5">
                <dt className="label-mono text-muted">Example</dt>
                <dd className="mt-2 leading-relaxed">{level.example}</dd>
              </div>
              <div className="border-2 border-ink p-5">
                <dt className="label-mono text-muted">Requires</dt>
                <dd className="mt-2 leading-relaxed">{level.requires}</dd>
              </div>
            </dl>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
