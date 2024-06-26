'use client'

import { Fragment, useEffect, useState } from 'react'

import { Bird } from 'lucide-react'

import { CustomPagination } from '~/components/custom-pagination'
import { EventDataDetailCard } from '~/components/event-data/event-data-detail-card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import useAxiosAuth from '~/hooks/axios-auth'
import { usePaginationRequest } from '~/hooks/pagination-request'
import { ApiRoutes, PROJECT_ID, TASK_ID } from '~/lib/axios-instance'
import { ExpressionTypeResponse, type ExpressionsResponse } from '~/types/expressions'

import { useProject } from '../project-provider'

export const TasksTab = ({ projectId }: { projectId: string }) => {
  const axiosAuth = useAxiosAuth()
  const { tasks, setTask } = useProject()((state) => state)
  const { loading, currentPage, totalPages, setCurrentPage } = usePaginationRequest(
    ApiRoutes.PROJECTS_PROJECT_ID_TASKS.replace(PROJECT_ID, projectId),
    setTask,
  )

  const [selectedTask, setSelectedTask] = useState<number | undefined>()
  const [taskExpressions, setTaskExpressions] = useState<Record<number, ExpressionsResponse>>()

  useEffect(() => {
    if (!selectedTask) return

    void (async () => {
      const { data } = await axiosAuth.get<ExpressionsResponse>(
        ApiRoutes.TASKS_TASK_ID_EXPRESSIONS.replace(TASK_ID, selectedTask.toString()),
      )

      setTaskExpressions((state) => ({
        ...state,
        [selectedTask]: data,
      }))
    })()
  }, [axiosAuth, selectedTask])

  if (loading === undefined && !tasks.length) return <></>

  if (!loading && !tasks.length)
    return (
      <section className='mt-[100px] flex flex-col items-center justify-center px-7 lg:container lg:mt-[150px]'>
        <Bird className='size-20' strokeWidth={1} />
        <p className='text-xl font-semibold'>No tasks</p>
      </section>
    )

  if (loading && !tasks.length) return <></>

  return (
    <>
      <div className='hidden bg-card px-5 lg:block'>
        <Table className=''>
          <TableHeader className='h-[60px]'>
            <TableRow>
              <TableHead className='align-middle text-lg font-medium'>Task</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Expression</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Range</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Periodical</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-muted'>
            {tasks.map((t) => (
              <Fragment key={t.id}>
                <TableRow className='h-[56px]'>
                  <TableCell className='border-t-DEFAULT text-base font-medium'>{t.id}</TableCell>
                  <TableCell className='flex items-center justify-center border-t-DEFAULT text-center text-base font-medium'>
                    <div
                      className='w-fit cursor-pointer'
                      onClick={() => {
                        setSelectedTask(selectedTask === t.id ? undefined : t.id)
                      }}
                    >
                      {t.name}
                    </div>
                  </TableCell>
                  <TableCell className='border-t-DEFAULT text-center text-base font-medium'>{t.block_range}</TableCell>
                  <TableCell className='border-t-DEFAULT text-center text-base font-medium'>
                    {t.periodical ?? '-'}
                  </TableCell>
                </TableRow>
                {selectedTask === t.id && taskExpressions && taskExpressions[t.id] && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className='flex w-full flex-col gap-5'>
                        <div className='flex flex-col gap-3'>
                          <p className='text-lg font-medium'>Expressions</p>
                          <div className='grid grid-cols-2 gap-4'>
                            {taskExpressions[t.id]?.[ExpressionTypeResponse.EVENT_DATA].map((exp) => (
                              <div key={exp.id} className='flex w-full flex-col border-2 bg-background p-3 lg:p-4'>
                                <EventDataDetailCard expression={exp} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className='flex flex-col gap-3'>
                          <p className='text-lg font-medium'>Compound Expressions</p>
                          <div className='grid grid-cols-2 gap-4'>
                            {taskExpressions[t.id]?.[ExpressionTypeResponse.COMPOUND].map((exp) => (
                              <div key={exp.id} className='flex w-full  border-2 bg-background p-3 lg:p-4'>
                                <span className='font-bold'>{exp.name}</span>
                                &nbsp;
                                <span>{`= ${exp.raw_data}`}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col gap-6 lg:hidden'>
        {tasks.map((t) => (
          <div key={t.id} className='flex flex-col bg-card p-4 '>
            <div className='flex items-center justify-between border-b-DEFAULT pb-3'>
              <p className='text-base font-semibold'>Task</p>
              <p className='text-sm font-medium'>{t.id}</p>
            </div>
            <div className='flex items-center justify-between border-b-DEFAULT py-3'>
              <p className='text-base font-semibold'>Expression</p>
              <p className='text-sm font-medium'>{t.name}</p>
            </div>
            <div className='flex items-center justify-between border-b-DEFAULT py-3'>
              <p className='text-base font-semibold'>Range</p>
              <p className='text-sm font-medium'>{t.block_range}</p>
            </div>
            <div className='flex items-center justify-between border-b-DEFAULT py-3'>
              <p className='text-base font-semibold'>Periodical</p>
              <p className='text-sm font-medium'>{t.periodical ?? '-'}</p>
            </div>
          </div>
        ))}
      </div>
      <CustomPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </>
  )
}
