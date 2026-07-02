# Blog Details Page — Vanilla HTML / CSS / JS + Tailwind

A fully component-driven Blog Details page built with **plain HTML, CSS,
JavaScript (ES modules) and Tailwind CSS** — no Nuxt, no framework, no build
step required.

It fetches:

```
GET https://api.boom.yugme.com/api/pages/blog/complete-guide-for-businesses-on-sending-otp-messages
```

and renders the page's `data.page.components` array dynamically, choosing a
renderer for each block based on its `definition.slug` — nothing about the
blog content itself is hardcoded in the markup.

## Folder structure

```
blog-project/
├── index.html                 # App shell: loading / error / content states
├── css/
│   └── style.css               # Small helpers Tailwind utilities can't express
│                                # (rich text typography, FAQ accordion animation)
└── js/
    ├── api.js                  # fetchPage() — talks to the API, throws on error
    ├── utils.js                 # escapeHtml(), richTextToHtml(), optionalImage()
    ├── componentMap.js          # slug -> renderer function registry
    ├── main.js                  # Orchestrator: fetch -> sort -> render -> mount
    └── components/
        ├── BlogTitle.js         # slug: blog-title
        ├── BlogHead.js          # slug: blog-head
        ├── BlogKeyNote.js       # slug: blog-key-note
        ├── BlogDescription.js   # slug: blog-description
        └── IndexFaq.js          # slug: index-faq (+ accordion behavior)
```

## How the dynamic mapping works

1. `main.js` calls `fetchPage('blog', '<slug>')`.
2. `data.page.components` is sorted by its `position` field.
3. For every component, `component.definition.slug` is looked up in
   `componentMap.js`:

   ```js
   export const componentMap = {
     "blog-title": BlogTitle,
     "blog-head": BlogHead,
     "blog-key-note": BlogKeyNote,
     "blog-description": BlogDescription,
     "index-faq": IndexFaq,
   };
   ```

4. The matching function receives only `component.data` and returns an HTML
   string. Unrecognized slugs (e.g. `seo-component`, header/footer entries)
   are safely skipped rather than breaking the page — `seo-component` is
   instead used to set `<title>` and the meta description.
5. All returned HTML strings are joined, in order, and injected into
   `#page-sections`.

Adding a new section type later only means adding one new file in
`components/` and one new line in `componentMap.js` — no other file changes.

## States handled

- **Loading** — spinner shown until the fetch resolves.
- **Error** — network failures, non-2xx responses, or a malformed payload
  show a friendly error panel with a **Try again** button that re-runs the
  fetch.
- **Success** — content fades in once all sections are rendered.

## Rich text / markdown-ish content

`blog-head.description` and `blog-description.description[].content` come
back as lightly-formatted text (`**bold**`, `##### Heading`, `- list items`).
`utils.js` → `richTextToHtml()` escapes all raw text first (XSS-safe) and then
converts that limited syntax into semantic HTML (`<strong>`, `<h3>`–`<h5>`,
`<ul><li>`, `<p>`).

## Responsive design

Built mobile-first with Tailwind's `sm:` / `md:` / `lg:` breakpoints:
- Single-column, readable line-length content container (`max-w-4xl`) on all
  screens.
- Type scale, spacing and hero image height step up at `sm`/`md`/`lg`.
- FAQ accordion and breadcrumb wrap naturally on narrow viewports.

## Running it

Because it uses native ES module imports (`<script type="module">`), it must
be served over HTTP(S), not opened directly via `file://`. Any static server
works, for example:

```bash
npx serve .
# or
python3 -m http.server 5500
```

Then open the printed local URL in your browser.

> **Note on CORS:** the fetch happens directly in the browser against
> `api.boom.yugme.com`. If that API does not send permissive
> `Access-Control-Allow-Origin` headers for your dev origin, the browser will
> block the request. If you hit a CORS error locally, run the page from a
> domain the API allows, or proxy the request through your own backend.

## Customization

- Change which article loads by editing `ENDPOINT` / `SLUG` constants at the
  top of `js/main.js`.
- Brand color is defined once in `index.html` under `tailwind.config` (`brand`
  color scale) and used consistently across all components.
