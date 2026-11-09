import { KITSU_BASE, REQUEST_TIMEOUT_MS } from "../config/kitsu.js";

export class KitsuError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "KitsuError";
    this.status = status;
  }
}

export async function kitsuFetch(path, { params = {}, signal } = {}) {
  const url = new URL(path.startsWith("http") ? path : `${KITSU_BASE}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, value);
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort, { once: true });

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.api+json" },
    });

    if (!response.ok) {
      throw new KitsuError(`Kitsu merespons ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new KitsuError("Permintaan dibatalkan", 0);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", onAbort);
  }
}
