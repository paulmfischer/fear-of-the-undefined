// _plugins/txt_output.ts
import type { Page, Site } from "lume/core.ts";
import { Page as PageClass } from "lume/core/file.ts";

interface TxtOutputOptions {
  // Filter function to determine which pages to process
  filter?: (page: Page) => boolean;
  // Whether to include metadata at the top
  includeMetadata?: boolean;
  // Whether to include image URLs (if false, only shows alt text)
  includeImageUrls?: boolean;
}

export default function txtOutput(options: TxtOutputOptions = {}) {
  const defaults: Required<TxtOutputOptions> = {
    filter: (page: Page) => page.data.url?.startsWith("/posts/") ?? false,
    includeMetadata: true,
    includeImageUrls: true,
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

        // Convert markdown images
        textContent = textContent.replace(
          /!\[([^\]]*)\]\(([^)]+)\)(\{[^}]+\})?/g,
          (_match, alt: string, src: string) => {
            if (!opts.includeImageUrls) {
              // Just show alt text, skip the URL
              return alt ? `[Image: ${alt}]` : "[Image]";
            }
            // Include the image URL
            let fullUrl = src;
            if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//')) {
              // Get the directory of the current page
              const pageDir = page.data.url?.replace(/[^/]*$/, '') || '/';
              // Resolve relative path
              const resolvedPath = new URL(src, `https://example.com${pageDir}`).pathname;
              // Combine with site location
              fullUrl = new URL(resolvedPath, site.options.location).href;
            }
            return alt ? `[Image: ${alt}](${fullUrl})` : `[Image](${fullUrl})`;
          },
        );

        // Convert markdown links to plain text with full URL
        textContent = textContent.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          (_match, text: string, href: string) => {
            let fullUrl = href;
            // Only convert relative or absolute paths to full URLs if they're not already absolute URLs
            if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
              // Construct the full URL using the site's location
              if (href.startsWith('/')) {
                // Absolute path - combine with site location
                fullUrl = new URL(href, site.options.location).href;
              } else {
                // Relative path - resolve relative to current page's directory
                const pageDir = page.data.url?.replace(/[^/]*$/, '') || '/';
                const resolvedPath = new URL(href, `https://example.com${pageDir}`).pathname;
                fullUrl = new URL(resolvedPath, site.options.location).href;
              }
            }
            return text ? `${text} (${fullUrl})` : fullUrl;
          },
        );

        // Convert markdown headings
        textContent = textContent.replace(/^### /gm, "\n\n### ");
        textContent = textContent.replace(/^## /gm, "\n\n## ");
        textContent = textContent.replace(/^# /gm, "\n\n# ");

        // Convert markdown bold and italic
        // Stars: remove safely (not used in URLs)
        textContent = textContent.replace(/\*\*([^*]+)\*\*/g, "$1");
        textContent = textContent.replace(/\*([^*]+)\*/g, "$1");
        // Underscore emphasis: avoid touching URLs or identifiers
        // Only match underscores that are not adjacent to word characters
        textContent = textContent.replace(/(^|[^\w])__([^_]+)__(?=[^\w]|$)/g, "$1$2");
        textContent = textContent.replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, "$1$2");

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
