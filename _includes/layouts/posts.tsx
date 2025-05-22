export const layout = "layouts/main.tsx";

export default ({ title, children, github, author, date, tags, categories, comp }: Lume.Data, { date: helperDate }: Lume.Helpers) => (
  <>
    <div className="flex flex-col gap-4 lg:gap-2">
      <h1 className="mt-4 text-6xl dark:text-slate-400">{title}</h1>
      <div className="flex flex-row gap-4">
        <comp.metadata className="text-3xl" dataList={categories} icon={<comp.icon className="w-8 h-8 lg:w-4 lg:h-4 mr-3" iconName="category" />} />
        <comp.metadata className="text-3xl" dataList={tags.filter((tag) => tag != 'post')} icon={<comp.icon className="w-8 h-8 lg:w-4 lg:h-4 mr-3" iconName="tag" />}></comp.metadata>
      </div>
      <div className="flex gap-3 text-2xl lg:text-sm">
        <div>
          By <a href={github} className="text-blue-600 dark:text-blue-400">{author}</a>
        </div>
        <div>
          Posted <span>{helperDate(date, 'MM/dd/yyyy')}</span>
        </div>
      </div>
      <div className="border-b border-solid border-slate-700"></div>
      <div id="post-content" className="dark:bg-zinc-900 overflow-auto">
        {children}
      </div>
    </div>
  </>
);