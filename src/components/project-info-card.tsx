import Image from 'next/image'
import { useEffect } from 'react'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { Project } from '~/types/project'

export const ProjectInfoCard = ({ id }: { id: string }) => {
  const axiosAuth = useAxiosAuth()

  const { project, setProject } = useProject()((state) => state)

  useEffect(() => {
    if (!id) return

    void (async () => {
      try {
        const { data: project } = await axiosAuth.get<Project>(ApiRoutes.PROJECTS_PROJECT_ID.replace(PROJECT_ID, id))

        setProject(project)
      } catch (error) {}
    })()
  }, [id, axiosAuth, setProject])

  if (!project) return

  return (
    <>
      <div className='flex items-center justify-between'>
        <p className='text-2xl font-bold'>{project.name}</p>
      </div>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-3'>
          {project.user.avatar_url && (
            <Image src={project.user.avatar_url} width={24} height={24} className='rounded-full' alt='avatar' />
          )}
          <p className='text-sm font-medium lg:text-base'>{project.user.username}</p>
        </div>

        <div className='flex flex-col gap-2'>
          <p className='text-lg font-medium'>Tags</p>
          {project.tags.map((tag) => (
            <div
              key={tag.id}
              className='border-2 border-border bg-background px-[26px] py-[5px] text-[12px] font-normal leading-[18px] text-muted-foreground'
            >
              {tag.name}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
