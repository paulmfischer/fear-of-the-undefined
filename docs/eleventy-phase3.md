# Phase 3 — Content and presentation port

## Completed

- Expanded Eleventy input from the single proof article to the repository's actual content. Build documentation and legacy output/cache directories are excluded.
- Preserved the homepage, nine article URLs, `/about-me/`, and `/404.html`, including case-sensitive names and the bracketed Actions article. Homepage links encode brackets.
- Reused the existing root `_data.yml` for typed shared profile/social metadata and the existing `posts/_data.yml` for inherited tags. The posts directory data file maps Lume-relative URLs to Eleventy permalinks without changing Markdown.
- Ported the shared layout, article layout, homepage, navigation, profile, metadata, header, sidebar footer, and footer using imported TSX components and typed props. The footer now credits Eleventy.
- Preserved the existing utility classes, DOM IDs, and Pagefind annotations for phase 4. The icon component currently preserves placement/theme hooks only; actual SVG rendering is a phase 4 task.
- Preserved author/date/category/tag/description output. Dates use UTC. The homepage collection is sorted newest first and does not expose the inherited `post` tag as a displayed topic.
- Added Markdown attributes and heading anchors. Existing About-page classes and in-article fragment links work without modifying source content.
- Copied shared assets, images, résumé, standalone Todo demo, and the two browser scripts unchanged so content references resolve. This completes the static-copy portion of phase 4 early, but not its CSS, highlighting, favicon-generation, or icon work.
- Removed generated Text Version navigation links. Existing Markdown prose and its historical text links remain unchanged; no text files are generated.
- Extended development restarts to the homepage and YAML/directory data. Disabled Eleventy's native JavaScript dependency scan because it cannot parse imported TypeScript; the existing supervisor handles those changes.

## Verification

- `npm test`: five regression groups passed, covering all baseline page routes, post order/links/metadata, Markdown classes/code/anchors, permalink compatibility/UTC dates, asset bytes, and exclusion of build documents.
- `npm run type-check`: passed, including the new homepage and all TSX components/helpers.
- All nine articles, About, and 404 were compared with production using parsed content text with whitespace removed. All matched. This checks content characters, not layout or code indentation fidelity.
- Image sources were compared after converting copied images to the equivalent data URLs used by production's inline plugin; all matched. Copied image/example/resume bytes were also checked in the regression suite.
- No missing local fragment targets were found in the generated pages.
- Browser checks visited the homepage, all nine linked articles, About, and the explicit 404 document. All returned HTTP 200. Theme persistence and navigation class toggles passed with no browser exceptions. CSS-dependent visibility is not yet a visual acceptance check.
- Desktop homepage and mobile article screenshots were visually inspected as unstyled content. The local server was stopped afterward.
- Dependency installation reported zero vulnerabilities.

## Deliberately incomplete

The preview still writes to `_site-eleventy`. Run `npm run serve` and open http://localhost:8080/ to inspect the content structure.

Tailwind/CSS, visible SVG icons, code coloring, reading-time estimates, generated favicons, search, RSS/JSON feeds, and sitemap remain phase 4 tasks. RSS links are retained for that phase, but their output is not available yet. The layout does not link an uncompiled stylesheet. This is not ready for full visual comparison or production publication.

The `/404.html` document was verified directly. Actual missing-URL behavior must also be checked on the final hosting preview in phase 5.

Existing public article `index.txt` URLs need an explicit deployment decision in phase 5: retain archived text, temporarily redirect to articles, or restore generation as the stretch goal. No redirects or archived text output are introduced here, and deployment remains gated on that decision. Text conversion itself does not block finishing the HTML port.

Legacy Lume configuration/templates, Markdown source files, and CI remain unchanged. Phase 4 is next; the main user testing checkpoint remains after phase 4.
