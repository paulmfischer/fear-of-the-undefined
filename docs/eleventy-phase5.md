# Phase 5 — Final verification and deployment preparation

The initial Eleventy migration is complete and prepared for review/merge. Nothing was pushed, merged, or published during this phase. Text generation remains the separate phase 6 stretch goal.

## Final changes

- Production and development output now use `_site`, matching Cloudflare's existing upload directory.
- Fresh builds clean generated output. `npm run serve` restarts the build/server after Markdown, TSX, helper, data, stylesheet, or copied-asset changes, including additions, renames, and deletions. Eleventy's native file watcher is disabled to avoid competing builds, stale ESM imports, and cached-directory failures when cleaning output. Reload after the brief restart.
- Obsolete Lume/Deno configuration, lockfile, templates, and models were removed. Highlight styles moved into `_eleventy/styles/`. The old text converter is archived at `docs/eleventy-baseline/legacy-txt-output.ts`, excluded from the build, for phase 6.
- Markdown layout names now point directly to Eleventy layouts. All eleven Markdown bodies are byte-identical to their pre-phase-5 contents, including original line endings/trailing bytes.
- README now documents Node setup, authoring, commands, project structure, output ownership, text redirects, and deployment.
- GitHub Actions validates PRs and pushes to `main` with a clean npm install, strict application type checking, generated-site checks, and an isolated clean/watch rebuild regression. Main-only publication downloads the exact validated artifact. Secrets and the existing Cloudflare project are unchanged.

## Text URL decision

The user selected **temporary redirects to HTML** while text generation is deferred. The build emits Cloudflare `_redirects` rules with HTTP 302 status. Twenty rules cover the nine canonical text paths, old double-slash links, and raw/percent-encoded bracket variants for the Actions article. Remove these redirects when their text companions return.

Cloudflare's actual local Pages emulator accepted all twenty rules. Canonical text requests and sampled double-slash requests returned 302 to the corresponding articles. Testing revealed that encoded-only rules did not match raw bracket paths; both forms are now covered and regression-checked.

## Verification results

| Check | Result |
| --- | --- |
| Clean install | `npm ci` passed; npm reported zero vulnerabilities |
| Node-only operation | Final commands passed with Deno absent from PATH |
| Application type checking | `npm run type-check` passed |
| Generated-site suite | Ten tests passed: routes, ordering, metadata, Markdown/classes/anchors, permalinks/dates, copied assets, feeds, styles/icons/favicons/search assets, sitemap/robots, text redirects, and all internal links/assets/fragments |
| Rebuild lifecycle | One integration test passed in an isolated copy: clean and watched additions, permalink changes, source/asset deletions, stale HTML removal, and feed cleanup |
| Manual watched lifecycle | Temporary post/image appeared; after deletion both disappeared, feed count returned from ten to nine, and the unique token disappeared from search. Existing assets remained available. All probes were removed |
| Public route baseline | All 39 recorded Lume/live resources checked in the local Cloudflare emulator: thirty non-text resources remained available, nine text resources redirected as selected |
| Hosting behavior | Unknown URL returned the custom 404 with HTTP 404. Cloudflare canonicalizes `/404.html` to `/404`; the explicit document remains available |
| Live content comparison | All nine articles, About, and 404 matched normalized content characters and image data. Whitespace was normalized for this comparison; it is not a code-indentation assertion |
| Feed compatibility | All nine item IDs and publication instants match production; relative content references become absolute URLs. JSON timestamps now use ISO format |
| Sitemap | Same eleven public content URLs as the Lume baseline, excluding 404 |
| Viewport/theme checks | Homepage, XUnit article, About, and 404 compared at 1440×1000 and 390×844 in both themes: sixteen combinations. Computed content typography, normalized color, horizontal position and width matched live |
| Browser interactions | Mobile navigation, theme persistence, and search passed in the local Cloudflare preview; no page exceptions or unexpected failed resources |
| Workflow review | YAML/trigger/job/artifact structure checked locally. The equivalent commands passed locally; GitHub-hosted jobs have not been run on this branch |

The first cleanup implementation exposed cached-directory failures under native watch mode. The final supervisor owns all source watching and starts clean processes; the durable rebuild regression covers the corrected behavior. Other verification fixes were a root-path resolution bug in the link checker and normalization of equivalent Lab/OKLCH computed color strings.

## Remaining differences and limits

- Existing mobile header/content overlap and narrow-screen footer overflow remain baseline behavior, already visible in the phase 1 and phase 4 captures. This migration did not redesign them.
- Article text companions are not generated; historical text URLs now redirect. Text Version UI links remain absent.
- The footer credits Eleventy. Feed generator/date formatting, CSS serialization, search index filenames, generated icon bytes, and image delivery differ from Lume without changing the checked content/identity behavior.
- The sixteen computed-style comparisons and representative screenshots are targeted regression evidence, not a claim of pixel-perfect equality for every page and scroll position.
- Publication and account-specific Cloudflare configuration were not exercised. The hosting checks used Wrangler locally without account login or deployment.

## Reproduce checks

```sh
nvm use
npm ci
npm run type-check
npm test
npm run test:rebuild
```

Optional local Cloudflare serving, including `_redirects` and custom 404 behavior:

```sh
WRANGLER_SEND_METRICS=false npx --yes wrangler@4.152.0 pages dev _site --port=8091 --ip=127.0.0.1 --compatibility-date=2026-10-22
```

The verification servers on 8090 and 8091 were stopped afterward. Use `npm run serve` for normal development or the command above for hosting behavior. No production credentials are needed.

## Final screenshots

These final-output screenshots were visually reviewed alongside the [baseline](eleventy-baseline/README.md) and [phase 4 captures](eleventy-phase4/README.md):

- [Homepage desktop, dark](eleventy-phase5/screenshots/phase5-home-desktop-dark.png)
- [XUnit article mobile, light](eleventy-phase5/screenshots/phase5-article-mobile-light.png)
- [About desktop, light](eleventy-phase5/screenshots/phase5-about-desktop-light.png)
- [Custom 404 mobile, dark](eleventy-phase5/screenshots/phase5-404-mobile-dark.png)

## Release state

Phases 1–5 are complete. The branch is prepared for final user review and a separately authorized merge/publication. The workflow will publish on a push to `main`; this phase deliberately did neither. Phase 6 remains optional and unchecked.
