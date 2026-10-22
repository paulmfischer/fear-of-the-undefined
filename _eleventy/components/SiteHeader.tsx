import { siteOptions } from "../../consts.ts";

export function SiteHeader() {
  return <header><a href="/">{siteOptions.title}</a></header>;
}
