# Phase 6 — Plain-text companions

Completed 2026-10-22. All nine articles now publish text companions and include a Text Version link. Nothing was pushed, merged or deployed.

## Conversion

`_eleventy/helpers/text.ts` preserves the archived converter's metadata/body structure, heading notation, readable links and fenced code. It traverses the rendered article instead of applying regular expressions to Markdown. This handles Markdown attributes, HTML entities, highlighting spans and raw HTML consistently with the HTML output.

- Metadata includes title, stable ISO UTC publication date, configured author and post tags (including inherited `post`). Tags are read from source front matter; article content and date come from final HTML.
- Relative links and images become absolute URLs, preserving query strings and fragments. Email links retain their scheme.
- Fenced code retains language, exact code text, indentation and blank lines. Longer fences protect code containing backticks. Generated heading-anchor controls and syntax-highlight markup are omitted.
- Nested lists retain indentation, ordered lists retain numbering, images become labelled URLs, and tables use rows with pipe-separated cells. Blockquotes prefix each line with `>`, including nested quotes and quoted code. Presentation such as emphasis and table alignment is intentionally flattened.
- Directory article URLs generate `index.txt`; explicit `.html` permalinks generate matching `.txt` filenames. Only articles receive companions; navigation, About, the demo and search index remain HTML-only.

Canonical text-to-HTML redirects are removed. Ten compatibility rules redirect the historical double-slash form to canonical text, including raw and encoded bracket variants. The archived Lume converter remains historical evidence and is not imported.

## Verification

- `npm run type-check` passed.
- `npm test` passed: eleven regression groups cover HTML routes, all nine companions, metadata, article link destinations, exact code-block content, relative links with query/fragment, email links, images, entities, nested lists and backticks inside code. Existing feed, search, style, asset and internal-link checks still pass.
- `npm run test:rebuild` passed: isolated production and watched builds create, rename and delete companions alongside HTML. A watched title edit updates text metadata. Deleted files and stale publishing output are removed.
- Local Cloudflare Pages emulator (Wrangler 4.152.0) served all nine companions with HTTP 200 and `text/plain`, with correct metadata bodies. Raw/encoded bracket and ordinary historical double-slash requests returned 302 to text assets. No publication occurred; the temporary emulator was stopped.
- Markdown source and article bodies were not edited. The new text format retains content rather than reproducing the archived converter's timezone-dependent dates and whitespace/relative-URL bugs byte for byte.

Run `npm run serve`, open any article, and select Text Version to review locally. Cloudflare redirect emulation is only needed for the historical double-slash compatibility rules.
