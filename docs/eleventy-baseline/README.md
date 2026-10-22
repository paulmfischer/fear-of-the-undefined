# Pre-migration baseline — 2026-10-22

## Provenance and reproduction

Source: the parent of planning commit `7f3754e` (the unchanged `main` checkout used to start this branch). Production reference: https://paulmfischer.dev.

An isolated `git archive` copy was built in `/tmp/fear-eleventy-baseline/source` using `deno task build`, then rebuilt with `TZ=UTC deno task build`. No application source or deployment configuration was changed. Node v22.23.4 and the ui-capture skill's Playwright/Chromium were used for read-only browser checks. The local build remains temporary; this document and the screenshots are the durable evidence.

Lume reported 75 generated files; the final filesystem contains **61 files**, including 22 Pagefind files. These counts are different because build processing includes generated files removed later (the configuration removes icon output). Use the final filesystem, not the build-log count, for migration comparisons.

Both builds passed. The first build warned about experimental Deno permissions and ignored npm lifecycle scripts for Sharp; neither prevented generation. These warnings are baseline observations, not Eleventy requirements.

## Content and rendering inventory

- Nine Markdown articles, one About page, a Markdown 404, and a TSX homepage.
- Front matter supplies title, layout, date, categories, tags, optional description, and often a relative `url: './index.html'`.
- Global data supplies author/profile/social details and the default layout; posts inherit the `post` tag from directory data. Preserve those inherited values when moving to Eleventy.
- Homepage sorts newest first and displays dates, reading minutes, categories, and non-`post` tags.
- Two TSX layouts and eight TSX components provide the presentation layer. Build-time Lume component lookup, helpers, JSX runtime, and data types must be replaced.
- The build enables Tailwind, Lightning CSS, Highlight.js with C#, inline SVG icons, avatar-derived favicons, reading information, RSS/JSON feeds (latest ten posts), sitemap/robots output, Pagefind, inlining, and HTML minification.
- Copy rules cover shared assets/scripts, the résumé, adjacent post images, and the standalone Todo demo.
- Browser scripts implement mobile navigation and a dark-default theme persisted in `localStorage.theme`.

## Public route manifest

All **39 non-Pagefind generated paths** returned HTTP 200 when requested from production. This includes the explicit `/404.html` document; an arbitrary missing path separately returned HTTP 404.

Core output:

```text
/                         (index.html)
/about-me/                (about-me/index.html; navigation uses /about-me)
/404.html
/PaulFischerResume.pdf
/posts.rss
/posts.json
/sitemap.xml
/robots.txt
/styles.css
/scripts/toggle-sidebar.js
/scripts/toggle-theme.js
/apple-touch-icon.png
/favicon.ico
/favicon.svg
/assets/favicon.ico
/assets/img/avatar-150x150.png
```

Each following directory contains `index.html` and an existing `index.txt` companion. HTML links use the directory URL. Preserve path casing; bracket characters in the Actions post are URL-encoded in the homepage link.

```text
/posts/Generic-Component-Blazor/
/posts/NO_ERRORS_SCHEMA/
/posts/automapper-precondition/
/posts/generate-todo-with-ai/
/posts/github-actions[bot]-denied/
/posts/more-thoughts-on-ai/
/posts/moving-to-cloudflare-pages/
/posts/text-versions-of-posts/
/posts/xunit-theory-data/
```

Post assets:

```text
/posts/NO_ERRORS_SCHEMA/known-element-error.png
/posts/github-actions[bot]-denied/actions-failed.png
/posts/github-actions[bot]-denied/setting-guide-1.png
/posts/github-actions[bot]-denied/setting-guide-2.png
/posts/generate-todo-with-ai/gpt-todo.html
```

Pagefind currently contributes 22 generated files under `/pagefind/`. Rebuild these from Eleventy HTML; exact search index hashes or filenames are not compatibility requirements.

## Live behavior checks

| Check | Result |
| --- | --- |
| Homepage | Nine posts, newest first; latest is More Thoughts on AI, dated 04/20/2026 |
| Mobile navigation | Menu opens the sidebar; close button hides it |
| Theme | Toggle changes the theme; reload retains the selected light theme |
| Search | Searching `automapper` returns Automapper PreCondition |
| Missing page | `/eleventy-baseline-missing-page` returns HTTP 404 with the custom message and Home link |
| Feed/sitemap availability | `/posts.rss`, `/posts.json`, and `/sitemap.xml` return HTTP 200 |
| Browser exceptions | None observed during the successful smoke checks |

The first search automation attempt used an incorrect `input[type="search"]` selector. The real input is `type="text"`; rerunning with `#search input` passed. This was a capture-script issue, not a site failure.

## Baseline differences and existing issues

1. **Dates depend on the build timezone.** The initial local build rendered the XUnit date as 02/12/2025, while production renders 02/13/2025. The source timestamp is `2025-02-13T05:00:00Z`. A UTC rebuild matches the live display. Use explicit UTC formatting in the migration to preserve production dates consistently across machines.
2. **Live HTML contains Cloudflare-injected script content.** After the UTC rebuild, the homepage and sampled XUnit HTML match up to an appended Cloudflare script. Exclude hosting-injected scripts from source-output comparisons. This observation does not prove every HTML difference has been normalized.
3. **Build timestamps differ.** RSS `lastBuildDate` and sitemap `lastmod` values reflect different build/source-copy times. Compare substantive feed entries and sitemap URLs separately from timestamps. The JSON feed was byte-identical to production.
4. **Raw byte comparisons are not the acceptance gate.** Against the UTC output, 24 of the 39 fetched resources were byte-identical; the initial timezone-dependent build matched 15. Remaining differences include HTML injection and generated timestamps; full semantic/visual comparison belongs to phase 5.
5. **Existing mobile layout issue:** at 390×844, the fixed header overlaps the beginning of the homepage and missing-page content. The missing-page footer also extends beyond the viewport. These are visible in the captured baseline; avoid silently attributing them to Eleventy or redesigning them during the generator port.
6. **Text links currently contain a double slash**, e.g. `/posts/xunit-theory-data//index.txt`, while generated companions use a single slash. Record canonical text paths above; text support remains deferred.
7. **Documentation is stale:** README describes Deno Deploy, but CI publishes to Cloudflare Pages. Update instructions in phase 5.

## Visual evidence

Screenshots were captured from production and visually reviewed. Desktop viewport: 1440×1000. Mobile viewport: 390×844. Captures show the initial viewport rather than full-page content.

- [Homepage desktop, dark](screenshots/home-desktop-dark.png)
- [Homepage desktop, light](screenshots/home-desktop-light.png)
- [Homepage mobile, dark](screenshots/home-mobile-dark.png)
- [Homepage mobile, light](screenshots/home-mobile-light.png)
- [XUnit article desktop, dark](screenshots/article-desktop-dark.png)
- [XUnit article desktop, light](screenshots/article-desktop-light.png)
- [About desktop, dark](screenshots/about-desktop-dark.png)
- [Missing page mobile, dark](screenshots/missing-mobile-dark.png)

## Phase 5 follow-through

Repeat these views and interaction checks against Eleventy, plus representative image-heavy and long-code articles. Compare meaningful content/metadata, feed entries, sitemap URLs, link destinations, and styles rather than requiring byte-identical generated markup. Confirm no new overflow/overlap relative to the baseline. Decide the treatment of old text URLs before deployment; do not implement conversions as part of the initial HTML port.
