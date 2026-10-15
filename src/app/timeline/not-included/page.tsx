import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { ClaimList } from "@/components/timeline/claim-list";
import { excludedAnchor } from "@/components/timeline/links";
import { excludedPeriods } from "@/content/haze-history";

export const metadata: Metadata = {
  title: "Haze history: periods not included",
  description:
    "Years and periods from 1997 to 2026 that were checked for the haze history and left out, with the reason for each and any sourced facts about them. Leaving a period out is not a claim that there was no haze. Compiled by an AI research agent; not yet verified by a human.",
};

/**
 * Every period that was considered and left out, with its reason and its
 * sourced claims. The /timeline overview shows the reasons only and links
 * here, so that the overview stays light on a phone.
 */
export default function NotIncludedPage() {
  const claimCount = excludedPeriods.reduce((n, x) => n + x.claims.length, 0);

  return (
    <>
      <section aria-labelledby="not-included-title" className="surface-dark">
        <Container className="pt-10 pb-14 sm:pt-14 sm:pb-16">
          <nav aria-label="Breadcrumb">
            <ol className="label-mono flex flex-wrap items-center gap-x-2 text-ink-muted">
              <li>
                <Link href="/timeline" className="inline-flex min-h-11 items-center text-paper underline underline-offset-4 hover:text-signal">
                  Timeline
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Not included</li>
            </ol>
          </nav>
          <p className="label-mono mt-8 text-ink-muted">Considered, not included</p>
          <h1
            id="not-included-title"
            className="mt-5 max-w-4xl text-4xl leading-[1.04] font-bold tracking-[-0.03em] text-balance sm:text-5xl"
          >
            Years that were checked and left out.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {excludedPeriods.length} periods were considered and did not meet the selection
            criteria, or the evidence found was too thin. Each has the reason, in terms of the
            criteria, and any sourced facts about it ({claimCount} labelled statements in all).
          </p>
          <p className="mt-6 max-w-3xl border-l-2 border-signal pl-5 leading-relaxed text-ink-muted">
            <strong className="font-semibold text-paper">Leaving a period out is not a claim that there was no haze.</strong>{" "}
            The reasons are the AI agent&rsquo;s summaries of the evidence; the labelled statements
            link to their sources. No human has checked them yet.
          </p>
        </Container>
      </section>

      <div className="py-14 sm:py-20">
        <Container>
          <ol className="border-t-2 border-ink">
            {excludedPeriods.map((x) => (
              <li
                key={x.id}
                id={excludedAnchor(x.id)}
                className="grid scroll-mt-6 gap-x-10 gap-y-3 border-b border-line py-8 md:grid-cols-12"
              >
                <div className="md:col-span-3">
                  <h2 className="text-xl leading-snug font-semibold tracking-tight">{x.period}</h2>
                  <p className="label-mono mt-2 text-muted">
                    {x.claims.length
                      ? `${x.claims.length} sourced statement${x.claims.length === 1 ? "" : "s"}`
                      : "Reason only"}
                  </p>
                </div>
                <div className="min-w-0 md:col-span-9">
                  <p className="max-w-3xl leading-relaxed">{x.reason}</p>
                  {x.claims.length ? (
                    <details className="group/statements mt-4">
                      <summary className="label-mono inline-flex min-h-11 cursor-pointer list-none items-center gap-2 underline-offset-4 hover:text-signal-ink hover:underline [&::-webkit-details-marker]:hidden">
                        <span aria-hidden="true" className="font-mono group-open/statements:hidden">
                          +
                        </span>
                        <span aria-hidden="true" className="hidden font-mono group-open/statements:inline">
                          −
                        </span>
                        <span className="group-open/statements:hidden">Show</span>
                        <span className="hidden group-open/statements:inline">Hide</span>{" "}
                        {x.claims.length === 1 ? "the sourced statement" : `the ${x.claims.length} sourced statements`}
                        <span className="sr-only"> for: {x.period}</span>
                      </summary>
                      <div className="mt-3">
                        <ClaimList claims={x.claims} />
                      </div>
                    </details>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-14">
            <Link
              href="/timeline#not-included"
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
