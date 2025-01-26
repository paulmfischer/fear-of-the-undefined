import { FontAwesomeIcon } from 'npm:@fortawesome/react-fontawesome';
import { faHouse, faCircleInfo } from 'npm:@fortawesome/free-solid-svg-icons';
import { Navigation } from "../models.ts";

const getIcon = (icon: string) => {
  if (icon === 'home') {
    return <FontAwesomeIcon icon={faHouse} />;
  } else if (icon === 'about') {
    return <FontAwesomeIcon icon={faCircleInfo} />;
  }
}

export default (data: Lume.Data, helpers: Lume.Helpers) => {
  return (
    <nav id="nav" className="lg:text-sm lg:leading-6 relative">
      <ul className="list-none pl-0">
        {data.navLinks.map((link: Navigation) => (
          <li key={link.text} className="my-7 lg:my-4">
            <a href={link.href} className="text-blue-600 dark:text-blue-400 flex items-center">
              <div className="dark:text-slate-400 w-8 h-8 lg:w-4 lg:h-4 mr-4">{getIcon(link.icon)}</div>
              <span className="text-3xl lg:text-lg">{link.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};