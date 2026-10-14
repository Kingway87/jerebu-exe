import { loopSteps } from "@/content/loop";

/**
 * The recurring public-attention cycle as an ordered list. The final step
 * points back to the first. Arrows are decorative; order is carried by <ol>.
 */
export function LoopDiagram() {
  const last = loopSteps.length - 1;

  return (
    <ol className="grid grid-cols-1 border-t-2 border-l-2 border-ink sm:grid-cols-2 xl:grid-cols-7">
      {loopSteps.map((step, i) => (
        <li
          key={step.name}
          className={`relative flex min-h-36 flex-col border-r-2 border-b-2 border-ink p-5 ${
            i === last ? "bg-ink text-paper sm:col-span-2 xl:col-span-1" : "bg-paper"
          }`}
        >
          <span
            className={`label-mono flex items-center justify-between ${
              i === last ? "text-signal" : "text-muted"
            }`}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className="text-base">
              {i === last ? "↺ 01" : <><span className="sm:hidden">↓</span><span className="hidden xl:inline">→</span></>}
            </span>
          </span>
          <span className="mt-6 text-xl leading-tight font-bold tracking-tight">{step.name}</span>
          <span
            className={`mt-2 text-sm leading-snug ${i === last ? "text-ink-muted" : "text-muted"}`}
          >
            {step.note}
          </span>
        </li>
      ))}
    </ol>
  );
}
