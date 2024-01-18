'use client'

import { Lock, Unlock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AxiosRoutes, axiosInstance } from '~/lib/axios-instance'
import { cn } from '~/lib/utils'
import { useSession } from 'next-auth/react'
import { Nav } from '~/types/nav'
import { SigninButton } from './signin-button'
import { Button, buttonVariants } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export const CreateProjectForm = () => {
  const navigate = useRouter()
  const { data: session } = useSession()
  const [repoName, setRepoName] = useState('')
  const [type, setType] = useState<'public' | 'private'>('public')

  return (
    <form
      className='flex w-full flex-col gap-6 bg-card p-6'
      onSubmit={(e) => {
        e.preventDefault()
        void (async () => {
          try {
            await axiosInstance.post(AxiosRoutes.PROJECTS, {
              repo_url: repoName,
              is_private: type === 'private',
            })
            navigate.push(Nav.PROJECTS)
          } catch (error) {
            /* empty */
          }
        })()
      }}
    >
      <div className='grid grid-cols-2 gap-6'>
        <div className='flex flex-col gap-[10px]'>
          <p className='text-base font-medium'>Owner</p>
          <Select defaultValue='light'>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Owner' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='light'>
                <div className='flex items-center gap-3'>
                  <div className='h-6 w-6 rounded-full bg-[#6D23F8]' />
                  <span>{session?.user.username}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-[10px]'>
          <p className='text-base font-medium'>Repository name</p>
          <Input
            value={repoName}
            onChange={(e) => {
              setRepoName(e.target.value)
            }}
          />
        </div>
      </div>
      <div className='mt-4 flex flex-col gap-4'>
        <p className='text-base font-medium'>Visibility</p>
        <RadioGroup
          value={type}
          defaultValue={type}
          onValueChange={(e) => {
            setType(e as 'public' | 'private')
          }}
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='public' id='public' />
            <Label htmlFor='public' className='flex items-center gap-2'>
              <Unlock strokeWidth='1' className='h-6 w-6 text-muted-foreground' />
              <div className='flex flex-col  gap-[2px]'>
                <p className='text-[12px] font-normal leading-[18px]'>Public</p>
                <p className='text-[12px] font-normal leading-[18px] text-muted-foreground'>
                  Anyone can view this project. You choose who can run it
                </p>
              </div>
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='private' id='private' />
            <Label htmlFor='private' className='flex items-center gap-2'>
              <Lock strokeWidth='1' className='h-6 w-6 text-muted-foreground' />
              <div className='flex flex-col  gap-[2px]'>
                <p className='text-[12px] font-normal leading-[18px]'>Private</p>
                <p className='text-[12px] font-normal leading-[18px] text-muted-foreground'>
                  You choose who cn view and run this project.
                </p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      {!session ? (
        <SigninButton className='mt-[34px] self-center' />
      ) : !session.user.installation_id ? (
        <a
          href='https://github.com/apps/maru-lake-app/installations/select_target'
          className={cn('mt-[34px] w-[196px] self-center', buttonVariants())}
        >
          Install App
        </a>
      ) : (
        <Button type='submit' className='mt-[34px] w-[196px] self-center'>
          Create
        </Button>
      )}
    </form>
  )
}
