import { siteOptions } from "../consts.ts";

export default ({ id, iconName, className, variant, ...data }: Lume.Data, { icon }: Lume.Helpers) => {
  return <img id={id} className={className} src={icon(iconName, siteOptions.iconPack, variant ?? siteOptions.iconVariant)} inline />
};