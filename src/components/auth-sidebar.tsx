'use client'

import { PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { cn } from '~/lib/utils'
import { Nav, type NavItem } from '~/types/nav'

import { QuoteAccordion } from './quote-accordion'
import { buttonVariants } from './ui/button'
import { UserCard } from './user-card'

export const AuthSidebar = ({ nav, className }: { nav: NavItem[]; className: string }) => {
  const { data } = useSession()

  if (!data) return

  return (
    <div className={cn('flex w-full flex-col gap-4}', className)}>
      <p className='mb-2 text-base font-semibold lg:text-lg lg:font-medium'>Account</p>
      <UserCard />
      <div className='mt-2 flex flex-col gap-4'>
        {nav.map((i) => (
          <Link href={i.href} key={i.href} className='flex items-center gap-2'>
            <div>{i.icon}</div>
            <p className='text-[12px] font-normal leading-[18px] lg:text-sm'>{i.title}</p>
          </Link>
        ))}
        <QuoteAccordion />
      </div>
      <Link
        href={Nav.PROJECT_CREATE}
        className={cn('w-full gap-[10px] mt-6 lg:mt-[30px] text-primary', buttonVariants())}
      >
        <PlusIcon className='size-4 ' />
        <span>New Project</span>
      </Link>
    </div>
  )
}
