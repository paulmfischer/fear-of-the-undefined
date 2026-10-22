import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { postPermalink } from "../_eleventy/helpers/permalinks.ts";

export default {
  ...parse(readFileSync(new URL("./_data.yml", import.meta.url), "utf8")),
  layout: "layouts/posts.tsx",
  eleventyComputed: {
    permalink: (data) => postPermalink(data.page.inputPath, data.url),
  },
};
