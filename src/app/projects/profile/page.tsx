'use client'

import { useEffect, useState } from 'react'

import axios from 'axios'
import { Bird, PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { CustomPagination } from '~/components/custom-pagination'
import { NotAuth } from '~/components/not-auth'
import { ProjectCard } from '~/components/project-card'
import { buttonVariants } from '~/components/ui/button'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { cn } from '~/lib/utils'
import { Nav } from '~/types/nav'
import type { PaginationGeneric } from '~/types/pagination'
import type { Project } from '~/types/project'

const ProjectsPage = () => {
  const axiosAuth = useAxiosAuth()
  const { data: session } = useSession()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean | undefined>()

  useEffect(() => {
    if (!session) return

    const source = axios.CancelToken.source()

    setLoading(true)
    void (async () => {
      try {
        const {
          data: { data, page_number, total_pages },
        } = await axiosAuth.get<PaginationGeneric<Project[]>>(
          ApiRoutes.USERS_ME_PROJECTS + `?page_size=10&page_number=${currentPage}`,
          {
            cancelToken: source.token,
          },
        )

        setCurrentPage(page_number)
        setTotalPages(total_pages)

        setProjects(data)
        setLoading(false)
      } catch {
        setLoading(false)
      }
    })()

    return () => {
      // Cancel the request when the component unmounts
      source.cancel()
    }
  }, [axiosAuth, session, currentPage])

  if (!session) return <NotAuth />

  if ((loading === undefined || loading) && !projects.length) return <></>

  return (
    <section className='container grid items-center py-10 lg:pt-[84px]'>
      <div className='flex flex-col gap-[60px] lg:gap-10'>
        <div className='flex items-center justify-between'>
          <p className='text-xl font-medium lg:text-2xl lg:font-bold'>My Projects</p>
          <Link href={Nav.PROJECT_CREATE} className={cn('w-[152px] lg:w-[196px] gap-[10px]', buttonVariants())}>
            <PlusIcon className='size-4 text-white' />
            <span>New Project</span>
          </Link>
        </div>
        {!projects.length ? (
          <div className='mt-[100px] flex flex-col items-center justify-center px-7 lg:container lg:mt-[150px]'>
            <Bird className='size-20' strokeWidth={1} />
            <p className='text-xl font-semibold'>No projects</p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-5'>
              {projects.map((pr) => (
                <ProjectCard key={pr.id} href={`${Nav.PROJECTS}/${pr.id}`} project={pr} />
              ))}
            </div>
            <CustomPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
          </>
        )}
      </div>
    </section>
  )
}

export default ProjectsPage
