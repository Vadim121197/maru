'use client'

import { useEffect } from 'react'
import Markdown from 'react-markdown'

import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { ProjectSummary } from '~/types/project'

import { useProject } from '../ProjectProvider'

export const SummaryTab = ({ projectId }: { projectId: string }) => {
  const axiosAuth = useAxiosAuth()
  const { summary, setSummary } = useProject()((state) => state)

  useEffect(() => {
    void (async () => {
      try {
        const { data: summary } = await axiosAuth.get<ProjectSummary>(
          ApiRoutes.PROJECTS_PROJECT_ID_SUMMARY.replace(PROJECT_ID, projectId),
        )

        setSummary(summary.content)
      } catch (error) {}
    })()
  }, [projectId, axiosAuth, setSummary])

  return (
    <div className='min-h-[404px] w-full bg-[rgba(24,21,36,0.65)] px-5 py-4'>
      <Markdown
        components={{
          p: ({ children }) => <p className='text-base font-medium text-[#CEC5C5]'>{children}</p>,
          h1: ({ children }) => (
            <h1 className='mt-6 border-b border-border pb-[.3em] text-[2em] leading-[1.25] text-[#CEC5C5]'>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className='mt-6 border-b border-border pb-[.3em] text-[1.5em] leading-[1.25] text-[#CEC5C5]'>
              {children}
            </h2>
          ),
          h3: ({ children }) => <h3 className='mt-6 text-[1.25em] leading-[1.25] text-[#CEC5C5]'>{children}</h3>,
          h4: ({ children }) => <h4 className='mt-6 text-[1em] leading-[1.25] text-[#CEC5C5]'>{children}</h4>,
          h5: ({ children }) => <h5 className='mt-6 text-[.875em] leading-[1.25] text-[#CEC5C5]'>{children}</h5>,
          h6: ({ children }) => <h6 className='mt-6 text-[.85em] leading-[1.25] text-[#CEC5C5]'>{children}</h6>,
          ol: ({ children }) => (
            <ol className='max-w-md list-inside list-decimal space-y-1 text-[#CEC5C5]'>{children}</ol>
          ),
          ul: ({ children }) => <ul className='max-w-md list-inside list-disc space-y-1 text-[#CEC5C5]'>{children}</ul>,
          li: ({ children }) => <li className='text-[#CEC5C5]'>{children}</li>,
          a: ({ children, href }) => (
            <a target='_blank' rel='noopener noreferrer' href={href} className='text-primary underline'>
              {children}
            </a>
          ),
        }}
      >
        {summary}
      </Markdown>
    </div>
  )
}
