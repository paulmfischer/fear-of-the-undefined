import type { PostEntry, SiteData } from "./_eleventy/types.ts";
import { MainLayout } from "./_eleventy/layouts/MainLayout.tsx";
import { Metadata } from "./_eleventy/components/Metadata.tsx";
import { Icon } from "./_eleventy/components/Icon.tsx";
import { formatDate } from "./_eleventy/helpers/dates.ts";

export const data = { permalink: "/index.html" };

export default function Home({ collections, site }: { collections: { posts: PostEntry[] }; site: SiteData }) {
  return <MainLayout title={site.siteTitle} site={site}><ul className="pl-0 mr-12">
    {collections.posts.map(post => <li key={post.url} className="list-none pb-5 mb-8 lg:mb-5 border-b border-solid border-slate-700" data-pagefind-ignore>
      <a className="py-5 text-blue-600 dark:text-blue-400" href={encodeURI(post.url)}>{post.data.title}</a>
      {post.data.description && <div className="my-6 text-3xl lg:my-2 lg:text-sm italic">{post.data.description}</div>}
      <div className="flex flex-col gap-3 text-2xl lg:flex-row italic lg:text-sm mt-3">
        <div className="flex items-center mr-5"><Icon iconName="calendar-event" className="w-8 h-8 lg:w-4 lg:h-4 mr-3" />{formatDate(post.date)}</div>
        <Metadata values={post.data.categories} icon={<Icon iconName="category" className="w-8 h-8 lg:w-4 lg:h-4 mr-3" />} />
        <Metadata values={post.data.tags.filter(tag => tag !== "post")} icon={<Icon iconName="tag" className="w-8 h-8 lg:w-4 lg:h-4 mr-3" />} />
      </div>
    </li>)}
  </ul></MainLayout>;
}
