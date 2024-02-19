'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Nav } from '~/types/nav'
import { ProjectInfoCard } from '~/components/project-info-card'
import ProjectProvider from './ProjectProvider'

const Layout = ({ children, params }: { children: React.ReactNode; params: { id: string } }) => {
  const navigate = useRouter()
  const pathname = usePathname()

  const tabValue = useMemo(() => {
    const splittedPathname = pathname.split('/')
    return splittedPathname.length === 3 ? 'expression' : splittedPathname[splittedPathname.length - 1]
  }, [pathname])

  return (
    <ProjectProvider>
      <section className='container grid items-center md:pt-[84px]'>
        <div className='flex flex-col md:gap-6'>
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
                value='proofs'
                onClick={() => {
                  navigate.push(`${Nav.PROJECTS}/${params.id}/proofs`)
                }}
              >
                Proofs
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
