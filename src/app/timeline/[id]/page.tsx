import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { EpisodeBody } from "@/components/timeline/episode";
import { episodeHref } from "@/components/timeline/links";
import {
  confidenceName,
  criterionName,
  formatDate,
  hazeEvents,
  hazeHistory,
  jurisdictionName,
  originStatusName,
  responsibilityStatusName,
  reviewStageName,
} from "@/content/haze-history";

/**
 * One page per episode, generated at build time from data/haze-events.json.
 * (`dynamicParams` is not available with Cache Components; an unknown id
 * reaches `notFound()` below and gets the 404 page.)
 */
export function generateStaticParams() {
  return hazeEvents.map((event) => ({ id: event.id }));
}

export async function generateMetadata(props: PageProps<"/timeline/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const event = hazeEvents.find((e) => e.id === id);
  if (!event) return {};
  return {
    title: event.title,
    description: `${event.title}. A haze episode as public sources record it; every statement links to its source.${
      event.ongoing
        ? ` Still under way when compiled (sources up to ${formatDate(hazeHistory.meta.compiled)}); not updated as the situation changes.`
        : ""
    } Compiled by an AI research agent; not yet verified by a human.`,
  };
}

export default async function EpisodePage(props: PageProps<"/timeline/[id]">) {
  const { id } = await props.params;
  const index = hazeEvents.findIndex((e) => e.id === id);
  if (index === -1) notFound();
  const event = hazeEvents[index];
  const earlier = hazeEvents[index - 1];
  const later = hazeEvents[index + 1];
  const year = event.period.start.slice(0, 4);

  const facts = [
    { term: "Confidence", value: confidenceName[event.confidence.level] },
    { term: "Review stage", value: reviewStageName[event.review.stage] },
    {
      term: "Criteria met",
      value: event.selection.criteria.map((c) => `${c.criterion} ${criterionName[c.criterion]}`).join(" · "),
    },
    { term: "Origin of the smoke", value: originStatusName[event.attribution.origin] },
    { term: "Who caused the fires", value: responsibilityStatusName[event.attribution.responsibility] },
  ];

  return (
    <>
      {/* ──────────────────────────── HEADER ──────────────────────────── */}
      <section aria-labelledby="episode-title" className="surface-dark">
        <Container className="pt-10 pb-14 sm:pt-14 sm:pb-16">
          <nav aria-label="Breadcrumb">
            <ol className="label-mono flex flex-wrap items-center gap-x-2 text-ink-muted">
              <li>
                <Link href="/timeline" className="inline-flex min-h-11 items-center text-paper underline underline-offset-4 hover:text-signal">
                  Timeline
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{year}</li>
            </ol>
          </nav>

          <p className="label-mono mt-8 text-ink-muted">Haze episode · {event.period.label}</p>
          <h1
            id="episode-title"
            className="mt-5 max-w-4xl text-4xl leading-[1.04] font-bold tracking-[-0.03em] text-balance sm:text-5xl"
          >
            {event.title}
          </h1>

          <p className="mt-6 flex flex-wrap gap-1.5">
            {event.ongoing ? (
              <span className="label-mono inline-flex border border-signal px-2 py-0.5 whitespace-nowrap text-signal">
                Ongoing
              </span>
            ) : null}
            {event.jurisdictions.map((code) => (
              <span key={code} className="label-mono inline-flex border border-ink-muted px-2 py-0.5 whitespace-nowrap">
                {jurisdictionName[code]}
              </span>
            ))}
          </p>

          <div className="mt-8 max-w-3xl border-l-2 border-signal pl-5">
            <p className="leading-relaxed text-ink-muted">
              <strong className="font-semibold text-paper">Not yet checked by a human.</strong> An
              AI research agent wrote this entry from the sources listed at the end, and every
              statement links to the passage it rests on. Treat it as a well-sourced lead until a
              person verifies it.
            </p>
            {event.ongoing ? (
              <p className="mt-4 leading-relaxed text-ink-muted">
                <strong className="font-semibold text-paper">Still under way when this entry was compiled</strong>{" "}
                (sources up to {formatDate(hazeHistory.meta.compiled)}). Figures are provisional and
                may be revised by the agencies that published them. This page is not updated as the
                situation changes: for current conditions, check the official air-quality services
                in each country.
              </p>
            ) : null}
          </div>

          <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-ink-line pt-6 sm:grid-cols-2 lg:grid-cols-5">
            {facts.map((f) => (
              <div key={f.term}>
                <dt className="label-mono text-ink-muted">{f.term}</dt>
                <dd className="mt-1 font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ───────────────────────────── BODY ───────────────────────────── */}
      <div className="py-14 sm:py-20">
        <Container>
          <EpisodeBody event={event} />

          <nav aria-label="Other episodes" className="mt-20 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2">
            {earlier ? (
              <Link href={episodeHref(earlier.id)} className="group bg-paper p-5 hover:bg-paper-2">
                <span className="label-mono text-muted">
                  <span aria-hidden="true">← </span>Earlier episode
                </span>
                <span className="mt-1 block font-semibold underline-offset-4 group-hover:underline">
                  {earlier.title}
                </span>
              </Link>
            ) : (
              <p className="bg-paper p-5 text-muted">This is the earliest episode in the timeline.</p>
            )}
            {later ? (
              <Link href={episodeHref(later.id)} className="group bg-paper p-5 hover:bg-paper-2 sm:text-right">
                <span className="label-mono text-muted">
                  Later episode<span aria-hidden="true"> →</span>
                </span>
                <span className="mt-1 block font-semibold underline-offset-4 group-hover:underline">
                  {later.title}
                </span>
              </Link>
            ) : (
              <p className="bg-paper p-5 text-muted sm:text-right">This is the latest episode in the timeline.</p>
            )}
          </nav>
          <p className="mt-6">
            <Link
              href="/timeline"
              className="font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink"
            >
              <span aria-hidden="true">← </span>All episodes
            </Link>
          </p>
        </Container>
      </div>
    </>
  );
}
