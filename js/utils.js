// js/utils.js
// -----------------------------------------------------------------------------
// Shared helpers used across components: HTML escaping and a tiny markdown-ish
// -> HTML converter for the "richtext" fields the API returns (bold, headings,
// bullet lists, line breaks).
// -----------------------------------------------------------------------------

/** Escape raw text so it can never inject markup. */
export function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Convert the API's lightweight markdown (**bold**, ##### heading, "- " lists,
 * blank-line paragraphs) into sanitized HTML. Every text run is escaped first,
 * so this is safe against markup injection coming from the API.
 */
export function richTextToHtml(raw = "") {
  if (!raw) return "";

  const text = escapeHtml(raw).replace(/\r\n/g, "\n");
  const lines = text.split("\n");

  const htmlParts = [];
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length) {
      htmlParts.push(`<ul>${listBuffer.join("")}</ul>`);
      listBuffer = [];
    }
  };

  const inline = (line) =>
    line
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, "<em>$1</em>");

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,5})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = Math.min(headingMatch[1].length + 1, 5); // ## -> h3, ##### -> h5-ish
      htmlParts.push(`<h${level}>${inline(headingMatch[2])}</h${level}>`);
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      listBuffer.push(`<li>${inline(trimmed.replace(/^[-*]\s+/, ""))}</li>`);
      return;
    }

    flushList();
    htmlParts.push(`<p>${inline(trimmed)}</p>`);
  });

  flushList();
  return htmlParts.join("\n");
}

/** Build a `<img>` tag only if a src is present, otherwise return an empty string. */
export function optionalImage(src, alt = "", classes = "") {
  if (!src) return "";
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" class="${classes}" />`;
}
