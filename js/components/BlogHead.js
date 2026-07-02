// components/BlogHead.js
// slug: "blog-head"
// data shape: { title, description, image, author, category: [{category_name, category_url}],
//               read_time, verified_by }

import { escapeHtml, richTextToHtml, optionalImage } from "../utils.js";

export function BlogHead(data = {}) {
  const {
    title = "",
    description = "",
    image = null,
    author = null,
    category = [],
    read_time = null,
    verified_by = null,
  } = data;

  const categories = Array.isArray(category) ? category : [];

  const categoryPills = categories
    .map(
      (c) => `
      <a
        href="${escapeHtml(c.category_url || "#")}"
        class="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs sm:text-sm font-medium text-brand-700 hover:bg-brand-100 transition-colors"
      >
        ${escapeHtml(c.category_name || "")}
      </a>`
    )
    .join("");

  const metaBits = [
    author ? { icon: "user", label: escapeHtml(author) } : null,
    verified_by
      ? { icon: "check", label: `Verified by ${escapeHtml(verified_by)}` }
      : null,
    read_time ? { icon: "clock", label: escapeHtml(read_time) } : null,
  ].filter(Boolean);

  const icons = {
    user: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l2.25 2.25 4.5-4.5m4.5 2.25a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  };

  const metaRow = metaBits.length
    ? `
    <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
      ${metaBits
        .map(
          (m) => `
        <span class="inline-flex items-center gap-1.5">
          ${icons[m.icon]}
          ${m.label}
        </span>`
        )
        .join("")}
    </div>`
    : "";

  const heroImage = image
    ? `
    <div class="mt-8 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
      ${optionalImage(image, title, "w-full h-56 sm:h-72 md:h-96 object-cover")}
    </div>`
    : "";

  return `
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
      ${categoryPills ? `<div class="flex flex-wrap gap-2 mb-4">${categoryPills}</div>` : ""}

      <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold leading-tight tracking-tight text-gray-900">
        ${escapeHtml(title)}
      </h1>

      ${metaRow}

      ${
        description
          ? `<div class="rich-content mt-6 text-base sm:text-lg text-gray-600">${richTextToHtml(
              description
            )}</div>`
          : ""
      }

      ${heroImage}
    </section>
  `;
}
