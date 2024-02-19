'use client'

import { useEffect, useState } from 'react'
import moment from 'moment'
import { Bird, Copy } from 'lucide-react'
import useAxiosAuth from '~/hooks/axios-auth'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { Proof } from '~/types/proof'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

export const ProofsTab = ({ projectId }: { projectId: string }) => {
  const { proofs, setProofs } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()
  const [loading, setLoading] = useState<boolean | undefined>()

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        const { data: proofs } = await axiosAuth.get<Proof[]>(
          ApiRoutes.PROJECTS_PROJECT_ID_PROOFS.replace(PROJECT_ID, projectId),
        )

        setProofs(proofs)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    })()
  }, [projectId, axiosAuth, setProofs])

  if (loading === undefined && !proofs.length) return <></>

  if (!loading && !proofs.length)

    return (
      <section className='mt-[100px] flex flex-col items-center justify-center px-7 lg:container lg:mt-[150px]'>
        <Bird className='w-20 h-20' strokeWidth={1} />
        <p className='text-xl font-semibold'>No proofs</p>
      </section>
    )

  if (loading && !proofs.length) return <></>

  return (
    <div className='bg-card px-5'>
      <Table className='hidden lg:table'>
        <TableHeader className='h-[60px]'>
          <TableRow>
            <TableHead className='align-middle text-lg font-medium'>Status</TableHead>
            <TableHead className='text-center align-middle text-lg font-medium'>Version</TableHead>
            <TableHead className='text-center align-middle text-lg font-medium'>Expression</TableHead>
            <TableHead className='text-center align-middle text-lg font-medium'>Time</TableHead>
            <TableHead className='text-center align-middle text-lg font-medium'>Input</TableHead>
            <TableHead className='text-center align-middle text-lg font-medium'>Proofs</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody className='text-muted'>
          {proofs.map((i) => (
            <TableRow key={i.id} className='h-[56px]'>
              <TableCell className='border-t-[1px] text-base font-medium capitalize'>{i.status}</TableCell>
              <TableCell className='border-t-[1px] text-center text-base font-medium'>{i.version}</TableCell>
              <TableCell className='border-t-[1px] text-center text-base font-medium'>{i.name}</TableCell>
              <TableCell className='border-t-[1px] text-center text-base font-medium'>
                {moment.utc(i.updated_at).startOf('minutes').fromNow()}
              </TableCell>
              <TableCell className='border-t-[1px] text-center text-base font-medium'>0x12345....6789</TableCell>
              <TableCell className='border-t-[1px] text-center text-base font-medium'>{'{}'}</TableCell>
              <TableCell className='border-t-[1px] text-center text-base font-medium'>
                <div>
                  <Copy className='h-5 w-5' strokeWidth={1} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
