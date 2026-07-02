// js/main.js
// -----------------------------------------------------------------------------
// App bootstrap:
//  1. fetch the page document from the API (loading / error states handled)
//  2. sort `page.components` by `position`
//  3. for each component, look up its renderer via `definition.slug`
//  4. inject the rendered HTML into the page in order
// -----------------------------------------------------------------------------

import { fetchPage } from "./api.js";
import { componentMap } from "./componentMap.js";
import { initFaqAccordion } from "./components/IndexFaq.js";
import { escapeHtml } from "./utils.js";

const ENDPOINT = "blog";
const SLUG = "complete-guide-for-businesses-on-sending-otp-messages";

const loadingEl = document.getElementById("loading-state");
const errorEl = document.getElementById("error-state");
const errorMessageEl = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");
const sectionsEl = document.getElementById("page-sections");

function showLoading() {
  loadingEl.classList.remove("hidden");
  loadingEl.classList.add("flex");
  errorEl.classList.add("hidden");
  errorEl.classList.remove("flex");
  sectionsEl.classList.add("hidden");
}

function showError(message) {
  loadingEl.classList.add("hidden");
  loadingEl.classList.remove("flex");
  errorEl.classList.remove("hidden");
  errorEl.classList.add("flex");
  sectionsEl.classList.add("hidden");
  errorMessageEl.textContent = message;
}

function showContent() {
  loadingEl.classList.add("hidden");
  loadingEl.classList.remove("flex");
  errorEl.classList.add("hidden");
  errorEl.classList.remove("flex");
  sectionsEl.classList.remove("hidden");
  sectionsEl.classList.add("fade-in");
}

/** Apply the SEO component (if present) to <title> / meta description. */
function applySeo(components = []) {
  const seo = components.find((c) => c.definition?.slug === "seo-component");
  if (!seo) return;

  const { title, description } = seo.data || {};
  if (title) document.title = title;
  if (description) {
    const metaTag = document.getElementById("meta-description");
    if (metaTag) metaTag.setAttribute("content", description);
  }
}

/** Render every component whose slug we recognize, in `position` order. */
function renderComponents(components = []) {
  const sorted = [...components].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );

  const html = sorted
    .map((component) => {
      const slug = component.definition?.slug;
      const renderer = componentMap[slug];

      if (!renderer) {
        // Unknown / non-visual component types (e.g. seo-component) are
        // silently skipped rather than breaking the page.
        return "";
      }

      try {
        return renderer(component.data || {});
      } catch (err) {
        console.error(`Failed to render component "${slug}":`, err);
        return "";
      }
    })
    .join("\n");

  sectionsEl.innerHTML = html;
}

async function init() {
  showLoading();

  try {
    const data = await fetchPage(ENDPOINT, SLUG);
    const components = data?.page?.components || [];

    if (!components.length) {
      throw new Error("This page has no content sections to display.");
    }

    applySeo(components);
    renderComponents(components);
    initFaqAccordion(sectionsEl);
    showContent();
  } catch (err) {
    console.error(err);
    showError(escapeHtml(err.message || "Unable to load this article."));
  }
}

retryBtn.addEventListener("click", init);

init();
