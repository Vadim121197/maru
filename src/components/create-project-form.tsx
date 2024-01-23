'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { AxiosRoutes } from '~/lib/axios-instance'
import useAxiosAuth from '~/hooks/axios-auth'
import { useSession } from 'next-auth/react'
import { Nav } from '~/types/nav'
import { Button } from './ui/button'
import { Input } from './ui/input'

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
            await axiosAuth.post(AxiosRoutes.PROJECTS, {
              name: name,
            })
            navigate.push(Nav.PROJECTS)
          } catch {}
        })()
      }}
    >
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='flex flex-col gap-[10px]'>
          <p className='text-sm font-medium lg:text-base'>Owner</p>
          <div className='flex h-11 w-full items-center gap-3 border-2 border-border bg-background px-4 text-base font-medium text-muted'>
            {session?.user.avatar_url && (
              <div>
                <Image src={session.user.avatar_url} width={24} height={24} className='rounded-full' alt='avatar' />
              </div>
            )}
            <span>{session?.user.username ?? ''}</span>
          </div>
        </div>
        <div className='flex flex-col gap-[10px]'>
          <p className='text-sm font-medium lg:text-base'>Project name</p>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </div>
      </div>
      <Button type='submit' className='mt-[34px] w-full self-center lg:w-[196px]' disabled={!session}>
        Create
      </Button>
    </form>
  )
}
