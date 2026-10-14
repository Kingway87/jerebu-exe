import assert from "node:assert/strict";
import { describe, test } from "node:test";
import Ajv2020 from "ajv/dist/2020";
import registryJson from "../../data/live-sources.json";
import schema from "../../data/live-sources.schema.json";
import { liveSources, registryProblems, type LiveSource, type LiveSourceRegistry } from "@/lib/live/registry";

describe("data/live-sources.json", () => {
  test("validates against data/live-sources.schema.json", () => {
    const ajv = new Ajv2020({ allErrors: true, strict: true });
    const validate = ajv.compile(schema);
    const valid = validate(registryJson);
    assert.equal(valid, true, JSON.stringify(validate.errors, null, 2));
  });

  test("passes the build-time checks", () => {
    assert.deepEqual(registryProblems(registryJson as LiveSourceRegistry), []);
  });

  test("records that no entry has been verified by a human yet", () => {
    for (const source of liveSources) {
      assert.equal(source.verification.humanVerified, false, source.id);
    }
  });

  test("gives every integrated source an attribution, a licence and official documentation", () => {
    for (const source of liveSources.filter((s) => s.integration.startsWith("integrated"))) {
      assert.ok(source.attribution.length > 20, `${source.id}: attribution`);
      assert.ok(source.licence.name.length > 0, `${source.id}: licence`);
      assert.ok(source.documentationUrls.length > 0, `${source.id}: documentation`);
      assert.ok(source.verification.evidence.length > 0, `${source.id}: evidence`);
    }
  });

  test("says what every source cannot show", () => {
    for (const source of liveSources) {
      assert.ok(source.cannotShow.length > 0, source.id);
    }
  });
});

describe("registryProblems", () => {
  const base = liveSources.find((s) => s.integration === "integrated");
  assert.ok(base, "the registry has at least one integrated source");

  const withSource = (patch: Partial<LiveSource>): LiveSourceRegistry => ({
    schemaVersion: 1,
    registryUpdated: "2026-10-15",
    about: "test",
    sources: [{ ...base, ...patch }],
  });

  test("rejects a credential variable that Next.js would send to browsers", () => {
    const problems = registryProblems(
      withSource({
        authentication: { type: "api-key-optional", envVar: "NEXT_PUBLIC_SECRET", notes: "x" },
      }),
    );
    assert.ok(problems.some((p) => p.includes("NEXT_PUBLIC_")));
  });

  test("rejects an endpoint that contains what looks like a real key", () => {
    const problems = registryProblems(
      withSource({ endpoints: [{ url: "https://example.org/api?MAP_KEY=abc123", description: "x" }] }),
    );
    assert.ok(problems.some((p) => p.includes("credential")));
  });

  test("accepts a placeholder in place of a key", () => {
    const problems = registryProblems(
      withSource({ endpoints: [{ url: "https://example.org/api?MAP_KEY={MAP_KEY}", description: "x" }] }),
    );
    assert.deepEqual(problems, []);
  });

  test("rejects an integrated source without freshness thresholds", () => {
    const problems = registryProblems(withSource({ freshness: null }));
    assert.ok(problems.some((p) => p.includes("freshness")));
  });

  test("rejects a claim of human verification that does not say who verified", () => {
    const problems = registryProblems(
      withSource({ verification: { ...base.verification, humanVerified: true } }),
    );
    assert.ok(problems.some((p) => p.includes("human verification")));
  });

  test("rejects a web address in the attribution of a source that may not be linked", () => {
    const problems = registryProblems(withSource({ linkable: false, attribution: "Agency (https://example.org)." }));
    assert.ok(problems.some((p) => p.includes("may not be linked")));
  });

  test("rejects duplicate ids", () => {
    const registry = withSource({});
    registry.sources.push({ ...registry.sources[0] });
    assert.ok(registryProblems(registry).some((p) => p.includes("listed twice")));
  });
});
