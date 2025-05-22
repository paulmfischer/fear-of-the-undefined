export default ({ comp, github, author }: Lume.Data, helpers: Lume.Helpers) => {
  return <>
    <footer className="flex mt-3 m-5 pt-3 border-t border-slate-700 dark:text-slate-400 text-3xl lg:text-sm">
      <div className="flex gap-2 items-center ml-3">
        <comp.icon iconName="copyright" className="w-6 h-6 lg:w-4 lg:h-4" />
        2025
        <a href={github} className="text-blue-600 dark:text-blue-400">{author}</a>
        <span>|</span>
        Built using<a href="https://lume.land/" className="text-blue-600 dark:text-blue-400">Lume</a>
      </div>
    </footer>
  </>
};