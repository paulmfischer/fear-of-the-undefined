import { parseHTML } from "linkedom";

export function textUrl(url: string): string {
  return url.endsWith("/") ? `${url}index.txt` : url.replace(/\.html$/, ".txt");
}

// Use the rendered article so Markdown extensions, entities and raw HTML have
// exactly the same meaning in both formats. Keep code outside whitespace cleanup.
export function articleText(html: string, url: string, author: string, tags: string[]): string {
  const { document } = parseHTML(html);
  const article = document.querySelector("#post-content");
  if (!article) throw new Error(`Missing article content: ${url}`);
  const code: string[] = [];
  function render(node: Node, depth = 0): string {
    if (node.nodeType === 3) return (node.textContent ?? "").replace(/\s+/g, " ");
    if (node.nodeType !== 1) return "";
    const element = node as Element;
    const tag = element.tagName.toLowerCase();
    if (["script", "style"].includes(tag) || element.classList.contains("header-anchor")) return "";
    if (tag === "pre") {
      const child = element.querySelector("code");
      const language = child?.className.match(/(?:^|\s)language-(\S+)/)?.[1] ?? "";
      const content = child?.textContent ?? element.textContent ?? "";
      const fence = "`".repeat(Math.max(3, ...[...content.matchAll(/`+/g)].map(m => m[0].length + 1)));
      code.push(`${fence}${language}\n${content}${content.endsWith("\n") ? "" : "\n"}${fence}`);
      return `\n\n\u0000${code.length - 1}\u0000\n\n`;
    }
    if (tag === "img") return `[Image: ${element.getAttribute("alt") ?? ""}] (${new URL(element.getAttribute("src") ?? "", url).href})`;
    const children = [...element.childNodes].map(child => render(child, depth + (tag === "ul" || tag === "ol" ? 1 : 0))).join("");
    if (tag === "blockquote") {
      // Expand protected code before quoting so every line receives a marker,
      // including blank lines, nested quotes and code inside the quotation.
      const quoted = children.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
        .replace(/\u0000(\d+)\u0000/g, (_, index: string) => code[Number(index)]!)
        .split("\n").map(line => line ? `> ${line}` : ">").join("\n");
      code.push(quoted);
      return `\n\n\u0000${code.length - 1}\u0000\n\n`;
    }
    if (tag === "a") {
      const href = element.getAttribute("href");
      return href ? `${children} (${new URL(href, url).href})` : children;
    }
    if (/^h[1-6]$/.test(tag)) return `\n\n${"#".repeat(Number(tag[1]))} ${children.trim()}\n\n`;
    if (tag === "li") {
      const parent = element.parentElement;
      const marker = parent?.tagName.toLowerCase() === "ol"
        ? `${Number(parent.getAttribute("start") ?? 1) + [...parent.children].indexOf(element)}.` : "-";
      return `\n${"  ".repeat(Math.max(0, depth - 1))}${marker} ${children.trim()}\n`;
    }
    if (tag === "br") return "\n";
    if (tag === "hr") return "\n\n---\n\n";
    if (tag === "th" || tag === "td") return `${children.trim()} | `;
    if (["p", "div", "ul", "ol", "table", "tr"].includes(tag)) return `\n${children}\n`;
    return children;
  }
  const body = render(article).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
    .replace(/\u0000(\d+)\u0000/g, (_, index: string) => code[Number(index)]!);
  const date = document.querySelector("time")?.getAttribute("dateTime");
  return `Title: ${document.querySelector("h1")?.textContent}\nDate: ${new Date(date!).toISOString()}\nAuthor: ${author}\nTags: ${tags.join(", ")}\n${"=".repeat(50)}\n\n${body}\n`;
}
