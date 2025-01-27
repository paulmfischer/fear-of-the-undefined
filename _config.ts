import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import jsx from "lume/plugins/jsx.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import sitemap from "lume/plugins/sitemap.ts";
import postcss from "lume/plugins/postcss.ts";
import date from "lume/plugins/date.ts";
import nav from "lume/plugins/nav.ts";
import pagefind from "lume/plugins/pagefind.ts";
import readInfo from "lume/plugins/reading_info.ts";

import lang_csharp from "npm:highlight.js/lib/languages/csharp";
import { siteOptions } from "./consts.ts";

const site = lume({
  location: new URL(siteOptions.baseUrl),
});

site.ignore('README.md');
site.copy("assets");
site.copy("scripts");
site.copy("PaulFischerResume.pdf");
site.copyRemainingFiles();
site.data("navLinks", [{
  href: '/',
  text: 'Home',
  icon: 'home',
}, {
  href: '/about-me',
  text: 'About Me',
  icon: 'about',
}]);

site.use(favicon({
  input: "/assets/img/avatar-150x150.png",
}));
site.use(nav());
site.use(date());
site.use(readInfo());
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

site.use(code_highlight({
  languages: {
      csharp: lang_csharp,
    },
}));
site.use(jsx());
site.use(tailwindcss({
  options: {
    darkMode: 'selector',
  }
}));
site.use(pagefind({
  ui: {
    resetStyles: true,
  }
}));
site.use(postcss());

export default site;
