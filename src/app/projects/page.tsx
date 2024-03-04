'use client'

import { useState } from 'react'

import { Bird } from 'lucide-react'

import { CustomPagination } from '~/components/custom-pagination'
import { ProjectCard } from '~/components/project-card'
import { usePaginationRequest } from '~/hooks/pagination-request'
import { ApiRoutes } from '~/lib/axios-instance'
import { Nav } from '~/types/nav'
import type { Project } from '~/types/project'

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])

  const { loading, currentPage, totalPages, setCurrentPage } = usePaginationRequest(ApiRoutes.PROJECTS, setProjects)

  if (loading === undefined && !projects.length) return <></>

  if (!loading && !projects.length)
    return (
      <section className='mt-[100px] flex flex-col items-center justify-center px-7 lg:container lg:mt-[150px]'>
        <Bird className='h-20 w-20' strokeWidth={1} />
        <p className='text-xl font-semibold'>No projects</p>
      </section>
    )

  if (loading && !projects.length) return <></>

  return (
    <section className='container grid items-center pt-10 lg:pt-[84px] pb-10'>
      <div className='flex flex-col gap-[60px] lg:gap-10'>
        <div className='flex items-center justify-between'>
          <p className='text-xl font-medium lg:text-2xl lg:font-bold'>All Projects</p>
        </div>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-5'>
          {projects.map((pr) => (
            <ProjectCard key={pr.id} href={`${Nav.PROJECTS}/${pr.id}`} project={pr} />
          ))}
        </div>
        <CustomPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </section>
  )
}

export default ProjectsPage
