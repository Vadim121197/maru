import { mainNav, secondaryNav } from '~/lib/nav'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Maru Portal',
  mainNav: mainNav,
  secondaryNav: secondaryNav,
}
