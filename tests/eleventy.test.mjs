import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { formatDate } from "../_eleventy/helpers/dates.ts";
import { postPermalink } from "../_eleventy/helpers/permalinks.ts";
import { parseHTML, DOMParser } from "linkedom";
import sharp from "sharp";

const output = new URL("../_site-eleventy/", import.meta.url);
const html = path => readFile(new URL(path, output), "utf8");
const posts = [
  "more-thoughts-on-ai", "text-versions-of-posts", "generate-todo-with-ai",
  "moving-to-cloudflare-pages", "xunit-theory-data", "automapper-precondition",
  "NO_ERRORS_SCHEMA", "github-actions[bot]-denied", "Generic-Component-Blazor",
];

test("all baseline HTML routes render through the shared layout", async () => {
  for (const route of ["index.html", "about-me/index.html", "404.html", ...posts.map(p => `posts/${p}/index.html`)]) {
    const page = await html(route);
    assert(page.startsWith("<!DOCTYPE html>"), route);
    for (const id of ["sidebar", "nav", "content", "toggle-theme", "search"]) assert(page.includes(`id="${id}"`), `${route}: ${id}`);
    assert(page.includes("Built using"));
    assert(!page.includes("Text Version</a>"));
    assert(!page.includes("react-dom/client"));
  }
});

test("homepage lists every article newest first with encoded public links", async () => {
  const home = await html("index.html");
  const links = [...home.matchAll(/<a class="py-5[^"]*" href="([^"]+)"/g)].map(m => decodeURI(m[1]));
  assert.deepEqual(links, posts.map(p => `/posts/${p}/`));
  assert(home.includes("github-actions%5Bbot%5D-denied"));
  assert(home.includes("02/13/2025"));
  assert(home.includes("Testing, dotnet"));
  assert(home.includes("Explore building a generic component with Blazor."));
});

test("Markdown preserves code, attribute syntax, and article heading targets", async () => {
  const article = await html("posts/xunit-theory-data/index.html");
  assert(article.includes('class="hljs language-csharp"'));
  assert(article.includes('id="using-classdata-attribute"'));
  assert(article.includes('href="#using-classdata-attribute"'));
  assert(article.includes("<blockquote>"));
  assert(!article.includes("&lt;blockquote&gt;"));
  const about = await html("about-me/index.html");
  assert(about.includes('href="https://dotnet.microsoft.com" class="text-blue-600 dark:text-blue-400"'));
  assert(!about.includes("{.text-blue-600"));
});

test("permalink compatibility covers standalone and folder-based Markdown", () => {
  assert.equal(postPermalink("./posts/Generic-Component-Blazor.md"), "/posts/Generic-Component-Blazor/index.html");
  assert.equal(postPermalink("./posts/text-versions-of-posts/index.md", "./index.html"), "/posts/text-versions-of-posts/index.html");
  assert.equal(postPermalink("./posts/github-actions[bot]-denied/github-actions[bot]-denied.md", "./index.html"), "/posts/github-actions[bot]-denied/index.html");
  assert.equal(formatDate("2025-02-13T05:00:00Z"), "02/13/2025");
});

test("content assets are copied unchanged and build documents are excluded", async () => {
  for (const path of ["PaulFischerResume.pdf", "assets/img/avatar-150x150.png", "scripts/toggle-theme.js", "posts/NO_ERRORS_SCHEMA/known-element-error.png", "posts/generate-todo-with-ai/gpt-todo.html"]) {
    assert.deepEqual(await readFile(new URL(path, output)), await readFile(new URL(`../${path}`, import.meta.url)));
  }
  const files = await readdir(output, { recursive: true });
  assert(!files.some(path => path.endsWith("index.txt")), "article text output is deferred");
  assert(!files.some(path => /^(docs|README|ELEVENTY-MIGRATION|node_modules|_site)/.test(path)), "build-only content must not be published");
});

test("publishing feeds preserve all nine article IDs, order, dates, and absolute content links", async () => {
  const feed = JSON.parse(await html("posts.json"));
  assert.equal(feed.items.length, 9);
  assert.deepEqual(feed.items.map(item => decodeURI(new URL(item.url).pathname)), posts.map(p => `/posts/${p}/`));
  for (const item of feed.items) {
    assert.equal(item.id, item.url);
    assert(!item.id.includes("["), "preserve the encoded legacy feed ID");
    assert(Number.isFinite(Date.parse(item.date_published)), item.title);
    const { document } = parseHTML(`<html><body>${item.content_html}</body></html>`);
    for (const element of document.querySelectorAll("[href], [src]")) {
      for (const attr of ["href", "src"]) {
        const value = element.getAttribute(attr);
        if (value) assert.doesNotThrow(() => new URL(value), `${item.title}: ${value}`);
      }
    }
  }
  const rss = new DOMParser().parseFromString(await html("posts.rss"), "text/xml");
  assert.equal(rss.querySelectorAll("item").length, 9);
  assert.equal(rss.querySelectorAll("item pubDate").length, 9);
  assert.equal(feed.items[0].date_published, "2026-04-20T05:00:00.000Z");
});

test("styles, highlighted code, icons, reading estimates, favicons and search assets exist", async () => {
  const home = await html("index.html");
  const { document } = parseHTML(home);
  assert.deepEqual([...document.querySelectorAll("#content li > span")].map(n => n.textContent), [4, 2, 4, 3, 4, 2, 3, 2, 3].map(n => `${n} min read`));
  assert(document.querySelector("#nav svg"));
  const css = await html("styles.css");
  assert(!css.includes('@import "tailwindcss"'));
  assert(css.includes(".lg\\:flex"));
  assert(css.includes(".pl-12"), "Markdown attribute classes must survive Tailwind compilation");
  assert(css.includes(".hljs-keyword"));
  assert((await html("posts/xunit-theory-data/index.html")).includes('class="hljs-keyword"'));
  const icon = await readFile(new URL("favicon.ico", output));
  assert.equal(icon.readUInt16LE(2), 1);
  assert.equal(icon[6], 32);
  const touch = await sharp(await readFile(new URL("apple-touch-icon.png", output))).metadata();
  assert.equal(touch.width, 180); assert.equal(touch.height, 180);
  for (const path of ["pagefind/pagefind.js", "pagefind/pagefind-ui.js", "pagefind/pagefind-ui.css", "scripts/search.js"]) assert((await html(path)).length > 0);
});

test("sitemap covers the eleven public content pages and robots advertises it", async () => {
  const sitemap = new DOMParser().parseFromString(await html("sitemap.xml"), "text/xml");
  const paths = [...sitemap.querySelectorAll("loc")].map(n => decodeURI(new URL(n.textContent).pathname)).sort();
  assert.deepEqual(paths, ["/", "/about-me/", ...posts.map(p => `/posts/${p}/`)].sort());
  assert((await html("robots.txt")).includes("Sitemap: https://paulmfischer.dev/sitemap.xml"));
});
