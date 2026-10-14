import { formatThreshold } from "@/lib/live/freshness";
import { liveSources } from "@/lib/live/registry";

const pipeline = [
  { name: "Source", note: "Official public data, read on the server" },
  { name: "Fetch", note: "Timeouts, size limits, honest User-Agent" },
  { name: "Validate", note: "Documented format, units and ranges" },
  { name: "Normalise", note: "One observation format, with provenance" },
  { name: "Cache", note: "Prerendered, refreshed in the background" },
  { name: "Display", note: "With source, times and status" },
];

/**
 * How the page works: the implemented pipeline, the freshness thresholds
 * from the registry, and what the page does not do.
 */
export function HowItWorks() {
  const fetched = liveSources.filter((s) => s.freshness !== null);

  return (
    <div className="space-y-14">
      <figure>
        <ol className="grid grid-cols-1 gap-px border-2 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-6">
          {pipeline.map((stage, i) => (
            <li key={stage.name} className="bg-paper p-5">
              <span className="label-mono text-muted">
                {String(i + 1).padStart(2, "0")}
                <span aria-hidden="true">
                  {" "}
                  {i < pipeline.length - 1 ? (
                    <>
                      <span className="sm:hidden">↓</span>
                      <span className="hidden sm:inline">→</span>
                    </>
                  ) : (
                    "■"
                  )}
                </span>
              </span>
              <span className="mt-3 block text-lg font-bold tracking-tight">{stage.name}</span>
              <span className="mt-1 block text-sm text-muted">{stage.note}</span>
            </li>
          ))}
        </ol>
        <figcaption className="mt-4 max-w-3xl leading-relaxed text-muted">
          <strong className="font-semibold text-ink">Implemented in Experiment 003.</strong> Every step is
          ordinary, deterministic code. No AI model fetches, checks, converts or summarises any value.
          An optional seventh step, AI interpretation, is <em>not</em> implemented: if it is ever added, its
          output will be stored and labelled separately from the observations, and reviewed by a human
          before it is shown.
        </figcaption>
      </figure>

      <div>
        <h3 className="text-2xl font-bold tracking-tight">Freshness thresholds</h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          Each source publishes on its own cycle, so “recent” means something different for each. Age is
          measured from the time the data describes (or, where stated, the time it was retrieved), and is
          re-checked in your browser against your clock.
        </p>
        <ul className="mt-6 border-t-2 border-ink">
          {fetched.map((source) => {
            const policy = source.freshness;
            if (!policy) return null;
            return (
              <li key={source.id} className="grid gap-x-8 gap-y-2 border-b border-line py-5 md:grid-cols-12">
                <p className="font-semibold tracking-tight md:col-span-3">{source.name}</p>
                <dl className="grid grid-cols-3 gap-4 text-sm md:col-span-4">
                  <div>
                    <dt className="label-mono text-muted">Recent</dt>
                    <dd className="mt-1">up to {formatThreshold(policy.recentMaxMinutes)}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-muted">Delayed</dt>
                    <dd className="mt-1">up to {formatThreshold(policy.staleAfterMinutes)}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-muted">Stale</dt>
                    <dd className="mt-1">older</dd>
                  </div>
                </dl>
                <p className="text-sm leading-relaxed text-muted md:col-span-5">
                  Measured from the {policy.basis === "observedAt" ? "observation time" : "retrieval time"}.{" "}
                  {policy.rationale}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
