import { Link2, PlusIcon, TrendingUp } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '~/auth'
import { ChartIcon } from '~/components/chart-icon'
import { ProjectCard } from '~/components/project-card'
import { buttonVariants } from '~/components/ui/button'
import { UserCard } from '~/components/user-card'
import { siteConfig } from '~/config/site'
import { ApiRoutes, axiosInstance } from '~/lib/axios-instance'
import { cn } from '~/lib/utils'
import { Nav } from '~/types/nav'
import type { Project } from '~/types/project'

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

const AuthSidebar = () => (
  <div className='flex w-full flex-col gap-4'>
    <p className='mb-2 text-base font-semibold lg:text-lg lg:font-medium'>Account</p>
    <UserCard />
    <div className='mt-2 flex flex-col gap-4'>
      {siteConfig.secondaryNav.map((i) => (
        <Link href={i.href} key={i.href} className='flex items-center gap-2'>
          <div>{i.icon}</div>
          <p className='text-[12px] font-normal leading-[18px] lg:text-sm'>{i.title}</p>
        </Link>
      ))}
    </div>
    <Link
      href={Nav.PROJECT_CREATE}
      className={cn('w-full gap-[10px] mt-6 lg:mt-0 lg:w-[196px] text-primary', buttonVariants())}
    >
      <PlusIcon className='h-4 w-4 ' />
      <span>New Project</span>
    </Link>
  </div>
)

const IndexPage = async () => {
  const session = await getServerSession(authOptions)

  let projects: Project[] = []
  try {
    const { data } = await axiosInstance.get<Project[]>(ApiRoutes.PROJECTS)

    projects = data
  } catch (error) {}

  return (
    <section className='grid items-center px-7 pt-10 lg:pt-[60px]'>
      <div className='flex flex-col justify-between gap-[100px]  lg:flex-row lg:gap-6'>
        <div className='order-2 flex flex-col gap-10 lg:order-1 lg:w-[20%]'>
          {session && (
            <div className='hidden w-full lg:block'>
              <AuthSidebar />
            </div>
          )}
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
          {session && (
            <div className='order-2 mt-10 block w-full lg:mt-0 lg:hidden'>
              <AuthSidebar />
            </div>
          )}
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
              {[projects.at(0), projects.at(1)].map(
                (pr) =>
                  pr && (
                    <ProjectCard
                      key={pr.id}
                      href={`${Nav.PROJECTS}/${pr.id}`}
                      project={pr}
                      className='gap-[204px] lg:gap-[128px] lg:pt-7'
                    />
                  ),
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className='order-3 flex flex-col gap-5 lg:w-[20%]'>
          <div className='flex items-center gap-3'>
            <div>
              <TrendingUp strokeWidth={1} className='h-6 w-6 text-primary' />
            </div>
            <p className='text-base font-semibold lg:text-lg lg:font-medium'>Statistics</p>
          </div>
          <div className='flex w-full flex-col border-2 border-border p-4 lg:py-5 lg:pl-5 lg:pr-[30px]'>
            <p className='mb-6 text-base font-semibold text-muted-foreground lg:mb-5 lg:text-lg lg:font-medium'>
              Proofs Generated
            </p>
            <div className='w-full'>
              <ChartIcon />
            </div>
            <p className='mt-[11px] text-base font-semibold lg:mt-[6px] lg:text-lg lg:font-medium'>
              Total count: 12374893
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IndexPage
