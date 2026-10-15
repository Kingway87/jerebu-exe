import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { ExternalLink } from "@/components/external-link";
import { SectionHeader } from "@/components/section-header";
import { Disclosure } from "@/components/timeline/disclosure";
import { EpisodeIndex } from "@/components/timeline/episode-index";
import { excludedAnchor, milestoneHref, notIncludedHref } from "@/components/timeline/links";
import { ReviewStages } from "@/components/timeline/review-stages";
import { YearStrip } from "@/components/timeline/year-strip";
import {
  allClaims,
  confidenceName,
  criterionName,
  excludedPeriods,
  formatDate,
  hazeEvents,
  hazeHistory,
  hazeMilestones,
  jurisdictionName,
  milestoneKindName,
  type Milestone,
} from "@/content/haze-history";
import { repoFile, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "Major transboundary haze episodes affecting Malaysia, Singapore or both, 1997–2026, compiled from public sources by an AI research agent. Every labelled statement links to its source. Not yet verified by a human.",
};

const issuesUrl = `${site.repoUrl}/issues`;

const pad = (n: number) => String(n).padStart(2, "0");

const onThisPage = [
  { id: "at-a-glance", label: "At a glance" },
  { id: "episodes", label: "Episodes" },
  { id: "what-changed", label: "What changed" },
  { id: "not-included", label: "Not included" },
  { id: "method", label: "Method" },
];

/**
 * Milestones grouped for "What changed", by kind. Grouping only; no new
 * claims. The entry into force of a regional agreement counts as a regional
 * milestone; the entry into force of a national law counts as a national law.
 */
const changeGroups: { title: string; includes: (m: Milestone) => boolean }[] = [
  {
    title: "Regional agreements",
    includes: (m) =>
      m.kind === "regional-agreement" ||
      m.kind === "ratification" ||
      (m.kind === "entry-into-force" && m.group === "regional"),
  },
  {
    title: "National laws",
    includes: (m) => m.kind === "legislation" || (m.kind === "entry-into-force" && m.group !== "regional"),
  },
  { title: "Policies and institutions", includes: (m) => m.kind === "policy" || m.kind === "institutional" },
  { title: "Enforcement and legal outcomes", includes: (m) => m.kind === "enforcement" || m.kind === "legal-outcome" },
  { title: "Diplomacy", includes: (m) => m.kind === "diplomatic" },
  { title: "How haze is measured", includes: (m) => m.kind === "measurement-change" },
];

const cannotShow = [
  {
    lead: "Whether haze has become more or less frequent or severe.",
    text: "The timeline records selected episodes, not a continuous series of measurements, and the indices used to report air quality changed during the period.",
  },
  {
    lead: "Whether any agreement, law or policy reduced haze.",
    text: "Answering that would need methods this timeline does not use, such as accounting for differences in weather from one year to the next.",
  },
  {
    lead: "Who started any fire, or who is legally responsible.",
    text: "A hotspot, or an agency’s view of where smoke came from, does not show who started a fire, and starting a fire is not the same as legal responsibility, which courts and authorised bodies decide. Where a legal outcome is recorded here, the parties are not named: naming anyone needs human review first.",
  },
  {
    lead: "Anything about a blank year.",
    text: "A year with no entry is a year with no episode that met the criteria in the sources searched. It is not a year without haze.",
  },
];

