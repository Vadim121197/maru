'use client'

import { useEffect, useState } from 'react'

import { TextLabel } from '~/components/form-components'
import { InputBlock } from '~/components/input-block'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { Project } from '~/types/project'

import { useProject } from '../ProjectProvider'

export const UpdateProject = () => {
  const axiosAuth = useAxiosAuth()
  const { project, setProject } = useProject()((state) => state)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!project) return
    setName(project.name ?? '')
    setDescription(project.description ?? '')
  }, [project])

  return (
    <form
      className='flex flex-col gap-4 bg-card p-4 lg:p-6'
      onSubmit={(e) => {
        e.preventDefault()
        if (!project) return
        void (async () => {
          const { data } = await axiosAuth.put<Project>(
            ApiRoutes.PROJECTS_PROJECT_ID.replace(PROJECT_ID, project.id.toString()),
            {
              name,
              description,
              block_range: project.block_range,
            },
          )
          setProject(data)
        })()
      }}
    >
      <InputBlock
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
        label='Project Name'
      />

      <div className='flex flex-col gap-2'>
        <TextLabel label='Descriptions' />
        <Textarea
          className='min-h-[180px] p-4 text-base font-medium text-muted'
          placeholder='Enter Description to your Project'
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        />
      </div>
      <Button type='submit' className='w-full' disabled={!name}>
        Save
      </Button>
    </form>
  )
}
