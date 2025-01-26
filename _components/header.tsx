import { FontAwesomeIcon } from 'npm:@fortawesome/react-fontawesome';
import { faBars } from 'npm:@fortawesome/free-solid-svg-icons';

export default ({ comp, ...data }: Lume.Data, helpers: Lume.Helpers) => {
  return <>
    <div className="min-h-28 lg:min-h-0 flex flex-col lg:flex-row pl-5 p-2 bg-zinc-300 dark:bg-zinc-700 justify-between lg:justify-end gap-4">
      <div className="lg:hidden flex gap-6 items-center">
        <button id="display-navigation" className="w-10 h-10 lg:w-5 lg:h-5 dark:text-slate-400">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h2 className="text-5xl lg:text-4xl mt-2 dark:text-slate-400">{data.siteTitle}</h2>
      </div>
      <div id="search" className="mb-2 lg:mb-0 lg:mr-10 lg:min-w-0"></div>
    </div>
  </>; 
}