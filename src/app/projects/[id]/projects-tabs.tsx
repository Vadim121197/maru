import { useMemo } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Nav } from '~/types/nav'

import { useProject } from './project-provider'

export enum ProjectTabs {
  EXPRESSION = 'expression',
  TASKS = 'tasks',
  PROOFS = 'proofs',
  DEPLOYMENTS = 'deployments',
  SETINGS = 'settings',
  SUMMARY = 'summary',
}

interface ProjectTab {
  value: ProjectTabs
  href: string
  isPrivate: boolean
}

export const tabs: ProjectTab[] = [
  {
    value: ProjectTabs.EXPRESSION,
    href: '/',
    isPrivate: false,
  },
  {
    value: ProjectTabs.SUMMARY,
    href: '/summary',
    isPrivate: false,
  },
  {
    value: ProjectTabs.TASKS,
    href: '/tasks',
    isPrivate: false,
  },
  {
    value: ProjectTabs.PROOFS,
    href: '/proofs',
    isPrivate: false,
  },
  {
    value: ProjectTabs.SETINGS,
    href: '/settings',
    isPrivate: true,
  },
]

export const ProjectsTabs = ({ projectId }: { projectId: string }) => {
  const { isUserProject } = useProject()((state) => state)
  const navigate = useRouter()
  const pathname = usePathname()

  const tabValue = useMemo(() => {
    const splittedPathname = pathname.split('/')
    return splittedPathname.length === 3 ? ProjectTabs.EXPRESSION : splittedPathname[splittedPathname.length - 1]
  }, [pathname])

  const filteredTabs = useMemo(() => {
    return isUserProject ? tabs : tabs.filter((t) => !t.isPrivate)
  }, [isUserProject])

  return (
    <>
      <Tabs value={tabValue} className='hidden lg:block'>
        <TabsList className='w-full'>
          {filteredTabs.map((t) => {
            return (
              <TabsTrigger
                key={t.href}
                value={t.value}
                onClick={() => {
                  navigate.push(`${Nav.PROJECTS}/${projectId}${t.href}`)
                }}
                className='capitalize'
                style={{
                  width: 100 / filteredTabs.length + '%',
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
            const index = filteredTabs.findIndex((t) => t.value === tabValue)
            if (index < 1) return
            navigate.push(`${Nav.PROJECTS}/${projectId}${filteredTabs[index - 1]?.href}`)
          }}
        />
        <p className='text-sm font-bold capitalize'>{tabValue}</p>
        <ChevronRight
          strokeWidth={1}
          className='size-6'
          onClick={() => {
            const index = filteredTabs.findIndex((t) => t.value === tabValue)
            if (index === filteredTabs.length - 1) return
            navigate.push(`${Nav.PROJECTS}/${projectId}${filteredTabs[index + 1]?.href}`)
          }}
        />
      </div>
    </>
  )
}
