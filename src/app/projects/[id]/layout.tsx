'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Nav } from '~/types/nav'
import ProjectProvider from './ProjectProvider'
import { ProjectInfoCard } from './project-info-card'

const Layout = ({ children, params }: { children: React.ReactNode; params: { id: string } }) => {
  const navigate = useRouter()
  const pathname = usePathname()

  const tabValue = useMemo(() => {
    const splittedPathname = pathname.split('/')
    return splittedPathname.length === 3 ? 'expression' : splittedPathname[splittedPathname.length - 1]
  }, [pathname])

  return (
    <ProjectProvider>
      <section className='container grid items-center pt-10 md:pt-[84px]'>
        <div className='flex flex-col gap-10'>
          <ProjectInfoCard id={params.id} />
          <Tabs value={tabValue}>
            <TabsList className='mb-10'>
              <TabsTrigger
                value='expression'
                onClick={() => {
                  navigate.push(`${Nav.PROJECTS}/${params.id}`)
                }}
              >
                Expression
              </TabsTrigger>
              <TabsTrigger
                value='tasks'
                onClick={() => {
                  navigate.push(`${Nav.PROJECTS}/${params.id}/tasks`)
                }}
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger
                value='proofs'
                onClick={() => {
                  navigate.push(`${Nav.PROJECTS}/${params.id}/proofs`)
                }}
              >
                Proofs
              </TabsTrigger>
              <TabsTrigger
                value='deployments'
                onClick={() => {
                  navigate.push(`${Nav.PROJECTS}/${params.id}/deployments`)
                }}
              >
                Deployments
              </TabsTrigger>
              <TabsTrigger
                value='settings'
                onClick={() => {
                  navigate.push(`${Nav.PROJECTS}/${params.id}/settings`)
                }}
              >
                Settings
              </TabsTrigger>
            </TabsList>
            {children}
          </Tabs>
        </div>
      </section>
    </ProjectProvider>
  )
}

export default Layout
