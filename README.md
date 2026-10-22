# Fear of the 'undefined'

Paul Fischer's developer blog at [paulmfischer.dev](https://paulmfischer.dev), built with Eleventy and hosted on Cloudflare Pages. Posts are Markdown; layouts/components are TSX rendered to static HTML; helpers are TypeScript. React is used only during the build.

## Develop locally

Use Node **22.23.4** (pinned in `.nvmrc`):

```sh
nvm use
npm ci
npm run serve
```

Open http://localhost:8080/. Set `PREVIEW_PORT=8090 npm run serve` if another preview occupies that port. Markdown, asset, TSX, helper, data, and configuration changes restart the preview with a fresh build to avoid stale imports and deleted output. Reload after the brief restart. Ctrl+C stops it.

```sh
npm run type-check  # Strict checking of application TypeScript/TSX
npm test            # Build and verify generated routes, links, content, feeds and assets
npm run test:rebuild # Isolated add/rename/delete and stale-file regression
npm run build       # Generate the deployable site
```

The build owns **`_site/`** and cleans it at startup, including watched rebuilds. Do not store authored files there. Use `npm run serve` for development so deletions and renames trigger clean rebuilds. Deno is not required.

## Write a post

Create `posts/my-post/index.md`:

```markdown
---
title: My post
date: 2026-10-22T05:00:00Z
url: ./index.html
categories:
  - dotnet
tags:
  - testing
---
Write the article here.
```

Place images beside the Markdown file and link to them with relative paths. The example publishes at `/posts/my-post/`. Standalone files such as `posts/Generic-Component-Blazor.md` also publish to a directory URL. Keep existing URLs when moving or renaming published posts. Dates display in UTC so local and CI builds agree.

Posts inherit their article layout and the `post` collection tag from directory data. YAML front matter may also include `description` and an explicit layout override. Markdown attributes such as `{.text-blue-600}` and generated heading anchors are supported. Code fences specify their language, e.g. `csharp`.

## Project structure

- `index.tsx`: newest-first post listing.
- `_eleventy/layouts/` and `_eleventy/components/`: shared TSX presentation.
- `_eleventy/helpers/`: dates, permalinks, reading estimates, assets and publishing output.
- `_data.yml`: profile/social metadata; `consts.ts`: canonical site/feed settings.
- `posts/_data.yml` and `posts/posts.data.js`: inherited post data and permalink mapping.
- `styles.css` and `_eleventy/styles/code-highlight.css`: Tailwind/custom styles and code colors.
- `scripts/`: browser behavior and the development supervisor.
- `tests/`: generated-site checks and isolated rebuild regression.

Styles are compiled from rendered classes, including Markdown attributes. Search indexes article/About content after HTML generation. RSS/JSON feeds include the latest ten posts. Favicons derive from the avatar. Copied assets include the résumé and the standalone Todo example.

## Text versions

Each article includes a Text Version link. The build generates a UTF-8 companion at `index.txt` (or `name.txt` for explicit `name.html` permalinks), containing title, ISO UTC date, author, tags and article content. Links and images use absolute URLs; fenced code retains its language and whitespace. Text comes from rendered article HTML, so Markdown extensions and HTML entities are handled consistently. Nested lists, headings and tables use plain-text notation.

Canonical text URLs serve files directly. Generated Cloudflare rules only redirect historical double-slash text links to their canonical text URLs. Eleventy's local server does not emulate these hosting rules. The conversion implementation is `_eleventy/helpers/text.ts`.

## Deployment

GitHub Actions validates pull requests and pushes to `main` using `npm ci`, type checking, site tests, and the rebuild regression. A push to `main` publishes the exact validated `_site` artifact to the existing Cloudflare Pages project. Deployment uses the existing `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and GitHub token secrets. No deployment credentials are needed for local builds.

The migration branch itself does not publish. Review and merge are separate from preparing the migration. See [ELEVENTY-MIGRATION.md](ELEVENTY-MIGRATION.md) for phase tracking and verification evidence.

## History

The site previously used Jekyll/Chirpy, then Lume/Deno. The Eleventy migration preserves the existing blog design and Markdown workflow.

