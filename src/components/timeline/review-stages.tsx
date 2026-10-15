import { reviewStageName, reviewStages, type ReviewStage } from "@/content/haze-history";

/** What each review stage means. Mirrors docs/AI_TRANSPARENCY.md. */
export const reviewStageMeaning: Record<ReviewStage, string> = {
  "ai-generated": "An AI agent selected the episodes, read the sources and wrote the entries.",
  "source-attached":
    "Every statement links to a source the agent opened, with the exact passage it relied on.",
  "human-checked":
    "A named person has read the entries and spot-checked sources, but not every claim.",
  "human-verified":
    "A named person has opened every cited source and confirmed each claim as worded.",
};

/**
 * The four review stages for research content, with the stage reached marked.
 * Each stage includes the ones before it. Only a human can complete the last
 * two. Built for dark surfaces.
 */
export function ReviewStages({ stage }: { stage: ReviewStage }) {
  const reached = reviewStages.indexOf(stage);
  return (
    <ol className="grid gap-px border border-ink-line bg-ink-line sm:grid-cols-2 lg:grid-cols-4">
      {reviewStages.map((s, i) => {
        const done = i <= reached;
        return (
          <li key={s} className="bg-ink p-5">
            <p className="label-mono flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`inline-block size-2.5 ${done ? "bg-signal" : "border border-ink-muted"}`}
              />
              <span className={done ? "text-paper" : "text-ink-muted"}>{reviewStageName[s]}</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{reviewStageMeaning[s]}</p>
            <p className="label-mono mt-3 text-ink-muted">{done ? "Done" : "Not yet"}</p>
          </li>
        );
      })}
    </ol>
  );
}
