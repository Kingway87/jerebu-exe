import type { Metadata } from "next";
import Link from "next/link";
import { AboutSection, Lede, Prose } from "@/components/about/about-section";
import { TransparencyLabel, type TransparencyLabelName } from "@/components/about/transparency-label";
import { Container } from "@/components/container";
import { ExternalLink } from "@/components/external-link";
import { Inequality } from "@/components/inequality";
import { inequalities } from "@/content/evidence";
import { getExperiment } from "@/content/experiments";
import { repoFile, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why JEREBU.EXE exists, why it is open source, why it starts with Malaysia and Singapore, why it is not a contest between countries, how it handles evidence and AI, and how to get in touch.",
};

/** Required wording from the project brief. Do not edit without a human decision. */
const disclaimer =
  "JEREBU.EXE is an independent educational and open-source civic-tech experiment. It does not provide legal, medical or scientific advice. AI-generated research must be independently verified before being treated as factual evidence.";

const pad = (n: number) => String(n).padStart(2, "0");

const onThisPage = [
  { id: "why", label: "Why it exists" },
  { id: "open-source", label: "Open source" },
  { id: "scope", label: "Why Malaysia and Singapore" },
  { id: "not-an-adversary", label: "Not an adversary" },
  { id: "evidence-standards", label: "Evidence standards" },
  { id: "ai", label: "How AI fits in" },
  { id: "what-it-is-not", label: "What it is not" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "contact", label: "Contact" },
];

const projectLinks = [
  { href: site.repoUrl, label: "Source code on GitHub" },
  { href: repoFile("docs/METHODOLOGY.md"), label: "Methodology" },
  { href: repoFile("CONTRIBUTING.md"), label: "Contributing guide" },
  { href: repoFile("LICENSE"), label: "MIT License" },
];

/** Human actions taken before Experiment 001, as listed in the project brief. */
const humanDecisions = [
  "Conceived the project.",
  "Chose the name JEREBU.EXE.",
  "Created the project email address.",
  "Created the public GitHub repository.",
  "Defined the project’s broad mission.",
  "Started the Claude Code session for Experiment 001, with a written task brief.",
];

/** Split so a narrow screen can break the address before the “@”, not inside the domain. */
const [emailLocal, emailDomain] = site.contactEmail.split("@");

/** What the AI did in Experiment 001. Keep in step with src/content/experiments.ts. */
const aiWork = [
  "Built this first version (V0) of the website, including this page, from the founder’s written brief.",
  "Wrote the first versions of the project’s documentation.",
];

/**
 * Short, plain-language glosses of the AI-involvement labels. The full policy,
 * and how each label is applied, is in docs/AI_TRANSPARENCY.md.
 */
const transparencyLabels: readonly { name: TransparencyLabelName; meaning: string }[] = [
  { name: "Human decision", meaning: "A choice made by a person, such as the project’s mission or scope." },
  { name: "AI assisted", meaning: "Work done by a person, with help from AI." },
  { name: "AI generated", meaning: "Work produced mainly by AI. Generated is not the same as checked." },
  { name: "Human verified", meaning: "Checked by a named person against its sources." },
  { name: "Unverified", meaning: "Not yet checked by a person. Do not treat it as fact." },
];

const notList = [
  "Not an anti-Indonesia campaign.",
  "Not an anti-government campaign.",
  "Not an official Malaysian or Singaporean initiative.",
  "Not a law firm.",
  "Not a scientific authority.",
  "Not an accusation platform.",
  "Not a system for automatically identifying guilty companies.",
];

const linkClass = "font-semibold text-ink underline underline-offset-4 hover:text-signal-ink";

