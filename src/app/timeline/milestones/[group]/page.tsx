import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { milestoneGroupHref } from "@/components/timeline/links";
import { MilestoneList } from "@/components/timeline/milestone-list";
import {
  hazeMilestones,
  milestoneGroupInfo,
  milestoneGroups,
  type MilestoneGroup,
} from "@/content/haze-history";

/**
 * One page per milestone group, generated at build time. (`dynamicParams` is
 * not available with Cache Components; an unknown group reaches `notFound()`.)
 */
export function generateStaticParams() {
  return milestoneGroups
    .filter((group) => hazeMilestones.some((m) => m.group === group))
    .map((group) => ({ group }));
}

function findGroup(value: string): MilestoneGroup | undefined {
  return milestoneGroups.find((g) => g === value);
}

export async function generateMetadata(props: PageProps<"/timeline/milestones/[group]">): Promise<Metadata> {
  const group = findGroup((await props.params).group);
  if (!group) return {};
  const info = milestoneGroupInfo[group];
  return {
    title: `Haze history milestones: ${info.title}`,
    description: `${info.intro} Each entry is linked to its sources. Compiled by an AI research agent; not yet verified by a human.`,
  };
}

export default async function MilestoneGroupPage(props: PageProps<"/timeline/milestones/[group]">) {
  const group = findGroup((await props.params).group);
  if (!group) notFound();
  const items = hazeMilestones.filter((m) => m.group === group);
  if (items.length === 0) notFound();
  const info = milestoneGroupInfo[group];
  const others = milestoneGroups.filter((g) => g !== group && hazeMilestones.some((m) => m.group === g));

  return (
    <>
      <section aria-labelledby="group-title" className="surface-dark">
        <Container className="pt-10 pb-14 sm:pt-14 sm:pb-16">
          <nav aria-label="Breadcrumb">
            <ol className="label-mono flex flex-wrap items-center gap-x-2 text-ink-muted">
              <li>
                <Link href="/timeline" className="inline-flex min-h-11 items-center text-paper underline underline-offset-4 hover:text-signal">
                  Timeline
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/timeline/milestones" className="inline-flex min-h-11 items-center text-paper underline underline-offset-4 hover:text-signal">
                  Milestones
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{info.title}</li>
            </ol>
          </nav>
          <p className="label-mono mt-8 text-ink-muted">Milestones</p>
          <h1
            id="group-title"
            className="mt-5 max-w-4xl text-4xl leading-[1.04] font-bold tracking-[-0.03em] text-balance sm:text-5xl"
          >
            {info.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {info.intro} {items.length} milestone{items.length === 1 ? "" : "s"}, in date order.
          </p>
          <p className="mt-6 max-w-3xl border-l-2 border-signal pl-5 leading-relaxed text-ink-muted">
            <strong className="font-semibold text-paper">Historical markers, not legal analysis.</strong>{" "}
            Parties to enforcement actions and court cases are not named. An AI research agent
            compiled these entries; no human has checked them yet.
          </p>
        </Container>
      </section>

      <div className="py-14 sm:py-20">
        <Container>
          <MilestoneList milestones={items} />
          <nav aria-label="Other milestone groups" className="mt-14">
            <p className="label-mono text-muted">Other milestones</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {others.map((g) => (
                <li key={g}>
                  <Link
                    href={milestoneGroupHref(g)}
                    className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:text-signal-ink"
                  >
                    {milestoneGroupInfo[g].title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-8">
            <Link
              href="/timeline/milestones"
              className="font-mono text-sm font-semibold tracking-[0.08em] uppercase underline underline-offset-4 hover:text-signal-ink"
            >
              <span aria-hidden="true">← </span>All milestones
            </Link>
          </p>
        </Container>
      </div>
    </>
  );
}
