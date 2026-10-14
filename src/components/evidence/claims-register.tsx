import type { ReactNode } from "react";
import { ExternalLink } from "@/components/external-link";
import {
  claimStatusLabel,
  siteClaims,
  type Citation,
  type ClaimStatus,
  type SiteClaim,
} from "@/content/claims";

const statusOrder: readonly ClaimStatus[] = ["unverified", "cited", "human-verified"];

/** What each status means. Mirrors the rules documented in src/content/claims.ts. */
const statusMeaning: Record<ClaimStatus, string> = {
  unverified: "No reliable source is linked yet.",
  cited: "A reliable source is linked.",
  "human-verified": "A named human reviewer has checked the linked source.",
};

const statusStyle: Record<ClaimStatus, string> = {
  unverified: "border-dashed border-subtle text-muted",
  cited: "border-ink text-ink",
  "human-verified": "border-ink bg-ink text-paper",
};

/** Status tag. The text carries the meaning; the border style is secondary. */
function ClaimStatusTag({ status }: { status: ClaimStatus }) {
  return (
    <span
      className={`label-mono inline-flex border px-2.5 py-1 whitespace-nowrap ${statusStyle[status]}`}
    >
      {claimStatusLabel[status]}
    </span>
  );
}

/** The claim text, with any foreign-language term marked up for screen readers. */
function claimText({ claim, term }: SiteClaim): ReactNode {
  const at = term ? claim.indexOf(term.text) : -1;
  if (!term || at === -1) return claim;
  return (
    <>
      {claim.slice(0, at)}
      <span lang={term.lang}>{term.text}</span>
      {claim.slice(at + term.text.length)}
    </>
  );
}

/** One citation, following the citation standard in docs/METHODOLOGY.md. */
function CitationEntry({ citation }: { citation: Citation }) {
  return (
    <li className="leading-relaxed">
      <cite className="not-italic font-semibold text-ink">{citation.title}</cite>, {citation.publisher} (
      {citation.published}).{" "}
      {citation.linkable ? (
        <ExternalLink href={citation.url} className="[overflow-wrap:anywhere] underline underline-offset-4 hover:text-signal-ink">
          {citation.url.replace(/^https:\/\//, "")}
        </ExternalLink>
      ) : (
        <>
          <span className="[overflow-wrap:anywhere]">{citation.url.replace(/^https:\/\//, "")}</span>{" "}
          <span className="text-muted">(not linked: the publisher&rsquo;s terms set conditions on linking that a person has yet to review)</span>
        </>
      )}
      . Accessed {citation.accessed}. Read by {citation.readBy}.
      {citation.quote ? (
        <details className="mt-1">
          <summary className="label-mono cursor-pointer text-muted hover:text-ink">Quoted text</summary>
          <p className="mt-1 border-l-2 border-line pl-3 font-serif">&ldquo;{citation.quote}&rdquo;</p>
        </details>
      ) : null}
    </li>
  );
}

/** The site's own factual claims and how well each is currently supported. */
export function ClaimsRegister() {
  return (
    <div>
      <h3 className="label-mono text-muted">What the statuses mean</h3>
      <dl className="mt-4 grid gap-px border-2 border-ink bg-ink sm:grid-cols-3">
        {statusOrder.map((status) => (
          <div key={status} className="bg-paper p-5">
            <dt>
              <ClaimStatusTag status={status} />
            </dt>
            <dd className="mt-3 text-sm leading-relaxed text-muted">{statusMeaning[status]}</dd>
          </div>
        ))}
      </dl>

      <h3 className="label-mono mt-14 text-muted">Register</h3>
      <ul className="mt-4 border-t-2 border-ink">
        {siteClaims.map((entry) => (
          <li
            key={entry.claim}
            className="grid gap-x-10 gap-y-5 border-b border-line py-8 md:grid-cols-12"
          >
            <p className="font-serif text-xl leading-snug sm:text-2xl md:col-span-7">
              {claimText(entry)}
            </p>
            <dl className="space-y-4 md:col-span-5">
              <div>
                <dt className="label-mono text-muted">Status</dt>
                <dd className="mt-2">
                  <ClaimStatusTag status={entry.status} />
                </dd>
              </div>
              <div>
                <dt className="label-mono text-muted">Note</dt>
                <dd className="mt-2 leading-relaxed text-muted">{entry.note}</dd>
              </div>
              {entry.citations && entry.citations.length > 0 ? (
                <div>
                  <dt className="label-mono text-muted">{entry.citations.length === 1 ? "Source" : "Sources"}</dt>
                  <dd className="mt-2">
                    <ul className="space-y-3 text-sm text-muted">
                      {entry.citations.map((citation) => (
                        <CitationEntry key={`${citation.url}-${citation.title}`} citation={citation} />
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : null}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
