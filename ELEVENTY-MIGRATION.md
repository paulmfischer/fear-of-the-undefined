# Eleventy migration

## Decisions and scope

- Use Eleventy with Node.js, TSX layouts/components, Markdown posts, and TypeScript helpers.
- Render TSX to static HTML at build time; do not introduce browser-side React hydration.
- Preserve the current design, HTML URLs, post content, assets, and publishing features.
- Keep Cloudflare Pages hosting and `_site` as the output directory where practical.
- Text versions are a stretch goal after the HTML migration works and passes verification.
- Compare against both the existing Lume build and https://paulmfischer.dev. Record differences between those baselines before treating them as regressions.

## Progress

- [ ] Phase 1 — Establish the baseline
  - [ ] Inventory pages, public URLs, front matter, assets, and build features.
  - [ ] Capture representative live desktop/mobile pages and both themes.
  - [ ] Record live navigation, theme, search, feed, and missing-page behavior.
  - [ ] Generate an isolated Lume baseline if the runtime is available; document blockers otherwise.
  - [ ] Record baseline discrepancies and existing text-version URLs separately.
- [ ] Phase 2 — Establish the Eleventy build
  - [ ] Select and pin supported Node/Eleventy versions and commit a dependency lockfile.
  - [ ] Configure ESM, TSX loading, static rendering, and TypeScript checking.
  - [ ] Add build/serve/type-check commands and verify one Markdown article through the shared layout.
  - [ ] Verify layout/component changes trigger development rebuilds.
- [ ] Phase 3 — Port content and presentation
  - [ ] Map global/directory data, post collections, dates, categories, tags, and permalinks.
  - [ ] Port the main/article layouts and shared components using explicit TSX imports and typed props.
  - [ ] Port homepage, About, and 404; preserve Markdown bodies and asset paths.
  - [ ] Remove Text Version links while text generation is deferred; decide how to handle existing public text URLs before deployment.
- [ ] Phase 4 — Restore assets and publishing features
  - [ ] Restore Tailwind/CSS processing and code highlighting, preserving C# examples.
  - [ ] Restore icons, favicons, reading times, scripts, images, résumé, and the standalone demo HTML.
  - [ ] Restore RSS/JSON feeds and sitemap with existing URLs and equivalent metadata.
  - [ ] Run Pagefind against final generated HTML; preserve search annotations and UI.
  - [ ] Verify development watching for CSS and generated features.
- [ ] Phase 5 — Validate and prepare deployment
  - [ ] Compare route/asset manifests against the Lume and live baselines.
  - [ ] Compare homepage, representative articles, About, and 404 at desktop/mobile widths in both themes.
  - [ ] Verify content ordering, dates, formatting, code blocks, images, and internal links.
  - [ ] Exercise navigation, theme persistence, search, and feed/sitemap contents.
  - [ ] Verify clean production builds and rebuilds after edits/deletions.
  - [ ] Update CI and contributor instructions; remove obsolete Lume/Deno configuration after parity is verified.
  - [ ] Review the completed migration before production publication.
- [ ] Phase 6 — Stretch goal: text versions
  - [ ] Reassess conversion requirements and port the reusable TypeScript logic.
  - [ ] Generate text companions and restore article links.
  - [ ] Verify URLs, metadata, links, images, fenced code, and rebuild behavior.

## Completion criteria

Phases 1–5 complete the initial migration. All current HTML pages and assets retain their public URLs; desktop/mobile appearance and behavior match the agreed baselines; search, feeds, sitemap, highlighting, and reading times work; clean builds and watched rebuilds require no Deno; CI builds reproducibly. Text generation does not block initial completion.

## Baseline evidence and work log

- 2026-10-22: Plan recorded before implementation. Baseline inspection is the first work item; no generator changes yet.
