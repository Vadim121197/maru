'use client'

import { useMemo } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

export enum UserTabs {
  PROFILE = 'profile',
  SETINGS = 'settings',
  LIMITS = 'limits',
}

interface UserTab {
  value: UserTabs
  href: string
}

export const tabs: UserTab[] = [
  {
    value: UserTabs.PROFILE,
    href: '/profile',
  },
  {
    value: UserTabs.SETINGS,
    href: '/settings',
  },
  {
    value: UserTabs.LIMITS,
    href: '/limits',
  },
]

export const UsersTabs = () => {
  const navigate = useRouter()
  const pathname = usePathname()

  const tabValue = useMemo(() => {
    const splittedPathname = pathname.split('/')
    return splittedPathname[splittedPathname.length - 1]
  }, [pathname])

  return (
    <>
      <Tabs value={tabValue} className='hidden lg:block'>
        <TabsList className='w-full'>
          {tabs.map((t) => {
            return (
              <TabsTrigger
                key={t.href}
                value={t.value}
                onClick={() => {
                  navigate.push(t.href)
                }}
                className='capitalize'
                style={{
                  width: 100 / tabs.length + '%',
                }}
              >
                {t.value}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
      <div className='flex items-center justify-between border-b-DEFAULT border-primary py-3 lg:hidden'>
        <ChevronLeft
          strokeWidth={1}
          className='size-6'
          onClick={() => {
            const index = tabs.findIndex((t) => t.value === tabValue)
            if (index < 1) return
            navigate.push(`${tabs[index - 1]?.href}`)
          }}
        />
        <p className='text-sm font-bold capitalize'>{tabValue}</p>
        <ChevronRight
          strokeWidth={1}
          className='size-6'
          onClick={() => {
            const index = tabs.findIndex((t) => t.value === tabValue)
            if (index === tabs.length - 1) return
            navigate.push(`${tabs[index + 1]?.href}`)
          }}
        />
      </div>
    </>
  )
}
