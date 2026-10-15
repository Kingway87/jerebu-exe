import { ExternalLink } from "@/components/external-link";
import { liveSourceRegistry, type Integration, type LiveSource } from "@/lib/live/registry";
import { LinkedText } from "./linked-text";

const integrationLabel: Record<Integration, string> = {
  integrated: "Fetched and shown on this page",
  "integrated-needs-credential": "Fetched when a credential is configured",
  bundled: "Copied into the site’s code, not fetched",
  "link-only": "Linked, not copied",
  "reference-only": "Used as reference only",
};

const recordTypeLabel: Record<LiveSource["recordType"], string> = {
  observation: "Observations",
  forecast: "Forecasts",
  assessment: "Assessments by the agency",
  reference: "Reference data",
};

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 leading-relaxed">
          <span aria-hidden="true" className="font-mono text-signal-ink">
            –
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Full card for a source the page uses: what it is, its terms, limits and how it was checked. */
function SourceCard({ source }: { source: LiveSource }) {
  return (
    <li id={`source-${source.id}`} className="border-2 border-ink bg-paper">
      <div className="grid gap-x-8 gap-y-4 p-5 sm:p-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label-mono text-muted">
            {recordTypeLabel[source.recordType]} · {source.status}
          </p>
          <h3 className="mt-2 text-xl leading-snug font-bold tracking-tight">
            <SourceName source={source} />
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {source.institution}
            {source.publisher ? ` · published by ${source.publisher}` : null}
          </p>
        </div>
        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:col-span-7">
          <div>
            <dt className="label-mono text-muted">On this page</dt>
            <dd className="mt-1">{integrationLabel[source.integration]}</dd>
          </div>
          <div>
            <dt className="label-mono text-muted">Credential</dt>
            <dd className="mt-1">{source.authentication.notes}</dd>
          </div>
          <div>
            <dt className="label-mono text-muted">Updates</dt>
            <dd className="mt-1">{source.updateFrequency}</dd>
          </div>
          <div>
            <dt className="label-mono text-muted">Licence</dt>
            <dd className="mt-1">
              {source.licence.url ? (
                <ExternalLink href={source.licence.url} className="underline underline-offset-4 hover:text-signal-ink">
                  {source.licence.name}
                </ExternalLink>
              ) : (
                source.licence.name
              )}
            </dd>
          </div>
        </dl>
      </div>

      <details className="group border-t border-line">
        <summary className="label-mono flex min-h-11 cursor-pointer items-center gap-2 px-5 text-muted hover:text-ink sm:px-6">
          <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-90">
            ›
          </span>
          Limits, attribution and how it was checked
        </summary>
        <div className="grid gap-8 px-5 pb-6 text-sm sm:px-6 lg:grid-cols-3">
          <div>
            <h4 className="label-mono text-muted">Can show</h4>
            <List items={source.canShow} />
          </div>
          <div>
            <h4 className="label-mono text-muted">Cannot show</h4>
            <List items={source.cannotShow} />
          </div>
          <div>
            <h4 className="label-mono text-muted">Limitations</h4>
            <List items={source.limitations} />
          </div>
          <div className="lg:col-span-3">
            <h4 className="label-mono text-muted">Attribution</h4>
            <p className="mt-2 max-w-3xl leading-relaxed [overflow-wrap:anywhere]">
              <LinkedText text={source.attribution} />
            </p>
          </div>
          <div className="lg:col-span-3">
            <h4 className="label-mono text-muted">How these facts were checked</h4>
            <p className="mt-2 max-w-3xl leading-relaxed text-muted">
              {source.verification.method} Checked on {source.verification.checkedOn} by{" "}
              {source.verification.checkedBy}.{" "}
              <strong className="font-semibold text-ink">
                {source.verification.humanVerified && source.verification.humanVerification
                  ? `Reviewed by ${source.verification.humanVerification.by} on ${source.verification.humanVerification.on}.`
                  : "Not yet verified by a human."}
              </strong>
            </p>
            {source.linkable !== false && source.documentationUrls.length > 0 ? (
              <ul className="mt-3 space-y-1">
                {source.documentationUrls.map((url) => (
                  <li key={url} className="[overflow-wrap:anywhere]">
                    <ExternalLink href={url} className="underline underline-offset-4 hover:text-signal-ink">
                      {url.replace(/^https:\/\//, "")}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </details>
    </li>
  );
}

/** A source's name: linked to its official page, unless its terms restrict linking. */
function SourceName({ source }: { source: LiveSource }) {
  if (source.linkable === false) {
    return (
      <>
        {source.name}
        <span className="mt-1 block text-sm font-normal text-muted">
          {source.officialUrl.replace(/^https:\/\//, "")} · named, not linked: its terms of use set conditions on
          linking that a person has yet to review
        </span>
      </>
    );
  }
  return (
    <ExternalLink href={source.officialUrl} className="underline decoration-1 underline-offset-4 hover:decoration-2">
      {source.name}
    </ExternalLink>
  );
}

const USED: readonly Integration[] = ["integrated", "integrated-needs-credential", "bundled", "link-only"];

/**
 * Every source investigated for the page, from data/live-sources.json. Sources
 * the page uses get a full card. Sources investigated but not used get one
 * line each; their full records are in the JSON file and docs/DATA_SOURCES.md.
 */
export function SourcesRegister() {
  const used = liveSourceRegistry.sources.filter((s) => USED.includes(s.integration));
  const notUsed = liveSourceRegistry.sources.filter((s) => !USED.includes(s.integration));

  return (
    <div className="space-y-14">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Used on this page</h3>
        <ol className="mt-6 space-y-6">
          {used.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight">Also investigated, not used</h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          Each was checked in Experiment 003 and left out, for the reason given. Full records are in the
          register file.
        </p>
        <ul className="mt-6 border-t-2 border-ink">
          {notUsed.map((source) => (
            <li key={source.id} id={`source-${source.id}`} className="grid gap-x-8 gap-y-2 border-b border-line py-5 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="label-mono text-muted">
                  {recordTypeLabel[source.recordType]} · {source.status}
                </p>
                <p className="mt-1 font-semibold tracking-tight">
                  <SourceName source={source} />
                </p>
                <p className="text-sm text-muted">{source.institution}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted md:col-span-7">
                {source.notUsedBecause ?? source.limitations[0]}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
