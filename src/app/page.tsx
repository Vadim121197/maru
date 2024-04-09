import { Link2 } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

import { authOptions } from '~/auth'
import { AuthSidebar } from '~/components/auth-sidebar'
import { ProjectCard } from '~/components/project-card'
import { buttonVariants } from '~/components/ui/button'
import { siteConfig } from '~/config/site'
import { ApiRoutes, axiosInstance } from '~/lib/axios-instance'
import { cn } from '~/lib/utils'
import { Nav } from '~/types/nav'
import type { PaginationGeneric } from '~/types/pagination'
import type { Project } from '~/types/project'

import { Statistics } from './statistics'

const resources = [
  {
    title: 'Maru starks',
  },
  {
    title: 'Extract Map Reduce explained',
  },
  {
    title: 'Volumes per Pool',
  },
  {
    title: 'Volumes per Address',
  },
  {
    title: 'LIDO Account Oracle',
  },
]

const IndexPage = async () => {
  const session = await getServerSession(authOptions)

  let projects: Project[] = []
  try {
    const {
      data: { data },
    } = await axiosInstance.get<PaginationGeneric<Project[]>>(ApiRoutes.PROJECTS + '?page_size=4')

    projects = data
  } catch (error) {}

  return (
    <section className='grid items-center px-7 pt-10 lg:pt-[60px]'>
      <div className='flex flex-col justify-between gap-[100px]  lg:flex-row lg:gap-6'>
        <div className='order-2 flex flex-col gap-10 lg:order-1 lg:w-[20%]'>
          <AuthSidebar nav={siteConfig.secondaryNav} className='hidden w-full lg:block' />
          <div className='flex flex-col gap-[2px]'>
            <p className='mb-[14px] text-base font-semibold lg:text-lg lg:font-medium'>Resources</p>
            {resources.map((r) => (
              <div key={r.title} className='flex w-full items-center gap-[10px] p-4 text-muted-foreground'>
                <div>
                  <Link2 className='h-6 w-6 rotate-[-45deg]' strokeWidth={1} />
                </div>
                <p className='text-sm font-bold lg:text-base lg:font-semibold'>{r.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='order-1 flex flex-col items-center lg:order-2 lg:w-[60%] lg:items-end lg:gap-6'>
          <div className='order-1 flex w-full flex-col items-center justify-between gap-6 bg-card p-4 lg:flex-row lg:gap-1 lg:px-5 lg:py-[18px]'>
            <p className='text-center text-base font-semibold lg:text-lg lg:font-medium'>
              Welcome! Get started by creating your first project.
            </p>
            <Link href={Nav.PROJECT_CREATE} className={cn('w-[148px] lg:w-[196px]', buttonVariants())}>
              New Project
            </Link>
          </div>

          <AuthSidebar nav={siteConfig.secondaryNav} className='order-2 mt-10 flex w-full lg:mt-0 lg:hidden' />
          {projects.length ? (
            <Link
              href={Nav.PROJECTS}
              className={cn(
                'order-4 lg:order-2',
                buttonVariants({
                  variant: 'ghost',
                  size: 'icon',
                }),
              )}
            >
              <p className='mt-6 text-sm font-bold text-muted-foreground lg:mt-0 lg:text-base lg:font-semibold'>
                See more
              </p>
            </Link>
          ) : (
            <></>
          )}
          {projects.length ? (
            <div className='order-3 mt-[60px] grid w-full gap-[34px] lg:order-3 lg:mt-0 lg:grid-cols-2 lg:gap-5'>
              {projects.map((pr) => (
                <ProjectCard
                  key={pr.id}
                  href={`${Nav.PROJECTS}/${pr.id}`}
                  project={pr}
                  className='gap-10 lg:gap-10 lg:pt-7'
                />
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
        <Statistics />
      </div>
    </section>
  )
}

export default IndexPage
