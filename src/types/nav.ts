import type { ReactElement } from 'react'

export enum Nav {
  HOME = '/',
  PROJECTS = '/projects',
  PROJECT_CREATE = '/projects/create',
}
export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon: ReactElement
}
