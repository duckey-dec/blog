// components/BlogDescription.js
// slug: "blog-description"
// data shape: { description: [{ content: richtext, image: string|null, image_title: string|null }] }

import { richTextToHtml, optionalImage, escapeHtml } from "../utils.js";

export function BlogDescription(data = {}) {
  const blocks = Array.isArray(data.description) ? data.description : [];

  if (!blocks.length) return "";

  const blockHtml = blocks
    .map((block) => {
      const content = block.content
        ? `<div class="rich-content">${richTextToHtml(block.content)}</div>`
        : "";

      const image = block.image
        ? `
        <figure class="my-6">
          ${optionalImage(
            block.image,
            block.image_title || "",
            "w-full rounded-xl border border-gray-100 object-cover max-h-[420px]"
          )}
          ${
            block.image_title
              ? `<figcaption class="mt-2 text-center text-xs sm:text-sm text-gray-400">${escapeHtml(
                  block.image_title
                )}</figcaption>`
              : ""
          }
        </figure>`
        : "";

      return `<div class="mb-2">${content}${image}</div>`;
    })
    .join("");

  return `
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
      <article class="prose-container text-gray-700">
        ${blockHtml}
      </article>
    </section>
  `;
}
