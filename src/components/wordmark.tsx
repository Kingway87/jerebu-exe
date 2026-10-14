/** The JEREBU.EXE wordmark: a signal block followed by the name in mono. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-mono font-bold tracking-tight ${className}`}>
      <span aria-hidden="true" className="inline-block size-3 bg-signal" />
      <span>
        JEREBU<span className="text-ink-muted">.EXE</span>
      </span>
    </span>
  );
}
