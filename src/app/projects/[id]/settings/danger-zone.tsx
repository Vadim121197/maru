'use client'

import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import useAxiosAuth from '~/hooks/axios-auth'
import { Button } from '~/components/ui/button'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { Project } from '~/types/project'
import { useProject } from '../ProjectProvider'

export const DangerZone = () => {
  const navigate = useRouter()
  const axiosAuth = useAxiosAuth()
  const { project, setProject } = useProject()((state) => state)

  const deleteProject = () => {
    if (!project) return
    void (async () => {
      try {
        await axiosAuth.delete(ApiRoutes.PROJECTS_PROJECT_ID.replace(PROJECT_ID, project.id.toString()))
        navigate.push('/projects/profile')
      } catch (error) {
        const err = error as AxiosError
        toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
      }
    })()
  }

  const updateProject = () => {
    if (!project) return
    void (async () => {
      try {
        const { data } = await axiosAuth.put<Project>(
          ApiRoutes.PROJECTS_PROJECT_ID.replace(PROJECT_ID, project.id.toString()),
          {
            is_private: !project.is_private,
          },
        )
        setProject(data)
      } catch (error) {
        const err = error as AxiosError
        toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
      }
    })()
  }

  return (
    <div className='flex flex-col gap-6 bg-card p-4 lg:gap-[34px] lg:p-6'>
      <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
        <div className='flex flex-col gap-2 lg:gap-[10px]'>
          <p className='text-sm font-medium lg:text-base'>Change project visibility</p>
          <p className='text-[12px] font-normal leading-[18px] text-muted-foreground lg:text-sm'>
            This project is currently <span className='text-primary'>{project?.is_private ? 'private' : 'public'}</span>
          </p>
        </div>
        <Button className='w-full lg:w-[196px]' onClick={updateProject}>
          Change visibility
        </Button>
      </div>
      <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
        <div className='flex flex-col gap-2 lg:gap-[10px]'>
          <p className='text-sm font-medium lg:text-base'>Delete this project</p>
          <p className='text-[12px] font-normal leading-[18px] text-muted-foreground lg:text-sm'>
            Once you delete a project, there is no going back.
          </p>
        </div>
        <Button className='w-full lg:w-[196px]' variant='outline' onClick={deleteProject}>
          Delete project
        </Button>
      </div>
    </div>
  )
}
