'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import type { ProjectCreateResponse } from '~/types/project'
import { ApiRoutes } from '~/lib/axios-instance'
import { Nav } from '~/types/nav'
import { InputComponent } from './form-components'
import { OwnerInput } from './owner-input'
import { Button } from './ui/button'

export const CreateProjectForm = () => {
  const navigate = useRouter()
  const axiosAuth = useAxiosAuth()
  const { data: session } = useSession()

  const [name, setName] = useState('')

  return (
    <form
      className='flex w-full flex-col gap-6 bg-card p-4 lg:p-6'
      onSubmit={(e) => {
        e.preventDefault()
        void (async () => {
          try {
            const { data } = await axiosAuth.post<ProjectCreateResponse>(ApiRoutes.PROJECTS, {
              name: name,
            })

            navigate.push(`${Nav.PROJECTS}/${data.id}`)
          } catch {}
        })()
      }}
    >
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <OwnerInput />
        <InputComponent
          value={name}
          label='Project name'
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>
      <Button type='submit' className='mt-[34px] w-full self-center lg:w-[196px]' disabled={!session}>
        Create
      </Button>
    </form>
  )
}
