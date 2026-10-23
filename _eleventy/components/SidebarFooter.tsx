import type { SiteData } from "../types.ts";
import { Icon } from "./Icon.tsx";

export function SidebarFooter({ site }: { site: SiteData }) {
  const iconClass = "w-6 h-6 dark:text-slate-400";
  return <div className="mx-auto mt-6 lg:mt-auto mb-4 flex flex-wrap items-center gap-3">
    <button id="toggle-theme" className="cursor-pointer" aria-label="Toggle theme"><Icon id="light-mode-icon" iconName="sun" className={iconClass} /><Icon id="dark-mode-icon" iconName="moon" className={`hidden ${iconClass}`} /></button>
    <div>|</div>
    {[{ href: site.github, name: "github", icon: "brand-github" }, { href: site.linkedin, name: "linkedin", icon: "brand-linkedin" }, { href: site.mastodon, name: "mastodon", icon: "brand-mastodon" }, { href: "/posts.rss", name: "rss", icon: "rss" }].map(link =>
      <a key={link.name} href={link.href} aria-label={link.name} target="_blank" rel={link.name === "mastodon" ? "me" : "noopener"}><Icon iconName={link.icon} className={iconClass} /></a>)}
  </div>;
}
