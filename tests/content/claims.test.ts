import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { siteClaims } from "@/content/claims";

describe("claims register", () => {
  test("every cited or human-verified claim has at least one citation", () => {
    for (const entry of siteClaims) {
      if (entry.status !== "unverified") {
        assert.ok(entry.citations && entry.citations.length > 0, entry.claim);
      }
    }
  });

  test("every citation has an HTTPS address, an access date and a reader", () => {
    for (const entry of siteClaims) {
      for (const citation of entry.citations ?? []) {
        assert.match(citation.url, /^https:\/\//, entry.claim);
        assert.match(citation.accessed, /^\d{4}-\d{2}-\d{2}$/, entry.claim);
        assert.ok(citation.readBy.length > 0, entry.claim);
      }
    }
  });

  test("no claim is marked human verified while the record says an AI read its sources", () => {
    for (const entry of siteClaims) {
      if (entry.status === "human-verified") {
        for (const citation of entry.citations ?? []) {
          assert.doesNotMatch(citation.readBy, /\bAI\b/, entry.claim);
        }
      }
    }
  });

  test("an archived copy is a public archive copy of the page it stands for", () => {
    for (const entry of siteClaims) {
      for (const citation of entry.citations ?? []) {
        if (!citation.archivedCopy) continue;
        assert.match(citation.archivedCopy, /^https:\/\/web\.archive\.org\/web\/\d{14}\//, entry.claim);
        assert.ok(citation.archivedCopy.endsWith(citation.url), entry.claim);
      }
    }
  });

  test("claims are unique", () => {
    const seen = new Set<string>();
    for (const entry of siteClaims) {
      assert.equal(seen.has(entry.claim), false, entry.claim);
      seen.add(entry.claim);
    }
  });
});
