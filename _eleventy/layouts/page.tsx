import type { PageData } from "../types.ts";
import { MainLayout } from "./MainLayout.tsx";

export default function Page({ title, content, site }: PageData) {
  return <MainLayout title={title} site={site}><div dangerouslySetInnerHTML={{ __html: content }} /></MainLayout>;
}
