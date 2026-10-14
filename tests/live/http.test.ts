import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { fetchText, serverDateIssue, USER_AGENT } from "@/lib/live/http";

describe("fetchText", () => {
  test("never lets a cached response stand in for a fresh one, and identifies the project", async () => {
    let seen: RequestInit | undefined;
    const fetchImpl = (async (_url: string | URL | Request, init?: RequestInit) => {
      seen = init;
      return new Response("ok", { status: 200, headers: { date: "Wed, 14 Oct 2026 18:20:00 GMT" } });
    }) as typeof fetch;

    const result = await fetchText("https://example.org/data", { timeoutMs: 1000, maxBytes: 1000, fetchImpl });
    assert.equal(seen?.cache, "no-store");
    assert.equal((seen?.headers as Record<string, string>)["user-agent"], USER_AGENT);
    assert.ok(result.ok);
    assert.equal(result.serverDate, "2026-10-14T18:20:00.000Z");
  });

  test("refuses a response larger than the limit, without reading it all", async () => {
    const fetchImpl = (async () => new Response("x".repeat(5000), { status: 200 })) as typeof fetch;
    const result = await fetchText("https://example.org/big", { timeoutMs: 1000, maxBytes: 1000, fetchImpl });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.failure.kind, "parse");
  });

  test("keeps the body of an error response, because some sources explain errors there", async () => {
    const fetchImpl = (async () => new Response("Invalid MAP_KEY.", { status: 400 })) as typeof fetch;
    const result = await fetchText("https://example.org/err", { timeoutMs: 1000, maxBytes: 1000, fetchImpl });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.text, "Invalid MAP_KEY.");
      assert.equal(result.failure.kind, "http");
      assert.equal(result.failure.httpStatus, 400);
    }
  });

  test("maps 401 and 403 to an authentication failure", async () => {
    for (const status of [401, 403]) {
      const fetchImpl = (async () => new Response("", { status })) as typeof fetch;
      const result = await fetchText("https://example.org/x", { timeoutMs: 1000, maxBytes: 1000, fetchImpl });
      assert.equal(result.ok, false);
      if (!result.ok) assert.equal(result.failure.kind, "auth");
    }
  });
});

describe("serverDateIssue", () => {
  test("is silent when the server's date agrees with the retrieval time", () => {
    assert.equal(serverDateIssue("x", "2026-10-14T18:20:00.000Z", "2026-10-14T18:25:00.000Z"), null);
    assert.equal(serverDateIssue("x", null, "2026-10-14T18:25:00.000Z"), null);
  });

  test("flags a response dated far from the retrieval time as a possible cached copy", () => {
    const issue = serverDateIssue("PSI", "2026-10-14T16:00:00.000Z", "2026-10-14T18:25:00.000Z");
    assert.ok(issue);
    assert.match(issue, /cached copy/);
  });
});
