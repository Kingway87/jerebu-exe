import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ExternalLink } from "@/components/external-link";
import { EvidenceLevelTag } from "@/components/live/evidence-level-tag";
import { FirePanel } from "@/components/live/fire-panel";
import { HowItWorks } from "@/components/live/how-it-works";
import { MalaysiaAirPanel } from "@/components/live/malaysia-air-panel";
import { MalaysiaForecastPanel } from "@/components/live/malaysia-forecast-panel";
import { WhatThisDoesNotMean, WhatThisMeans } from "@/components/live/meaning-sections";
import { RegionalConditionsPanel } from "@/components/live/regional-conditions-panel";
import { SingaporeAirPanel } from "@/components/live/singapore-air-panel";
import { SourceStatusTable, type StatusRow } from "@/components/live/source-status-table";
import { SourcesRegister } from "@/components/live/sources-register";
import { StatusChip } from "@/components/live/status-chip";
import { SectionHeader } from "@/components/section-header";
import { repoFile } from "@/content/site";
import { getLiveSource } from "@/lib/live/registry";
import {
  getFireView,
  getMalaysiaForecastSnapshot,
  getSingaporePm25Snapshot,
  getSingaporePsiSnapshot,
  getSingaporeRainfallSnapshot,
  getSingaporeWindDirectionSnapshot,
  getSingaporeWindSpeedSnapshot,
} from "@/lib/live/snapshots";
import { displayStatusLabel, displayStatusMeaning, displayStatusOrder } from "@/lib/live/status";
import {
  fireSummarySentence,
  pm25Summary,
  psiSummary,
  rainfallSummary,
  windSpeedSummary,
  type Summary,
} from "@/lib/live/summaries";

export const metadata: Metadata = {
  title: "Live evidence",
  description:
    "Current public observations relevant to transboundary haze affecting Malaysia and Singapore — satellite fire detections, official air-quality readings and weather measurements — each with its source, its time and its limits. Live evidence, not live accusations.",
};

const pad = (n: number) => String(n).padStart(2, "0");

const onThisPage = [
  { id: "status", label: "Status" },
  { id: "fires", label: "Satellite fires" },
  { id: "malaysia", label: "Malaysia air" },
  { id: "singapore", label: "Singapore air" },
  { id: "regional", label: "Regional conditions" },
  { id: "meaning", label: "What this means" },
  { id: "not-meaning", label: "What it does not mean" },
  { id: "sources", label: "Sources" },
  { id: "how", label: "How it works" },
];

