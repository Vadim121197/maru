'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { siteConfig } from '~/config/site'

export const MainNav = () => {
  const { data } = useSession()
  return (
    <nav className='hidden gap-6 lg:flex'>
      {siteConfig.mainNav.map((item) => {
        if (!data && item.protected) return
        return (
          <Link key={item.href} href={item.href} className='flex text-base font-semibold'>
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
