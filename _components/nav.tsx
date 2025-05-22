import { Navigation } from "../models.ts";

const getIcon = (icon: string) => {
  if (icon === 'home') {
    return "home";
  } else if (icon === 'about') {
    return "info-circle";
  }
}

export default ({ comp, ...data }: Lume.Data, helpers: Lume.Helpers) => {
  return (
    <nav id="nav" className="lg:leading-6 relative">
      <ul className="list-none pl-0 flex flex-col gap-10 lg:gap-4">
        {data.navLinks.map((link: Navigation) => (
          <li key={link.text}>
            <a href={link.href} className="flex items-center">
              <comp.icon className="dark:text-slate-400 w-12 h-12 lg:w-6 lg:h-6 mr-4" iconName={getIcon(link.icon)} />
              <span className="text-blue-600 dark:text-blue-400">{link.text}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="test2"></div>
    </nav>
  );
};