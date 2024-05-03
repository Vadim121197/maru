'use client'

import { useEffect, useState } from 'react'

import { Markdown } from '~/components/markdown'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import { showErrorToast } from '~/lib/show-error-toast'
import { cn } from '~/lib/utils'
import type { ProjectSummary } from '~/types/project'

import { useProject } from '../project-provider'

export const SummaryTab = ({ projectId }: { projectId: string }) => {
  const axiosAuth = useAxiosAuth()
  const { isUserProject, summary, setSummary } = useProject()((state) => state)

  const [loading, setLoading] = useState<boolean | undefined>()
  const [edit, setEdit] = useState<boolean>(false)
  const [temporarySummary, setTemporarySummary] = useState(summary)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      try {
        const { data: summary } = await axiosAuth.get<ProjectSummary>(
          ApiRoutes.PROJECTS_PROJECT_ID_SUMMARY.replace(PROJECT_ID, projectId),
        )

        setTemporarySummary(summary.content)
        setSummary(summary.content)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    })()
  }, [projectId, axiosAuth, setSummary])

  const save = () => {
    void (async () => {
      try {
        await axiosAuth.post(ApiRoutes.PROJECTS_PROJECT_ID_SUMMARY.replace(PROJECT_ID, projectId), {
          content: temporarySummary,
        })
        setEdit(false)
        setSummary(temporarySummary)
      } catch (error) {
        showErrorToast(error)
      }
    })()
  }

  if ((loading === undefined || loading) && !temporarySummary) return <></>

  if (!isUserProject && !temporarySummary) return <></>

  return (
    <div
      className={cn(
        'flex min-h-[404px] w-[calc(100vw-64px)] lg:w-full flex-col items-end gap-2 bg-[rgba(24,21,36,0.65)] px-5 py-4',
        isUserProject && !temporarySummary && !edit && 'items-center justify-center',
      )}
    >
      {!temporarySummary && !edit ? (
        <div className='flex flex-col items-center gap-2'>
          <Button
            className='w-full lg:w-[300px]'
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
              className='w-full lg:w-[200px]'
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
          <Markdown markdown={temporarySummary} />
        </>
      )}
    </div>
  )
}
