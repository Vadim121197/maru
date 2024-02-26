import { ProjectCard } from '~/components/project-card'
import { ApiRoutes, axiosInstance } from '~/lib/axios-instance'
import { Nav } from '~/types/nav'
import type { PaginationGeneric } from '~/types/pagination'
import type { Project } from '~/types/project'

const ProjectsPage = async () => {
  let projects: Project[] = []
  try {
    const {
      data: { data },
    } = await axiosInstance.get<PaginationGeneric<Project[]>>(ApiRoutes.PROJECTS + '?page_size=1000')

    projects = data
  } catch (error) {}

  return (
    <section className='container grid items-center pt-10 lg:pt-[84px]'>
      <div className='flex flex-col gap-[60px] lg:gap-10'>
        <div className='flex items-center justify-between'>
          <p className='text-xl font-medium lg:text-2xl lg:font-bold'>All Projects</p>
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
