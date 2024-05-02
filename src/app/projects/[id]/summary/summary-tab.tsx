'use client'

import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'

import { Copy } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import { copyToClipboard } from '~/lib/copy-to-clipboard'
import { showErrorToast } from '~/lib/show-error-toast'
import { cn } from '~/lib/utils'
import type { ProjectSummary } from '~/types/project'

import { useProject } from '../ProjectProvider'

export const SummaryTab = ({ projectId }: { projectId: string }) => {
  const axiosAuth = useAxiosAuth()
  const { isUserProject } = useProject()((state) => state)

  const [loading, setLoading] = useState<boolean | undefined>()
  const [edit, setEdit] = useState<boolean>(false)
  const [temporarySummary, setTemporarySummary] = useState('')

  useEffect(() => {
    void (async () => {
      setLoading(true)
      try {
        const { data: summary } = await axiosAuth.get<ProjectSummary>(
          ApiRoutes.PROJECTS_PROJECT_ID_SUMMARY.replace(PROJECT_ID, projectId),
        )

        setTemporarySummary(summary.content)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    })()
  }, [projectId, axiosAuth])

  const save = () => {
    void (async () => {
      try {
        await axiosAuth.post(ApiRoutes.PROJECTS_PROJECT_ID_SUMMARY.replace(PROJECT_ID, projectId), {
          content: temporarySummary,
        })
        setEdit(false)
      } catch (error) {
        showErrorToast(error)
      }
    })()
  }

  if (loading === undefined || loading) return <></>

  if (!isUserProject && !temporarySummary) return <></>

  return (
    <div
      className={cn(
        'flex min-h-[404px] w-full flex-col items-end gap-2 bg-[rgba(24,21,36,0.65)] px-5 py-4',
        isUserProject && !temporarySummary && !edit && 'items-center justify-center',
      )}
    >
      {!temporarySummary && !edit ? (
        <div className='flex flex-col items-center gap-2'>
          <p className='text-2xl'>Add a SUMMARY</p>
          <Button
            className='w-[300px]'
            onClick={() => {
              setEdit(true)
            }}
          >
            Add a SUMMARY
          </Button>
        </div>
      ) : (
        <>
          {isUserProject && (
            <Button
              variant='secondary'
              className='w-[200px]'
              onClick={() => {
                if (edit) {
                  save()
                } else {
                  setEdit(true)
                }
              }}
            >
              {edit ? 'Save' : 'Edit'}
            </Button>
          )}
          {isUserProject && edit && (
            <Textarea
              value={temporarySummary}
              onChange={(e) => {
                setTemporarySummary(e.target.value)
              }}
              className='min-h-[202px]'
            />
          )}
          <Markdown
            className='w-full'
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
              ul: ({ children }) => (
                <ul className='max-w-md list-inside list-disc space-y-1 text-[#CEC5C5]'>{children}</ul>
              ),
              li: ({ children }) => <li className='text-[#CEC5C5]'>{children}</li>,
              a: ({ children, href }) => (
                <a target='_blank' rel='noopener noreferrer' href={href} className='text-primary underline'>
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className='rounded-[6px] bg-[#6e768166] p-1 text-[85%] text-[#CEC5C5]'>{children}</code>
              ),
              pre: ({ children }) => {
                const content = (
                  children as {
                    props?: {
                      children?: string
                    }
                  }
                ).props?.children

                return (
                  <div className='relative my-2'>
                    <div className='absolute right-4 top-4'>
                      <Copy className='size-4 cursor-pointer' onClick={copyToClipboard(content ?? '')} />
                    </div>
                    <pre className='min-h-[52px] rounded-[6px] bg-[#161b22] px-4 py-2 text-[85%] leading-[1.45]'>
                      {content ?? ''}
                    </pre>
                  </div>
                )
              },
            }}
          >
            {temporarySummary}
          </Markdown>
        </>
      )}
    </div>
  )
}
