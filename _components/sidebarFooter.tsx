export default ({ comp, ...data }: Lume.Data, helpers: Lume.Helpers) => {
  const emailHref = 'mailto:' + data.email;
  return (
    <div className="mt-auto mx-auto mb-12 lg:mb-4 flex flex-wrap items-center gap-6 lg:gap-3">
      <button id="toggle-theme" className="cursor-pointer" aria-label="Toggle theme">
        <comp.icon id="light-mode-icon" iconName="sun" className="w-12 h-12 lg:w-6 lg:h-6 dark:text-slate-400" />
        <comp.icon id="dark-mode-icon" iconName="moon" className="hidden w-12 h-12 lg:w-6 lg:h-6 dark:text-slate-400" />
      </button>
      <div>|</div>
      <a href={data.github} aria-label="github" target="_blank" rel="noopener">
        <comp.icon iconName="brand-github" className="w-12 h-12 lg:w-6 lg:h-6 dark:text-slate-400" />
      </a>
      <a href={data.linkedin} aria-label="linkedin" target="_blank" rel="noopener">
        <comp.icon iconName="brand-linkedin" className="w-12 h-12 lg:w-6 lg:h-6 dark:text-slate-400" />
      </a>
      <a href={data.mastodon} aria-label="mastodon" target="_blank" rel="me">
        <comp.icon iconName="brand-mastodon" className="w-12 h-12 lg:w-6 lg:h-6 dark:text-slate-400" />
      </a>
      <a href={emailHref} aria-label="email" target="_blank" rel="noopener">
        <comp.icon iconName="mail" className="w-12 h-12 lg:w-6 lg:h-6 dark:text-slate-400" />
      </a>
      <a href="/posts.rss" aria-label="rss" target="_blank" rel="noopener">
        <comp.icon iconName="rss" className="w-12 h-12 lg:w-6 lg:h-6 dark:text-slate-400" />
      </a>
    </div>
  );
};