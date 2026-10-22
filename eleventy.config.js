import "tsx/esm";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import MarkdownIt from "markdown-it";
import attrs from "markdown-it-attrs";
import anchor from "markdown-it-anchor";
import { validateSite } from "./_eleventy/helpers/site.ts";
import { readingMinutes } from "./_eleventy/helpers/reading.ts";
import { buildAssets, buildPublishing } from "./_eleventy/helpers/build.ts";
import hljs from "highlight.js";

export default function (eleventyConfig) {
  // The native dependency scanner parses JavaScript, not TypeScript. The serve
  // supervisor already restarts for imported TS/TSX and data-file changes.
  eleventyConfig.setWatchJavaScriptDependencies(false);
  eleventyConfig.addExtension(["11ty.tsx"], {
    key: "11ty.js",
    compile() {
      return async function (data) {
        const markup = renderToStaticMarkup(await this.defaultRenderer(data));
        return markup.startsWith("<html") ? `<!DOCTYPE html>${markup}` : markup;
      };
    },
  });
  eleventyConfig.addTemplateFormats("11ty.tsx");
  eleventyConfig.addLayoutAlias("layouts/posts.tsx", "layouts/article.11ty.tsx");
  eleventyConfig.addLayoutAlias("layouts/main.tsx", "layouts/page.11ty.tsx");
  eleventyConfig.addGlobalData("site", () => validateSite(parse(readFileSync("_data.yml", "utf8"))));
  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByTag("post").sort((a, b) => b.date.getTime() - a.date.getTime()),
  );
  eleventyConfig.addPreprocessor("reading-time", "md", (data) => {
    // Counting the full source matches the nine live baseline estimates,
    // including the Angular post at the two/three minute boundary.
    data.readingMinutes = readingMinutes(readFileSync(data.page.inputPath, "utf8"));
  });
  eleventyConfig.setLibrary("md", new MarkdownIt({ html: true, linkify: true, highlight: (code, language) => {
    if (language && hljs.getLanguage(language)) {
      return `<pre><code class="hljs language-${language}">${hljs.highlight(code, { language }).value}</code></pre>`;
    }
    return "";
  } })
    .use(attrs).use(anchor, { slugify: (value) => value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") }));
  for (const path of ["README.md", "ELEVENTY-MIGRATION.md", "docs/**", "_site/**", "_site-eleventy/**", "_cache/**", "_vendor/**"]) {
    eleventyConfig.ignores.add(path);
  }
  for (const path of ["assets", "favicon.svg", "PaulFischerResume.pdf", "scripts/search.js", "scripts/toggle-sidebar.js", "scripts/toggle-theme.js", "posts/**/*.{png,jpg,jpeg,gif,webp,svg}", "posts/generate-todo-with-ai/gpt-todo.html"]) {
    eleventyConfig.addPassthroughCopy(path);
  }
  eleventyConfig.on("eleventy.before", async ({ dir }) => buildAssets(dir.output));
  eleventyConfig.on("eleventy.after", async ({ dir, results }) => buildPublishing(dir.output, results));
  eleventyConfig.addWatchTarget("styles.css");
  eleventyConfig.addWatchTarget("_includes/styles/code-highlight.css");
  // The serve wrapper restarts on TSX/helper changes to avoid stale ESM modules.
  // Eleventy's native watcher handles Markdown changes in the input directory.

  return {
    templateFormats: ["md", "11ty.tsx"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: false,
    dir: {
      input: ".",
      includes: "_eleventy",
      output: "_site-eleventy",
    },
  };
}
