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

  test("refuses a response whose declared length is over the limit, without reading the body", async () => {
    let pulled = 0;
    // highWaterMark 0: the stream pulls only when someone actually reads it.
    const body = new ReadableStream<Uint8Array>(
      {
        pull() {
          pulled += 1;
          throw new Error("the body should not be read");
        },
      },
      { highWaterMark: 0 },
    );
    const fetchImpl = (async () =>
      new Response(body, { status: 200, headers: { "content-length": "5000" } })) as typeof fetch;
    const result = await fetchText("https://example.org/big", { timeoutMs: 1000, maxBytes: 1000, fetchImpl });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.failure.kind, "parse");
    assert.equal(pulled, 0);
  });

  test("stops reading a streamed response as soon as it passes the limit", async () => {
    let pulled = 0;
    const chunk = new Uint8Array(100).fill(120);
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1;
        if (pulled > 100) controller.close();
        else controller.enqueue(chunk);
      },
    });
    const fetchImpl = (async () => new Response(body, { status: 200 })) as typeof fetch;
    const result = await fetchText("https://example.org/stream", { timeoutMs: 1000, maxBytes: 1000, fetchImpl });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.failure.kind, "parse");
    // 1,100 bytes is the first point past the 1,000-byte limit; a little read-ahead is allowed.
    assert.ok(pulled <= 15, `pulled ${pulled} chunks`);
  });

  test("does not follow a redirect: it is reported, so credentials never travel to another address", async () => {
    let seen: RequestInit | undefined;
    const fetchImpl = (async (_url: string | URL | Request, init?: RequestInit) => {
      seen = init;
      return new Response(null, { status: 301, headers: { location: "http://elsewhere.example/data" } });
    }) as typeof fetch;
    const result = await fetchText("https://example.org/data", { timeoutMs: 1000, maxBytes: 1000, fetchImpl });
    assert.equal(seen?.redirect, "manual");
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.failure.kind, "http");
      assert.equal(result.failure.httpStatus, 301);
      assert.match(result.failure.message, /redirected/);
    }
  });

  test("a timeout while the body is arriving is reported as a timeout, not a connection failure", async () => {
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([123]));
      },
      pull(controller) {
        controller.error(new DOMException("The operation timed out.", "TimeoutError"));
      },
    });
    const fetchImpl = (async () => new Response(body, { status: 200 })) as typeof fetch;
    const result = await fetchText("https://example.org/slow", { timeoutMs: 2000, maxBytes: 1000, fetchImpl });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.failure.kind, "timeout");
      assert.match(result.failure.message, /did not finish arriving within 2 seconds/);
    }
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
