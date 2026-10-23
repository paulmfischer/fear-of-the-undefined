import type { SiteData } from "../types.ts";

export function Profile({ site }: { site: SiteData }) {
  return <div className="profile-wrapper flex flex-col gap-4">
    <div id="avatar" className="mt-12 size-24"><a href="/"><img src="/assets/img/avatar-150x150.png" alt="avatar" className="size-24 rounded-full border-2 border-slate-800 dark:border-slate-300" /></a></div>
    <h2 className="text-xl dark:text-slate-400" id="siteTitle">{site.siteTitle}</h2>
    <div className="text-base italic" id="siteDescription">{site.siteDescription}</div>
  </div>;
}
