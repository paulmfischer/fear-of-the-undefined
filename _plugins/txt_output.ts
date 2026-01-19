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
    site.process([".md"], (pages: Page[], allPages: Page[]) => {
      for (const page of pages) {
        if (!opts.filter(page)) continue;

        let textContent = page.data.content as string;

        // Preserve code blocks first (before other processing)
        // The content already has markdown code blocks (```), not HTML pre/code tags
        const codeBlocks: string[] = [];
        textContent = textContent.replace(
          /```[\s\S]*?```/g,
          (match) => {
            const placeholder = `@@CODEBLOCK${codeBlocks.length}@@`;
            codeBlocks.push(match);
            return placeholder;
          },
        );

        // Convert markdown images to links
        textContent = textContent.replace(
          /!\[([^\]]*)\]\(([^)]+)\)(\{[^}]+\})?/g,
          (_match, alt: string, src: string) => {
            return alt ? `[Image: ${alt}](${src})` : `[Image](${src})`;
          },
        );

        // Convert markdown links to plain text with URL
        textContent = textContent.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          (_match, text: string, href: string) => {
            return text ? `${text} (${href})` : href;
          },
        );

        // Convert markdown headings
        textContent = textContent.replace(/^### /gm, "\n\n### ");
        textContent = textContent.replace(/^## /gm, "\n\n## ");
        textContent = textContent.replace(/^# /gm, "\n\n# ");

        // Convert markdown bold and italic
        textContent = textContent.replace(/\*\*([^*]+)\*\*/g, "$1");
        textContent = textContent.replace(/\*([^*]+)\*/g, "$1");
        textContent = textContent.replace(/__([^_]+)__/g, "$1");
        textContent = textContent.replace(/_([^_]+)_/g, "$1");

        // Convert markdown lists
        textContent = textContent.replace(/^\s*[-*+] /gm, "• ");

        // Remove remaining markdown syntax
        textContent = textContent.replace(/`([^`]+)`/g, "$1"); // inline code
        textContent = textContent.replace(/~~([^~]+)~~/g, "$1"); // strikethrough

        // Clean up excessive whitespace while preserving intentional spacing
        // Do this BEFORE restoring code blocks to avoid stripping their indentation
        textContent = textContent
          .split("\n")
          .map((line) => line.trim())
          .join("\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        // Restore code blocks (after cleanup, with indentation applied here)
        codeBlocks.forEach((code, i) => {
          // Put the original fenced block back (keeps language annotation and spacing)
          textContent = textContent.replace(`@@CODEBLOCK${i}@@`, `\n${code}\n`);
        });

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

        // Create the .txt page without colliding with the HTML output path
        let txtUrl = page.data.url;
        if (txtUrl?.endsWith("/")) {
          txtUrl = txtUrl + "index.txt";
        } else {
          txtUrl = txtUrl
            ?.replace(/\/index\.html$/, "/index.txt")
            .replace(/\.html$/, ".txt")
            .replace(/\.md$/, ".txt");
        }

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
