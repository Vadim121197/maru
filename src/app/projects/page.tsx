'use client'

import axios from 'axios'
import { PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'
import { ProjectCard } from '~/components/project-card'
import { buttonVariants } from '~/components/ui/button'
import { AxiosRoutes, BASE_URL } from '~/lib/axios-interceptor-instance'
import { cn } from '~/lib/utils'
import { useStore } from '~/state'
import { authSelector } from '~/state/auth'
import { projectsSelector } from '~/state/projects'
import { Nav } from '~/types/nav'
import type { Project } from '~/types/project'

const ProjectsPage = () => {
  const { userProjects, getUserProjects } = useStore(projectsSelector)
  const { isAuthenticated } = useStore(authSelector)

  const { data: session, status } = useSession()


  useEffect(() => {
    if (!session?.user) return

    void (async () => {
      try {
        const { data: projects } = await axios.get<Project[]>(`${BASE_URL}${AxiosRoutes.PROJECTS}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        console.log(projects)
      } catch {}
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user])

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
          {userProjects.map((pr) => (
            <ProjectCard key={pr.id} href={`${Nav.PROJECTS}/${pr.id}`} project={pr} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsPage
