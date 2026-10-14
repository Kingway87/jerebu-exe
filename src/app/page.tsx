import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { EvidenceLadder } from "@/components/evidence-ladder";
import { ExperimentLog } from "@/components/experiment-log";
import { Inequality } from "@/components/inequality";
import { LoopDiagram } from "@/components/loop-diagram";
import { SectionHeader } from "@/components/section-header";
import { inequalities, sourceCategories } from "@/content/evidence";
import { getExperiment, statusLabel } from "@/content/experiments";
import { site } from "@/content/site";

const inThirtySeconds = [
  {
    q: "What is it?",
    a: "An independent, open-source experiment: one person, AI agents and public data, working on recurring transboundary haze.",
  },
  {
    q: "Why does haze matter?",
    a: "Haze can cross borders, affecting people in Malaysia, Singapore and Indonesia. And it keeps coming back: each season the same questions return, with the answers scattered across agencies, satellites, courts and archives.",
  },
  {
    q: "What is it investigating?",
    a: "Whether AI agents and open data can make the problem easier for ordinary people to investigate and understand, without overstating what the evidence shows.",
  },
  {
    q: "How can I follow or contribute?",
    a: "Read the public experiment log, watch the repository on GitHub, or contribute code, research and expertise.",
  },
];

const jurisdictions = [
  {
    code: "MY",
    flag: "🇲🇾",
    name: "Malaysia",
    questions: [
      "Which laws and agencies deal with air pollution and open burning?",
      "Where is official air-quality data published, and how?",
      "What happens when the source of pollution lies outside the country?",
    ],
  },
  {
    code: "SG",
    flag: "🇸🇬",
    name: "Singapore",
    questions: [
      "Which laws and agencies deal with air pollution and haze?",
      "Where is official air-quality data published, and how?",
      "What happens when the source of pollution lies outside the country?",
    ],
  },
];

const commitments = [
  { item: "Code", detail: "Public, MIT licensed." },
  { item: "Methodology", detail: "Public, and open to challenge." },
  { item: "AI involvement", detail: "Documented: what AI did, and what humans decided." },
  { item: "Mistakes", detail: "Recorded with their corrections, not quietly erased." },
  { item: "Contributions", detail: "Welcome — code, research, data, law, design, translation." },
];

