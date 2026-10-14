interface InequalityProps {
  left: string;
  right: string;
  surface?: "light" | "dark";
}

/** A large "A ≠ B" statement that also reads correctly to screen readers. */
export function Inequality({ left, right, surface = "light" }: InequalityProps) {
  const sign = surface === "dark" ? "text-signal" : "text-signal-ink";

  return (
    <p className="font-mono text-2xl leading-tight font-bold tracking-tight uppercase sm:text-3xl lg:text-4xl">
      <span>{left}</span>{" "}
      <span aria-hidden="true" className={sign}>
        ≠
      </span>
      <span className="sr-only">is not the same as</span>{" "}
      <span>{right}</span>
    </p>
  );
}
