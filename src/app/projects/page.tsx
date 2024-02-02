'use client'

import { PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { NotAuth } from '~/components/not-auth'
import { ProjectCard } from '~/components/project-card'
import { buttonVariants } from '~/components/ui/button'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { cn } from '~/lib/utils'
import { Nav } from '~/types/nav'
import type { Project } from '~/types/project'

const ProjectsPage = () => {
  const axiosAuth = useAxiosAuth()
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    if (!session) return

    void (async () => {
      try {
        const { data } = await axiosAuth.get<Project[]>(ApiRoutes.USERS_ME_ROJECTS)

        setProjects(data)
      } catch {}
    })()
  }, [axiosAuth, session])

  if (!session) return <NotAuth />

  return (
    <section className='container grid items-center pt-10 lg:pt-[84px]'>
      <div className='flex flex-col gap-[60px] lg:gap-10'>
        <div className='flex items-center justify-between'>
          <p className='text-xl font-medium lg:text-2xl lg:font-bold'>My Projects</p>
          <Link href={Nav.PROJECT_CREATE} className={cn('w-[152px] lg:w-[196px] gap-[10px]', buttonVariants())}>
            <PlusIcon className='h-4 w-4 text-white' />
            <span>New Project</span>
          </Link>
        </div>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-5'>
          {projects.map((pr) => (
            <ProjectCard key={pr.id} href={`${Nav.PROJECTS}/${pr.id}`} project={pr} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsPage
