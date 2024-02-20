'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Nav } from '~/types/nav'
import ProjectProvider from './ProjectProvider'
import { ProjectInfoCard } from './project-info-card'

enum Tab {
  EXPRESSION = 'expression',
  TASKS = 'tasks',
  PROOFS = 'proofs',
  DEPLOYMENTS = 'deployments',
  SETINGS = 'settings',
}

const tabs = [
  {
    value: Tab.EXPRESSION,
    href: '/',
  },
  {
    value: Tab.TASKS,
    href: '/tasks',
  },
  {
    value: Tab.PROOFS,
    href: '/proofs',
  },
  {
    value: Tab.DEPLOYMENTS,
    href: '/deployments',
  },
  {
    value: Tab.SETINGS,
    href: '/settings',
  },
]

const Layout = ({ children, params }: { children: React.ReactNode; params: { id: string } }) => {
  const navigate = useRouter()
  const pathname = usePathname()

  const tabValue = useMemo(() => {
    const splittedPathname = pathname.split('/')
    return splittedPathname.length === 3 ? Tab.EXPRESSION : splittedPathname[splittedPathname.length - 1]
  }, [pathname])

  return (
    <ProjectProvider>
      <section className='container grid items-center pt-10 md:pt-[84px]'>
        <div className='flex flex-col gap-10'>
          <ProjectInfoCard id={params.id} />
          <Tabs value={tabValue}>
            <TabsList className='mb-10 w-full'>
              {tabs.map((t) => {
                return (
                  <TabsTrigger
                    key={t.href}
                    value={t.value}
                    onClick={() => {
                      navigate.push(`${Nav.PROJECTS}/${params.id}${t.href}`)
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
            {children}
          </Tabs>
        </div>
      </section>
    </ProjectProvider>
  )
}

export default Layout
