import { evidenceLadder } from "@/content/evidence";

export type EvidenceLevelId = "observation" | "interpretation" | "attribution" | "legal-responsibility";

/**
 * Marks which rung of the evidence ladder a block of content belongs to:
 * "Level 1 · Observation", and so on. The meter is decorative; the text
 * carries the meaning. For light surfaces.
 */
export function EvidenceLevelTag({ level }: { level: EvidenceLevelId }) {
  const index = evidenceLadder.findIndex((rung) => rung.id === level);
  const rung = evidenceLadder[index];
  if (!rung) {
    throw new Error(`Unknown evidence level "${level}".`);
  }
  const total = evidenceLadder.length;

  return (
    <span className="label-mono inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 border border-ink bg-paper px-2.5 py-1 text-ink">
      <span aria-hidden="true" className="flex gap-0.5">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-2.5 ${i <= index ? "bg-signal-ink" : "border border-subtle"}`}
          />
        ))}
      </span>
      <span>
        Level {index + 1}
        <span className="sr-only"> of {total}</span> · {rung.name}
      </span>
    </span>
  );
}
