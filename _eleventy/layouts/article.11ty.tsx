import { siteOptions } from "../../consts.ts";
import { formatDate } from "../helpers/dates.ts";
import { MainLayout } from "./MainLayout.tsx";

interface ArticleData {
  title: string;
  date: Date | string;
  content: string;
}

export default function Article({ title, date, content }: ArticleData) {
  return (
    <MainLayout title={title}>
      <article>
        <h1>{title}</h1>
        <p>By {siteOptions.author} · Posted <time dateTime={new Date(date).toISOString()}>{formatDate(date)}</time></p>
        {/* Only the HTML produced from repository-authored Markdown is inserted raw. */}
        <div id="post-content" dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </MainLayout>
  );
}
