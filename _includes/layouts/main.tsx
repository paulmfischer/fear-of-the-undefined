import { siteOptions } from "../../consts.ts";

export default ({ title, children, comp }: Lume.Data, helpers: Lume.Helpers) => (
  <>
    {{ __html: "<!DOCTYPE html>" }}
    <html className="dark" lang="en">
      <head>
        <meta charSet="UTF-8"></meta>
        <title>{title ?? siteOptions.title}</title>
        <link rel="stylesheet" href="/styles.css"></link>
        <link rel="alternate" type="application/rss+xml" title={`RSS Feed for ${siteOptions.baseUrl}`} href="/posts.rss" />
      </head>
      <body className="text-5xl lg:text-base text-slate-900 bg-zinc-200 dark:text-slate-300 dark:bg-zinc-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="min-h-screen flex">
            <div id="sidebar" className="max-w-lg hidden lg:flex flex-col fixed inset-0 h-full lg:max-w-64 bg-zinc-200 dark:bg-zinc-800 z-50">
              <div className="ml-8 mr-2">
                <button id="close-sidebar" className="mt-5 mr-7 cursor-pointer float-right lg:hidden">
                  <comp.icon iconName="x" className="w-8 h-8" />
                </button>
                <comp.profile></comp.profile>
                <comp.nav></comp.nav>
              </div>
              <comp.sidebarFooter></comp.sidebarFooter>
            </div>
            <div id="main" className="max-w-full grow flex flex-col lg:pl-56 bg-zinc-100 dark:bg-zinc-900">
              <comp.Header></comp.Header>
              <div id="content" className="ml-10 m-5 mr-12 text-3xl lg:text-lg" data-pagefind-body>
                {children}
              </div>
              <div className="mt-auto">
                <comp.footer></comp.footer>
              </div>
            </div>
          </div>
        </div>
        <script src="/scripts/toggle-sidebar.js"></script>
        <script src="/scripts/toggle-theme.js"></script>
      </body>
    </html>
  </>
);