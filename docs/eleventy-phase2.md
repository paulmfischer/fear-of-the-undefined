# Phase 2 — Eleventy build foundation

## Scope

The phase 2 build intentionally renders only the existing XUnit Markdown article using a minimal shared TSX layout and imported header component. It does not yet reproduce the full site. The source article and legacy Lume templates/configuration are unchanged.

- Runtime: Node **22.23.4**, pinned in `.nvmrc` and `package.json`.
- Generator: Eleventy **3.1.7**, with exact direct dependency versions and `package-lock.json`.
- Templates: ESM, `tsx`, React static server rendering. No React runtime is shipped to the browser.
- Helpers: TypeScript; date formatting explicitly uses UTC to preserve live dates.
- Output: `_site-eleventy`, deliberately separate from the legacy `_site` while the migration is partial. Final output/CI transition belongs to the later migration phases.
- Input: `posts/xunit-theory-data`; the existing `layouts/posts.tsx` front-matter reference is mapped to the new article layout through an Eleventy alias.

## Commands

From the repository root:

```sh
nvm use
npm ci
npm run type-check
npm run build
npm run serve
```

`nvm` is optional if Node 22.23.4 is already installed. Preview the article at http://localhost:8080/posts/xunit-theory-data/. The homepage is not implemented in this phase.

`type-check` covers the new `_eleventy` TS/TSX files, the development supervisor, and shared `consts.ts`. Legacy Deno/Lume files remain outside this configuration until ported. Running the TSX loader alone does not type-check templates; run the separate command.

## Development reloads

Eleventy detects imported TSX edits but its in-process rebuild can retain cached ESM components. This was reproduced with a temporary header attribute: the build ran, but the attribute did not appear.

`npm run serve` therefore starts a small TypeScript supervisor using Node's built-in filesystem watcher. Changes to `_eleventy`, `consts.ts`, Eleventy configuration, or TypeScript configuration restart the preview in a fresh process. Markdown changes use Eleventy's own watcher. No additional watcher package is required. TSX changes briefly restart the server; reload the browser after the restart completes. Ctrl+C stops the supervisor and child server.

## Verification performed

- A clean `npm ci` succeeded; npm reported zero vulnerabilities.
- `npm run type-check` and `npm run build` passed.
- One article was written at the expected `/posts/xunit-theory-data/` path.
- HTML has a doctype, title, viewport, author/date metadata, rendered Markdown blocks, and C# code fences. Markdown HTML is inserted as HTML rather than escaped text.
- Production output contains no scripts or hydration runtime. The development server injects its own connection script, as expected.
- Temporary edits to an imported TSX component and shared layout both appeared in served HTML after restart.
- Temporary Markdown title and TypeScript date-helper changes appeared in the preview; all probes were reverted, including the source article change.
- Browser capture returned HTTP 200 with no page exceptions; the unstyled article was visually inspected. Styling, heading-anchor parity, full navigation, search, and feeds are later-phase work.
- The local preview was stopped after verification. Production and CI were not changed.

## Next phase

Phase 3 expands the input to all content, replaces the temporary fixed permalink, maps metadata/collections, and ports the full presentation. Phase 4 restores styling/assets and publishing features. This foundation is not ready for production publication or the full user review planned after phase 4.
