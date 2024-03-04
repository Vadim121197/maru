'use client'

import { useEffect, useState } from 'react'

import { Bird } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import { cutAddress } from '~/lib/cut-address'
import { Network, type Deployment } from '~/types/deployment'
import type { PaginationGeneric } from '~/types/pagination'

import { useProject } from '../ProjectProvider'

const explores: Record<Network, string> = {
  [Network.MAINNET]: 'https://etherscan.io/address/',
  [Network.GOERLI]: 'https://goerli.etherscan.io/address/',
  [Network.KOVAN]: 'https://kovan.ethplorer.io/address/',
  [Network.RINKEBY]: '',
  [Network.ROPSTEN]: '',
}

export const DeploymentsTab = ({ projectId }: { projectId: string }) => {
  const axiosAuth = useAxiosAuth()
  const { deployments, setDeployments } = useProject()((state) => state)

  const [loading, setLoading] = useState<boolean | undefined>()

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        const {
          data: { data },
        } = await axiosAuth.get<PaginationGeneric<Deployment[]>>(
          ApiRoutes.PROJECTS_PROJECT_ID_DEPLOYMENTS.replace(PROJECT_ID, projectId) + '?page_size=1000',
        )

        setDeployments(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    })()
  }, [projectId, axiosAuth, setDeployments])

  if (loading === undefined && !deployments.length) return <></>

  if (!loading && !deployments.length)
    return (
      <section className='mt-[100px] flex flex-col items-center justify-center px-7 lg:container lg:mt-[150px]'>
        <Bird className='h-20 w-20' strokeWidth={1} />
        <p className='text-xl font-semibold'>No deployments</p>
      </section>
    )

  if (loading && !deployments.length) return <></>

  return (
    <>
      <div className='hidden bg-card px-5 lg:block'>
        <Table className=''>
          <TableHeader className='h-[60px]'>
            <TableRow>
              <TableHead className='align-middle text-lg font-medium'>Network</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Task</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Expression</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Contract</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-muted'>
            {deployments.map((d, index) => (
              <TableRow key={index} className='h-[56px]'>
                <TableCell className='border-t-[1px] text-base font-medium'>{d.network}</TableCell>
                <TableCell className='border-t-[1px] text-center text-base font-medium'>{d.task_id}</TableCell>
                <TableCell className='border-t-[1px] text-center text-base font-medium'>{d.name}</TableCell>
                <TableCell className='border-t-[1px] text-center text-lg font-medium'>
                  {d.address ? (
                    explores[d.network] ? (
                      <a
                        href={explores[d.network] + d.address}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='cursor-pointer'
                      >
                        {cutAddress(d.address)}
                      </a>
                    ) : (
                      cutAddress(d.address)
                    )
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col gap-6 lg:hidden'>
        {deployments.map((d, index) => (
          <div key={index} className='flex flex-col bg-card p-4 '>
            <div className='flex items-center justify-between border-b-[1px] pb-3'>
              <p className='text-base font-semibold'>Network</p>
              <p className='text-sm font-medium'>{d.network}</p>
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Task</p>
              <p className='text-sm font-medium'>{d.task_id}</p>
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Expression</p>
              <p className='text-sm font-medium'>{d.name}</p>
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Contract</p>
              <p className='text-sm font-medium'>
                {d.address ? (
                  explores[d.network] ? (
                    <a
                      href={explores[d.network] + d.address}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='cursor-pointer'
                    >
                      {cutAddress(d.address)}
                    </a>
                  ) : (
                    cutAddress(d.address)
                  )
                ) : (
                  '-'
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
