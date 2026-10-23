import { formatDate } from "../helpers/dates.ts";
import { MainLayout } from "./MainLayout.tsx";

import type { PostData } from "../types.ts";
import { Metadata } from "../components/Metadata.tsx";
import { Icon } from "../components/Icon.tsx";
import { textUrl } from "../helpers/text.ts";

export default function Article({ title, date, content, categories, tags, site, page }: PostData) {
  return (
    <MainLayout title={title} site={site}>
      <article className="flex flex-col gap-4 lg:gap-2">
        <h1 className="mt-4 text-6xl dark:text-slate-400">{title}</h1>
        <div className="flex flex-row gap-4">
          <Metadata className="text-2xl" values={categories} icon={<Icon iconName="category" className="w-8 h-8 lg:w-4 lg:h-4 mr-3" />} />
          <Metadata className="text-2xl" values={tags.filter(tag => tag !== "post")} icon={<Icon iconName="tag" className="w-8 h-8 lg:w-4 lg:h-4 mr-3" />} />
        </div>
        <div className="flex gap-3 text-2xl lg:text-sm"><div>By <a href={site.github} className="text-blue-600 dark:text-blue-400">{site.author}</a></div>
          <div>Posted <time dateTime={new Date(date).toISOString()}>{formatDate(date)}</time></div>
          <a href={encodeURI(textUrl(page.url))} className="text-blue-600 dark:text-blue-400">Text Version</a>
        </div>
        <div className="border-b border-solid border-slate-700" />
        {/* Only the HTML produced from repository-authored Markdown is inserted raw. */}
        <div id="post-content" className="dark:bg-zinc-900 overflow-auto" dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </MainLayout>
  );
}
