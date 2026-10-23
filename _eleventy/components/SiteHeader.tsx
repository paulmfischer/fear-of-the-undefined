import type { SiteData } from "../types.ts";
import { Icon } from "./Icon.tsx";

export function SiteHeader({ site }: { site: SiteData }) {
  return <div className="relative flex flex-col lg:flex-row gap-3 justify-between lg:justify-end p-4 lg:p-2 bg-zinc-300 dark:bg-zinc-700">
    <div className="lg:hidden"><div className="flex flex-col gap-4 justify-between"><div className="flex items-center gap-3">
      <button id="display-navigation" aria-label="Open navigation" className="cursor-pointer min-w-11 min-h-11 flex items-center justify-center dark:text-slate-400"><Icon iconName="menu-2" className="w-6 h-6" /></button>
      <a href="/" className="min-w-0"><h2 className="text-2xl leading-tight dark:text-slate-400">{site.siteTitle}</h2></a>
    </div></div></div>
    <div id="search" className="lg:min-w-0" />
  </div>;
}
