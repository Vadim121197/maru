'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Button } from './ui/button'

export const ImportProjectForm = () => {
  const { data: session } = useSession()

  const [name, setName] = useState('')

  return (
    <form className='flex w-full flex-col gap-6 bg-card p-4 lg:p-6'>
      <div className='flex flex-col gap-[10px]'>
        <p className='text-sm font-medium lg:text-base'>Project</p>
        <Select defaultValue='light'>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Owner' />
          </SelectTrigger>
          <SelectContent>
            {/* {userProjects.map((pr) => (
              <SelectItem value={pr.id.toString()} key={pr.id}>
                <div className='flex items-center gap-3'>
                  <div className='h-6 w-6 rounded-full bg-[#6D23F8]' />
                  <span>{pr.name}</span>
                </div>
              </SelectItem>
            ))} */}
          </SelectContent>
        </Select>
      </div>
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

      <Button type='submit' className='mt-[34px] w-[196px] self-center'>
        Create
      </Button>
    </form>
  )
}
