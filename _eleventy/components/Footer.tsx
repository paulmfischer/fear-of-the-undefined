import type { SiteData } from "../types.ts";
import { Icon } from "./Icon.tsx";

export function Footer({ site }: { site: SiteData }) {
  return <footer className="flex mt-3 m-5 pt-3 border-t border-slate-700 dark:text-slate-400 text-3xl lg:text-sm"><div className="flex gap-2 items-center ml-3">
    <Icon iconName="copyright" className="w-6 h-6 lg:w-4 lg:h-4" />2025
    <a href={site.github} className="text-blue-600 dark:text-blue-400">{site.author}</a><span>|</span>
    Built using<a href="https://www.11ty.dev/" className="text-blue-600 dark:text-blue-400">Eleventy</a>
  </div></footer>;
}
