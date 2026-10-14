import type { ReactNode } from "react";
import { ExternalLink } from "@/components/external-link";
import { StatusBadge } from "@/components/status-badge";
import type { Experiment } from "@/content/experiments";
import { repoFile } from "@/content/site";

/**
 * Experiment records for /experiments.
 *
 * Each record is an <article> whose id is `exp-${id}`: the homepage log links
 * to these anchors (/experiments#exp-001 and so on), so the ids must not
 * change. Every value comes from src/content/experiments.ts; nothing about an
 * experiment is written here.
 */

function anchorFor(id: string) {
  return `exp-${id}`;
}

/** Shown when a full record is missing a field, instead of inventing one. */
const NOT_RECORDED = "Not recorded yet.";

interface RowProps {
  label: string;
  children: ReactNode;
  /** The first row under the ID/name masthead gets the thick rule. */
  first?: boolean;
}

/** One label/value pair of a full record. Stacks on small screens. */
function Row({ label, children, first = false }: RowProps) {
  return (
    <div
      className={`col-span-full grid gap-2 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-baseline sm:gap-0 sm:py-6 ${
        first ? "border-t-2 border-ink" : "border-t border-line"
      }`}
    >
      <dt className="label-mono px-5 text-muted sm:px-8">{label}</dt>
      <dd className="px-5 sm:px-8">{children}</dd>
    </div>
  );
}

function Text({ value }: { value?: string }) {
  if (!value) {
    return <p className="text-muted">{NOT_RECORDED}</p>;
  }
  return <p className="max-w-3xl leading-relaxed sm:text-lg">{value}</p>;
}

/** Full record, used for any experiment that has started. */
export function ExperimentRecord({ experiment }: { experiment: Experiment }) {
  const anchor = anchorFor(experiment.id);
  const titleId = `${anchor}-title`;
  const { phases, output, aiErrors } = experiment;

  return (
    <article id={anchor} aria-labelledby={titleId} className="border-2 border-ink bg-paper">
      <dl className="grid grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <div className="surface-dark flex items-baseline gap-4 px-5 py-4 sm:block sm:px-8 sm:py-8">
          <dt className="label-mono text-ink-muted">ID</dt>
          <dd className="font-mono text-3xl leading-none font-bold sm:mt-4 sm:text-6xl">
            {experiment.id}
          </dd>
        </div>
        <div className="px-5 py-5 sm:px-8 sm:py-8">
          <dt className="label-mono text-muted">Name</dt>
          <dd className="mt-3 sm:mt-4">
            <h3
              id={titleId}
              className="text-2xl leading-[1.05] font-bold tracking-[-0.02em] text-balance uppercase sm:text-4xl"
            >
              <span className="sr-only">Experiment {experiment.id}: </span>
              {experiment.name}
            </h3>
          </dd>
        </div>

        <Row label="Question" first>
          <p className="max-w-3xl font-serif text-xl leading-snug sm:text-2xl lg:text-[1.75rem]">
            {experiment.question}
          </p>
        </Row>

        <Row label="Human input">
          <Text value={experiment.humanInput} />
        </Row>

        <Row label="AI">
          <Text value={experiment.ai} />
        </Row>

        <Row label="Task">
          <Text value={experiment.task} />
        </Row>

        <Row label="Status">
          <StatusBadge status={experiment.status} />
          {phases && phases.length > 0 ? (
            <ul className="mt-4 max-w-md space-y-2 font-mono text-sm">
              {phases.map((phase) => (
                <li key={phase.label} className="flex items-baseline gap-x-3">
                  <span className="min-w-0">{phase.label}</span>
                  <span
                    aria-hidden="true"
                    className="min-w-4 flex-1 border-b border-dotted border-subtle"
                  />
                  <span className="sr-only">: </span>
                  <span className="shrink-0 font-semibold uppercase">{phase.state}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </Row>

        <Row label="Output">
          {output && output.length > 0 ? (
            <ul className="max-w-3xl space-y-3">
              {output.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed sm:text-lg">
                  <span aria-hidden="true" className="font-mono text-signal-ink">
                    –
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Text />
          )}
        </Row>

        {aiErrors && aiErrors.length > 0 ? (
          <Row label="What AI got wrong">
            <ul className="max-w-3xl space-y-3">
              {aiErrors.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed sm:text-lg">
                  <span aria-hidden="true" className="font-mono text-signal-ink">
                    ×
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Row>
        ) : null}

        <Row label="Human review">
          <Text value={experiment.humanReview} />
        </Row>

        <Row label="Cost">
          <Text value={experiment.cost} />
        </Row>
      </dl>

      {experiment.record ? (
        <footer className="flex flex-col gap-3 border-t-2 border-ink bg-paper-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <p className="text-sm leading-relaxed text-muted">
            The full written record lives in the repository, next to the code it describes.
          </p>
          <ExternalLink
            href={repoFile(experiment.record)}
            className="shrink-0 font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink"
          >
            Read the full record on GitHub
          </ExternalLink>
        </footer>
      ) : null}
    </article>
  );
}

/**
 * Short record for a planned experiment: ID, name, question and status only.
 * Deliberately quieter than a full record, and explicit that nothing exists.
 */
export function PlannedExperimentRecord({ experiment }: { experiment: Experiment }) {
  const anchor = anchorFor(experiment.id);
  const titleId = `${anchor}-title`;

  return (
    <article id={anchor} aria-labelledby={titleId}>
      <dl className="grid grid-cols-1 pb-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:pb-7 lg:grid-cols-[12rem_minmax(0,1fr)_17rem]">
        <div className="flex items-baseline gap-4 px-5 pt-5 sm:row-span-3 sm:block sm:px-8 sm:pt-7 lg:row-span-2">
          <dt className="label-mono text-muted">ID</dt>
          <dd className="font-mono text-2xl leading-none font-bold text-muted sm:mt-3 sm:text-4xl">
            {experiment.id}
          </dd>
        </div>
        <div className="px-5 pt-4 sm:col-start-2 sm:px-8 sm:pt-7">
          <dt className="label-mono text-muted">Name</dt>
          <dd className="mt-2">
            <h3
              id={titleId}
              className="text-xl leading-tight font-bold tracking-tight text-graphite uppercase sm:text-2xl"
            >
              <span className="sr-only">Experiment {experiment.id}: </span>
              {experiment.name}
            </h3>
          </dd>
        </div>
        <div className="px-5 pt-4 sm:col-start-2 sm:px-8">
          <dt className="label-mono text-muted">Question</dt>
          <dd className="mt-2 max-w-3xl leading-relaxed text-muted">{experiment.question}</dd>
        </div>
        <div className="px-5 pt-4 sm:col-start-2 sm:px-8 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:pt-7 lg:pl-0">
          <dt className="label-mono text-muted">Status</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <StatusBadge status={experiment.status} />
            {experiment.status === "planned" ? (
              <span className="text-sm text-muted">Not started. Nothing has been produced yet.</span>
            ) : null}
          </dd>
        </div>
      </dl>
    </article>
  );
}
