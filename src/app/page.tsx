'use client'

import { Link2, MoveRight, PlusIcon, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { ProjectCard } from '~/components/project-card'
import { buttonVariants } from '~/components/ui/button'
import { UserCard } from '~/components/user-card'
import { siteConfig } from '~/config/site'
import { cn } from '~/lib/utils'
import { useStore } from '~/state'
import { authSelector } from '~/state/auth'
import { Nav } from '~/types/nav'
import type { Project } from '~/types/project'

const resources = [
  {
    title: 'MarU STARKs',
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
    <Link href={Nav.PROJECT_CREATE} className={cn('md:w-full gap-[10px] mt-6 lg:mt-0', buttonVariants())}>
      <PlusIcon className='h-4 w-4 text-white' />
      <span>New Project</span>
    </Link>
  </div>
)

const IndexPage = () => {
  const { isAuthenticated } = useStore(authSelector)
  const projects = [] as Project[]

  return (
    <section className='grid items-center px-7 pt-10 lg:container lg:pt-[60px]'>
      <div className='grid grid-cols-1 gap-[100px] lg:grid-cols-6 lg:gap-6'>
        <div className='order-2 flex flex-col gap-10 lg:order-1 lg:col-span-1'>
          {isAuthenticated && (
            <div className='hidden w-full lg:block'>
              <AuthSidebar />
            </div>
          )}
          <div className='flex flex-col gap-[2px]'>
            <p className='mb-[14px] text-base font-semibold lg:text-lg lg:font-medium'>Resources</p>
            {resources.map((r) => (
              <div key={r.title} className='flex w-full items-center gap-[10px] p-4 text-muted-foreground'>
                <Link2 className='h-6 w-6 rotate-[-45deg]' strokeWidth={1} />
                <p className='text-sm font-bold lg:text-base lg:font-semibold'>{r.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='order-1 flex flex-col items-center lg:order-2 lg:col-span-3 lg:items-end lg:gap-6'>
          <div className='order-1 flex w-full flex-col items-center justify-between gap-6 bg-card p-4 lg:flex-row lg:gap-1 lg:px-5 lg:py-[18px]'>
            <p className='text-center text-base font-semibold lg:text-lg lg:font-medium'>
              Welcome! Get started by creating your first project.
            </p>
            <Link
              href={Nav.PROJECT_CREATE}
              className={cn(
                'gap-4',
                buttonVariants({
                  variant: 'ghost',
                  size: 'icon',
                }),
              )}
            >
              <p className='text-sm font-bold text-muted-foreground lg:text-base lg:font-semibold'>New Project</p>
              <div>
                <MoveRight className='h-6 w-6 text-muted-foreground' />
              </div>
            </Link>
          </div>
          {isAuthenticated && (
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
        <div className='order-3 flex flex-col gap-5 lg:col-span-2'>
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
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='141'
              height='66'
              viewBox='0 0 141 66'
              fill='none'
              className='self-end'
            >
              <g opacity='0.8'>
                <path
                  opacity='0.4'
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M140 65C140 65 126.078 53 120.888 53C115.697 53 110.309 58.881 105.25 53.0098C100.191 47.1386 99.1463 40.9776 94.825 45C90.5037 49.0224 86.3667 49.0224 84.4 45C82.4333 40.9776 84.3483 39 77.45 39C70.5517 39 71.1652 27.6914 68.7625 21C66.3598 14.3086 62.8186 7.35401 56.6 13C50.3814 18.646 46.1454 14.9231 44.4375 11C42.7296 7.07692 41.3063 5 37.4875 5C33.6687 5 33.704 9 30.5375 9C27.371 9 26.3683 13 21.85 13C17.3317 13 14.7705 3.00503 11.425 3.00503C8.07948 3.00503 1 1 1 1V65H140Z'
                  fill='url(#paint0_linear_491_19351)'
                />
                <path
                  d='M140 65C140 65 126.078 53 120.888 53C115.697 53 110.309 58.881 105.25 53.0098C100.191 47.1386 99.1463 40.9776 94.825 45C90.5037 49.0224 86.3667 49.0224 84.4 45C82.4333 40.9776 84.3483 39 77.45 39C70.5517 39 71.1652 27.6914 68.7625 21C66.3598 14.3086 62.8186 7.35401 56.6 13C50.3814 18.646 46.1454 14.9231 44.4375 11C42.7296 7.07692 41.3063 5 37.4875 5C33.6687 5 33.704 9 30.5375 9C27.371 9 26.3683 13 21.85 13C17.3317 13 14.7705 3.00503 11.425 3.00503C8.07949 3.00503 1 1 1 1'
                  stroke='#6D23F8'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </g>
              <defs>
                <linearGradient
                  id='paint0_linear_491_19351'
                  x1='139.704'
                  y1='1'
                  x2='139.704'
                  y2='64.7276'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stopColor='#6D23F8' />
                  <stop offset='1' stopColor='#6D23F8' stopOpacity='0' />
                </linearGradient>
              </defs>
            </svg>
            <p className='mt-[11px] text-lg font-semibold lg:mt-[6px] lg:text-xl'>12374893</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IndexPage
