import { Fragment } from "react";
import { ExternalLink } from "@/components/external-link";

/** An https address in running text. Trailing punctuation is not part of it. */
const URL_PATTERN = /https:\/\/[^\s)]+[^\s).,;:]/g;

/**
 * Registry text, such as an attribution notice, with each https address in it
 * rendered as a link. Used only for text from data/live-sources.json, which is
 * part of this repository, never for text received from a source.
 */
export function LinkedText({ text }: { text: string }) {
  const parts: (string | { url: string })[] = [];
  let last = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push({ url: match[0] });
    last = start + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <ExternalLink key={i} href={part.url} className="underline underline-offset-4 hover:text-signal-ink">
            {part.url.replace(/^https:\/\//, "")}
          </ExternalLink>
        ),
      )}
    </>
  );
}
