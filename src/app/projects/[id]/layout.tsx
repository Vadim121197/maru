'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import { Nav } from '~/types/nav'
import type { Project } from '~/types/project'

const Layout = ({ children, params }: { children: React.ReactNode; params: { id: string } }) => {
  const navigate = useRouter()
  const pathname = usePathname()
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

  const tabValue = useMemo(() => {
    const splittedPathname = pathname.split('/')
    return splittedPathname.length === 3 ? 'expression' : splittedPathname[splittedPathname.length - 1]
  }, [pathname])

  if (!project) return

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
        <Tabs value={tabValue}>
          <TabsList className='mb-10'>
            <TabsTrigger
              value='expression'
              onClick={() => {
                navigate.push(`${Nav.PROJECTS}/${params.id}`)
              }}
            >
              Expression
            </TabsTrigger>
            <TabsTrigger
              value='proofs'
              onClick={() => {
                navigate.push(`${Nav.PROJECTS}/${params.id}/proofs`)
              }}
            >
              Proofs
            </TabsTrigger>
          </TabsList>
          {children}
        </Tabs>
      </div>
    </section>
  )
}

export default Layout
