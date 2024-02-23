import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect } from 'react'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import { BackButton } from '~/components/back-button'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { Project } from '~/types/project'

export const ProjectInfoCard = ({ id }: { id: string }) => {
  const axiosAuth = useAxiosAuth()
  const { data: session } = useSession()

  const { project, setProject, setProjectOwnership } = useProject()((state) => state)

  useEffect(() => {
    if (!id) return

    void (async () => {
      try {
        const { data: project } = await axiosAuth.get<Project>(ApiRoutes.PROJECTS_PROJECT_ID.replace(PROJECT_ID, id))

        setProjectOwnership(session?.user.id === project.user.id)
        setProject(project)
      } catch (error) {}
    })()
  }, [id, axiosAuth, setProject, session, setProjectOwnership])

  if (!project) return

  return (
    <div className='flex flex-col gap-6'>
      <BackButton href='/projects' />
      <div className='mt-[14px] flex items-center justify-between lg:mt-[26px]'>
        <p className='text-xl font-medium lg:text-2xl lg:font-bold'>{project.name}</p>
      </div>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-3'>
          {project.user.avatar_url && (
            <Image src={project.user.avatar_url} width={24} height={24} className='rounded-full' alt='avatar' />
          )}
          <p className='text-base font-semibold lg:text-lg lg:font-medium'>{project.user.username}</p>
        </div>

        {project.description && (
          <div className='flex flex-col gap-2'>
            <p className='text-base font-semibold lg:text-lg lg:font-medium'>Description</p>
            <p className='break-all text-base font-semibold text-muted-foreground lg:text-lg lg:font-medium'>
              {project.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
