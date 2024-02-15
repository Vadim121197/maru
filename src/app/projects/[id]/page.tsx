'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ExpressionsTab } from '~/components/expressions-tab'
import { ProofsTab } from '~/components/proofs-tab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import { type Project } from '~/types/project'

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const axiosAuth = useAxiosAuth()

  const [project, setProject] = useState<Project | undefined>()

  useEffect(() => {
    if (!params.id) return

    void (async () => {
      try {
        const { data: project } = await axiosAuth.get<Project>(
          ApiRoutes.PROJECTS_PROJECT_ID.replace(PROJECT_ID, params.id),
        )

        setProject(project)
      } catch (error) {}
    })()
  }, [params.id, axiosAuth])

  if (!project) return <></>

  return (
    <section className='container grid items-center md:pt-[84px]'>
      <div className='flex flex-col md:gap-6'>
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
        <Tabs defaultValue='expression'>
          <TabsList className='mb-10'>
            <TabsTrigger value='expression'>Expression</TabsTrigger>
            <TabsTrigger value='proofs'>Proofs</TabsTrigger>
          </TabsList>
          <TabsContent value='expression'>
            <ExpressionsTab
              project={project}
              updateProject={(newProject) => {
                setProject(newProject)
              }}
            />
          </TabsContent>

          <TabsContent value='proofs'>
            <ProofsTab project={project} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default ProjectPage
