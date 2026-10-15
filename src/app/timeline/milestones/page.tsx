import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { milestoneGroupHref, milestoneHref } from "@/components/timeline/links";
import {
  formatDate,
  hazeMilestones,
  milestoneGroupInfo,
  milestoneGroups,
  milestoneKindName,
} from "@/content/haze-history";

export const metadata: Metadata = {
  title: "Haze history milestones",
  description:
    "Legal, policy, institutional, diplomatic and measurement milestones related to transboundary haze affecting Malaysia and Singapore, 1997–2026, each linked to its sources. Compiled by an AI research agent; not yet verified by a human.",
};

export default function MilestonesPage() {
  const groups = milestoneGroups
    .map((group) => ({ group, items: hazeMilestones.filter((m) => m.group === group) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <section aria-labelledby="milestones-title" className="surface-dark">
        <Container className="pt-10 pb-14 sm:pt-14 sm:pb-16">
          <nav aria-label="Breadcrumb">
            <ol className="label-mono flex flex-wrap items-center gap-x-2 text-ink-muted">
              <li>
                <Link href="/timeline" className="inline-flex min-h-11 items-center text-paper underline underline-offset-4 hover:text-signal">
                  Timeline
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Milestones</li>
            </ol>
          </nav>
          <h1
            id="milestones-title"
            className="mt-8 max-w-4xl text-4xl leading-[1.04] font-bold tracking-[-0.03em] text-balance sm:text-5xl"
          >
            Agreements, laws, enforcement, outcomes.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {hazeMilestones.length} legal, policy, institutional, diplomatic and measurement
            milestones, grouped as the research was: regional, then by country, then changes to
            how haze is measured. Within each group they are in date order, and each is labelled
            with its kind: a regional agreement is not a law, a law is not enforcement, and
            enforcement is not a legal outcome.
          </p>
          <div className="mt-8 max-w-3xl border-l-2 border-signal pl-5">
            <p className="leading-relaxed text-ink-muted">
              <strong className="font-semibold text-paper">Historical markers, not legal analysis.</strong>{" "}
              Each entry says what was adopted, decided or done, by whom and when, quoting its
              sources. It does not say what a law means in practice or whether it worked: that is
              for Experiment 004. Parties to enforcement actions and court cases are not named.
              An AI research agent compiled these entries; no human has checked them yet.
            </p>
          </div>
        </Container>
      </section>

      <div className="py-14 sm:py-20">
        <Container>
          <div className="space-y-16">
            {groups.map(({ group, items }) => {
              const info = milestoneGroupInfo[group];
              return (
                <section key={group} aria-labelledby={`group-${group}`} className="border-t-2 border-ink pt-6">
                  <div className="grid gap-x-10 gap-y-4 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                      <h2 id={`group-${group}`} className="text-2xl font-bold tracking-tight">
                        {info.title}
                      </h2>
                      <p className="mt-3 leading-relaxed text-muted">{info.intro}</p>
                      <p className="mt-4">
                        <Link
                          href={milestoneGroupHref(group)}
                          className="font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink"
                        >
                          {items.length} milestone{items.length === 1 ? "" : "s"}, with sources
                          <span className="sr-only">: {info.title}</span>
                          <span aria-hidden="true"> →</span>
                        </Link>
                      </p>
                    </div>
                    <ol className="space-y-3 lg:col-span-8">
                      {items.map((m) => (
                        <li key={m.id} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 leading-snug">
                          <span className="font-mono text-sm text-muted">{formatDate(m.date)}</span>
                          <span>
                            <Link href={milestoneHref(m)} className="underline-offset-4 hover:text-signal-ink hover:underline">
                              {m.title}
                            </Link>{" "}
                            <span className="label-mono text-muted">· {milestoneKindName[m.kind]}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>
              );
            })}
          </div>
          <p className="mt-14">
            <Link
              href="/timeline#what-changed"
              className="font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink"
            >
              <span aria-hidden="true">← </span>Back to the timeline
            </Link>
          </p>
        </Container>
      </div>
    </>
  );
}
