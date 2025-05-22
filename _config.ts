import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import icons from "lume/plugins/icons.ts";
import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import jsx from "lume/plugins/jsx.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import sitemap from "lume/plugins/sitemap.ts";
import date from "lume/plugins/date.ts";
import pagefind from "lume/plugins/pagefind.ts";
import readInfo from "lume/plugins/reading_info.ts";
import inline from "lume/plugins/inline.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import lightningCss from "lume/plugins/lightningcss.ts";
import purgecss from "lume/plugins/purgecss.ts";

import lang_csharp from "npm:highlight.js/lib/languages/csharp";

import { siteOptions } from "./consts.ts";

const site = lume({
  location: new URL(siteOptions.baseUrl),
});

site.ignore('README.md');
site.copy("assets");
site.copy("scripts");
site.copy("PaulFischerResume.pdf");

site.data("navLinks", [{
  href: '/',
  text: 'Home',
  icon: 'home',
}, {
  href: '/about-me',
  text: 'About Me',
  icon: 'about',
}]);

site.use(feed({
  output: ["/posts.rss", "/posts.json"],
  query: "post",
  limit: 10,
  info: {
    title: siteOptions.title,
    description: siteOptions.description,
    authorName: siteOptions.author,
    authorUrl: siteOptions.baseUrl,
  },
  items: {
    title: "=title",
    description: "$#post-content > div > p:first-child",
    authorName: siteOptions.author,
  },
}));
site.use(sitemap());

site.use(icons());
site.use(favicon({
  input: "/assets/img/avatar-150x150.png",
}));
site.use(date());
site.use(readInfo());
site.use(pagefind({
  ui: {
    resetStyles: true,
  }
}));

site.use(code_highlight({
  languages: {
    csharp: lang_csharp,
  },
}));
site.use(jsx());
site.use(inline());
site.use(tailwindcss());
site.use(lightningCss());
site.add("styles.css");
site.use(purgecss());
site.use(minifyHTML());

export default site;
