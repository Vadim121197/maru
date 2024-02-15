'use client'

import { useEffect, useState } from 'react'
import moment from 'moment'
import { Copy } from 'lucide-react'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { Proof } from '~/types/proof'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

export const ProofsTab = ({ projectId }: { projectId: string }) => {
  const axiosAuth = useAxiosAuth()
  const [proofs, setProofs] = useState<Proof[]>([])

  useEffect(() => {
    void (async () => {
      try {
        const { data: proofs } = await axiosAuth.get<Proof[]>(
          ApiRoutes.PROJECTS_PROJECT_ID_PROOFS.replace(PROJECT_ID, projectId),
        )

        setProofs(proofs)
      } catch (error) {}
    })()
  }, [projectId, axiosAuth])

  return (
    <div className='bg-card px-5'>
      <Table className='hidden lg:table'>
        <TableHeader className='h-[60px]'>
          <TableRow>
            <TableHead className='text-lg font-medium align-middle'>Status</TableHead>
            <TableHead className='text-center text-lg font-medium align-middle'>Version</TableHead>
            <TableHead className='text-center text-lg font-medium align-middle'>Expression</TableHead>
            <TableHead className='text-center text-lg font-medium align-middle'>Time</TableHead>
            <TableHead className='text-center text-lg font-medium align-middle'>Input</TableHead>
            <TableHead className='text-center text-lg font-medium align-middle'>Proofs</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody className='text-muted'>
          {proofs.map((i) => (
            <TableRow key={i.id} className='h-[56px]'>
              <TableCell className='capitalize border-t-[1px] text-base font-medium'>{i.status}</TableCell>
              <TableCell className='text-center border-t-[1px] text-base font-medium'>{i.version}</TableCell>
              <TableCell className='text-center border-t-[1px] text-base font-medium'>{i.name}</TableCell>
              <TableCell className='text-center border-t-[1px] text-base font-medium'>
                {moment.utc(i.updated_at).startOf('minutes').fromNow()}
              </TableCell>
              <TableCell className='text-center border-t-[1px] text-base font-medium'>0x12345....6789</TableCell>
              <TableCell className='text-center border-t-[1px] text-base font-medium'>{'{}'}</TableCell>
              <TableCell className='text-center border-t-[1px] text-base font-medium'>
                <div>
                  <Copy className='w-5 h-5' strokeWidth={1} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
