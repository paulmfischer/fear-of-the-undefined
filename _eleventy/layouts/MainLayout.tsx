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
      </head>
      <body className="text-5xl lg:text-lg text-slate-900 bg-zinc-200 dark:text-slate-300 dark:bg-zinc-800">
        <div className="max-w-8xl mx-auto lg:px-8"><div className="min-h-screen flex">
          <div id="sidebar" className="max-w-lg hidden lg:flex flex-col fixed inset-0 h-full lg:max-w-64 bg-zinc-200 dark:bg-zinc-800 z-50">
            <button id="close-sidebar" aria-label="Close navigation" className="absolute top-10 right-10 lg:hidden"><Icon iconName="x" className="w-12 h-12" /></button>
            <div className="ml-8 mr-4 lg:mr-2 flex flex-col gap-15 lg:gap-10"><Profile site={site} /><Nav /></div>
            <SidebarFooter site={site} />
          </div>
          <div id="main" className="max-w-full grow flex flex-col lg:pl-56 bg-zinc-100 dark:bg-zinc-900">
            <SiteHeader site={site} />
            <main id="content" className="ml-10 m-5 mr-12 pt-46 lg:pt-0 leading-14 lg:leading-7 text-4xl lg:text-lg" data-pagefind-body>{children}</main>
            <div className="mt-auto"><Footer site={site} /></div>
          </div>
        </div></div>
        <script src="/scripts/toggle-sidebar.js" />
        <script src="/scripts/toggle-theme.js" />
      </body>
    </html>
  );
}
