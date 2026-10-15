import { ExternalLink } from "@/components/external-link";
import {
  claimLabelName,
  formatDate,
  getSource,
  type Claim,
  type SourceRef,
} from "@/content/haze-history";

/**
 * A list of sourced claims. Each claim shows its text and its label; its
 * sources, with the exact passage each one was relied on for, are one click
 * away. Nothing is shown without a source: the dataset is validated so that
 * every claim has at least one.
 */

/** Named when a quoted passage is not in English. */
const languageName: Record<string, string> = {
  ms: "Malay",
  id: "Indonesian",
  zh: "Chinese",
  ta: "Tamil",
};

/** The claim label, as defined on /evidence. The text carries the meaning. */
export function ClaimLabelTag({ label }: { label: Claim["label"] }) {
  return (
    <span className="label-mono inline-flex border border-graphite px-1.5 whitespace-nowrap text-graphite">
      <span className="sr-only">Claim type: </span>
      {claimLabelName[label]}
    </span>
  );
}

interface RefPassageProps {
  sourceRef: SourceRef;
  /** The source's number in the entry's source list, if it has one. */
  n?: number;
}

/** One quoted passage with its source. Titles are in italics: they are the source's own words. */
export function RefPassage({ sourceRef, n }: RefPassageProps) {
  const source = getSource(sourceRef.source);
  // A passage can be in another language than the rest of its source.
  const lang = sourceRef.language ?? source.language;
  const language = languageName[lang];
  return (
    <figure className="border-l-2 border-line pl-4">
      <blockquote cite={source.url} lang={lang}>
        <p className="font-serif text-lg leading-snug">&ldquo;{sourceRef.quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-2 text-sm leading-relaxed text-muted">
        {n ? <span className="font-mono text-xs text-muted">[{n}] </span> : null}
        {source.publisher},{" "}
        <ExternalLink href={source.url} className="text-ink underline underline-offset-4 hover:text-signal-ink">
          <cite>{source.title}</cite>
        </ExternalLink>
        {source.published === "undated" ? " (undated)" : `, ${formatDate(source.published)}`}
        {sourceRef.pinpoint ? `, ${sourceRef.pinpoint}` : ""}.{language ? ` Quoted in ${language}.` : ""}
        {sourceRef.check === "not-machine-checked" ? (
          <span className="mt-1 block">
            This passage was read with a page-reading tool and could not be matched to the
            source by script. Check it against the source.
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** "1 source · show 2 passages": sources are counted once, however many passages they give. */
export function PassageToggleLabel({ refs }: { refs: readonly SourceRef[] }) {
  const sources = new Set(refs.map((r) => r.source)).size;
  const passages = refs.length;
  const what = passages === 1 ? "passage" : `${passages} passages`;
  return (
    <>
      <span aria-hidden="true" className="font-mono group-open/claim:hidden">
        +
      </span>
      <span aria-hidden="true" className="hidden font-mono group-open/claim:inline">
        −
      </span>
      {sources === 1 ? "1 source" : `${sources} sources`} ·{" "}
      <span className="group-open/claim:hidden">show</span>
      <span className="hidden group-open/claim:inline">hide</span> {what}
    </>
  );
}

interface ClaimListProps {
  claims: readonly Claim[];
  /** Larger type, for the "What happened" summary. */
  lead?: boolean;
  /** Source id → its number in the entry's source list. */
  sourceNumbers?: ReadonlyMap<string, number>;
}

export function ClaimList({ claims, lead = false, sourceNumbers }: ClaimListProps) {
  if (claims.length === 0) return null;
  return (
    <ul className="divide-y divide-line">
      {claims.map((claim) => {
        const textId = `claim-${claim.id}-text`;
        return (
          <li key={claim.id} id={`claim-${claim.id}`} className="py-4 first:pt-0 last:pb-0">
            <p id={textId} className={lead ? "text-lg leading-relaxed sm:text-xl" : "leading-relaxed"}>
              {claim.text}
            </p>
            {claim.note ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-graphite">Note:</span> {claim.note}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-start gap-x-3 gap-y-2">
              <ClaimLabelTag label={claim.label} />
              <details className="group/claim min-w-0 basis-full sm:basis-auto sm:flex-1">
                <summary
                  aria-describedby={textId}
                  className="label-mono inline-flex min-h-6 cursor-pointer list-none items-center gap-1.5 text-muted underline-offset-4 hover:text-ink hover:underline [&::-webkit-details-marker]:hidden"
                >
                  <PassageToggleLabel refs={claim.refs} />
                </summary>
                <div className="mt-3 space-y-4">
                  {claim.refs.map((sourceRef, i) => (
                    <RefPassage
                      key={`${sourceRef.source}-${i}`}
                      sourceRef={sourceRef}
                      n={sourceNumbers?.get(sourceRef.source)}
                    />
                  ))}
                </div>
              </details>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
