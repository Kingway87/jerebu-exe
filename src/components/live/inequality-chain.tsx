import { Fragment } from "react";

interface InequalityChainProps {
  terms: readonly string[];
  surface?: "light" | "dark";
}

/**
 * "A ≠ B ≠ C …" as a list that wraps cleanly on small screens and reads
 * correctly to screen readers ("A is not the same as B, which is not the
 * same as C …").
 */
export function InequalityChain({ terms, surface = "light" }: InequalityChainProps) {
  const sign = surface === "dark" ? "text-signal" : "text-signal-ink";

  return (
    <p className="font-mono text-xl leading-snug font-bold tracking-tight uppercase sm:text-2xl lg:text-3xl">
      {terms.map((term, i) => (
        <Fragment key={term}>
          {i > 0 ? (
            <>
              {" "}
              <span aria-hidden="true" className={sign}>
                ≠
              </span>
              <span className="sr-only">{i === 1 ? " is not the same as " : ", which is not the same as "}</span>{" "}
            </>
          ) : null}
          <span className="whitespace-nowrap">{term}</span>
        </Fragment>
      ))}
    </p>
  );
}
