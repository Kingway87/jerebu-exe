import { pipeline } from "@/content/evidence";

/**
 * The planned evidence pipeline. Conceptual only: it is labelled as not
 * implemented wherever it appears.
 */
export function PipelineDiagram() {
  return (
    <figure>
      <ol className="grid grid-cols-1 gap-px border-2 border-dashed border-subtle bg-line sm:grid-cols-2 lg:grid-cols-4">
        {pipeline.map((stage, i) => (
          <li key={stage.name} className="bg-paper p-5">
            <span className="label-mono text-muted">
              {String(i + 1).padStart(2, "0")}
              <span aria-hidden="true"> {i < pipeline.length - 1 ? "→" : "■"}</span>
            </span>
            <span className="mt-3 block text-lg font-bold tracking-tight">{stage.name}</span>
            <span className="mt-1 block text-sm text-muted">{stage.note}</span>
          </li>
        ))}
      </ol>
      <figcaption className="label-mono mt-4 text-muted">
        Planned architecture · Not implemented in V0 · Subject to change
      </figcaption>
    </figure>
  );
}
