import { ExternalLink } from "@/components/external-link";
import { formatDate, getSource, sourceTypeName, type Source } from "@/content/haze-history";

/** How the AI agent read the source, in plain words. */
const accessDescription: Record<Source["accessMethod"], string> = {
  downloaded: "downloaded; quotes matched to its text by script",
  "web-fetch": "read with a page-reading tool; quotes not matched by script",
  "archive-downloaded": "downloaded from a web archive copy; quotes matched by script",
  "archive-web-fetch": "read from a web archive copy with a page-reading tool; quotes not matched by script",
};

/**
 * The numbered list of every source an entry cites, with enough detail for
 * someone else to find and check it. Numbers match the [n] shown beside each
 * quoted passage.
 */
interface SourceListProps {
  ids: readonly string[];
  /** Source id → how many statements in the entry cite it. */
  uses?: ReadonlyMap<string, number>;
  /** Sources cited only in "Where sources disagree", with no passage on the page. */
  summaryOnly?: ReadonlySet<string>;
}

export function SourceList({ ids, uses, summaryOnly }: SourceListProps) {
  return (
    <ol className="space-y-5">
      {ids.map((id, i) => {
        const source = getSource(id);
        return (
          <li key={id} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2">
            <span className="font-mono text-sm leading-relaxed text-muted">[{i + 1}]</span>
            <div>
              <p className="leading-relaxed">
                <ExternalLink
                  href={source.url}
                  className="font-semibold underline underline-offset-4 hover:text-signal-ink"
                >
                  <cite>{source.title}</cite>
                </ExternalLink>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {source.publisher}
                {source.author ? ` · ${source.author}` : ""} ·{" "}
                {source.published === "undated" ? "Undated" : formatDate(source.published)} ·{" "}
                {sourceTypeName[source.type]}
                {source.access === "paywalled" ? " · Paywalled" : ""}
                {source.access === "partial" ? " · Partly paywalled" : ""}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Read by an AI agent on {formatDate(source.accessed)}:{" "}
                {accessDescription[source.accessMethod]}.
                {source.archivedUrl ? (
                  <>
                    {" "}
                    <ExternalLink
                      href={source.archivedUrl}
                      className="text-ink underline underline-offset-4 hover:text-signal-ink"
                    >
                      Archived copy<span className="sr-only"> of source {i + 1}</span>
                    </ExternalLink>
                  </>
                ) : null}
              </p>
              {source.readFrom && source.readFrom !== source.url && source.readFrom !== source.archivedUrl ? (
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  The text was read from{" "}
                  <ExternalLink
                    href={source.readFrom}
                    className="text-ink underline underline-offset-4 hover:text-signal-ink"
                  >
                    this copy<span className="sr-only"> of source {i + 1}</span>
                  </ExternalLink>
                  , not from the address above.
                </p>
              ) : null}
              {source.note ? (
                <p className="mt-1 text-sm leading-relaxed text-muted">{source.note}</p>
              ) : null}
              {summaryOnly?.has(id) ? (
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Cited under &ldquo;Where sources disagree&rdquo;; no passage from it is shown on this
                  page.
                </p>
              ) : null}
              {uses?.get(id) ? (
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Supports {uses.get(id)} statement{uses.get(id) === 1 ? "" : "s"} in this entry.
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
