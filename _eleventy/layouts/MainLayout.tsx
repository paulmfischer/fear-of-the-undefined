import type { ReactNode } from "react";
import { siteOptions } from "../../consts.ts";
import { SiteHeader } from "../components/SiteHeader.tsx";

interface MainLayoutProps {
  title: string;
  children: ReactNode;
}

export function MainLayout({ title, children }: MainLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={siteOptions.description} />
        <title>{title}</title>
      </head>
      <body>
        <SiteHeader />
        <main id="content" data-pagefind-body>{children}</main>
      </body>
    </html>
  );
}
