import { FontAwesomeIcon } from 'npm:@fortawesome/react-fontawesome';
import { faEnvelope, faSun, faMoon } from 'npm:@fortawesome/free-solid-svg-icons';
import { faGithub, faMastodon, faLinkedin } from 'npm:@fortawesome/free-brands-svg-icons';

export default (data: Lume.Data, helpers: Lume.Helpers) => {
  const emailHref = 'mailto:' + data.email;
  return (
    <div className="mt-auto mx-auto mb-9 flex flex-wrap items-center gap-8 lg:gap-4">
      <button id="toggle-theme" aria-label="Toggle theme">
        <FontAwesomeIcon id="light-mode-icon" icon={faSun} className="w-12 h-12 lg:w-5 lg:h-5 dark:text-slate-400"></FontAwesomeIcon>
        <FontAwesomeIcon id="dark-mode-icon" icon={faMoon} className="hidden w-12 h-12 lg:w-5 lg:h-5 dark:text-slate-400"></FontAwesomeIcon>
      </button>
      <div>|</div>
      <a href={data.github} aria-label="github" target="_blank" rel="noopener">
        <FontAwesomeIcon icon={faGithub} className="w-12 h-12 lg:w-5 lg:h-5 dark:text-slate-400" />
      </a>
      <a href={data.linkedin} aria-label="linkedin" target="_blank" rel="noopener">
        <FontAwesomeIcon icon={faLinkedin} className="w-12 h-12 lg:w-5 lg:h-5 dark:text-slate-400" />
      </a>
      <a href={data.mastodon} aria-label="mastodon" target="_blank" rel="me">
        <FontAwesomeIcon icon={faMastodon} className="w-12 h-12 lg:w-5 lg:h-5 dark:text-slate-400" />
      </a>
      <a href={emailHref} aria-label="email" target="_blank" rel="noopener">
        <FontAwesomeIcon icon={faEnvelope} className="w-12 h-12 lg:w-5 lg:h-5 dark:text-slate-400" />
      </a>
    </div>
  );
};