import { posix } from "node:path";

export function postPermalink(inputPath: string, relativeUrl?: string): string {
  const source = inputPath.replace(/^\.\//, "");
  const stem = source.replace(/\.md$/, "");
  // Lume resolves ./index.html beside the source file; Eleventy needs a permalink.
  return relativeUrl
    ? `/${posix.join(posix.dirname(source), relativeUrl)}`
    : `/${stem}/index.html`;
}
