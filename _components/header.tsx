export default ({ comp, ...data }: Lume.Data, helpers: Lume.Helpers) => {
  return <>
    <div className="fixed w-full lg:relative flex flex-col lg:flex-row gap-5 justify-between lg:justify-end min-h-28 lg:min-h-0 p-4 lg:p-2 bg-zinc-300 dark:bg-zinc-700">
      <div className="lg:hidden">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex gap-6 mt-3">
            <button id="display-navigation" className="cursor-pointer dark:text-slate-400">
              <comp.icon iconName="menu-2" className="w-12 h-12" />
            </button>
            <a href="/" className="m-auto">
              <h2 className="text-5xl dark:text-slate-400">{data.siteTitle}</h2>
            </a>
          </div>
        </div>
      </div>
        <div id="search" className="lg:min-w-0"></div>
    </div>
  </>;
}