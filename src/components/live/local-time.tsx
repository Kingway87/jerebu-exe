import { formatLocalDate, formatLocalTime, formatUtcDateTime, LOCAL_ZONE_LABEL, toUtcIso } from "@/lib/live/time";

/**
 * A timestamp shown in Malaysia/Singapore time (UTC+8), with the UTC time
 * available to assistive technology and on hover. Rendered on the server.
 * The date and the time each stay on one line, but may wrap between them,
 * so narrow table columns never overflow.
 */
export function LocalTime({ iso, className = "" }: { iso: string; className?: string }) {
  const date = formatLocalDate(iso, "short");
  const time = formatLocalTime(iso);
  const utc = formatUtcDateTime(iso);
  const machine = toUtcIso(iso);
  if (!date || !time || !utc || !machine) {
    return <span className={className}>Unreadable time ({iso})</span>;
  }
  return (
    <time dateTime={machine} title={`${utc} UTC`} className={className}>
      <span className="whitespace-nowrap">{date},</span>{" "}
      <span className="whitespace-nowrap">
        {time} <span className="text-muted">{LOCAL_ZONE_LABEL}</span>
      </span>
    </time>
  );
}
