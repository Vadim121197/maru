'use client'

import { useEffect, useState } from 'react'
import { Bird } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import type { Pagination } from '~/types/pagination'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { Task } from '~/types/task'
import { useProject } from '../ProjectProvider'

export const TasksTab = ({ projectId }: { projectId: string }) => {
  const axiosAuth = useAxiosAuth()
  const { tasks, setTask } = useProject()((state) => state)

  const [loading, setLoading] = useState<boolean | undefined>()

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        const {
          data: { data },
        } = await axiosAuth.get<Pagination<Task[]>>(ApiRoutes.PROJECTS_PROJECT_ID_TASKS.replace(PROJECT_ID, projectId))

        setTask(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    })()
  }, [projectId, axiosAuth, setTask])

  if (loading === undefined && !tasks.length) return <></>

  if (!loading && !tasks.length)
    return (
      <section className='mt-[100px] flex flex-col items-center justify-center px-7 lg:container lg:mt-[150px]'>
        <Bird className='h-20 w-20' strokeWidth={1} />
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
              <TableRow key={t.id} className='h-[56px]'>
                <TableCell className='border-t-[1px] text-base font-medium'>{t.id}</TableCell>
                <TableCell className='border-t-[1px] text-center text-base font-medium'>{t.name}</TableCell>
                <TableCell className='border-t-[1px] text-center text-base font-medium'>{t.block_range}</TableCell>
                <TableCell className='border-t-[1px] text-center text-base font-medium'>
                  {t.periodical ?? '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col gap-6 lg:hidden'>
        {tasks.map((t) => (
          <div key={t.id} className='flex flex-col bg-card p-4 '>
            <div className='flex items-center justify-between border-b-[1px] pb-3'>
              <p className='text-base font-semibold'>Task</p>
              <p className='text-sm font-medium'>{t.id}</p>
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Expression</p>
              <p className='text-sm font-medium'>{t.name}</p>
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Range</p>
              <p className='text-sm font-medium'>{t.block_range}</p>
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Periodical</p>
              <p className='text-sm font-medium'>{t.periodical ?? '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
