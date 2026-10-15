import type { ReactNode } from "react";
import Link from "next/link";
import { ClaimList } from "@/components/timeline/claim-list";
import { claimStatusLabel, siteClaims, type ClaimStatus, type SiteClaim } from "@/content/claims";
import { formatDate, getClaim } from "@/content/haze-history";

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
              {entry.verifiedBy ? (
                <div>
                  <dt className="label-mono text-muted">Verified by</dt>
                  <dd className="mt-2 leading-relaxed">
                    {entry.verifiedBy.name}, {formatDate(entry.verifiedBy.date)}
                  </dd>
                </div>
              ) : null}
            </dl>
            {entry.evidence?.length ? (
              <details className="group/evidence md:col-span-12">
                <summary className="label-mono inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-muted underline-offset-4 hover:text-ink hover:underline [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true" className="font-mono group-open/evidence:hidden">
                    +
                  </span>
                  <span aria-hidden="true" className="hidden font-mono group-open/evidence:inline">
                    −
                  </span>
                  Evidence: {entry.evidence.length} sourced statement
                  {entry.evidence.length === 1 ? "" : "s"} from the haze history
                </summary>
                <div className="mt-4 border-l-2 border-ink pl-5">
                  <ClaimList claims={entry.evidence.map(getClaim)} />
                  <p className="mt-5 text-sm leading-relaxed text-muted">
                    From the{" "}
                    <Link href="/timeline" className="text-ink underline underline-offset-4 hover:text-signal-ink">
                      haze history timeline
                    </Link>
                    , compiled by AI in Experiment 002 and not yet verified by a human.
                  </p>
                </div>
              </details>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
