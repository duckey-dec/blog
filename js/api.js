// js/api.js
// -----------------------------------------------------------------------------
// Thin API layer. Kept separate from rendering logic so the fetch strategy /
// base URL can change without touching any component code.
// -----------------------------------------------------------------------------

const API_BASE = "https://api.boom.yugme.com/api";

/**
 * Fetch a "page" document by endpoint + slug.
 * @param {string} endpoint e.g. "blog"
 * @param {string} slug     e.g. "complete-guide-for-businesses-on-sending-otp-messages"
 * @returns {Promise<object>} the `data` payload from the API response
 */
export async function fetchPage(endpoint, slug) {
  const url = "./data/blog.json";

  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  } catch (networkErr) {
    throw new Error(
      "Network error while reaching the API. Please check your connection and try again."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status} (${response.statusText})`
    );
  }

  const json = await response.json();

  if (!json || json.success !== true || !json.data) {
    throw new Error(json?.message || "API returned an unexpected response.");
  }

  return json.data;
}
