import type { ReactNode } from "react";
import { SiteHeader } from "../components/SiteHeader.tsx";
import type { SiteData } from "../types.ts";
import { Profile } from "../components/Profile.tsx";
import { Nav } from "../components/Nav.tsx";
import { SidebarFooter } from "../components/SidebarFooter.tsx";
import { Footer } from "../components/Footer.tsx";
import { Icon } from "../components/Icon.tsx";

interface MainLayoutProps {
  title: string;
  children: ReactNode;
  site: SiteData;
}

export function MainLayout({ title, children, site }: MainLayoutProps) {
  return (
    <html className="dark" lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={site.siteDescription} />
        <title>{title}</title>
        <link rel="stylesheet" href="/pagefind/pagefind-ui.css" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="alternate" type="application/rss+xml" href="/posts.rss" title={`RSS Feed for ${site.siteTitle}`} />
        <link rel="alternate" type="application/feed+json" href="/posts.json" title={`JSON Feed for ${site.siteTitle}`} />
      </head>
      <body className="text-lg text-slate-900 bg-zinc-200 dark:text-slate-300 dark:bg-zinc-800">
        <div className="max-w-8xl mx-auto lg:px-8"><div className="min-h-screen flex">
          <div id="sidebar" className="w-80 max-w-full hidden lg:flex flex-col fixed inset-0 h-full overflow-y-auto lg:max-w-64 bg-zinc-200 dark:bg-zinc-800 z-50">
            <button id="close-sidebar" aria-label="Close navigation" className="absolute top-4 right-4 lg:hidden"><Icon iconName="x" className="w-6 h-6" /></button>
            <div className="ml-8 mr-4 lg:mr-2 flex flex-col gap-6 lg:gap-10"><Profile site={site} /><Nav /></div>
            <SidebarFooter site={site} />
          </div>
          <div id="main" className="min-w-0 max-w-full grow flex flex-col lg:pl-56 bg-zinc-100 dark:bg-zinc-900">
            <SiteHeader site={site} />
            <main id="content" className="m-5 lg:ml-10 lg:mr-12 leading-7 text-lg wrap-anywhere" data-pagefind-body>{children}</main>
            <div className="mt-auto"><Footer site={site} /></div>
          </div>
        </div></div>
        <script src="/scripts/toggle-sidebar.js" />
        <script src="/scripts/toggle-theme.js" />
        <script src="/pagefind/pagefind-ui.js" />
        <script src="/scripts/search.js" />
      </body>
    </html>
  );
}
