'use client'

import { useEffect } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { authSelector } from '~/state/auth'
import { useStore } from '~/state'
import { projectsSelector } from '~/state/projects'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button'

export const ImportProjectForm = () => {
  const { user, isAuthenticated } = useStore(authSelector)
  const { userProjects, getUserProjects } = useStore(projectsSelector)

  useEffect(() => {
    if (!isAuthenticated) return

    void (async () => {
      await getUserProjects()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  return (
    <form className='flex w-full flex-col gap-6 bg-card p-6'>
      <div className='flex flex-col gap-[10px]'>
        <p className='text-base font-medium'>Project</p>
        <Select defaultValue='light'>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Owner' />
          </SelectTrigger>
          <SelectContent>
            {userProjects.map((pr) => (
              <SelectItem value={pr.id.toString()} key={pr.id}>
                <div className='flex items-center gap-3'>
                  <div className='h-6 w-6 rounded-full bg-[#6D23F8]' />
                  <span>{pr.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
                  <span>{user?.username}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-[10px]'>
          <p className='text-base font-medium'>Repository name</p>
          <Input name='repo_url' />
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-4'>
        <p className='text-base font-medium'>Visibility</p>
        <RadioGroup defaultValue='public' name='is_private'>
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
      <Button type='submit' className='mt-[34px] w-[196px] self-center'>
        Create
      </Button>
    </form>
  )
}
