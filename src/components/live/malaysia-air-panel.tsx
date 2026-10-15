import { ButtonLink } from "@/components/button-link";
import { ExternalLink } from "@/components/external-link";
import type { LiveSource } from "@/lib/live/registry";
import { StatusChip } from "./status-chip";

/**
 * Bands of Malaysia's Air Pollutant Index, from DOE's method document
 * "Pengiraan Indeks Pencemar Udara (IPU) / Air Pollutant Index (API)
 * Calculation" (page 22 and the health table on pages 24–25), accessed
 * 15 October 2026. The health table also lists "above 500: Emergency".
 */
export const MY_API_BANDS = [
  { range: "0–50", label: "Good" },
  { range: "51–100", label: "Moderate" },
  { range: "101–200", label: "Unhealthy" },
  { range: "201–300", label: "Very unhealthy" },
  { range: "Above 300", label: "Hazardous" },
] as const;

/** Averaging periods per pollutant, from the same DOE document (page 4). */
export const MY_API_POLLUTANTS = [
  { pollutant: "PM2.5", averaging: "24 hours" },
  { pollutant: "PM10", averaging: "24 hours" },
  { pollutant: "Sulphur dioxide", averaging: "1 hour" },
  { pollutant: "Nitrogen dioxide", averaging: "1 hour" },
  { pollutant: "Ozone", averaging: "1 hour and 8 hours" },
  { pollutant: "Carbon monoxide", averaging: "8 hours" },
] as const;

const METHOD_PDF = "https://eqms.doe.gov.my/Documents/APIMS/API_Calculation.pdf";

interface MalaysiaAirPanelProps {
  apims: LiveSource;
}

/**
 * Malaysia's official current air-quality readings are published for people
 * to read, not as a documented data feed. This panel says so, explains the
 * index from DOE's own method document, and links to the official page.
 */
export function MalaysiaAirPanel({ apims }: MalaysiaAirPanelProps) {
  return (
    <div className="space-y-10">
      <div className="border-2 border-dashed border-subtle bg-paper p-6 sm:p-8">
        <StatusChip status="not-integrated" />
        <p className="mt-4 text-2xl leading-snug font-bold tracking-tight">
          Malaysian air-quality readings are not copied onto this page.
        </p>
        <div className="mt-3 max-w-3xl space-y-3 leading-relaxed text-muted">
          <p>
            The Department of Environment Malaysia (DOE) publishes the hourly Air Pollutant Index (API)
            for its monitoring stations on its APIMS page and in the MyJAS EQMS app. During this
            experiment no documented public data feed or downloadable dataset of current readings was
            found. DOE&rsquo;s open-data page lists the index among its open datasets, but the link leads to
            the APIMS page, which offers neither. The page loads its readings from internal addresses that
            are not documented for public use, so JEREBU.EXE does not read them.
          </p>
          <p className="font-semibold text-ink">
            No Malaysian reading appears here. That is a gap in what this site can show, not a sign that
            the air is good or bad.
          </p>
        </div>
        <div className="mt-6">
          <ButtonLink href={apims.officialUrl} external>
            Read current readings at DOE (APIMS)
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="text-xl font-bold tracking-tight">How DOE calculates the index</h3>
          <p className="mt-3 leading-relaxed text-muted">
            According to DOE&rsquo;s method document, each of six pollutants is averaged over its own
            period and converted to a sub-index, and the published index is the highest sub-index.
          </p>
          <table className="mt-4 w-full border-collapse text-left text-sm">
            <caption className="sr-only">Pollutants and averaging periods in Malaysia&rsquo;s Air Pollutant Index</caption>
            <thead>
              <tr className="label-mono border-y-2 border-ink text-muted">
                <th scope="col" className="py-2 pr-4 font-normal">
                  Pollutant
                </th>
                <th scope="col" className="py-2 font-normal">
                  Averaging period
                </th>
              </tr>
            </thead>
            <tbody>
              {MY_API_POLLUTANTS.map((row) => (
                <tr key={row.pollutant} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 font-semibold">
                    {row.pollutant}
                  </th>
                  <td className="py-2">{row.averaging}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight">DOE&rsquo;s bands</h3>
          <table className="mt-4 w-full border-collapse text-left text-sm">
            <caption className="sr-only">Bands of Malaysia&rsquo;s Air Pollutant Index</caption>
            <thead>
              <tr className="label-mono border-y-2 border-ink text-muted">
                <th scope="col" className="py-2 pr-4 font-normal">
                  Index
                </th>
                <th scope="col" className="py-2 font-normal">
                  Band
                </th>
              </tr>
            </thead>
            <tbody>
              {MY_API_BANDS.map((row) => (
                <tr key={row.range} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 font-mono font-semibold tabular-nums">
                    {row.range}
                  </th>
                  <td className="py-2">{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Source:{" "}
            <ExternalLink href={METHOD_PDF} className="underline underline-offset-4 hover:text-signal-ink">
              DOE, Air Pollutant Index (API) Calculation (PDF)
            </ExternalLink>
            , accessed 15 October 2026. The document&rsquo;s health table calls the 101–200 band
            &ldquo;Unhealthy (for sensitive group)&rdquo; and adds &ldquo;Emergency&rdquo; above 500.
          </p>
        </div>
      </div>

      <p className="max-w-3xl border-l-2 border-signal-ink pl-5 leading-relaxed">
        <strong className="font-semibold">Malaysia&rsquo;s API and Singapore&rsquo;s PSI are different indices.</strong>{" "}
        Different agencies calculate them with different methods. For example, DOE averages sulphur
        dioxide over one hour, while NEA publishes a 24-hour sulphur dioxide value and describes the PSI
        as based on 24-hour averages. The same number need not mean the same air, so do not compare them
        directly.
      </p>
    </div>
  );
}
