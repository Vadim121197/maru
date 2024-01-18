'use client'

import { PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ProjectCard } from '~/components/project-card'
import { buttonVariants } from '~/components/ui/button'
import useAxiosAuth from '~/hooks/axios-auth'
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
        const { data } = await axiosAuth.get<Project[]>('/users/me/projects')

        setProjects(data)
      } catch {}
    })()
  }, [axiosAuth, session])

  return (
    <section className='container grid items-center md:pt-[84px]'>
      <div className='flex flex-col md:gap-10'>
        <div className='flex justify-between'>
          <p className='text-lg font-bold md:text-2xl'>My Projects</p>
          <Link href={Nav.PROJECT_CREATE} className={cn('md:w-[196px] gap-[10px]', buttonVariants())}>
            <PlusIcon className='h-4 w-4 text-white' />
            <span>New Project</span>
          </Link>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          {projects.map((pr) => (
            <ProjectCard key={pr.id} href={`${Nav.PROJECTS}/${pr.id}`} project={pr} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsPage
