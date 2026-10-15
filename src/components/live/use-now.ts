"use client";

import { useSyncExternalStore } from "react";

/**
 * The reader's current time, for labelling how old data is.
 *
 * A cached page can be served long after it was built, so ages ("34 min ago")
 * must be worked out in the reader's browser, not on the server. This hook
 * returns `null` while the page is prerendered and during hydration (the
 * server has no reader's clock), then the browser's time, refreshed every
 * 30 seconds. One shared timer serves every component on the page.
 *
 * It reads the clock only inside the subscription, never during render.
 */

/** Ages are shown in whole minutes, so a 30-second tick is enough. */
const TICK_MS = 30_000;

let now: number | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function tick() {
  now = Date.now();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === null) {
    // React re-reads the snapshot after subscribing, so this first value is
    // picked up without notifying anyone.
    now = Date.now();
    timer = setInterval(tick, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot() {
  return now;
}

function getServerSnapshot() {
  return null;
}

/** The reader's current time in milliseconds, or `null` before the page is interactive. */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
