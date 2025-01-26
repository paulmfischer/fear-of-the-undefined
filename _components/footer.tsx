import { FontAwesomeIcon } from 'npm:@fortawesome/react-fontawesome';
import { faCopyright } from 'npm:@fortawesome/free-solid-svg-icons';

export default (data: Lume.Data, helpers: Lume.Helpers) => {
  return <>
    <footer className="flex mx-5 mb-5 pt-3 border-t border-slate-700 text-3xl lg:text-sm">
      <div className="flex gap-2 items-center ml-3">
        <span className="w-6 h-6 lg:w-3 lg:h-3"><FontAwesomeIcon icon={faCopyright} /></span>2025<a href={data.github} className="text-blue-600 dark:text-blue-400">{data.author}</a>
        <span>|</span>
        Built using<a href="https://lume.land/" className="text-blu-600 dark:text-blue-400">Lume</a>
      </div>
    </footer>
  </>
};