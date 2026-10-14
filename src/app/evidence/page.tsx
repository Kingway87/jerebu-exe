import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CandidateSourceList } from "@/components/evidence/candidate-source-list";
import { ClaimsRegister } from "@/components/evidence/claims-register";
import { EvidenceLadder } from "@/components/evidence-ladder";
import { ExternalLink } from "@/components/external-link";
import { Inequality } from "@/components/inequality";
import { NotYetBuilt } from "@/components/not-yet-built";
import { PipelineDiagram } from "@/components/pipeline-diagram";
import { SectionHeader } from "@/components/section-header";
import { siteClaims } from "@/content/claims";
import {
  claimTypes,
  inequalities,
  safetyRules,
  sourceCategories,
} from "@/content/evidence";
import { repoFile, site } from "@/content/site";
import { candidateSources, sourcesCheckedOn } from "@/content/sources";

export const metadata: Metadata = {
  title: "Evidence",
  description:
    "How JEREBU.EXE separates observation, interpretation, attribution and legal responsibility, and the rules it applies to data and claims.",
};

const issuesUrl = `${site.repoUrl}/issues`;

const pad = (n: number) => String(n).padStart(2, "0");

const onThisPage = [
  { id: "ladder", label: "Evidence ladder" },
  { id: "two-rules", label: "Two rules" },
  { id: "claim-labels", label: "Claim labels" },
  { id: "safety-rules", label: "Safety rules" },
  { id: "sources", label: "Sources" },
  { id: "data-panels", label: "Data panels" },
  { id: "pipeline", label: "Pipeline" },
  { id: "claims-register", label: "Claims register" },
];

interface RuleNote {
  heading: string;
  explanation: string;
  canShow: string;
  cannotShow: string[];
}

/** Plain-language notes for each inequality. Definitional, not empirical. */
const ruleNotes: Record<(typeof inequalities)[number]["left"], RuleNote> = {
  Hotspot: {
    heading: "A detection is not a responsible party",
    explanation:
      "A hotspot is a satellite detection of unusual heat at a place and time. It may or may not be a fire. Even a confirmed fire does not, by itself, show who started it, who controls the land, or whether any law was broken. Each of those is a separate question that needs its own evidence.",
    canShow: "That an instrument detected unusual heat at a place and time, by a stated method.",
    cannotShow: [
      "Whether it was a fire",
      "Who started it",
      "Who controls the land",
      "Whether any law was broken",
    ],
  },
  Correlation: {
    heading: "Moving together is not proof in law",
    explanation:
      "Two things that rise and fall together are correlated — for example, hotspots detected in one area and haze measured in another. A correlation can be a good reason to investigate. A legal attribution needs evidence linking a specific actor to a specific event, assessed through a legal process under the applicable standards.",
    canShow: "That two patterns move together, which may be worth investigating.",
    cannotShow: [
      "Whether one caused the other",
      "Whether something else explains both",
      "Which specific party acted, if any",
      "Whether anyone is legally responsible",
    ],
  },
};

const sourceListNotes = [
  {
    lead: "Found by AI web search.",
    text: `AI agents located these candidates by web search on ${sourcesCheckedOn}, during Experiment 001.`,
  },
  {
    lead: "Not opened.",
    text: "The agents could not open any of the pages. Each address is one that appeared in search results.",
  },
  {
    lead: "Spot-checked by a sceptic.",
    text: "A second, sceptical AI agent spot-checked the entries. It could not open the pages either. Some addresses and descriptions were corrected as a result.",
  },
  {
    lead: "Check before relying on it.",
    text: "A human must open and check each link before relying on it. Until then, treat every entry as unconfirmed.",
  },
  {
    lead: "Not an endorsement.",
    text: "Inclusion does not mean a source is reliable, suitable or recommended. None has been evaluated for reliability, licensing or fitness for purpose.",
  },
  {
    lead: "No data shown.",
    text: "Nothing from these sources is integrated into, or displayed on, this site.",
  },
];

