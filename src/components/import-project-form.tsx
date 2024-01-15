import { Lock, Unlock } from 'lucide-react'
import axiosInterceptorInstance, { AxiosRoutes } from '~/lib/axios-interceptor-instance'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button'

const importProject = async (formData: FormData) => {
  try {
    await axiosInterceptorInstance.post(AxiosRoutes.PROJECTS, {
      name: formData.get('name'),
      repo_url: formData.get('repo_url'),
      is_private: formData.get('is_private') === 'private',
    })
  } catch (error) {
    /* empty */
  }
}

export const ImportProjectForm = () => {
  async function create(formData: FormData) {
    'use server'

    await importProject(formData)
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form className='flex w-full flex-col gap-6 bg-card p-6' action={create}>
      <div className='flex flex-col gap-[10px]'>
        <p className='text-base font-medium'>Project</p>
        <Select defaultValue='light'>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Owner' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='light'>
              <div className='flex items-center gap-3'>
                <div className='h-6 w-6 rounded-full bg-[#6D23F8]' />
                <span>test_1</span>
              </div>
            </SelectItem>
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
                  <span>@uzerprofile234</span>
                </div>
              </SelectItem>
              <SelectItem value='dark'>
                <div className='flex items-center gap-3'>
                  <div className='h-6 w-6 rounded-full bg-[#6D23F8]' />
                  <span>@uzerprofile234</span>
                </div>
              </SelectItem>
              <SelectItem value='system'>
                <div className='flex items-center gap-3'>
                  <div className='h-6 w-6 rounded-full bg-[#6D23F8]' />
                  <span>@uzerprofile234</span>
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
      <div className='flex flex-col gap-[10px]'>
        <p className='text-base font-medium'>Project Name</p>
        <Input name='name' />
      </div>
      <div className='flex flex-col gap-[10px]'>
        <p className='text-base font-medium'>Description</p>
        <Input />
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
