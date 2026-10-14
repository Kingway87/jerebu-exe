import type { ReactNode } from "react";
import type { SourceSnapshot } from "@/lib/live/types";
import { StatusChip } from "./status-chip";

const reasonLead: Record<string, string> = {
  "not-configured": "Not configured.",
  auth: "Access refused.",
  "rate-limited": "Too many requests.",
  timeout: "No response in time.",
  network: "Could not connect.",
  http: "The source returned an error.",
  parse: "The response could not be read.",
  validation: "The response did not match the documented format.",
};

interface UnavailableNoticeProps {
  /** Plain statement, e.g. "NASA FIRMS data currently unavailable." */
  headline: string;
  snapshot: Pick<SourceSnapshot, "outcome" | "failure" | "requests">;
  /** What the absence does NOT mean, e.g. "This is not a finding of no fires." */
  notMeaning: string;
  children?: ReactNode;
}

/**
 * The honest failure state for a live source: says that the data is
 * missing, why, and what the gap does not mean. It never shows zero, an
 * empty chart, or an "all clear".
 */
export function UnavailableNotice({ headline, snapshot, notMeaning, children }: UnavailableNoticeProps) {
  const failure = snapshot.failure;
  const status = snapshot.outcome === "not-configured" ? "not-configured" : "unavailable";

  return (
    <div className="border-2 border-dashed border-signal-ink bg-paper p-6 sm:p-8">
      <StatusChip status={status} />
      <p className="mt-4 text-2xl leading-snug font-bold tracking-tight">{headline}</p>
      {failure ? (
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          <strong className="font-semibold text-ink">{reasonLead[failure.kind] ?? "Unavailable."}</strong>{" "}
          {failure.message}
          {failure.httpStatus ? ` (HTTP ${failure.httpStatus})` : null}
        </p>
      ) : null}
      <p className="mt-3 max-w-2xl leading-relaxed font-semibold">{notMeaning}</p>
      {children ? <div className="mt-4 max-w-2xl leading-relaxed text-muted">{children}</div> : null}
    </div>
  );
}
