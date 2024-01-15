import { mainNav, secondaryNav } from '~/lib/nav'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Maru Lake',
  mainNav: mainNav,
  secondaryNav: secondaryNav,
}
