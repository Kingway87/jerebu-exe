import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="surface-dark">
      <Container className="py-24 sm:py-32">
        <p className="label-mono text-ink-muted">Error 404</p>
        <h1 id="not-found-title" className="mt-6 font-mono text-4xl leading-tight font-bold sm:text-6xl">
          PAGE NOT FOUND.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
          The page you asked for does not exist, or has moved. Clean air is also still missing.
        </p>
        <div className="mt-10">
          <ButtonLink href="/" surface="dark">
            Back to the homepage
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
