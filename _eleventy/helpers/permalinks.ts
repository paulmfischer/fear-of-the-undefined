import { posix } from "node:path";

export function postPermalink(inputPath: string, relativeUrl?: string): string {
  const source = inputPath.replace(/^\.\//, "");
  const stem = source.replace(/\.md$/, "");
  // Resolve relative HTML URLs beside the source file to preserve published paths.
  return relativeUrl
    ? `/${posix.join(posix.dirname(source), relativeUrl)}`
    : `/${stem}/index.html`;
}
