import { Inequality } from "@/components/inequality";
import {
  attributionChain,
  canAnswer,
  cannotAnswerYet,
  deliberatelyExcluded,
  ladderOnThisPage,
  whyNoAttribution,
  windFallacy,
} from "@/content/live";
import { evidenceLadder } from "@/content/evidence";
import { EvidenceLevelTag } from "./evidence-level-tag";
import { InequalityChain } from "./inequality-chain";

export interface ObservationSummary {
  /** One factual sentence generated from the data, by code. */
  text: string;
  /** Short source label, e.g. "NEA via data.gov.sg". */
  source: string;
}

/**
 * "What this means": the observations, stated plainly, kept apart from the
 * interpretive questions the page does not answer.
 */
export function WhatThisMeans({ summaries }: { summaries: readonly ObservationSummary[] }) {
  return (
    <div className="space-y-14">
      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="meaning-observed" className="border-2 border-ink p-6 sm:p-8">
          <EvidenceLevelTag level="observation" />
          <h3 id="meaning-observed" className="mt-4 text-2xl font-bold tracking-tight">
            What the sources report now
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Generated from the data above by fixed rules in the code, not written by AI. Each line
            restates published values.
          </p>
          {summaries.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {summaries.map((summary) => (
                <li key={summary.text} className="flex gap-3 leading-relaxed">
                  <span aria-hidden="true" className="font-mono text-signal-ink">
                    —
                  </span>
                  <span>
                    {summary.text} <span className="text-sm text-muted">({summary.source})</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 font-semibold">
              No source could be read when this page was built, so there are no observations to
              restate. That is a gap in the data, not a finding.
            </p>
          )}
        </section>

        <section aria-labelledby="meaning-interpretation" className="border-2 border-dashed border-subtle bg-paper-2 p-6 sm:p-8">
          <EvidenceLevelTag level="interpretation" />
          <h3 id="meaning-interpretation" className="mt-4 text-2xl font-bold tracking-tight">
            What it might mean is a separate question
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            These are interpretive questions. The page does not answer them automatically. Each needs
            more than the data shown here.
          </p>
          <dl className="mt-6 space-y-5">
            {cannotAnswerYet.map((item) => (
              <div key={item.question}>
                <dt className="font-semibold">{item.question}</dt>
                <dd className="mt-1 leading-relaxed text-muted">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight">What the data on this page can help with</h3>
        <dl className="mt-6 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2">
          {canAnswer.map((item) => (
            <div key={item.question} className="bg-paper p-5">
              <dt className="font-semibold">{item.question}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight">Where this page sits on the evidence ladder</h3>
        <ol className="mt-6 border-t-2 border-ink">
          {ladderOnThisPage.map((step) => {
            const rung = evidenceLadder.find((r) => r.id === step.level);
            return (
              <li key={step.level} className="grid gap-x-8 gap-y-3 border-b border-line py-6 md:grid-cols-12">
                <div className="md:col-span-3">
                  <EvidenceLevelTag level={step.level} />
                  {rung ? <p className="mt-3 text-sm leading-relaxed text-muted">{rung.definition}</p> : null}
                </div>
                <ul className="space-y-1.5 leading-relaxed md:col-span-5">
                  {step.examples.map((example) => (
                    <li key={example} className="flex gap-2">
                      <span aria-hidden="true" className="font-mono text-muted">
                        e.g.
                      </span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
                <p className="leading-relaxed font-semibold md:col-span-4">{step.onThisPage}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/** "What this does not mean": the attribution boundary, stated as plainly as possible. */
export function WhatThisDoesNotMean() {
  return (
    <div className="space-y-14">
      <div className="space-y-8 border-y-2 border-ink py-10">
        <InequalityChain terms={attributionChain} />
        <Inequality left={windFallacy.premises.join(" + ")} right={windFallacy.conclusion} />
        <p className="max-w-3xl leading-relaxed text-muted">
          Each sign marks a step that needs its own, separate evidence. Seeing the first item, or
          the first two together, never establishes anything to its right.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight">
          Why this page cannot identify a responsible company, or establish legal responsibility
        </h3>
        <ol className="mt-6 grid gap-px border-2 border-ink bg-ink md:grid-cols-2 lg:grid-cols-3">
          {whyNoAttribution.map((reason, i) => (
            <li key={reason.title} className="bg-paper p-6">
              <span aria-hidden="true" className="font-mono text-sm text-signal-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="mt-3 text-lg font-bold tracking-tight">{reason.title}</h4>
              <p className="mt-2 leading-relaxed text-muted">{reason.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-paper-2 p-6 sm:p-8">
        <h3 className="text-xl font-bold tracking-tight">Deliberately left out of this page</h3>
        <ul className="mt-4 space-y-2">
          {deliberatelyExcluded.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed">
              <span aria-hidden="true" className="font-mono text-signal-ink">
                ×
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
