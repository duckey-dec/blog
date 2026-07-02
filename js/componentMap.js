// js/componentMap.js
// -----------------------------------------------------------------------------
// Single source of truth for "definition.slug -> renderer" mapping. Adding a
// new section type in the API only requires adding one entry here.
// -----------------------------------------------------------------------------

import { BlogTitle } from "./components/BlogTitle.js";
import { BlogHead } from "./components/BlogHead.js";
import { BlogKeyNote } from "./components/BlogKeyNote.js";
import { BlogDescription } from "./components/BlogDescription.js";
import { IndexFaq } from "./components/IndexFaq.js";

export const componentMap = {
  "blog-title": BlogTitle,
  "blog-head": BlogHead,
  "blog-key-note": BlogKeyNote,
  "blog-description": BlogDescription,
  "index-faq": IndexFaq,
  // "seo-component" intentionally has no visual renderer — it's consumed
  // separately in main.js to populate <title> / meta description.
};
