import "tsx/esm";
import { renderToStaticMarkup } from "react-dom/server";

export default function (eleventyConfig) {
  // Phase 2 deliberately builds one existing article without changing its source.
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
  eleventyConfig.addGlobalData("permalink", "/posts/xunit-theory-data/index.html");
  // The serve wrapper restarts on TSX/helper changes to avoid stale ESM modules.
  // Eleventy's native watcher handles Markdown changes in the input directory.

  return {
    templateFormats: ["md", "11ty.tsx"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: false,
    dir: {
      input: "posts/xunit-theory-data",
      includes: "../../_eleventy",
      output: "_site-eleventy",
    },
  };
}