export default function AboutPage() {
  const experiment001 = getExperiment("001");

  return (
    <>
      {/* ──────────────────────────── HEADER ──────────────────────────── */}
      <section aria-labelledby="about-title" className="surface-dark">
        <Container className="pt-14 pb-16 sm:pt-20 sm:pb-20">
          <p className="label-mono text-ink-muted">About</p>
          <h1
            id="about-title"
            className="mt-6 max-w-4xl text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl"
          >
            Why this exists, and how it is being built.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
            JEREBU.EXE is an independent, open-source civic-tech experiment. It explores whether AI
            agents, public environmental data and community participation can help people
            understand recurring transboundary haze affecting Malaysia and Singapore. This page
            explains why it exists, the choices behind it, and its limits.
          </p>

          <div className="mt-10 max-w-3xl border-l-2 border-signal pl-5">
            <p className="font-serif text-2xl leading-snug sm:text-3xl">
              An experiment, not an authority.
            </p>
            <p className="mt-3 leading-relaxed text-ink-muted">
              There are no findings yet, and in particular none about who caused any haze. What
              exists so far is a question, a method, a public record of how the project is being
              built, a first{" "}
              <Link href="/timeline" className="text-paper underline underline-offset-4 hover:text-signal">
                haze history
              </Link>
              , compiled by AI from public sources and not yet verified by a human, and, since
              Experiment 003, a{" "}
              <Link href="/live" className="text-paper underline underline-offset-4 hover:text-signal">
                live evidence page
              </Link>{" "}
              that shows official observations as published, without drawing conclusions from them.
            </p>
          </div>

          <dl className="mt-12 grid gap-6 border-t border-ink-line pt-6 sm:grid-cols-3">
            <div>
              <dt className="label-mono text-ink-muted">Status</dt>
              <dd className="mt-1">Draft, awaiting human review</dd>
            </div>
            <div>
              <dt className="label-mono text-ink-muted">Mission and scope set by</dt>
              <dd className="mt-1">The project&rsquo;s human founder</dd>
            </div>
            <div>
              <dt className="label-mono text-ink-muted">Page written by</dt>
              <dd className="mt-1">
                AI (Claude Code), Experiment 001; updated in Experiments 002 and 003 (not yet
                reviewed)
              </dd>
            </div>
          </dl>

          <nav aria-label="On this page" className="mt-10">
            <p className="label-mono text-ink-muted">On this page</p>
            <ul className="label-mono mt-2 grid grid-cols-2 gap-x-6 lg:grid-cols-3">
              {onThisPage.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex min-h-11 items-center gap-2 text-paper underline-offset-4 hover:text-signal hover:underline"
                  >
                    <span aria-hidden="true" className="text-ink-muted">
                      →
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      {/* ──────────────────────── §01 WHY IT EXISTS ────────────────────── */}
      <AboutSection index="01" eyebrow="Why it exists" id="why" title="Haze returns. So do the questions.">
        <Lede>
          When haze arrives, people ask what is burning, where the smoke is coming from and who is
          responsible. When it clears, the questions tend to fade with it.
        </Lede>
        <Prose>
          <p>
            The homepage describes this as a loop: fires, smoke, haze, public anger, rain, and then
            attention disappears — until it repeats. It is a pattern of public attention, not a
            scientific model, and it is not a claim about the causes of any particular event.
          </p>
          <p>
            Part of the problem is that the evidence is scattered. What could help someone
            understand a haze episode is spread across official publications, satellite archives,
            weather records, research papers and legal records, in different places and formats.
            Much of it is hard for a non-specialist to find, and harder to read correctly.
          </p>
          <p>
            JEREBU.EXE is an attempt to bring the questions and the evidence together in one public
            place, carefully, in a way that does not fade when the sky clears — and to be honest
            about what is still unknown.
          </p>
          <p>
            It is at a very early stage. So far there is a website, a method, a public log of how
            the project is being built, a haze history timeline that an AI agent compiled from
            public sources and that no human has verified yet, and a page of current official
            observations. There are no findings, and none about who is responsible for any haze.
          </p>
        </Prose>
      </AboutSection>

      {/* ──────────────────────── §02 OPEN SOURCE ──────────────────────── */}
      <AboutSection
        index="02"
        eyebrow="Why open source"
        id="open-source"
        title="Built in the open, so it can be checked."
      >
        <Lede>
          A project about evidence should be held to its own standard. Anyone should be able to
          check how it works.
        </Lede>
        <Prose>
          <p>
            The code, the method and the record of AI involvement are public. Anyone can read how a
            page was made, which rules it follows, and what an AI did along the way.
          </p>
          <p>
            Being public means mistakes are visible. That is intended. When something is wrong, the
            correction should be made in the open and recorded, not quietly erased.
          </p>
          <p>
            Contributions are welcome: code, research, data, legal and scientific expertise, design
            and translation. Disagreement is welcome too, especially when it comes with a source.
          </p>
        </Prose>
        <ul className="mt-8 grid border-t-2 border-ink sm:grid-cols-2 sm:gap-x-8">
          {projectLinks.map((link) => (
            <li key={link.href} className="border-b border-line">
              <ExternalLink
                href={link.href}
                className="flex min-h-12 items-center py-2 font-semibold underline-offset-4 hover:text-signal-ink hover:underline"
              >
                {link.label}
              </ExternalLink>
            </li>
          ))}
        </ul>
      </AboutSection>

      {/* ───────────────────── §03 WHY MALAYSIA + SINGAPORE ────────────── */}
      <AboutSection
        index="03"
        eyebrow="Scope"
        id="scope"
        title="Why Malaysia and Singapore first."
        meta={<TransparencyLabel name="Human decision" />}
      >
        <Lede>
          Starting with Malaysia and Singapore was a decision made by the project&rsquo;s human
          founder.
        </Lede>
        <Prose>
          <p>
            It is the scope the founder chose for the project&rsquo;s first stage. It is not a claim
            that haze matters less anywhere else.
          </p>
          <p>
            The founder has not yet recorded reasons for this choice. One practical advantage of a
            narrow start, suggested by the AI that wrote this page: evidence work done properly is
            slow. Every source has to be found, read and checked, and every country has its own
            laws, agencies, courts and public data. A small scope gives that work a chance to be
            done carefully rather than quickly.
          </p>
          <p>
            Other jurisdictions, including Indonesia, may be added later. Widening the scope would
            be a decision of its own, and should be recorded when it is made.
          </p>
        </Prose>
      </AboutSection>

      {/* ────────────────────── §04 NOT AN ADVERSARY ───────────────────── */}
      <AboutSection
        index="04"
        eyebrow="Not an adversary"
        id="not-an-adversary"
        title="Not a contest between countries."
        surface="muted"
      >
        <Lede>People in Indonesia are also affected by fires and haze.</Lede>
        <Prose>
          <p>
            It would be easy to tell the haze story as Malaysia and Singapore against Indonesia.
            JEREBU.EXE does not frame it that way.
          </p>
          <p>
            The subject is transboundary haze accountability: how evidence, responsibility, law and
            public attention work when smoke crosses borders. That is a question about evidence and
            systems, not a contest between countries or peoples.
          </p>
          <p>
            Indonesian institutions, researchers and communities are part of this story, including
            as potential sources of evidence, expertise and experience. A project that treated them
            only as the other side would understand the problem less well, and would be less fair.
          </p>
          <p>
            This site makes no claims about the causes of any fire or haze event, or about the
            conduct of any government. Contributions and corrections from people in Indonesia are
            as welcome as anyone else&rsquo;s.
          </p>
        </Prose>
      </AboutSection>

      {/* ───────────────────── §05 EVIDENCE STANDARDS ──────────────────── */}
      <AboutSection
        index="05"
        eyebrow="Evidence standards"
        id="evidence-standards"
        title="A wrong accusation is not a small mistake."
      >
        <Lede>
          Haze makes people angry, and anger looks for someone to blame. Blame that lands on the
          wrong target does real harm.
        </Lede>
        <Prose>
          <p>
            Naming a company, a person or a government as responsible for haze is a serious claim.
            If it is wrong, it can damage people who did nothing wrong, and it can distract from
            finding out what actually happened.
          </p>
        </Prose>

        <div className="mt-10 space-y-4 border-y-2 border-ink py-8">
          {inequalities.map((pair) => (
            <Inequality key={pair.left} left={pair.left} right={pair.right} />
          ))}
        </div>

        <Prose className="mt-8">
          <p>
            A satellite hotspot is a detection of heat at a place and time. By itself, it does not
            show who started a fire, who controls the land, or whether any law was broken. Two
            patterns that move together may be worth investigating, but a correlation is not a
            legal attribution: that needs evidence linking a specific actor to a specific event,
            assessed through a legal process.
          </p>
          <p>
            So the project keeps what is observed apart from what is interpreted, what is
            attributed and what is legally established, and applies the same rules to people and
            to AI.
          </p>
        </Prose>
        <p className="mt-8">
          <Link
            href="/evidence"
            className="font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink"
          >
            Read the evidence framework&nbsp;<span aria-hidden="true">→</span>
          </Link>
        </p>
      </AboutSection>

      {/* ──────────────────────── §06 HOW AI FITS IN ───────────────────── */}
      <AboutSection
        index="06"
        eyebrow="How AI fits in"
        id="ai"
        title="AI is part of the experiment, and part of the record."
      >
        <Lede>
          JEREBU.EXE asks whether AI agents can make civic investigation more accessible. That
          makes the way AI is used part of the product, not a footnote.
        </Lede>
        <Prose>
          <p>
            Behind the project is a broader question: can one person working with AI agents and
            open public data build useful civic infrastructure around a long-running environmental
            problem? Nobody knows yet. Answering it honestly means showing what humans decided,
            what AI did, what it got wrong and what humans had to correct.
          </p>
        </Prose>

        <div className="mt-10 grid gap-px border-2 border-ink bg-ink md:grid-cols-2">
          <div className="bg-paper p-6">
            <TransparencyLabel name="Human decision" />
            <h3 className="mt-4 text-xl font-bold tracking-tight">
              Decided by humans, before Experiment 001
            </h3>
            <ol className="mt-5 space-y-3">
              {humanDecisions.map((item, i) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span aria-hidden="true" className="w-6 shrink-0 pt-0.5 font-mono text-sm text-signal-ink tabular-nums">
                    {pad(i + 1)}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col bg-paper p-6">
            <p className="flex flex-wrap gap-2">
              <TransparencyLabel name="AI generated" />
              <TransparencyLabel name="Unverified" />
            </p>
            <h3 className="mt-4 text-xl font-bold tracking-tight">Done by AI, in Experiment 001</h3>
            <ul className="mt-5 space-y-3">
              {aiWork.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span aria-hidden="true" className="font-mono text-sm text-signal-ink">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {experiment001?.phases ? (
              <dl className="mt-6 space-y-1.5 border-t border-line pt-4">
                {experiment001.phases.map((phase) => (
                  <div key={phase.label} className="flex flex-wrap justify-between gap-x-4">
                    <dt className="label-mono text-muted">{phase.label}</dt>
                    <dd className="label-mono text-ink">{phase.state}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <p className="mt-auto pt-6">
              <Link
                href="/experiments#exp-001"
                className="font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink"
              >
                Read the Experiment 001 record&nbsp;<span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-[65ch] leading-relaxed text-muted">
          The AI did not conceive the project, choose its name or set its mission. It worked from
          a brief written by the project&rsquo;s human founder.
        </p>
        <p className="mt-4 max-w-[65ch] leading-relaxed text-muted">
          The same holds for Experiment 002. The founder wrote its brief and its research
          question. An AI agent did the research, built the haze history dataset and the{" "}
          <Link href="/timeline" className="text-ink underline underline-offset-4 hover:text-signal-ink">
            timeline
          </Link>
          , and checked its own work. No human has reviewed that work yet:{" "}
          <Link href="/experiments#exp-002" className="text-ink underline underline-offset-4 hover:text-signal-ink">
            read the Experiment 002 record
          </Link>
          .
        </p>

        <h3 className="mt-14 text-2xl font-bold tracking-tight">Five labels for AI involvement</h3>
        <p className="mt-3 max-w-[65ch] text-lg leading-relaxed text-graphite">
          The project uses these labels to show who did what, and how far it has been checked.
        </p>
        <dl className="mt-6 border-t-2 border-ink">
          {transparencyLabels.map((label) => (
            <div
              key={label.name}
              className="grid gap-2 border-b border-line py-4 sm:grid-cols-[12rem_1fr] sm:items-baseline sm:gap-6"
            >
              <dt>
                <TransparencyLabel name={label.name} />
              </dt>
              <dd className="leading-relaxed text-graphite">{label.meaning}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[65ch] leading-relaxed text-graphite">
          How each label is applied is set out in the project&rsquo;s AI transparency policy:{" "}
          <ExternalLink href={repoFile("docs/AI_TRANSPARENCY.md")} className={linkClass}>
            docs/AI_TRANSPARENCY.md on GitHub
          </ExternalLink>
          .
        </p>

        <div className="mt-12 border-l-2 border-signal-ink bg-paper-2 p-6">
          <h3 className="label-mono text-muted">Two things to be clear about</h3>
          <ul className="mt-4 space-y-4 leading-relaxed">
            <li>
              <strong className="font-semibold">
                Use of Claude Code does not imply endorsement by Anthropic.
              </strong>{" "}
              <span className="text-muted">
                Claude Code is an AI coding agent made by Anthropic. It is the tool used in
                Experiments 001, 002 and 003.
              </span>
            </li>
            <li>
              <strong className="font-semibold">AI output is not evidence until it is verified.</strong>{" "}
              <span className="text-muted">
                Anything an AI agent writes or finds, including the text on this site, should be
                treated as unverified until a person has checked it against reliable sources.
              </span>
            </li>
          </ul>
        </div>
      </AboutSection>

      {/* ─────────────────────── §07 WHAT IT IS NOT ────────────────────── */}
      <AboutSection
        index="07"
        eyebrow="Boundaries"
        id="what-it-is-not"
        title="What JEREBU.EXE is not."
        surface="dark"
      >
        <ul className="border-t border-ink-line">
          {notList.map((item) => (
            <li key={item} className="flex gap-5 border-b border-ink-line py-5">
              <span
                aria-hidden="true"
                className="shrink-0 font-mono text-2xl leading-tight font-bold text-signal"
              >
                ×
              </span>
              <p className="text-xl leading-snug font-semibold tracking-tight sm:text-2xl">{item}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[65ch] text-lg leading-relaxed text-ink-muted">
          What it is: an independent, educational, open-source civic-tech experiment. It is small,
          at an early stage, and run in public.
        </p>
      </AboutSection>

      {/* ───────────────────────────── DISCLAIMER ──────────────────────── */}
      <section aria-labelledby="disclaimer" className="pt-16 sm:pt-20">
        <Container>
          <div className="border-2 border-ink">
            <h2
              id="disclaimer"
              className="label-mono flex items-center gap-3 bg-ink px-5 py-3 text-paper sm:px-8"
            >
              <span aria-hidden="true" className="inline-block size-2.5 bg-signal" />
              Disclaimer
            </h2>
            <p className="max-w-[46ch] p-6 font-serif text-2xl leading-snug sm:p-8 sm:text-3xl">
              {disclaimer}
            </p>
          </div>
        </Container>
      </section>

      {/* ──────────────────────────── §08 CONTACT ──────────────────────── */}
      <AboutSection index="08" eyebrow="Contact" id="contact" title="Write to the project.">
        <p className="label-mono text-muted">Email</p>
        <p className="mt-2">
          <a
            href={`mailto:${site.contactEmail}`}
            className="font-mono text-xl font-bold [overflow-wrap:anywhere] underline decoration-2 underline-offset-[6px] hover:text-signal-ink sm:text-3xl"
          >
            {emailLocal}
            <wbr />@{emailDomain}
          </a>
        </p>

        <ul className="mt-10 border-t-2 border-ink">
          <li className="border-b border-line py-4 leading-relaxed">
            <strong className="font-semibold">Do not send sensitive material.</strong>{" "}
            <span className="text-muted">
              Please do not send personal health information or confidential documents.
            </span>
          </li>
          <li className="border-b border-line py-4 leading-relaxed">
            <strong className="font-semibold">No advice.</strong>{" "}
            <span className="text-muted">
              The project cannot give legal, medical or scientific advice. For health concerns,
              please speak to a medical professional.
            </span>
          </li>
          <li className="border-b border-line py-4 leading-relaxed">
            <strong className="font-semibold">No personal data collected here.</strong>{" "}
            <span className="text-muted">
              The site&rsquo;s code collects no personal data. There are no forms, accounts,
              cookies, analytics or third-party scripts.
            </span>
          </li>
          <li className="border-b border-line py-4 leading-relaxed">
            <strong className="font-semibold">Public is often better.</strong>{" "}
            <span className="text-muted">
              For corrections, bugs and suggestions, consider{" "}
              <ExternalLink href={`${site.repoUrl}/issues`} className={linkClass}>
                opening an issue on GitHub
              </ExternalLink>
              , where others can see and check it. Do not post personal or confidential
              information there either.
            </span>
          </li>
        </ul>
      </AboutSection>
    </>
  );
}
