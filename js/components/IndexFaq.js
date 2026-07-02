// components/IndexFaq.js
// slug: "index-faq"
// data shape: { title, description, questions: [{ question, answer }] }
//
// Renders markup with data-faq-toggle hooks; interactivity (open/close) is
// wired up separately via `initFaqAccordion()` since it needs to run after
// the HTML has been inserted into the DOM.

import { escapeHtml } from "../utils.js";

export function IndexFaq(data = {}) {
  const { title = "", description = "", questions = [] } = data;
  const items = Array.isArray(questions) ? questions : [];

  if (!items.length) return "";

  const faqItems = items
    .map((q, i) => {
      const isFirst = i === 0;
      return `
      <div
        class="faq-item border border-gray-100 rounded-xl bg-white overflow-hidden"
        data-open="${isFirst}"
      >
        <button
          type="button"
          data-faq-toggle
          class="w-full flex items-center justify-between gap-4 text-left px-4 sm:px-5 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
          aria-expanded="${isFirst}"
        >
          <span class="text-sm sm:text-base font-semibold text-gray-900">${escapeHtml(
            q.question || ""
          )}</span>
          <span class="faq-icon shrink-0 text-brand-600 text-xl leading-none">+</span>
        </button>
        <div class="faq-panel">
          <div>
            <p class="px-4 sm:px-5 pb-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              ${escapeHtml(q.answer || "")}
            </p>
          </div>
        </div>
      </div>`;
    })
    .join("");

  return `
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 pb-16">
      <div class="text-center max-w-2xl mx-auto mb-8">
        ${
          title
            ? `<h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">${escapeHtml(
                title
              )}</h2>`
            : ""
        }
        ${
          description
            ? `<p class="mt-3 text-sm sm:text-base text-gray-500">${escapeHtml(
                description
              )}</p>`
            : ""
        }
      </div>

      <div class="space-y-3" data-faq-group>
        ${faqItems}
      </div>
    </section>
  `;
}

/** Attach click handlers for accordion open/close. Call after DOM insertion. */
export function initFaqAccordion(root = document) {
  root.querySelectorAll("[data-faq-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", String(!isOpen));
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}