export default function TimelinePage() {
  const { meta } = hazeHistory;
  const claims = allClaims();
  const stats = [
    { label: "Episodes", value: hazeEvents.length },
    { label: "Milestones", value: hazeMilestones.length },
    { label: "Sourced claims", value: claims.length },
    { label: "Sources", value: hazeHistory.sources.length },
  ];

  return (
    <>
      {/* ──────────────────────────── HEADER ──────────────────────────── */}
      <section aria-labelledby="timeline-title" className="surface-dark">
        <Container className="pt-14 pb-16 sm:pt-20 sm:pb-20">
          <p className="label-mono text-ink-muted">Haze history · Experiment {meta.experiment}</p>
          <h1
            id="timeline-title"
            className="mt-6 max-w-4xl text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl"
          >
            Haze history, {meta.studyPeriod.start}–{meta.studyPeriod.end}.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
            Major transboundary haze episodes affecting Malaysia, Singapore or both, as public
            sources record them. Every labelled statement links to the source it rests on, with the exact
            passage relied on. Notes, reasons and rationales are the AI agent&rsquo;s summaries of
            that evidence.
          </p>

          <div className="mt-10 max-w-3xl border-l-2 border-signal pl-5">
            <p className="font-serif text-2xl leading-snug sm:text-3xl">
              A draft for checking, not a finished history.
            </p>
            <p className="mt-3 leading-relaxed text-ink-muted">
              An AI research agent selected these episodes, read the sources and wrote every
              entry. No human has checked it yet. Until a person verifies an entry, treat it as a
              well-sourced lead, not as established fact. Nothing here says who caused any fire.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink-line pt-6 sm:flex sm:flex-wrap sm:gap-x-14">
            {stats.map((item) => (
              <div key={item.label}>
                <dt className="label-mono text-ink-muted">{item.label}</dt>
                <dd className="mt-1 font-mono text-3xl font-bold tabular-nums">{item.value}</dd>
              </div>
            ))}
            <div>
              <dt className="label-mono text-ink-muted">Compiled</dt>
              <dd className="mt-1 font-mono text-3xl font-bold">
                <time dateTime={meta.compiled}>{formatDate(meta.compiled)}</time>
              </dd>
            </div>
          </dl>

          <h2 className="label-mono mt-12 text-ink-muted">Review stage reached</h2>
          <div className="mt-4">
            <ReviewStages stage={meta.review.stage} />
          </div>

          <nav aria-label="On this page" className="mt-12">
            <p className="label-mono text-ink-muted">On this page</p>
            <ol className="label-mono mt-2 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
              {onThisPage.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex min-h-11 items-center gap-2 text-paper underline-offset-4 hover:text-signal hover:underline"
                  >
                    <span aria-hidden="true" className="text-ink-muted">
                      {pad(i + 1)}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Container>
      </section>

      {/* ────────────────────────── §01 AT A GLANCE ─────────────────────── */}
      <section aria-labelledby="at-a-glance" className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="01"
            eyebrow="At a glance"
            id="at-a-glance"
            title={`${meta.studyPeriod.end - meta.studyPeriod.start + 1} years. ${hazeEvents.length} episodes on the record.`}
          >
            <p>
              Each square is a year. Dark squares are years with an episode in this timeline;
              select one to open it.
            </p>
            <p className="mt-4">
              A light square does not mean there was no haze that year. It means no episode met
              this timeline&rsquo;s criteria in the sources searched.{" "}
              <a href="#not-included" className="text-ink underline underline-offset-4 hover:text-signal-ink">
                See what was considered but not included
              </a>
              .
            </p>
          </SectionHeader>
          <YearStrip />
        </Container>
      </section>

      {/* ─────────────────────────── §02 EPISODES ───────────────────────── */}
      <section aria-labelledby="episodes" className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHeader index="02" eyebrow="Episodes" id="episodes" title="What happened, episode by episode.">
            <p>
              Each episode has its own page: when, what happened, then Malaysia, Singapore, the
              regional context, the response, what changed and the sources. Every statement
              carries a label, such as observation or analysis, and its source passage. Some
              statements labelled analysis go further: the AI agent worked them out itself from
              an agency&rsquo;s published data, such as the highest reading in a year, and the note
              under each says how.
            </p>
            <p className="mt-4">
              Each episode met criterion A and at least one of B1 to B3, set out under{" "}
              <a href="#method" className="text-ink underline underline-offset-4 hover:text-signal-ink">
                Method
              </a>
              . Confidence describes the evidence for an entry, not how severe the episode was.
              Air-quality figures are quoted as each source published them: Malaysia and
              Singapore use different indices, and both changed during this period, so readings
              from different years or countries should not be compared directly.
            </p>
          </SectionHeader>
          <EpisodeIndex />
        </Container>
      </section>

      {/* ──────────────────────── §03 WHAT CHANGED ──────────────────────── */}
      <section aria-labelledby="what-changed" className="surface-dark py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="03"
            eyebrow="What changed?"
            id="what-changed"
            title="After three decades, what is on the record."
            surface="dark"
          >
            <p>
              Legal, policy, institutional, diplomatic and measurement milestones, grouped by
              kind. This is an index, not a verdict: it shows what was agreed, passed, enforced or
              decided, and when. It does not say whether any of it worked.
            </p>
            <p className="mt-4">
              <Link href="/timeline/milestones" className="text-paper underline underline-offset-4 hover:text-signal">
                All {hazeMilestones.length} milestones, by region and country, each with its sources
              </Link>
              .
            </p>
          </SectionHeader>

          <div className="grid gap-px border border-ink-line bg-ink-line sm:grid-cols-2 lg:grid-cols-3">
            {changeGroups.map((group) => {
              const items = hazeMilestones.filter(group.includes);
              return (
                <section key={group.title} aria-label={group.title} className="bg-ink p-6">
                  <h3 className="text-lg font-bold tracking-tight">{group.title}</h3>
                  <p className="label-mono mt-1 text-ink-muted">
                    {items.length} milestone{items.length === 1 ? "" : "s"}
                    {items.length ? `, ${items[0].date.slice(0, 4)}–${items[items.length - 1].date.slice(0, 4)}` : ""}
                  </p>
                  {items.length ? (
                    <details className="group/kind mt-4">
                      <summary className="label-mono inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-paper underline-offset-4 hover:text-signal hover:underline [&::-webkit-details-marker]:hidden">
                        <span aria-hidden="true" className="font-mono group-open/kind:hidden">
                          +
                        </span>
                        <span aria-hidden="true" className="hidden font-mono group-open/kind:inline">
                          −
                        </span>
                        Show the list<span className="sr-only"> of {group.title.toLowerCase()} milestones</span>
                      </summary>
                      <ul className="mt-3 space-y-3">
                        {items.map((m) => (
                          <li key={m.id} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 leading-snug">
                            <span className="font-mono text-sm text-ink-muted">{m.date.slice(0, 4)}</span>
                            <span>
                              <Link
                                href={milestoneHref(m)}
                                className="text-paper underline-offset-4 hover:text-signal hover:underline"
                              >
                                {m.title}
                              </Link>{" "}
                              <span className="label-mono text-ink-muted">
                                · {milestoneKindName[m.kind]} · {m.jurisdictions.map((j) => jurisdictionName[j]).join(", ")}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                      None recorded in this timeline.
                    </p>
                  )}
                </section>
              );
            })}
          </div>

          <div className="mt-14 grid gap-10 border-t border-ink-line pt-10 lg:grid-cols-12">
            <h3 className="text-2xl font-bold tracking-tight lg:col-span-4">
              What this timeline cannot tell you
            </h3>
            <ul className="space-y-5 lg:col-span-8">
              {cannotShow.map((item) => (
                <li key={item.lead} className="flex gap-3 leading-relaxed">
                  <span aria-hidden="true" className="font-mono text-signal">
                    ×
                  </span>
                  <span>
                    <strong className="font-semibold">{item.lead}</strong>{" "}
                    <span className="text-ink-muted">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ─────────────────────── §04 NOT INCLUDED ───────────────────────── */}
      <section aria-labelledby="not-included" className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="04"
            eyebrow="Considered, not included"
            id="not-included"
            title="Years that were checked and left out."
          >
            <p>
              The research did not assume that every year had a major episode. These periods
              were considered and did not meet the criteria, or the evidence found was too thin.
              Leaving a year out is not a claim that there was no haze.
            </p>
          </SectionHeader>
          <p className="mb-6 max-w-2xl leading-relaxed text-muted">
            Open a period to read why it was left out. The sourced facts about each period, with
            their passages, are on a page of their own.
          </p>
          <div className="border-t-2 border-ink">
            {excludedPeriods.map((x) => (
              <Disclosure
                key={x.id}
                title={x.period}
                meta={x.claims.length ? `${x.claims.length} sourced claim${x.claims.length === 1 ? "" : "s"}` : "Reason only"}
              >
                <p className="max-w-3xl leading-relaxed">{x.reason}</p>
                {x.claims.length ? (
                  <p className="mt-4">
                    <Link
                      href={`${notIncludedHref}#${excludedAnchor(x.id)}`}
                      className="font-semibold underline underline-offset-4 hover:text-signal-ink"
                    >
                      {x.claims.length === 1 ? "The sourced statement" : `The ${x.claims.length} sourced statements`}{" "}
                      about this period<span className="sr-only">: {x.period}</span>
                      <span aria-hidden="true"> →</span>
                    </Link>
                  </p>
                ) : null}
              </Disclosure>
            ))}
          </div>
          <p className="mt-8">
            <Link
              href={notIncludedHref}
              className="font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink"
            >
              All {excludedPeriods.length} periods, with their sources<span aria-hidden="true"> →</span>
            </Link>
          </p>
        </Container>
      </section>

      {/* ─────────────────────────── §05 METHOD ─────────────────────────── */}
      <section aria-labelledby="method" className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHeader index="05" eyebrow="Method" id="method" title="How this timeline was made.">
            <p>
              No source, no claim. An AI research agent searched official, intergovernmental,
              scientific, peer-reviewed and news sources, opened each one, and copied the exact
              passage behind every labelled statement. It downloaded every source it cites and
              matched each passage to the text by script. For some statements, labelled
              analysis, it also computed a figure itself from an agency&rsquo;s published data,
              such as the highest reading in a year; these quote the data rows that show the
              values, and a note under each explains the computation. Separate AI checks then
              challenged every entry. None of that is human verification.
            </p>
          </SectionHeader>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Which episodes are included</h3>
              <p className="mt-5 leading-relaxed">
                An episode is included when criterion A and at least one of B1, B2 or B3 are met
                by evidence opened during the research.
              </p>
              <dl className="mt-5 space-y-4">
                {meta.selectionCriteria.definitions.map((c) => (
                  <div key={c.id} className="border-t border-line pt-4">
                    <dt className="label-mono">
                      <span className="text-signal-ink">{c.id}</span> · {criterionName[c.id]}
                    </dt>
                    <dd className="mt-1 leading-relaxed text-muted">{c.text}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                Written on{" "}
                <time dateTime={meta.selectionCriteria.written}>
                  {formatDate(meta.selectionCriteria.written)}
                </time>
                , before the research results were read, and quoted here as written. They are an
                AI proposal awaiting human review.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">What the confidence levels mean</h3>
              <p className="mt-5 leading-relaxed">
                Each rating answers one question: {meta.confidenceMethod.question}
              </p>
              <dl className="mt-5 space-y-4">
                {meta.confidenceMethod.definitions.map((d) => (
                  <div key={d.level} className="border-t border-line pt-4">
                    <dt className="label-mono">{confidenceName[d.level]}</dt>
                    <dd className="mt-1 leading-relaxed text-muted">{d.text}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                {meta.confidenceMethod.note} Each episode page explains its rating under
                &ldquo;Attribution and confidence&rdquo;. Claim labels are defined on the{" "}
                <Link href="/evidence#claim-labels" className="text-ink underline underline-offset-4 hover:text-signal-ink">
                  evidence page
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-12">
            <h3 className="text-2xl font-bold tracking-tight lg:col-span-4">How attribution is handled</h3>
            <dl className="space-y-5 lg:col-span-8">
              <div>
                <dt className="font-semibold">Origin of the smoke: agency assessment</dt>
                <dd className="mt-1 leading-relaxed text-muted">
                  Agencies or studies said where the smoke came from, and no public dispute
                  between governments about it was found in the sources opened. Each assessment
                  is attributed to the body that made it and labelled analysis.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Origin of the smoke: disputed</dt>
                <dd className="mt-1 leading-relaxed text-muted">
                  Governments or officials publicly disagreed about where the smoke came from.
                  Each position is labelled an allegation and attributed, and the timeline does
                  not decide between them.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Who caused the fires: not established</dt>
                <dd className="mt-1 leading-relaxed text-muted">
                  This timeline does not establish who caused any fire or who is legally
                  responsible for any episode. A hotspot is not proof of who owns the land, the
                  owner of the land is not necessarily who started a fire, and starting a fire
                  is not the same as legal responsibility. Where a court or authority has made
                  a finding, it is recorded as a milestone without naming the parties.
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-16 grid gap-6 border-t-2 border-ink pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: repoFile("data/haze-events.json"), label: "The dataset (JSON)" },
              { href: repoFile("docs/research/HAZE_HISTORY.md"), label: "The research notes" },
              { href: repoFile("experiments/002-haze-history.md"), label: "The experiment record" },
              { href: issuesUrl, label: "Report an error" },
            ].map((item) => (
              <ExternalLink
                key={item.label}
                href={item.href}
                className="font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink"
              >
                {item.label}
              </ExternalLink>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
