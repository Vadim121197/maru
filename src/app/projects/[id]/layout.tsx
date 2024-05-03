'use client'

import { ProjectInfoCard } from './project-info-card'
import ProjectProvider from './project-provider'
import { ProjectsTabs } from './projects-tabs'

const Layout = ({ children, params }: { children: React.ReactNode; params: { id: string } }) => {
  return (
    <ProjectProvider>
      <section className='container mb-10 grid items-center pt-10 md:pt-[84px]'>
        <div className='mb-10 flex flex-col gap-10'>
          <ProjectInfoCard id={params.id} />
          <ProjectsTabs projectId={params.id} />
          {children}
        </div>
      </section>
    </ProjectProvider>
  )
}

export default Layout
