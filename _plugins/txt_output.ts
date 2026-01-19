// _plugins/txt_output.ts
import type { Page, Site } from "lume/core.ts";
import { Page as PageClass } from "lume/core/file.ts";

interface TxtOutputOptions {
  // Filter function to determine which pages to process
  filter?: (page: Page) => boolean;
  // Whether to include metadata at the top
  includeMetadata?: boolean;
}

export default function txtOutput(options: TxtOutputOptions = {}) {
  const defaults: Required<TxtOutputOptions> = {
    filter: (page: Page) => page.data.url?.startsWith("/posts/") ?? false,
    includeMetadata: true,
  };

  const opts = { ...defaults, ...options };

  return (site: Site) => {
    site.process([".html"], (pages: Page[], allPages: Page[]) => {
      for (const page of pages) {
        if (!opts.filter(page)) continue;

        let textContent = page.data.content as string;

        // Preserve code blocks first (before other processing)
        const codeBlocks: string[] = [];
        textContent = textContent.replace(
          /<pre[^>]*>.*?<\/pre>/gis,
          (match) => {
            const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
            // Extract text content from code block
            const code = match
              .replace(/<pre[^>]*>/i, "")
              .replace(/<\/pre>/i, "")
              .replace(/<code[^>]*>/i, "")
              .replace(/<\/code>/i, "")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&amp;/g, "&")
              .replace(/&quot;/g, '"')
              .trim();
            codeBlocks.push("\n```\n" + code + "\n```\n");
            return placeholder;
          },
        );

        // Convert images to links
        textContent = textContent.replace(
          /<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
          (_match, src: string, alt: string) => {
            return alt ? `[Image: ${alt}](${src})` : `[Image](${src})`;
          },
        );
        // Handle images without alt text
        textContent = textContent.replace(
          /<img[^>]*src=["']([^"']+)["'][^>]*>/gi,
          (match, src: string) => {
            if (match.includes("alt=")) return match; // Already processed
            return `[Image](${src})`;
          },
        );

        // Convert links to preserve them
        textContent = textContent.replace(
          /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi,
          (_match, href: string, text: string) => {
            const linkText = text.replace(/<[^>]+>/g, "").trim();
            return linkText ? `${linkText} (${href})` : href;
          },
        );

        // Convert headings to preserve hierarchy
        textContent = textContent.replace(
          /<h1[^>]*>(.*?)<\/h1>/gi,
          "\n\n# $1\n\n",
        );
        textContent = textContent.replace(
          /<h2[^>]*>(.*?)<\/h2>/gi,
          "\n\n## $1\n\n",
        );
        textContent = textContent.replace(
          /<h3[^>]*>(.*?)<\/h3>/gi,
          "\n\n### $1\n\n",
        );
        textContent = textContent.replace(
          /<h4[^>]*>(.*?)<\/h4>/gi,
          "\n\n#### $1\n\n",
        );
        textContent = textContent.replace(
          /<h5[^>]*>(.*?)<\/h5>/gi,
          "\n\n##### $1\n\n",
        );
        textContent = textContent.replace(
          /<h6[^>]*>(.*?)<\/h6>/gi,
          "\n\n###### $1\n\n",
        );

        // Convert paragraphs and divs to preserve spacing
        textContent = textContent.replace(/<\/p>/gi, "\n\n");
        textContent = textContent.replace(/<p[^>]*>/gi, "");
        textContent = textContent.replace(/<\/div>/gi, "\n");
        textContent = textContent.replace(/<div[^>]*>/gi, "");

        // Convert breaks
        textContent = textContent.replace(/<br\s*\/?>/gi, "\n");

        // Convert list items
        textContent = textContent.replace(/<li[^>]*>/gi, "\n• ");
        textContent = textContent.replace(/<\/li>/gi, "");
        textContent = textContent.replace(/<\/?[uo]l[^>]*>/gi, "\n");

        // Remove script and style tags
        textContent = textContent.replace(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          "",
        );
        textContent = textContent.replace(
          /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
          "",
        );

        // Remove remaining HTML tags
        textContent = textContent.replace(/<[^>]+>/g, "");

        // Decode HTML entities
        textContent = textContent
          .replace(/&nbsp;/g, " ")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&mdash;/g, "—")
          .replace(/&ndash;/g, "–");

        // Restore code blocks
        codeBlocks.forEach((code, i) => {
          textContent = textContent.replace(`__CODE_BLOCK_${i}__`, code);
        });

        // Clean up excessive whitespace while preserving intentional spacing
        textContent = textContent
          .split("\n")
          .map((line) => line.trim())
          .join("\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        // Add metadata header if enabled
        let finalContent = "";
        if (opts.includeMetadata && page.data) {
          const metadata: string[] = [];
          if (page.data.title) metadata.push(`Title: ${page.data.title}`);
          if (page.data.date) metadata.push(`Date: ${page.data.date}`);
          if (page.data.author) metadata.push(`Author: ${page.data.author}`);
          if (page.data.tags && Array.isArray(page.data.tags)) {
            metadata.push(`Tags: ${page.data.tags.join(", ")}`);
          }

          if (metadata.length > 0) {
            finalContent = metadata.join("\n") + "\n" + "=".repeat(50) + "\n\n";
          }
        }

        finalContent += textContent;

        // Create the .txt page
        const txtUrl = page.data.url?.replace(/\.html$/, ".txt").replace(
          /\/$/,
          "/index.txt",
        );

        if (txtUrl) {
          // Create a new page using the Page.create() method
          const txtPage = PageClass.create({
            url: txtUrl,
            content: finalContent,
          });
          
          // Add the new page to allPages
          allPages.push(txtPage);
          console.log(`🔥 ${txtUrl} <- ${page.data.url}`);
        }
      }
    });
  };
}
