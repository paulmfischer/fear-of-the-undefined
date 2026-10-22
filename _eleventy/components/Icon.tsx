import { IconHome, IconInfoCircle, IconX, IconMenu2, IconSun, IconMoon, IconBrandGithub, IconBrandLinkedin, IconBrandMastodon, IconRss, IconCopyright, IconCategory, IconTag, IconCalendarEvent } from "@tabler/icons-react";

interface IconProps { iconName: string; className?: string; id?: string }
const icons = {
  home: IconHome, "info-circle": IconInfoCircle, x: IconX, "menu-2": IconMenu2,
  sun: IconSun, moon: IconMoon, "brand-github": IconBrandGithub,
  "brand-linkedin": IconBrandLinkedin, "brand-mastodon": IconBrandMastodon,
  rss: IconRss, copyright: IconCopyright, category: IconCategory, tag: IconTag,
  "calendar-event": IconCalendarEvent,
};

export function Icon({ iconName, className, id }: IconProps) {
  const Svg = icons[iconName as keyof typeof icons];
  if (!Svg) throw new Error(`Unknown icon: ${iconName}`);
  return <Svg id={id} className={className} aria-hidden="true" stroke={2} />;
}
