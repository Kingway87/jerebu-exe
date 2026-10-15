import { ExternalLink } from "@/components/external-link";
import { maintainerReview, reviewNoticeHeading, reviewNoticeParagraphs } from "@/content/review";
import { repoFile, site } from "@/content/site";
import { formatLocalDate } from "@/lib/live/time";

const CONTRIBUTE = "Open an issue, submit a pull request, or propose a correction.";

const link = "underline underline-offset-4 hover:text-signal-ink";

/** The contribution paragraph, with each route linked. */
function ContributeLinks() {
  return (
    <>
      <ExternalLink href={`${site.repoUrl}/issues`} className={link}>
        Open an issue
      </ExternalLink>
      ,{" "}
      <ExternalLink href={`${site.repoUrl}/pulls`} className={link}>
        submit a pull request
      </ExternalLink>
      , or{" "}
      <ExternalLink href={repoFile("docs/CORRECTIONS.md")} className={link}>
        propose a correction
      </ExternalLink>
      .
    </>
  );
}

interface ReviewNoticeProps {
  /**
   * For pages whose data updates by itself (/live): says that readings
   * arriving after the review date were not part of the review.
   */
  liveData?: boolean;
}

/**
 * The maintainer's "Human reviewed · Open for contribution" notice, in the
 * maintainer's own words, with the date and scope of the review.
 */
export function ReviewNotice({ liveData = false }: ReviewNoticeProps) {
  const date = formatLocalDate(`${maintainerReview.on}T12:00:00+08:00`) ?? maintainerReview.on;

  return (
    <section aria-labelledby="review-notice-heading" className="border-2 border-ink bg-paper p-6 sm:p-8">
      <h2 id="review-notice-heading" className="label-mono inline-flex border border-ink bg-ink px-2.5 py-1 text-paper">
        {reviewNoticeHeading}
      </h2>
      <div className="mt-5 max-w-3xl space-y-3 leading-relaxed">
        {reviewNoticeParagraphs.map((paragraph, i) => (
          <p key={paragraph} className={i === 0 ? "text-lg font-semibold" : undefined}>
            {paragraph === CONTRIBUTE ? <ContributeLinks /> : paragraph}
          </p>
        ))}
      </div>
      <p className="mt-5 max-w-3xl border-t border-line pt-4 text-sm leading-relaxed text-muted">
        Reviewed by {maintainerReview.by} on {date}.
        {liveData
          ? " This page’s readings update automatically from their sources, so readings published after that date were not part of the review."
          : null}
      </p>
    </section>
  );
}