export default async function LivePage() {
  const [fire, psi, pm25, windDirection, windSpeed, rainfall, malaysiaForecast] = await Promise.all([
    getFireView(),
    getSingaporePsiSnapshot(),
    getSingaporePm25Snapshot(),
    getSingaporeWindDirectionSnapshot(),
    getSingaporeWindSpeedSnapshot(),
    getSingaporeRainfallSnapshot(),
    getMalaysiaForecastSnapshot(),
  ]);

  const firms = getLiveSource("nasa-firms");
  const psiSource = getLiveSource("datagovsg-psi");
  const pm25Source = getLiveSource("datagovsg-pm25");
  const windDirectionSource = getLiveSource("datagovsg-wind-direction");
  const windSpeedSource = getLiveSource("datagovsg-wind-speed");
  const rainfallSource = getLiveSource("datagovsg-rainfall");
  const apims = getLiveSource("doe-apims");
  const metMalaysiaForecast = getLiveSource("datagovmy-weather-forecast");
  const asmc = getLiveSource("asmc");

  const statusRows: StatusRow[] = [
    { source: firms, shows: "Satellite fire detections (VIIRS, NOAA-20 and NOAA-21)", snapshot: fire.snapshot },
    { source: apims, shows: "Malaysia’s hourly Air Pollutant Index", snapshot: null },
    {
      source: metMalaysiaForecast,
      shows: "MET Malaysia’s forecast for today, by state (a forecast, not an observation)",
      snapshot: { ...malaysiaForecast, latestObservedAt: null },
    },
    { source: psiSource, shows: "Singapore’s 24-hour PSI by region", snapshot: psi },
    { source: pm25Source, shows: "Singapore’s 1-hour PM2.5 by region", snapshot: pm25 },
    { source: windDirectionSource, shows: "Wind direction at Singapore stations", snapshot: windDirection },
    { source: windSpeedSource, shows: "Wind speed at Singapore stations", snapshot: windSpeed },
    { source: rainfallSource, shows: "Rainfall at Singapore stations", snapshot: rainfall },
    { source: asmc, shows: "Regional haze situation, hotspots and alerts", snapshot: null },
  ];

  const summaries = [
    fireSummarySentence(fire.snapshot, fire.summary),
    psiSummary(psi),
    pm25Summary(pm25),
    windSpeedSummary(windSpeed),
    rainfallSummary(rainfall),
  ].filter((s): s is Summary => s !== null);

  return (
    <>
      {/* ──────────────────────────── HEADER ──────────────────────────── */}
      <section aria-labelledby="live-title" className="surface-dark">
        <Container className="pt-14 pb-16 sm:pt-20 sm:pb-20">
          <p className="label-mono text-ink-muted">
            JEREBU.EXE <span aria-hidden="true">/</span> Live
          </p>
          <h1
            id="live-title"
            className="mt-6 max-w-4xl text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl"
          >
            Live evidence. Not live accusations.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
            Current public observations relevant to transboundary haze affecting Malaysia and Singapore:
            satellite fire detections, official air-quality readings and weather measurements. Each comes
            with its source, the time it describes, when this site retrieved it, and what it cannot show.
          </p>

          <div className="mt-10 max-w-3xl border-l-2 border-signal pl-5">
            <p className="font-mono text-lg leading-snug font-bold tracking-tight uppercase sm:text-2xl">
              No data <span className="text-signal">≠</span> zero.
              <br />
              Observation <span className="text-signal">≠</span> attribution.
              <br />
              Attribution <span className="text-signal">≠</span> legal responsibility.
            </p>
            <p className="mt-4 leading-relaxed text-ink-muted">
              This page reports what instruments and agencies have published. It does not say who caused
              anything, and it is not health advice: for that, follow the official advisories where you
              are.
            </p>
          </div>

          <dl className="mt-12 grid gap-6 border-t border-ink-line pt-6 sm:grid-cols-3">
            <div>
              <dt className="label-mono text-ink-muted">Status</dt>
              <dd className="mt-1">Experiment 003, awaiting human review</dd>
            </div>
            <div>
              <dt className="label-mono text-ink-muted">Data</dt>
              <dd className="mt-1">Read by this site&rsquo;s server from official sources; your browser contacts no other site</dd>
            </div>
            <div>
              <dt className="label-mono text-ink-muted">Page written by</dt>
              <dd className="mt-1">AI (Claude Code), from the founder&rsquo;s brief</dd>
            </div>
          </dl>

          <nav aria-label="On this page" className="mt-10">
            <p className="label-mono text-ink-muted">On this page</p>
            <ol className="label-mono mt-2 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-5">
              {onThisPage.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex min-h-11 items-center gap-2 text-paper underline-offset-4 hover:text-signal hover:underline"
                  >
                    <span aria-hidden="true" className="text-ink-muted">
                      {pad(i + 1)}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Container>
      </section>

      {/* ───────────────────────────── §01 STATUS ──────────────────────────── */}
      <section aria-labelledby="status" className="py-20 sm:py-24">
        <Container>
          <SectionHeader index="01" eyebrow="Source status" id="status" title="What each source is doing now.">
            <p>
              Status is worked out from how old each source&rsquo;s newest data is, compared with how often
              that source normally publishes. Your browser re-checks it against your clock, because this page
              can be served some time after the data was retrieved.
            </p>
          </SectionHeader>

          <SourceStatusTable rows={statusRows} />

          <dl className="mt-10 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-3">
            {displayStatusOrder.map((status) => (
              <div key={status} className="bg-paper p-5">
                <dt>
                  <StatusChip status={status} />
                  <span className="sr-only">: {displayStatusLabel[status]}</span>
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">{displayStatusMeaning[status]}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ─────────────────────────── §02 SATELLITE FIRES ─────────────────────────── */}
      <section aria-labelledby="fires" className="bg-paper-2 py-20 sm:py-24">
        <Container>
          <SectionHeader index="02" eyebrow="Satellite fire observations" id="fires" title="Where satellites detected heat.">
            <p>
              NASA&rsquo;s Fire Information for Resource Management System (FIRMS) distributes near-real-time
              &ldquo;active fire&rdquo; detections from satellites. This page uses the VIIRS instruments on the
              NOAA-20 and NOAA-21 satellites. Each detection marks the centre of a pixel about 375 metres
              across in which the detection algorithm flagged one or more fires or other thermal anomalies
              as the satellite passed over.
            </p>
          </SectionHeader>
          <div className="mb-10 grid gap-8 lg:grid-cols-2">
            <div className="border-2 border-ink bg-paper p-6">
              <EvidenceLevelTag level="observation" />
              <h3 className="mt-4 text-xl font-bold tracking-tight">What a detection can show</h3>
              <ul className="mt-3 space-y-2">
                {firms.canShow.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="font-mono text-signal-ink">
                      +
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-2 border-ink bg-paper p-6">
              <p className="label-mono text-muted">Cannot show, by itself</p>
              <h3 className="mt-4 text-xl font-bold tracking-tight">What a detection cannot show</h3>
              <ul className="mt-3 space-y-2">
                {firms.cannotShow.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="font-mono text-signal-ink">
                      ×
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <FirePanel snapshot={fire.snapshot} summary={fire.summary} source={firms} />
        </Container>
      </section>

      {/* ─────────────────────────── §03 MALAYSIA AIR ─────────────────────────── */}
      <section aria-labelledby="malaysia" className="py-20 sm:py-24">
        <Container>
          <SectionHeader index="03" eyebrow="Malaysia air" id="malaysia" title="What Malaysia is reporting.">
            <p>
              Malaysia&rsquo;s official measure is the Air Pollutant Index, published hourly by the Department
              of Environment.
            </p>
          </SectionHeader>
          <MalaysiaAirPanel apims={apims} />
          <div className="mt-16">
            <h3 className="text-2xl font-bold tracking-tight">What MET Malaysia forecasts</h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted">
              The Malaysian Meteorological Department&rsquo;s general forecast, published through the
              government&rsquo;s open data portal. It is the official Malaysian information about haze that
              this page can show automatically.
            </p>
            <div className="mt-6">
              <MalaysiaForecastPanel snapshot={malaysiaForecast} source={metMalaysiaForecast} />
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────── §04 SINGAPORE AIR ─────────────────────────── */}
      <section aria-labelledby="singapore" className="bg-paper-2 py-20 sm:py-24">
        <Container>
          <SectionHeader index="04" eyebrow="Singapore air" id="singapore" title="What Singapore is reporting.">
            <p>
              The National Environment Agency (NEA) reports the 24-hour Pollutant Standards Index (PSI) and
              1-hour PM2.5 concentrations for five regions. NEA computes the PSI from six pollutants: each gets
              a sub-index, and the highest sub-index is the PSI.
            </p>
          </SectionHeader>
          <div className="mb-8">
            <EvidenceLevelTag level="observation" />
          </div>
          <SingaporeAirPanel psi={psi} pm25={pm25} psiSource={psiSource} pm25Source={pm25Source} />
        </Container>
      </section>

      {/* ───────────────────────── §05 REGIONAL CONDITIONS ───────────────────────── */}
      <section aria-labelledby="regional" className="py-20 sm:py-24">
        <Container>
          <SectionHeader index="05" eyebrow="Regional conditions" id="regional" title="Weather, and the regional picture.">
            <p>
              Weather moves and clears smoke, so it is part of the context. But a wind reading at one station
              cannot show where smoke came from, and nothing on this page connects a fire to haze somewhere
              else.
            </p>
          </SectionHeader>
          <RegionalConditionsPanel
            windDirection={windDirection}
            windSpeed={windSpeed}
            rainfall={rainfall}
            sources={{ windDirection: windDirectionSource, windSpeed: windSpeedSource, rainfall: rainfallSource }}
            regionalContext={
              <div className="border-2 border-dashed border-subtle p-6">
                <StatusChip status="not-integrated" />
                <p className="mt-4 text-lg font-semibold">{asmc.name}</p>
                <p className="mt-2 max-w-3xl leading-relaxed text-muted">{asmc.limitations[0]}</p>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted">
                  Named here, not linked or copied: ASMC&rsquo;s terms of use set conditions on linking and
                  reuse that a person has yet to review. ASMC&rsquo;s regional assessments are interpretations
                  by an official centre. If you read them, read them as ASMC&rsquo;s, not as findings of this
                  site.
                </p>
              </div>
            }
          />
        </Container>
      </section>

      {/* ─────────────────────────── §06 WHAT THIS MEANS ─────────────────────────── */}
      <section aria-labelledby="meaning" className="bg-paper-2 py-20 sm:py-24">
        <Container>
          <SectionHeader index="06" eyebrow="What this means" id="meaning" title="Observation first. Interpretation is a separate step.">
            <p>
              The left column restates what the sources reported. The right column lists questions people
              naturally ask next, which this page does not answer.
            </p>
          </SectionHeader>
          <WhatThisMeans summaries={summaries} />
        </Container>
      </section>

      {/* ───────────────────────── §07 WHAT THIS DOES NOT MEAN ───────────────────────── */}
      <section aria-labelledby="not-meaning" className="py-20 sm:py-24">
        <Container>
          <SectionHeader index="07" eyebrow="What this does not mean" id="not-meaning" title="Seeing heat is not knowing who is responsible.">
            <p>
              Each step from a satellite detection to legal responsibility needs its own evidence. This page
              stops at the first step.
            </p>
          </SectionHeader>
          <WhatThisDoesNotMean />
        </Container>
      </section>

      {/* ──────────────────────────── §08 SOURCES ──────────────────────────── */}
      <section aria-labelledby="sources" className="bg-paper-2 py-20 sm:py-24">
        <Container>
          <SectionHeader index="08" eyebrow="Sources" id="sources" title="Every source, and how it was checked.">
            <p>
              From the machine-readable register{" "}
              <ExternalLink href={repoFile("data/live-sources.json")} className="text-ink underline underline-offset-4 hover:text-signal-ink">
                data/live-sources.json
              </ExternalLink>
              . AI agents opened each official page during Experiment 003. No human has checked them yet.
            </p>
          </SectionHeader>
          <SourcesRegister />
        </Container>
      </section>

      {/* ───────────────────────── §09 HOW THIS PAGE WORKS ───────────────────────── */}
      <section aria-labelledby="how" className="py-20 sm:py-24">
        <Container>
          <SectionHeader index="09" eyebrow="How this page works" id="how" title="Deterministic data in. No AI in the loop.">
            <p>
              The full design, the failure behaviour and the limits are documented in{" "}
              <ExternalLink href={repoFile("docs/LIVE_EVIDENCE.md")} className="text-ink underline underline-offset-4 hover:text-signal-ink">
                docs/LIVE_EVIDENCE.md
              </ExternalLink>
              .
            </p>
          </SectionHeader>
          <HowItWorks />
          <div className="mt-14 grid gap-px border-2 border-ink bg-ink md:grid-cols-3">
            <div className="bg-paper p-6">
              <h3 className="text-lg font-bold tracking-tight">When the data is read</h3>
              <p className="mt-2 leading-relaxed text-muted">
                When the site is built, and again in the background when someone visits after a source&rsquo;s
                refresh interval (10 to 60 minutes, depending on the source). A failed source is retried after
                about two minutes. On a host that only serves files, the data stays as it was at build time,
                and the status labels say how old it is.
              </p>
            </div>
            <div className="bg-paper p-6">
              <h3 className="text-lg font-bold tracking-tight">What happens when a source fails</h3>
              <p className="mt-2 leading-relaxed text-muted">
                The page says the source is unavailable, why, and what the gap does not mean. It never shows a
                zero, an empty chart or an &ldquo;all clear&rdquo; in place of missing data.
              </p>
            </div>
            <div className="bg-paper p-6">
              <h3 className="text-lg font-bold tracking-tight">Your privacy</h3>
              <p className="mt-2 leading-relaxed text-muted">
                The page does not ask for your location, sets no cookies and loads nothing from other
                websites. The map is drawn from data stored in this site&rsquo;s code, not from a map service.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
