import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import {
  ExperimentRecord,
  PlannedExperimentRecord,
} from "@/components/experiments/experiment-record";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { experiments, statusLabel, type ExperimentStatus } from "@/content/experiments";
import { repoFile, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "The public experiment log of JEREBU.EXE. Each numbered experiment records its question, human input, AI involvement, status, output, human review and cost — mistakes included.",
};

/** Order used by the status key and the log summary. */
const statusOrder: readonly ExperimentStatus[] = ["planned", "in-progress", "complete"];

/** What each status means on this site. Keep in step with ExperimentStatus. */
const statusMeaning: Record<ExperimentStatus, string> = {
  planned: "Proposed, not started. Nothing has been produced.",
  "in-progress": "Work has started, or has finished and is waiting for human review.",
  complete: "Finished and reviewed by a human, with the outcome recorded.",
};

const proposalChecklist = [
  "The question the experiment would try to answer.",
  "The public sources or data it would rely on.",
  "What humans would decide, and what AI would do.",
  "How the result would be checked, and by whom.",
  "What could go wrong, or be misread.",
];

const issuesUrl = `${site.repoUrl}/issues`;

const started = experiments.filter((experiment) => experiment.status !== "planned");
const planned = experiments.filter((experiment) => experiment.status === "planned");

const summary = [
  { label: "Entries", value: experiments.length },
  ...statusOrder.map((status) => ({
    label: statusLabel[status],
    value: experiments.filter((experiment) => experiment.status === status).length,
  })),
];

export default function ExperimentsPage() {
  return (
    <>
      {/* ──────────────────────────── HEADER ──────────────────────────── */}
      <section aria-labelledby="experiments-title" className="surface-dark">
        <Container className="pt-14 pb-16 sm:pt-20 sm:pb-20">
          <p className="label-mono text-ink-muted">Experiment log</p>
          <h1
            id="experiments-title"
            className="mt-6 max-w-4xl text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl"
          >
            Every step is an experiment.
          </h1>
          <div className="mt-8 max-w-2xl space-y-4 text-lg leading-relaxed text-ink-muted sm:text-xl">
            <p>
              JEREBU.EXE moves forward as numbered, public experiments. Each one records the
              question it asks, what humans provided, what the AI did, its status, what it
              produced, what human review it needs and what it cost — including what went wrong.
            </p>
            <p>
              So far, this is a log of how the project itself is being built. It is not a set of
              findings about haze.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink-line pt-6 sm:flex sm:flex-wrap sm:gap-x-14">
            {summary.map((item) => (
              <div key={item.label}>
                <dt className="label-mono text-ink-muted">{item.label}</dt>
                <dd className="mt-1 font-mono text-3xl font-bold">
                  <span aria-hidden="true">{String(item.value).padStart(2, "0")}</span>
                  <span className="sr-only">{item.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ────────────────────────── STATUS KEY ────────────────────────── */}
      <section aria-labelledby="status-key" className="bg-paper">
        <Container className="py-10 sm:py-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <h2 id="status-key" className="label-mono text-muted lg:col-span-3">
              Status key
            </h2>
            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-3 lg:col-span-9">
              {statusOrder.map((status) => (
                <div key={status} className="border-t-2 border-ink pt-4">
                  <dt>
                    <StatusBadge status={status} />
                  </dt>
                  <dd className="mt-3 text-sm leading-relaxed text-muted">
                    {statusMeaning[status]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* ──────────────────────────── RECORDS ─────────────────────────── */}
      <section aria-labelledby="records" className="pt-6 pb-20 sm:pt-8 sm:pb-28">
        <Container>
          <SectionHeader index="01" eyebrow="Records" id="records" title="What has been tried so far.">
            <p>
              An experiment gets a full record once it starts. Records are written while the
              work happens, so they can be incomplete. A record drafted by an AI agent is that
              agent&rsquo;s own account until a human has reviewed it.
            </p>
          </SectionHeader>
          <div className="space-y-10">
            {started.map((experiment) => (
              <ExperimentRecord key={experiment.id} experiment={experiment} />
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────────────────── PLANNED ─────────────────────────── */}
      <section aria-labelledby="planned" className="pb-20 sm:pb-28">
        <Container>
          <SectionHeader index="02" eyebrow="Planned" id="planned" title="What might come next.">
            <p>
              None of these experiments has started, and nothing has been produced for them.
              Their order, scope and questions may change as earlier experiments report back.
            </p>
            <p className="mt-4">
              The names come from the founder&rsquo;s brief. The questions were drafted by AI
              during Experiment 001 and, like the rest of this site, are awaiting human review.
            </p>
          </SectionHeader>
          <div className="divide-y divide-dashed divide-subtle border-2 border-dashed border-subtle bg-paper-2">
            {planned.map((experiment) => (
              <PlannedExperimentRecord key={experiment.id} experiment={experiment} />
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────────────────── PROPOSE ─────────────────────────── */}
      <section aria-labelledby="propose" className="surface-dark py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="03"
            eyebrow="Take part"
            id="propose"
            title="Propose or challenge an experiment."
            surface="dark"
          >
            <p>
              If an experiment asks the wrong question, leans on a weak source or claims more
              than its evidence shows, say so. Proposals and challenges happen in the open on
              GitHub, where anyone can read and check them.
            </p>
          </SectionHeader>

          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="text-2xl font-bold tracking-tight">A useful proposal says</h3>
              <ol className="mt-6 border-t border-ink-line">
                {proposalChecklist.map((item, i) => (
                  <li key={item} className="flex gap-4 border-b border-ink-line py-4 leading-relaxed">
                    <span aria-hidden="true" className="font-mono text-sm leading-relaxed text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-5">
              <div className="flex flex-col gap-4">
                <ButtonLink href={issuesUrl} surface="dark" external>
                  Open an issue on GitHub
                </ButtonLink>
                <ButtonLink href={repoFile("CONTRIBUTING.md")} surface="dark" variant="secondary" external>
                  Read the contributing guide
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-ink-muted">
                This site has no forms. Opening an issue needs a GitHub account, and issues are
                public: please do not post personal health information or confidential
                documents.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                No GitHub account? Write to{" "}
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="whitespace-nowrap text-paper underline underline-offset-4 hover:text-signal"
                >
                  {site.contactEmail}
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
