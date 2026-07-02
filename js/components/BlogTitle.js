// components/BlogTitle.js
// slug: "blog-title"
// data shape: { title: [{ value: string, url: string|null }] }

import { escapeHtml } from "../utils.js";

export function BlogTitle(data = {}) {
  const items = Array.isArray(data.title) ? data.title : [];

  if (!items.length) return "";

  const crumbs = items
    .map((item, i) => {
      const label = escapeHtml(item.value || "");
      const isLast = i === items.length - 1;
      const separator = isLast
        ? ""
        : `<span class="mx-2 text-gray-300">/</span>`;

      const content = item.url
        ? `<a href="${escapeHtml(item.url)}" class="hover:text-brand-600 transition-colors">${label}</a>`
        : `<span class="${isLast ? "text-gray-900 font-semibold" : ""}">${label}</span>`;

      return `<span class="capitalize">${content}</span>${separator}`;
    })
    .join("");

  return `
    <section class="border-b border-gray-100 bg-gray-50/60">
      <nav
        aria-label="Breadcrumb"
        class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm text-gray-500 flex flex-wrap items-center"
      >
        ${crumbs}
      </nav>
    </section>
  `;
}
