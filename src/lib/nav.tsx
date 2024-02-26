import { AlignLeft, LayoutGrid, SlidersHorizontal, UserRound } from 'lucide-react'
import type { NavItem } from '~/types/nav'

export const mainNav: NavItem[] = [
  {
    title: 'Discover',
    href: '/',
    icon: <LayoutGrid strokeWidth={1} className='h-6 w-6' />,
    protected: false,
  },
  {
    title: 'My Projects',
    href: '/projects/profile',
    icon: <AlignLeft strokeWidth={1} className='h-6 w-6' />,
    protected: true,
  },
]

export const secondaryNav: NavItem[] = [
  {
    title: 'Profile',
    href: '/profile',
    icon: <UserRound strokeWidth='1' className='h-6 w-6' />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <SlidersHorizontal strokeWidth='1' className='h-6 w-6' />,
  },
]
