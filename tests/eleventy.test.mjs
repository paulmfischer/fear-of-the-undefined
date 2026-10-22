import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { formatDate } from "../_eleventy/helpers/dates.ts";
import { postPermalink } from "../_eleventy/helpers/permalinks.ts";

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
  assert(article.includes('class="language-csharp"'));
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
  assert(!files.some(path => path.endsWith(".txt")), "text output is deferred");
  assert(!files.some(path => /^(docs|README|ELEVENTY-MIGRATION|node_modules|_site)/.test(path)), "build-only content must not be published");
});
