import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Nav } from '~/types/nav'
import { useProject } from './ProjectProvider'

export enum Tab {
  EXPRESSION = 'expression',
  TASKS = 'tasks',
  PROOFS = 'proofs',
  DEPLOYMENTS = 'deployments',
  SETINGS = 'settings',
}

export const tabs = [
  {
    value: Tab.EXPRESSION,
    href: '/',
    isPrivate: false,
  },
  {
    value: Tab.TASKS,
    href: '/tasks',
    isPrivate: false,
  },
  {
    value: Tab.PROOFS,
    href: '/proofs',
    isPrivate: false,
  },
  {
    value: Tab.DEPLOYMENTS,
    href: '/deployments',
    isPrivate: false,
  },
  {
    value: Tab.SETINGS,
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
    return splittedPathname.length === 3 ? Tab.EXPRESSION : splittedPathname[splittedPathname.length - 1]
  }, [pathname])

  const filteredTabs = useMemo(() => {
    return isUserProject ? tabs : tabs.filter((t) => !t.isPrivate)
  }, [isUserProject])

  return (
    <Tabs value={tabValue}>
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
  )
}
