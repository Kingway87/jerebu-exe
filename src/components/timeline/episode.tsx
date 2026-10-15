import Link from "next/link";
import {
  confidenceName,
  criterionName,
  eventSections,
  formatDate,
  getMilestone,
  getSource,
  hazeHistory,
  originStatusName,
  responsibilityStatusName,
  type Claim,
  type CountryRecord,
  type HazeEvent,
} from "@/content/haze-history";
import { ClaimList, PassageToggleLabel, RefPassage } from "./claim-list";
import { Disclosure, SubSection } from "./disclosure";
import { milestoneHref } from "./links";
import { SourceList } from "./source-list";

/**
 * The body of an episode page. It follows the order the founder's brief sets
 * out (when, what happened, Malaysia, Singapore, regional context, response,
 * what changed, sources), with aftermath, health evidence, the reasons for
 * inclusion, attribution and confidence, and open questions added before the
 * sources. "When" and "What happened" are always visible; everything else
 * starts closed, so a long record stays short on a phone. An empty section is
 * still shown, because missing evidence is not evidence that nothing happened.
 */

function count(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

function claimCount(claims: readonly Claim[]) {
  return count(claims.length, "claim", "claims");
}

/** Shown when a section has no sourced claims. Missing is not zero. */
function NothingFound({ what }: { what: string }) {
  return (
    <p className="leading-relaxed text-muted">
      <span className="font-semibold text-ink">Not established.</span> No sourced statement
      about {what} was found for this episode. That is a gap in the evidence collected, not
      evidence that nothing happened.
    </p>
  );
}

interface CountryProps {
  name: string;
  record: CountryRecord;
  numbers: ReadonlyMap<string, number>;
}

function CountrySection({ name, record, numbers }: CountryProps) {
  const groups = [
    { title: "Impact", claims: record.impact },
    { title: "Air quality", claims: record.airQuality },
    { title: "Government response", claims: record.responses },
  ].filter((g) => g.claims.length > 0);

  return (
    <Disclosure title={name} meta={groups.length ? claimCount(groups.flatMap((g) => g.claims)) : "Nothing sourced"}>
      {groups.length === 0 ? (
        <NothingFound what={name} />
      ) : (
        groups.map((g) => (
          <SubSection key={g.title} title={g.title} context={name}>
            <ClaimList claims={g.claims} sourceNumbers={numbers} />
          </SubSection>
        ))
      )}
    </Disclosure>
  );
}

/**
 * Why the episode is in the timeline: each pre-registered criterion it met,
 * with the claims that show it and where they appear on the page.
 */
function SelectionNote({ event }: { event: HazeEvent }) {
  const located = new Map<string, { claim: Claim; section: string }>();
  for (const section of eventSections(event)) {
    for (const claim of section.claims) located.set(claim.id, { claim, section: section.title });
  }
  return (
    <>
      <p className="leading-relaxed">{event.selection.note}</p>
      <ul className="mt-6 space-y-6">
        {event.selection.criteria.map(({ criterion, claims }) => (
          <li key={criterion}>
            <p className="label-mono">
              <span className="text-signal-ink">{criterion}</span> · {criterionName[criterion]}
            </p>
            <ul className="mt-2 space-y-2 border-l-2 border-line pl-4">
              {claims.map((id) => {
                const found = located.get(id);
                if (!found) return null;
                return (
                  <li key={id} className="leading-relaxed">
                    {found.claim.text}{" "}
                    <span className="text-sm text-muted">(under {found.section})</span>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        The criteria are set out under{" "}
        <Link href="/timeline#method" className="text-ink underline underline-offset-4 hover:text-signal-ink">
          Method
        </Link>
        . They were written before the research results were read.
      </p>
    </>
  );
}

export function EpisodeBody({ event }: { event: HazeEvent }) {
  const numbers = new Map(event.sources.map((id, i) => [id, i + 1]));
  const uses = new Map<string, number>();
  for (const claim of eventSections(event).flatMap((s) => s.claims)) {
    for (const id of new Set(claim.refs.map((r) => r.source))) uses.set(id, (uses.get(id) ?? 0) + 1);
  }
  for (const id of new Set(event.period.refs.map((r) => r.source))) uses.set(id, (uses.get(id) ?? 0) + 1);
  const summaryOnly = new Set(event.sources.filter((id) => !uses.has(id)));
  const changed = [...event.policyDevelopments, ...event.legalDevelopments];
  const related = event.relatedMilestones
    .map((id) => getMilestone(id))
    .filter((m) => m !== undefined);
  const openCount =
    event.contradictions.length + event.evidenceGaps.length + event.unresolvedQuestions.length;

  return (
    <>
      <section aria-labelledby="when">
        <h2 id="when" className="label-mono text-muted">
          When
        </h2>
        <p className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">{event.period.label}</p>
        <div className="mt-4 max-w-3xl">
          <h3 className="label-mono text-muted">How these dates were chosen</h3>
          {event.period.note ? <p className="mt-2 leading-relaxed text-muted">{event.period.note}</p> : null}
          <details className="group/claim mt-3">
            <summary className="label-mono inline-flex min-h-6 cursor-pointer list-none items-center gap-1.5 text-muted underline-offset-4 hover:text-ink hover:underline [&::-webkit-details-marker]:hidden">
              <PassageToggleLabel refs={event.period.refs} />
              <span className="sr-only"> for the dates of this episode</span>
            </summary>
            <div className="mt-3 space-y-4">
              {event.period.refs.map((ref, i) => (
                <RefPassage key={`${ref.source}-${i}`} sourceRef={ref} n={numbers.get(ref.source)} />
              ))}
            </div>
          </details>
        </div>
      </section>

      <section aria-labelledby="what-happened" className="mt-14">
        <h2 id="what-happened" className="label-mono text-muted">
          What happened
        </h2>
        <div className="mt-4 max-w-3xl">
          <ClaimList claims={event.summary} lead sourceNumbers={numbers} />
        </div>
      </section>

      <section aria-labelledby="in-detail" className="mt-14">
        <h2 id="in-detail" className="label-mono text-muted">
          In detail
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Open a section to read it. Every statement carries a label, such as observation or
          analysis, and its source passage. Numbers in square brackets refer to the sources at
          the end.
        </p>
        <div className="mt-6 border-t-2 border-ink">
          <CountrySection name="Malaysia" record={event.malaysia} numbers={numbers} />
          <CountrySection name="Singapore" record={event.singapore} numbers={numbers} />

          <Disclosure
            title="Regional context"
            meta={event.regionalContext.length ? claimCount(event.regionalContext) : "Nothing sourced"}
          >
            {event.regionalContext.length ? (
              <ClaimList claims={event.regionalContext} sourceNumbers={numbers} />
            ) : (
              <NothingFound what="the regional context" />
            )}
          </Disclosure>

          <Disclosure
            title="Response between governments"
            meta={event.diplomaticResponse.length ? claimCount(event.diplomaticResponse) : "Nothing sourced"}
          >
            <p className="mb-5 text-sm leading-relaxed text-muted">
              Responses between governments and at regional level. Each country&rsquo;s own
              response is under &ldquo;Government response&rdquo; in the Malaysia and Singapore
              sections above.
            </p>
            {event.diplomaticResponse.length ? (
              <ClaimList claims={event.diplomaticResponse} sourceNumbers={numbers} />
            ) : (
              <NothingFound what="responses between governments" />
            )}
          </Disclosure>

          <Disclosure
            title="What changed"
            meta={
              changed.length || related.length
                ? count(changed.length + related.length, "item", "items")
                : "Nothing sourced"
            }
          >
            {event.policyDevelopments.length ? (
              <SubSection title="Policy" context="What changed">
                <ClaimList claims={event.policyDevelopments} sourceNumbers={numbers} />
              </SubSection>
            ) : null}
            {event.legalDevelopments.length ? (
              <SubSection title="Law and courts" context="What changed">
                <ClaimList claims={event.legalDevelopments} sourceNumbers={numbers} />
              </SubSection>
            ) : null}
            {related.length ? (
              <SubSection title="Related milestones" context="What changed">
                <p className="mb-3 text-sm leading-relaxed text-muted">
                  Legal, policy and other milestones that their sources connect with this
                  episode. A milestone that followed an episode was not necessarily caused by it.
                </p>
                <ul className="space-y-2">
                  {related.map((m) => (
                    <li key={m.id} className="leading-relaxed">
                      <Link href={milestoneHref(m)} className="underline underline-offset-4 hover:text-signal-ink">
                        {m.title}
                      </Link>{" "}
                      <span className="text-muted">({formatDate(m.date)})</span>
                    </li>
                  ))}
                </ul>
              </SubSection>
            ) : null}
            {!changed.length && !related.length ? (
              <NothingFound what="policy, legal or other changes following this episode" />
            ) : null}
          </Disclosure>

          <Disclosure
            title="Aftermath"
            meta={event.aftermath.length ? claimCount(event.aftermath) : "Nothing sourced"}
          >
            {event.aftermath.length ? (
              <ClaimList claims={event.aftermath} sourceNumbers={numbers} />
            ) : event.ongoing ? (
              <p className="leading-relaxed text-muted">
                The episode was still under way when this record was compiled (sources to{" "}
                {formatDate(hazeHistory.meta.compiled)}), so there is no aftermath to record yet.
              </p>
            ) : (
              <NothingFound what="the aftermath of this episode" />
            )}
          </Disclosure>

          <Disclosure title="Health evidence" meta={event.health.length ? claimCount(event.health) : "Nothing sourced"}>
            {event.health.length ? (
              <>
                <p className="mb-6 max-w-2xl border-l-2 border-signal pl-4 text-sm leading-relaxed text-muted">
                  <strong className="font-semibold text-ink">How to read this.</strong> Research on
                  populations, records of clinic and hospital visits, and official health advice
                  describe groups of people, not individuals. None of it shows that haze caused any
                  particular person&rsquo;s illness. Modelled estimates are estimates, with
                  uncertainty.
                </p>
                <ClaimList claims={event.health} sourceNumbers={numbers} />
              </>
            ) : (
              <NothingFound what="health effects" />
            )}
          </Disclosure>

          <Disclosure
            title="Why it is included"
            meta={event.selection.criteria.map((c) => c.criterion).join(" · ")}
          >
            <SelectionNote event={event} />
          </Disclosure>

          <Disclosure
            title="Attribution and confidence"
            meta={`${originStatusName[event.attribution.origin]} · ${confidenceName[event.confidence.level]}`}
          >
            <SubSection title="Origin of the smoke" context="Attribution">
              <p className="leading-relaxed">
                <span className="font-semibold">{originStatusName[event.attribution.origin]}.</span>{" "}
                {event.attribution.note}
              </p>
            </SubSection>
            <SubSection title="Who caused the fires" context="Attribution">
              <p className="leading-relaxed">
                <span className="font-semibold">
                  {responsibilityStatusName[event.attribution.responsibility].toUpperCase()}.
                </span>{" "}
                This record does not establish who started any fire or who is legally responsible
                for this episode. See{" "}
                <Link href="/timeline#method" className="text-ink underline underline-offset-4 hover:text-signal-ink">
                  how attribution is handled
                </Link>
                .
              </p>
            </SubSection>
            <SubSection title="Why this confidence level" context="Confidence">
              <p className="leading-relaxed">
                <span className="font-semibold">{confidenceName[event.confidence.level]}.</span>{" "}
                {event.confidence.rationale}
              </p>
            </SubSection>
          </Disclosure>

          <Disclosure title="Open questions and conflicts" meta={count(openCount, "item", "items")}>
            {event.contradictions.length ? (
              <SubSection title="Where sources disagree" context="Open questions">
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  Summaries written by the AI agent. The passages behind them are in the sources
                  cited and, where quoted, under the statements above.
                </p>
                <ul className="space-y-4">
                  {event.contradictions.map((c) => (
                    <li key={c.text} className="leading-relaxed">
                      {c.text}{" "}
                      <span className="font-mono text-xs text-muted">
                        {c.sources.map((s) => `[${numbers.get(s) ?? "?"}]`).join(" ")}
                      </span>
                      <span className="sr-only">
                        {" "}
                        Sources: {c.sources.map((s) => getSource(s).title).join("; ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </SubSection>
            ) : null}
            {event.evidenceGaps.length ? (
              <SubSection title="Evidence not found" context="Open questions">
                <ul className="list-disc space-y-2 pl-5 leading-relaxed marker:text-muted">
                  {event.evidenceGaps.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </SubSection>
            ) : null}
            {event.unresolvedQuestions.length ? (
              <SubSection title="Unresolved questions" context="Open questions">
                <ul className="list-disc space-y-2 pl-5 leading-relaxed marker:text-muted">
                  {event.unresolvedQuestions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </SubSection>
            ) : null}
            {openCount === 0 ? <NothingFound what="disagreements, gaps or open questions" /> : null}
          </Disclosure>

          <Disclosure title="Sources" meta={count(event.sources.length, "source", "sources")}>
            <SourceList ids={event.sources} uses={uses} summaryOnly={summaryOnly} />
          </Disclosure>
        </div>
      </section>
    </>
  );
}
