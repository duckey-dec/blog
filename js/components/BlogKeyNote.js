// components/BlogKeyNote.js
// slug: "blog-key-note"
// data shape: { title: string, notes: [{ note: string }] }

import { escapeHtml } from "../utils.js";

export function BlogKeyNote(data = {}) {
  const { title = "", notes = [] } = data;
  const items = Array.isArray(notes) ? notes : [];

  if (!items.length) return "";

  const listItems = items
    .map(
      (n) => `
      <li class="py-2.5 border-b last:border-b-0 border-gray-100">
        <span class="text-sm sm:text-base text-gray-700">${escapeHtml(n.note || "")}</span>
      </li>`
    )
    .join("");

  return `
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
      <div class="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 sm:p-6">
        ${
          title
            ? `<h2 class="text-sm sm:text-base font-bold uppercase tracking-wide text-brand-700 mb-2">${escapeHtml(
                title
              )}</h2>`
            : ""
        }
        <ul class="divide-y divide-transparent">
          ${listItems}
        </ul>
      </div>
    </section>
  `;
}
