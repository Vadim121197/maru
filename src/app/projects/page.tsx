import axios from 'axios'
import { PlusIcon } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '~/auth'
import { ProjectCard } from '~/components/project-card'
import { buttonVariants } from '~/components/ui/button'
import { AxiosRoutes, BASE_URL } from '~/lib/axios-interceptor-instance'
import { cn } from '~/lib/utils'
import { Nav } from '~/types/nav'
import type { Project } from '~/types/project'

const ProjectsPage = async () => {
  try {
    const session = await getServerSession(authOptions)

    console.log(session)

    let projects: Project[] = []
    if (session) {
      const { data } = await axios.get<Project[]>(`${BASE_URL}${AxiosRoutes.PROJECTS}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      projects = data
    }

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
  } catch (error) {}
}

export default ProjectsPage
