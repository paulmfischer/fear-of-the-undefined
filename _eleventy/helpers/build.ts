import { readFile, writeFile, mkdir, rm, readdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import { transform } from "lightningcss";
import sharp from "sharp";
import { Feed } from "feed";
import { parseHTML } from "linkedom";
import * as pagefind from "pagefind";
import { siteOptions } from "../../consts.ts";
import { parse } from "yaml";
import { articleText, textUrl } from "./text.ts";

interface BuildResult { url: string; content: string; inputPath: string; outputPath: string }

async function buildStyles(output: string, results: BuildResult[]) {
  // Scan rendered classes so Markdown attributes and computed TSX classes are
  // included too; source-only scanning misses Markdown's `.pl-12` notation.
  const classes = new Set<string>();
  for (const result of results) {
    const { document } = parseHTML(result.content);
    for (const element of document.querySelectorAll("[class]")) {
      for (const name of element.getAttribute("class")!.split(/\s+/)) if (name) classes.add(name);
    }
  }
  const source = (await readFile("styles.css", "utf8"))
    .replace('"tailwindcss"', '"tailwindcss" source(none)')
    + `\n@source inline(${JSON.stringify([...classes].join(" "))});\n`;
  const css = await postcss([tailwind({ optimize: false })]).process(source, { from: resolve("styles.css") });
  await writeFile(join(output, "styles.css"), transform({ filename: "styles.css", code: Buffer.from(css.css), minify: true }).code);
}

export async function buildAssets(output: string, clean = true) {
  // Clean on process startup. Native watch rebuilds retain Eleventy's cached
  // directories; obsolete HTML is pruned below and asset changes restart cleanly.
  if (resolve(output) !== resolve("_site")) throw new Error("Refusing to clean an unexpected output directory");
  if (clean) await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  const avatar = "assets/img/avatar-150x150.png";
  await sharp(avatar).resize(180, 180).png().toFile(join(output, "apple-touch-icon.png"));
  const png = await sharp(avatar).resize(32, 32).png().toBuffer();
  // ICO directory containing a PNG image (supported by current browsers).
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  header[6] = 32; header[7] = 32;
  header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
  await writeFile(join(output, "favicon.ico"), Buffer.concat([header, png]));
}

function absolute(url: string, base = siteOptions.baseUrl): string {
  return new URL(url, base).href.replaceAll("[", "%5B").replaceAll("]", "%5D");
}

function xml(value: string): string {
  return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);
}

export async function buildPublishing(output: string, results: BuildResult[]) {
  const currentPages = new Set(results.map(result => resolve(result.outputPath)));
  currentPages.add(resolve(output, "posts/generate-todo-with-ai/gpt-todo.html"));
  for (const path of await readdir(output, { recursive: true })) {
    if (path.endsWith(".html") && !currentPages.has(resolve(output, path))) {
      await rm(join(output, path), { force: true });
    }
  }
  await buildStyles(output, results);
  const feed = new Feed({
    id: siteOptions.baseUrl, title: siteOptions.title, description: siteOptions.description,
    link: siteOptions.baseUrl, language: "en", copyright: siteOptions.author,
    generator: "Eleventy", feedLinks: { rss: absolute("/posts.rss"), json: absolute("/posts.json") },
    author: { name: siteOptions.author, link: siteOptions.baseUrl },
  });
  const articles = results.filter(r => r.url.startsWith("/posts/"));
  const entries = articles.map(result => {
    const { document } = parseHTML(result.content);
    const article = document.querySelector("#post-content")!;
    const url = absolute(result.url);
    for (const element of article.querySelectorAll("[href], [src]")) {
      for (const attr of ["href", "src"]) {
        const value = element.getAttribute(attr);
        if (value) element.setAttribute(attr, absolute(value, url));
      }
    }
    return {
      title: document.querySelector("h1")!.textContent!, id: url, link: url,
      date: new Date(document.querySelector("time")!.getAttribute("dateTime")!),
      published: new Date(document.querySelector("time")!.getAttribute("dateTime")!),
      description: article.querySelector("p")?.textContent ?? "",
      content: article.innerHTML, author: [{ name: siteOptions.author }],
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());
  for (const entry of entries.slice(0, 10)) feed.addItem(entry);
  await writeFile(join(output, "posts.rss"), feed.rss2());
  await writeFile(join(output, "posts.json"), feed.json1());
  const urls = results.filter(r => r.url !== "/404.html").map(r => absolute(r.url));
  await writeFile(join(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${xml(url)}</loc></url>`).join("")}</urlset>`);
  await writeFile(join(output, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${absolute("/sitemap.xml")}\n`);
  for (const result of articles) {
    const source = await readFile(result.inputPath, "utf8");
    const metadata = parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "") ?? {};
    const tags = [...new Set<string>(["post", ...(metadata.tags ?? [])])];
    const destination = join(output, decodeURI(textUrl(result.url)));
    await mkdir(resolve(destination, ".."), { recursive: true });
    await writeFile(destination, articleText(result.content, absolute(result.url), siteOptions.author, tags));
  }
  // Only historical double-slash links need redirects now; canonical text URLs
  // are real assets and must never redirect to HTML.
  const redirects = articles.flatMap(result => {
    const url = new URL(absolute(textUrl(result.url))).pathname;
    return url.endsWith("/index.txt") ? [...new Set([url, decodeURI(url)])].map(source =>
      `${source.replace(/\/index\.txt$/, "//index.txt")} ${url} 302`) : [];
  });
  await writeFile(join(output, "_redirects"), [...new Set(redirects)].join("\n") + "\n");

  // Index articles and About from final HTML; navigation, listing, 404 and demo are excluded.
  await rm(join(output, "pagefind"), { recursive: true, force: true });
  const { index, errors } = await pagefind.createIndex();
  if (!index || errors?.length) throw new Error(`Pagefind: ${errors?.join(", ")}`);
  try {
    for (const result of results.filter(r => r.url !== "/" && r.url !== "/404.html")) {
      const indexed = await index.addHTMLFile({ url: result.url, content: result.content });
      if (indexed.errors.length) throw new Error(indexed.errors.join(", "));
    }
    const written = await index.writeFiles({ outputPath: join(output, "pagefind") });
    if (written.errors.length) throw new Error(written.errors.join(", "));
  } finally {
    await index.deleteIndex();
    await pagefind.close();
  }
}
