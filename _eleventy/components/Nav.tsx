import { Icon } from "./Icon.tsx";

export function Nav() {
  return <nav id="nav" className="lg:leading-6 relative"><ul className="list-none pl-0 flex flex-col gap-10 lg:gap-4">
    {[{ href: "/", text: "Home", icon: "home" }, { href: "/about-me", text: "About Me", icon: "info-circle" }].map(link =>
      <li key={link.href}><a href={link.href} className="flex items-center"><Icon iconName={link.icon} className="dark:text-slate-400 w-12 h-12 lg:w-6 lg:h-6 mr-4" /><span className="text-blue-600 dark:text-blue-400">{link.text}</span></a></li>)}
  </ul></nav>;
}