export default function Home() {
  const currentExperiment = getExperiment("001");
  if (!currentExperiment) {
    throw new Error('Experiment "001" is missing from src/content/experiments.ts.');
  }

  return (
    <>
      {/* ───────────────────────────── HERO ───────────────────────────── */}
      <section aria-labelledby="hero-title" className="surface-dark relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="haze-sun pointer-events-none absolute -top-1/4 -right-1/3 -z-10 aspect-square w-[150%] sm:-right-1/4 sm:w-[110%] lg:-top-1/2 lg:-right-[15%] lg:w-[80%]"
        />
        <Container className="pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32">
          <p className="label-mono flex flex-col gap-y-1 text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-4">
            <span>Open-source civic-tech experiment</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>Malaysia + Singapore</span>
          </p>

          <h1 id="hero-title" className="mt-8">
            <span className="block text-[clamp(3rem,15vw,10rem)] leading-[0.88] font-extrabold tracking-[-0.055em]">
              JEREBU<span className="text-ink-muted">.EXE</span>
            </span>{" "}
            <span className="mt-6 block font-mono text-[clamp(1.25rem,4.2vw,2.5rem)] leading-tight font-bold tracking-tight">
              {site.tagline}
              <span aria-hidden="true" className="cursor-blink ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.12em] bg-signal" />
            </span>
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-serif text-3xl leading-tight italic sm:text-4xl">
                Same haze. Different year.
              </p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                {site.description}
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <ButtonLink href={site.repoUrl} surface="dark" external>
                  View source
                </ButtonLink>
                <ButtonLink href="/experiments" surface="dark" variant="secondary">
                  Follow the experiment
                </ButtonLink>
              </div>
            </div>
            <aside
              aria-label="Definition"
              className="self-end border-l-2 border-signal pl-5 lg:col-span-4 lg:col-start-9"
            >
              <p className="font-serif text-2xl">
                <span lang="ms" className="font-bold">jerebu</span>{" "}
                <span className="text-ink-muted italic">(Malay, noun)</span>
              </p>
              <p className="mt-1 font-serif text-xl text-ink-muted">haze.</p>
            </aside>
          </div>
        </Container>
      </section>

      {/* ───────────────────────── IN 30 SECONDS ───────────────────────── */}
      <section aria-labelledby="summary-title" className="bg-paper">
        <Container className="py-14 sm:py-16">
          <h2 id="summary-title" className="label-mono text-muted">
            In thirty seconds
          </h2>
          <dl className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {inThirtySeconds.map((entry, i) => (
              <div key={entry.q} className="border-t-2 border-ink pt-4">
                <dt className="flex items-baseline gap-3 text-lg font-bold tracking-tight lg:min-h-[2lh]">
                  <span aria-hidden="true" className="font-mono text-sm text-signal-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {entry.q}
                </dt>
                <dd className="mt-3 leading-relaxed text-muted">{entry.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ──────────────────────────── THE LOOP ─────────────────────────── */}
      <section aria-labelledby="loop" className="pt-6 pb-20 sm:pt-8 sm:pb-28">
        <Container>
          <SectionHeader index="01" eyebrow="The loop" id="loop" title="Every haze season seems to follow the same script.">
            <p>
              The smoke arrives, people ask who is responsible, the rain comes, and attention
              moves on — until next time.
            </p>
          </SectionHeader>
          <LoopDiagram />
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
            <strong className="font-semibold text-ink">Read this as a pattern of public attention, not as science.</strong>{" "}
            It is not a causal claim about any particular event. Fires have many possible causes,
            and where smoke travels depends on weather. Working out causes is what the evidence
            work is for.
          </p>
        </Container>
      </section>

      {/* ────────────────────────── THE QUESTION ───────────────────────── */}
      <section aria-labelledby="question" className="surface-dark py-20 sm:py-28">
        <Container>
          <SectionHeader index="02" eyebrow="The question" id="question" title="One question drives the project." surface="dark" />
          <p className="max-w-5xl font-serif text-3xl leading-[1.15] sm:text-5xl lg:text-6xl">
            Can AI agents and open public data make a decades-old environmental problem{" "}
            <em className="text-signal">easier for ordinary people</em> to investigate and
            understand?
          </p>
          <div className="mt-14 grid gap-10 border-t border-ink-line pt-10 md:grid-cols-2">
            <div>
              <h3 className="label-mono text-ink-muted">Behind it, a second question</h3>
              <p className="mt-4 text-lg leading-relaxed">
                Can one person working with AI agents and open public data build useful civic
                infrastructure around a problem this old?
              </p>
            </div>
            <div>
              <h3 className="label-mono text-ink-muted">Current answer</h3>
              <p className="mt-4 text-lg leading-relaxed">
                Unknown. That is why each step is run as a public experiment, with its inputs,
                outputs, mistakes and costs written down.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────────────── TWO JURISDICTIONS ────────────────────── */}
      <section aria-labelledby="jurisdictions" className="py-20 sm:py-28">
        <Container>
          <SectionHeader index="03" eyebrow="Two jurisdictions" id="jurisdictions" title="Same sky. Different rules.">
            <p>
              Malaysia and Singapore both experience transboundary haze, but they are separate
              countries with their own laws, regulators, courts and policy processes. The project
              starts with these two. Mapping their legal landscapes from primary sources is a
              later experiment — until then, this site makes no claims about what either legal
              system does or does not allow.
            </p>
          </SectionHeader>

          <div className="grid gap-6 md:grid-cols-2">
            {jurisdictions.map((j) => (
              <article key={j.code} aria-labelledby={`jurisdiction-${j.code}`} className="flex flex-col border-2 border-ink">
                <header className="flex items-center justify-between gap-4 border-b-2 border-ink p-6">
                  <h3 id={`jurisdiction-${j.code}`} className="flex items-center gap-4 text-3xl font-bold tracking-tight">
                    <span aria-hidden="true" className="text-4xl leading-none">
                      {j.flag}
                    </span>
                    {j.name}
                  </h3>
                  <span aria-hidden="true" className="label-mono hidden text-muted sm:inline">{j.code}</span>
                </header>
                <div className="flex-1 p-6">
                  <p className="label-mono text-muted">Questions for Experiment 004</p>
                  <ul className="mt-4 space-y-3">
                    {j.questions.map((q) => (
                      <li key={q} className="flex gap-3 leading-relaxed">
                        <span aria-hidden="true" className="font-mono text-signal-ink">?</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="label-mono border-t border-line px-6 py-4 text-muted">
                  Legal analysis · Not yet researched
                </p>
              </article>
            ))}
          </div>

          <aside aria-labelledby="indonesia-note" className="mt-6 bg-paper-2 p-6 sm:p-8">
            <h3 id="indonesia-note" className="text-xl font-bold tracking-tight">
              This is not Malaysia and Singapore versus Indonesia.
            </h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted">
              People in Indonesia are also affected by fires and haze. The subject of this project
              is transboundary haze accountability — how evidence, law and public attention work
              across borders — not a contest between countries or their people.
            </p>
          </aside>
        </Container>
      </section>

      {/* ──────────────────────────── EVIDENCE ─────────────────────────── */}
      <section aria-labelledby="evidence" className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHeader index="04" eyebrow="Evidence" id="evidence" title="Seeing something is not the same as proving it.">
            <p>
              The project separates four kinds of statement. Each step up needs more evidence,
              and the last one can only come from a legal process.
            </p>
          </SectionHeader>

          <EvidenceLadder />

          <div className="mt-14 space-y-4 border-y-2 border-ink py-10">
            {inequalities.map((pair) => (
              <Inequality key={pair.left} left={pair.left} right={pair.right} />
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold tracking-tight">Sources to investigate</h3>
              <p className="mt-3 leading-relaxed text-muted">
                Kinds of public evidence future experiments may use. None are connected yet, and
                no data is shown on this site.
              </p>
              <p className="mt-6">
                <Link href="/evidence" className="font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink">
                  Read the evidence framework <span aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
            <ul className="grid gap-px self-start border-2 border-ink bg-ink sm:grid-cols-2 lg:col-span-8">
              {sourceCategories.map((category) => (
                <li key={category.id} className="flex flex-col gap-1 bg-paper px-5 py-4">
                  <span className="font-semibold">{category.name}</span>
                  <span className="label-mono text-subtle">Not connected</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────── EXPERIMENTS ───────────────────────── */}
      <section aria-labelledby="experiments" className="py-20 sm:py-28">
        <Container>
          <SectionHeader index="05" eyebrow="Experiments" id="experiments" title="A public log of what was tried.">
            <p>
              The project moves forward as numbered experiments. Each one records its question,
              what humans provided, what the AI did, what came out, and what still needs human
              review.
            </p>
          </SectionHeader>

          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="label-mono text-muted">
                {statusLabel[currentExperiment.status]} · Experiment {currentExperiment.id}
              </p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight">{currentExperiment.name}</h3>
              <p className="mt-4 leading-relaxed text-muted">
                Claude Code, an AI coding agent, was given this nearly empty repository and a
                written brief from the project&rsquo;s human founder. Its task: build this first
                version of the website and its documentation, check its own work, and hand
                everything over as a pull request for human review — without deploying,
                publishing or contacting anyone.
              </p>
              <p className="mt-6">
                <Link href="/experiments#exp-001" className="font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink">
                  Read the record <span aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
            <div className="lg:col-span-7">
              <ExperimentLog />
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────── OPEN SOURCE ───────────────────────── */}
      <section aria-labelledby="open-source" className="pb-20 sm:pb-28">
        <Container>
          <SectionHeader index="06" eyebrow="Open source" id="open-source" title="Built in public, mistakes included.">
            <p>
              Credibility matters more than looking impressive. So the working is shown, not
              just the result.
            </p>
          </SectionHeader>
          <ul className="grid gap-px border-2 border-ink bg-ink sm:grid-cols-2 sm:[&>li:last-child]:col-span-2 lg:grid-cols-5 lg:[&>li:last-child]:col-span-1">
            {commitments.map((c) => (
              <li key={c.item} className="bg-paper p-6">
                <span aria-hidden="true" className="font-mono text-sm text-signal-ink">
                  [x]
                </span>
                <p className="mt-4 text-xl font-bold tracking-tight">{c.item}</p>
                <p className="mt-2 leading-relaxed text-muted">{c.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ────────────────────────────── CTA ────────────────────────────── */}
      <section aria-labelledby="cta-title" className="surface-dark relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="haze-sun pointer-events-none absolute -bottom-1/2 -left-1/4 -z-10 aspect-square w-[120%] opacity-70 lg:w-[60%]"
        />
        <Container className="py-20 sm:py-28">
          <h2 id="cta-title" className="max-w-3xl text-4xl leading-[1.02] font-bold tracking-[-0.03em] sm:text-6xl">
            Haze seasons come and go. The record should stay.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Read the code, follow the experiments, or open an issue. To follow along, watch or
            star the repository on GitHub.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href={site.repoUrl} surface="dark" external>
              View source
            </ButtonLink>
            <ButtonLink href="/experiments" surface="dark" variant="secondary">
              Follow the experiment
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
