'use client'

import { useSession } from 'next-auth/react'

import { BackButton } from '~/components/back-button'
import { CreateProjectForm } from '~/components/create-project-form'
import { ImportProjectForm } from '~/components/import-project-form'
import { NotAuth } from '~/components/not-auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

const ProjectNewPage = () => {
  const { data: session } = useSession()

  if (!session) return <NotAuth />

  return (
    <section className='flex w-full flex-col gap-6 px-7 pt-10 lg:container lg:w-[628px] lg:pt-[70px]'>
      <BackButton href='/projects/profile' />
      <div className='mt-[36px] flex flex-col items-center gap-4 lg:mt-[26px]'>
        <p className='text-xl font-medium lg:text-2xl lg:font-bold'>Create Project</p>
        <p className='text-base font-semibold text-muted-foreground lg:text-lg lg:font-medium'>
          To get started, try create project
        </p>
      </div>
      <Tabs defaultValue='new'>
        <TabsList className='mb-10 w-full lg:mb-6'>
          <TabsTrigger value='new' className='w-full'>
            New Project
          </TabsTrigger>
          <TabsTrigger value='import' className='w-full'>
            Import
          </TabsTrigger>
        </TabsList>
        <TabsContent value='new'>
          <CreateProjectForm />
        </TabsContent>
        <TabsContent value='import'>
          <ImportProjectForm />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default ProjectNewPage
