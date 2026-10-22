# Eleventy migration

## Decisions and scope

- Use Eleventy with Node.js, TSX layouts/components, Markdown posts, and TypeScript helpers.
- Render TSX to static HTML at build time; do not introduce browser-side React hydration.
- Preserve the current design, HTML URLs, post content, assets, and publishing features.
- Keep Cloudflare Pages hosting and `_site` as the output directory where practical.
- Text versions are a stretch goal after the HTML migration works and passes verification.
- Compare against both the existing Lume build and https://paulmfischer.dev. Record differences between those baselines before treating them as regressions.

## Progress

- [x] Phase 1 — Establish the baseline
  - [x] Inventory pages, public URLs, front matter, assets, and build features.
  - [x] Capture representative live desktop/mobile pages and both themes.
  - [x] Record live navigation, theme, search, feed, and missing-page behavior.
  - [x] Generate an isolated Lume baseline if the runtime is available; document blockers otherwise.
  - [x] Record baseline discrepancies and existing text-version URLs separately.
- [x] Phase 2 — Establish the Eleventy build
  - [x] Select and pin supported Node/Eleventy versions and commit a dependency lockfile.
  - [x] Configure ESM, TSX loading, static rendering, and TypeScript checking.
  - [x] Add build/serve/type-check commands and verify one Markdown article through the shared layout.
  - [x] Verify layout/component changes trigger development rebuilds.
- [x] Phase 3 — Port content and presentation
  - [x] Map global/directory data, post collections, dates, categories, tags, and permalinks.
  - [x] Port the main/article layouts and shared components using explicit TSX imports and typed props.
  - [x] Port homepage, About, and 404; preserve Markdown bodies and asset paths.
  - [x] Remove Text Version links while text generation is deferred; track existing public text URL handling as a phase 5 deployment gate.
- [x] Phase 4 — Restore assets and publishing features
  - [x] Restore Tailwind/CSS processing and code highlighting, preserving C# examples.
  - [x] Restore icons, favicons, reading times, scripts, images, résumé, and the standalone demo HTML.
  - [x] Restore RSS/JSON feeds and sitemap with existing URLs and equivalent metadata.
  - [x] Run Pagefind against final generated HTML; preserve search annotations and UI.
  - [x] Verify development watching for CSS and generated features.
- [x] Phase 5 — Validate and prepare deployment
  - [x] Decide existing public text URL handling before deployment (user selected temporary article redirects).
  - [x] Compare route/asset manifests against the Lume and live baselines.
  - [x] Compare homepage, representative articles, About, and 404 at desktop/mobile widths in both themes.
  - [x] Verify content ordering, dates, formatting, code blocks, images, and internal links.
  - [x] Exercise navigation, theme persistence, search, and feed/sitemap contents.
  - [x] Verify clean production builds and rebuilds after edits/deletions.
  - [x] Update CI and contributor instructions; remove obsolete Lume/Deno configuration after parity is verified.
  - [x] Review the completed migration before production publication (prepared only; no push/merge/deployment).
- [x] Phase 6 — Stretch goal: text versions
  - [x] Reassess conversion requirements and port the reusable TypeScript logic.
  - [x] Generate text companions and restore article links.
  - [x] Verify URLs, metadata, links, images, fenced code, and rebuild behavior.

## Completion criteria

Phases 1–5 complete the initial migration. All current HTML pages and assets retain their public URLs; desktop/mobile appearance and behavior match the agreed baselines; search, feeds, sitemap, highlighting, and reading times work; clean builds and watched rebuilds require no Deno; CI builds reproducibly. Text generation does not block initial completion.

## Baseline evidence and work log

- 2026-10-22: Phase 6 complete. See [text conversion and verification](docs/eleventy-phase6.md). Nine text companions and article links are restored, canonical text-to-HTML redirects are removed, and historical double-slash links redirect to text. Type checking, site regressions, clean/watch lifecycle tests and local Cloudflare text responses passed. Nothing was pushed, merged or deployed.

- 2026-10-22: Plan recorded before implementation. Baseline inspection is the first work item; no generator changes yet.
- 2026-10-22: Phase 1 complete. See [baseline inventory, findings, and screenshots](docs/eleventy-baseline/README.md). Isolated Lume builds passed; 39 non-search-index resources returned HTTP 200 on production; mobile navigation, theme persistence, search, and custom 404 smoke checks passed. UTC formatting is needed to preserve production dates. Existing mobile overlap and Cloudflare HTML injection are recorded. Phase 2 has not started.
- 2026-10-22: Phase 2 complete. See [setup, limitations, and verification](docs/eleventy-phase2.md). Eleventy 3.1.7 on Node 22.23.4 renders the existing XUnit article through TSX into isolated `_site-eleventy` output. Clean install, build, type checking, browser rendering, and watched Markdown/component/layout/helper changes passed. A built-in Node supervisor avoids stale imported TSX modules. Phase 3 has not started; production/CI remain unchanged.
- 2026-10-22: Phase 3 complete. See [content port and verification](docs/eleventy-phase3.md). All 12 generated page routes and copied content assets are present; Markdown source is unchanged. Five regression groups, type checking, browser smoke checks, and normalized production-content/image comparisons passed. Styling, icons, highlighting, reading times, search, and feeds remain phase 4. Existing text URL handling is explicitly tracked in phase 5 before deployment. Production/CI remain unchanged.
- 2026-10-22: Phase 4 complete. See [preview instructions, verification, and screenshots](docs/eleventy-phase4/README.md). Styling, icons, code highlighting, reading times, favicons, search, feeds, sitemap, and robots are restored. Eight regression groups, strict application type checks, clean dependency installation, browser checks, and live feed/visual comparisons passed. Temporary watch probes were reverted. The preview is ready for user review; phase 5 and production publication have not started.
- 2026-10-22: Phase 5 complete. See [final verification and release state](docs/eleventy-phase5.md). Node-only clean install/type checking, ten generated-site tests, and the isolated clean/watch lifecycle test passed. All 39 baseline resources and actual local Cloudflare 302/404 behavior were verified; sixteen viewport/theme combinations and all article content/images/feed identities were compared with live. User selected temporary text-to-HTML redirects. CI/README and `_site` output are ready; obsolete Lume/Deno build files were removed and converter source archived. Nothing was pushed, merged, or deployed. Phase 6 remains deferred.
