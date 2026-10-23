export interface SiteData {
  siteTitle: string;
  siteDescription: string;
  author: string;
  github: string;
  email: string;
  mastodon: string;
  linkedin: string;
}

export interface PageData {
  title: string;
  content: string;
  site: SiteData;
}

export interface PostData extends PageData {
  page: { url: string };
  date: Date | string;
  categories?: string[];
  tags: string[];
  description?: string;
  readingMinutes: number;
}

export interface PostEntry {
  url: string;
  date: Date;
  data: PostData;
}
