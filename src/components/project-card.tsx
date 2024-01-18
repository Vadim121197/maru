import { StarIcon } from 'lucide-react'
import Link from 'next/link'
import moment from 'moment'
import { cn } from '~/lib/utils'
import type { Project } from '~/types/project'
import Image from 'next/image'

export const ProjectCard = ({ href, project, className }: { href: string; project: Project; className?: string }) => (
  <Link href={href} className={cn('flex flex-col bg-card p-4 lg:p-6 gap-11 lg:gap-5', className)}>
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <Image src={project.user.avatar_url} width={24} height={24} className='rounded-full' alt='avatar' />
        <p className='text-sm font-medium lg:text-base'>{project.user.username}</p>
      </div>
      <div className='flex items-center gap-2'>
        <StarIcon stroke='#FFE600' fill='#FFE600' className='h-6 w-6' />
        <p className='text-lg font-semibold lg:text-xl'>{project.stars_count}</p>
      </div>
    </div>
    <div className='flex flex-col gap-1'>
      <div className='flex items-center justify-between'>
        <p className='text-base font-semibold lg:text-lg lg:font-medium'>{project.repo_url}</p>
        {project.tags.map((tag) => (
          <div
            key={tag.id}
            className='border-2 border-border bg-background px-3 py-[5px] text-[12px] font-normal leading-[18px] lg:px-[26px]'
          >
            {tag.name}
          </div>
        ))}
      </div>
      <p className='text-sm font-medium text-muted-foreground lg:text-base'>
        Last updated {moment(project.updated_at).startOf('days').fromNow()}
      </p>
    </div>
  </Link>
)
