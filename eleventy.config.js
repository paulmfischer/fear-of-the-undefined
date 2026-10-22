import "tsx/esm";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import MarkdownIt from "markdown-it";
import attrs from "markdown-it-attrs";
import anchor from "markdown-it-anchor";
import { validateSite } from "./_eleventy/helpers/site.ts";

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
  eleventyConfig.setLibrary("md", new MarkdownIt({ html: true, linkify: true })
    .use(attrs).use(anchor, { slugify: (value) => value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") }));
  for (const path of ["README.md", "ELEVENTY-MIGRATION.md", "docs/**", "_site/**", "_site-eleventy/**", "_cache/**", "_vendor/**"]) {
    eleventyConfig.ignores.add(path);
  }
  for (const path of ["assets", "PaulFischerResume.pdf", "scripts/toggle-sidebar.js", "scripts/toggle-theme.js", "posts/**/*.{png,jpg,jpeg,gif,webp,svg}", "posts/generate-todo-with-ai/gpt-todo.html"]) {
    eleventyConfig.addPassthroughCopy(path);
  }
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
