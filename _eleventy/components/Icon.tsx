interface IconProps { iconName: string; className?: string; id?: string }

// Preserve icon placement and theme hooks; SVG assets are restored in phase 4.
export function Icon({ iconName, className, id }: IconProps) {
  return <span id={id} className={className} data-icon={iconName} aria-hidden="true" />;
}