export default function EvidencePage() {
  const unverifiedCount = siteClaims.filter((c) => c.status === "unverified").length;

  return (
    <>
      {/* ──────────────────────────── HEADER ──────────────────────────── */}
      <section aria-labelledby="evidence-title" className="surface-dark">
        <Container className="pt-14 pb-16 sm:pt-20 sm:pb-20">
          <p className="label-mono text-ink-muted">Evidence framework</p>
          <h1
            id="evidence-title"
            className="mt-6 max-w-4xl text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl"
          >
            How we will tell seeing from proving.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
            Haze raises hard questions: what burned, where the smoke went, who is responsible,
            and what the law says. JEREBU.EXE does not answer any of them yet. This page sets out
            how future experiments should handle evidence, so that what is seen is never presented
            as more than it shows.
          </p>

          <div className="mt-10 max-w-3xl border-l-2 border-signal pl-5">
            <p className="font-serif text-2xl leading-snug sm:text-3xl">
              This page describes method, not findings.
            </p>
            <p className="mt-3 leading-relaxed text-ink-muted">
              No environmental data is shown anywhere on this site: no air-quality readings, no
              hotspot detections, no maps. Nothing here is evidence about any event,
              organisation or government.
            </p>
          </div>

          <dl className="mt-12 grid gap-6 border-t border-ink-line pt-6 sm:grid-cols-3">
            <div>
              <dt className="label-mono text-ink-muted">Status</dt>
              <dd className="mt-1">Draft, awaiting human review</dd>
            </div>
            <div>
              <dt className="label-mono text-ink-muted">Principles set by</dt>
              <dd className="mt-1">The project&rsquo;s human founder</dd>
            </div>
            <div>
              <dt className="label-mono text-ink-muted">Page written by</dt>
              <dd className="mt-1">AI (Claude Code), Experiment 001</dd>
            </div>
          </dl>

          <nav aria-label="On this page" className="mt-10">
            <p className="label-mono text-ink-muted">On this page</p>
            <ol className="label-mono mt-2 grid grid-cols-2 gap-x-6 sm:grid-cols-4">
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

      {/* ─────────────────────── §01 EVIDENCE LADDER ───────────────────── */}
      <section aria-labelledby="ladder" className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="01"
            eyebrow="The evidence ladder"
            id="ladder"
            title="Four kinds of statement. Each needs more evidence than the last."
          >
            <p>
              Observation, interpretation, attribution, legal responsibility. Any statement about
              haze sits on one of these rungs, and each rung up demands more evidence and more
              scrutiny.
            </p>
            <p className="mt-4">
              A satellite hotspot can be an observation. Smoke transport modelling can support an
              interpretation. Connecting an event to an organisation requires additional evidence.
              Establishing legal responsibility requires a legal process and applicable
              evidentiary standards.
            </p>
          </SectionHeader>

          <EvidenceLadder variant="full" />

          <p className="mt-8 max-w-3xl leading-relaxed text-muted">
            <strong className="font-semibold text-ink">
              Repeating a claim, mapping it or sharing it widely does not move it up the ladder.
            </strong>{" "}
            Only further evidence does, and the last rung can only be reached through a legal
            process.
          </p>
        </Container>
      </section>

      {/* ───────────────────────── §02 TWO RULES ───────────────────────── */}
      <section aria-labelledby="two-rules" className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="02"
            eyebrow="Two rules"
            id="two-rules"
            title="Two things the project will never treat as the same."
          >
            <p>Both rules guard against the same mistake: skipping rungs on the ladder.</p>
          </SectionHeader>

          <ol className="space-y-16">
            {inequalities.map((pair) => {
              const note = ruleNotes[pair.left];
              return (
                <li key={pair.left} className="border-t-2 border-ink pt-8">
                  <h3 className="label-mono text-muted">{note.heading}</h3>
                  <div className="mt-4">
                    <Inequality left={pair.left} right={pair.right} />
                  </div>
                  <div className="mt-8 grid gap-8 lg:grid-cols-12">
                    <p className="text-lg leading-relaxed lg:col-span-6">{note.explanation}</p>
                    <dl className="grid gap-5 sm:grid-cols-2 lg:col-span-6">
                      <div className="bg-paper p-5">
                        <dt className="label-mono text-muted">Can show</dt>
                        <dd className="mt-2 leading-relaxed">{note.canShow}</dd>
                      </div>
                      <div className="border-2 border-ink p-5">
                        <dt className="label-mono text-muted">Cannot show, by itself</dt>
                        <dd className="mt-2">
                          <ul className="space-y-1.5">
                            {note.cannotShow.map((item) => (
                              <li key={item} className="flex gap-2 leading-relaxed">
                                <span aria-hidden="true" className="font-mono text-signal-ink">
                                  ×
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* ──────────────────────── §03 CLAIM LABELS ─────────────────────── */}
      <section aria-labelledby="claim-labels" className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="03"
            eyebrow="How claims are labelled"
            id="claim-labels"
            title="Every statement gets a label."
          >
            <p>
              Safety rule 3 asks the project to keep six kinds of statement apart. When future
              experiments publish research, each statement should carry one of these labels, so
              readers can see what kind of claim they are reading.
            </p>
          </SectionHeader>

          <dl className="grid gap-px border-2 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-3">
            {claimTypes.map((type, i) => (
              <div key={type.name} className="bg-paper p-6">
                <dt className="flex items-baseline gap-3 text-xl font-bold tracking-tight">
                  <span aria-hidden="true" className="font-mono text-sm text-signal-ink">
                    {pad(i + 1)}
                  </span>
                  {type.name}
                </dt>
                <dd className="mt-3 leading-relaxed text-muted">{type.meaning}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 max-w-3xl leading-relaxed text-muted">
            How far a statement has been checked is tracked separately. See the{" "}
            <a href="#claims-register" className="text-ink underline underline-offset-4 hover:text-signal-ink">
              claims register
            </a>{" "}
            below.
          </p>
        </Container>
      </section>

      {/* ──────────────────────── §04 SAFETY RULES ─────────────────────── */}
      <section aria-labelledby="safety-rules" className="surface-dark py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="04"
            eyebrow="Data and claim safety"
            id="safety-rules"
            title="Eight rules for data and claims."
            surface="dark"
          >
            <p>
              Set by the project&rsquo;s human founder. They apply to every page, document, dataset
              and pull request, whether a human or an AI wrote it.
            </p>
          </SectionHeader>

          <ol className="grid border-t border-ink-line md:grid-cols-2 md:gap-x-12">
            {safetyRules.map((rule) => (
              <li key={rule.number} className="flex gap-5 border-b border-ink-line py-6">
                <span
                  aria-hidden="true"
                  className="shrink-0 font-mono text-2xl leading-tight font-bold text-signal tabular-nums sm:text-3xl"
                >
                  {pad(rule.number)}
                </span>
                <p className="text-xl leading-snug font-semibold tracking-tight lg:text-2xl">
                  <span className="sr-only">Rule {rule.number}: </span>
                  {rule.rule}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-10 max-w-2xl leading-relaxed text-ink-muted">
            Found a page, document or dataset that breaks one of these rules? Please{" "}
            <ExternalLink href={issuesUrl} className="text-paper underline underline-offset-4 hover:text-signal">
              report it on GitHub
            </ExternalLink>
            .
          </p>
        </Container>
      </section>

      {/* ─────────────────────────── §05 SOURCES ───────────────────────── */}
      <section aria-labelledby="sources" className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="05"
            eyebrow="Sources to investigate"
            id="sources"
            title="Where evidence could come from."
          >
            <p>
              Future experiments may draw on several kinds of public evidence. None is connected
              yet. Below are the kinds, then a first list of specific candidate sources.
            </p>
          </SectionHeader>

          <h3 className="text-2xl font-bold tracking-tight">Kinds of evidence</h3>
          <ul className="mt-6 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4">
            {sourceCategories.map((category) => (
              <li key={category.id} className="flex flex-col bg-paper p-5">
                <span className="font-semibold">{category.name}</span>
                <span className="mt-1 text-sm leading-relaxed text-muted">
                  {category.description}
                </span>
                <span className="label-mono mt-auto pt-4 text-subtle">Not connected</span>
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-8 bg-paper-2 p-6 sm:p-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold tracking-tight">How the candidate list was made</h3>
              <p className="mt-3 leading-relaxed text-muted">Read this before using any link below.</p>
            </div>
            <div className="lg:col-span-8">
              <ul className="space-y-4">
                {sourceListNotes.map((item) => (
                  <li key={item.lead} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="font-mono text-signal-ink">
                      —
                    </span>
                    <span>
                      <strong className="font-semibold">{item.lead}</strong>{" "}
                      <span className="text-muted">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed">
                More detail and caveats:{" "}
                <ExternalLink
                  href={repoFile("docs/DATA_SOURCES.md")}
                  className="font-semibold underline underline-offset-4 hover:text-signal-ink"
                >
                  docs/DATA_SOURCES.md on GitHub
                </ExternalLink>
              </p>
            </div>
          </div>

          <p className="label-mono mt-16 text-muted">
            {candidateSources.length} candidate sources · grouped by jurisdiction
          </p>
          <div className="mt-6">
            <CandidateSourceList />
          </div>
        </Container>
      </section>

      {/* ───────────────────────── §06 DATA PANELS ─────────────────────── */}
      <section aria-labelledby="data-panels" className="pb-20 sm:pb-28">
        <Container>
          <SectionHeader
            index="06"
            eyebrow="Data panels"
            id="data-panels"
            title="Empty on purpose."
          >
            <p>
              These panels mark where future experiments may show data. Each stays empty until
              its data has been collected, checked against sources and reviewed by a human. There
              are no sample charts or placeholder numbers, so nothing here can be mistaken for
              real data.
            </p>
          </SectionHeader>

          <div className="grid gap-6 lg:grid-cols-3">
            <NotYetBuilt title="Satellite fire observations" plannedFor="Experiment 003">
              <p>
                In future, this may show satellite fire detections (hotspots) with their source,
                time, detection method and known limits, presented as observations only and
                never as evidence of who is responsible.
              </p>
              <p className="mt-3">
                Nothing is shown because no data has been collected or reviewed.
              </p>
            </NotYetBuilt>
            <NotYetBuilt title="Haze history timeline" plannedFor="Experiment 002">
              <p>
                In future, this may show a timeline of past haze episodes, each entry linked to
                its sources, with gaps and disagreements between sources left visible.
              </p>
              <p className="mt-3">
                Nothing is shown because no historical records have been collected or reviewed.
              </p>
            </NotYetBuilt>
            <NotYetBuilt title="Legal landscape" plannedFor="Experiment 004">
              <p>
                In future, this may set out laws, regional agreements, agencies and published
                court decisions relevant to haze in Malaysia and Singapore, read from official
                texts and cited.
              </p>
              <p className="mt-3">
                Nothing is shown because no legal research has been collected or reviewed. This
                site makes no claims about what any law says.
              </p>
            </NotYetBuilt>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────── §07 PIPELINE ──────────────────────── */}
      <section aria-labelledby="pipeline" className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="07"
            eyebrow="Planned pipeline"
            id="pipeline"
            title="How evidence might flow, one day."
          >
            <p>
              A conceptual sketch for future experiments, not a description of anything that
              exists. None of these stages is implemented, and the design will change as
              experiments test it. In this sketch, AI assists with analysis but does not decide:
              every claim is traced to a source, and a human reviews it before anything is
              published.
            </p>
          </SectionHeader>

          <PipelineDiagram />
        </Container>
      </section>

      {/* ──────────────────────── §08 CLAIMS REGISTER ──────────────────── */}
      <section aria-labelledby="claims-register" className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            index="08"
            eyebrow="Claims register"
            id="claims-register"
            title="This site applies its own rules to itself."
          >
            <p>
              The main factual statements this website makes about the world are listed here,
              with how well each is currently supported. {unverifiedCount} of {siteClaims.length}{" "}
              {unverifiedCount === 1 ? "is" : "are"} currently unverified.
            </p>
          </SectionHeader>

          <ClaimsRegister />

          <p className="mt-10 max-w-2xl leading-relaxed text-muted">
            Spotted a factual statement missing from this register, or a status that looks wrong?
            Please{" "}
            <ExternalLink href={issuesUrl} className="text-ink underline underline-offset-4 hover:text-signal-ink">
              report it on GitHub
            </ExternalLink>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
