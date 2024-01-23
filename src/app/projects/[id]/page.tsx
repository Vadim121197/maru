'use client'

import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { buttonVariants } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import useAxiosAuth from '~/hooks/axios-auth'
import { AxiosRoutes } from '~/lib/axios-instance'
import { cn } from '~/lib/utils'
import type { ExpressionsRes } from '~/types/expressions'
import { type Project } from '~/types/project'

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const axiosAuth = useAxiosAuth()
  const { data: session } = useSession()

  const [project, setProject] = useState<Project | undefined>()
  const [projectExpressions, setProjectExpressions] = useState<ExpressionsRes | undefined>(undefined)

  useEffect(() => {
    if (!params.id) return

    void (async () => {
      try {
        const { data: project } = await axiosAuth.get<Project>(`${AxiosRoutes.PROJECTS}/${params.id}`)

        setProject(project)

        const { data: projectExpressions } = await axiosAuth.get<ExpressionsRes>(
          `${AxiosRoutes.PROJECTS}/${params.id}/expressions`,
        )

        setProjectExpressions(projectExpressions)
      } catch (error) {
        console.log(error)
      }
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
            <TabsTrigger value='deployment'>Deployment</TabsTrigger>
          </TabsList>
          <TabsContent value='expression' className='grid grid-cols-2 gap-6'>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <p className='text-lg font-medium'>Expression</p>
                {project.user.id === session?.user.id && (
                  <Link
                    href={`/projects/${params.id}/expression/create`}
                    className={cn(
                      'flex items-center gap-[10px] px-4',
                      buttonVariants({
                        variant: 'outline',
                      }),
                    )}
                  >
                    <div>
                      <Plus className='h-4 w-4' />
                    </div>
                    <p className='text-base font-semibold'>Add Expression</p>
                  </Link>
                )}
              </div>
              <div className='flex flex-col gap-4'>
                {projectExpressions?.base_expressions.map((exp) => (
                  <div key={exp.id} className='flex flex-col gap-4 border-2 px-4 pb-[26px] pt-[18px]'>
                    <div className='flex items-center justify-between'>
                      <p className='text-base font-medium'>{exp.name}</p>
                      <div className='flex items-center gap-3'>
                        <p className='text-sm font-normal'>Aggregate</p>
                        <div className='border-2 px-8 py-[2px] text-sm font-normal'>{exp.aggregate_operation}</div>
                      </div>
                    </div>
                    <p className='text-sm font-normal text-muted-foreground'>{exp.raw_data}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <p className='text-lg font-medium'>Final Expression</p>
                {project.user.id === session?.user.id && (
                  <Link
                    href={`/projects/${params.id}/final-expression/create`}
                    className={cn(
                      'flex items-center gap-[10px] px-4',
                      buttonVariants({
                        variant: 'outline',
                      }),
                    )}
                  >
                    <div>
                      <Plus className='h-4 w-4' />
                    </div>
                    <p className='text-base font-semibold'>Add Final Expression</p>
                  </Link>
                )}
              </div>
              <div className='flex flex-col gap-4'>
                {projectExpressions?.final_expressions.map((exp) => (
                  <div key={exp.id} className='flex flex-col gap-4 border-2 px-4 pb-[26px] pt-[18px]'>
                    <div className='flex items-center justify-between'>
                      <p className='text-base font-medium'>{exp.name}</p>
                    </div>
                    <p className='text-sm font-normal text-muted-foreground'>{exp.raw_data}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value='deployment' />
        </Tabs>
      </div>
    </section>
  )
}

export default ProjectPage
