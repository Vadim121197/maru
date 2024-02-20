'use client'

import { Bird, Copy, InfoIcon } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import useAxiosAuth from '~/hooks/axios-auth'
import { copyToClipboard } from '~/lib/copy-to-clipboard'
import { ApiRoutes, BASE_URL, PROJECT_ID, PROOF_ID } from '~/lib/axios-instance'
import { ProofStatus, type Proof } from '~/types/proof'
import { cn } from '~/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table'

const statusColor = {
  [ProofStatus.SUCCESS]: 'bg-[#83FF73]',
  [ProofStatus.PROCESSING]: 'bg-[#FFEA00]',
  [ProofStatus.FAILED]: 'bg-[#FF2E00]',
  [ProofStatus.NEW]: 'bg-[#6D23F8]',
}

const Status = ({ status }: { status: ProofStatus }) => {
  return (
    <div className='flex items-center gap-2'>
      <div className={cn('w-[10px] h-[10px] rounded-full', statusColor[status])} />
      <p className='text-sm font-medium capitalize lg:text-base'>{status}</p>
    </div>
  )
}

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
        <Bird className='h-20 w-20' strokeWidth={1} />
        <p className='text-xl font-semibold'>No proofs</p>
      </section>
    )

  if (loading && !proofs.length) return <></>

  const verify = (proofId: number) => () => {
    void (async () => {
      try {
        await axiosAuth.post(ApiRoutes.PROOFS_PROOF_ID_VERIFY.replace(PROOF_ID, proofId.toString()))

        const { data } = await axiosAuth.get<Proof>(ApiRoutes.PROOFS_PROOF_ID.replace(PROOF_ID, proofId.toString()))

        const updatedProof = [...proofs]
        const index = updatedProof.findIndex((pr) => pr.id === proofId)
        updatedProof[index] = data

        setProofs(updatedProof)
      } catch (error) {
        const err = error as AxiosError
        toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
      }
    })()
  }

  return (
    <>
      <div className='hidden bg-card px-5 lg:block'>
        <Table className=''>
          <TableHeader className='h-[60px]'>
            <TableRow>
              <TableHead className='align-middle text-lg font-medium'>Status</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Version</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Expression</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Time</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Input</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Proofs</TableHead>
              <TableHead className='text-center align-middle text-lg font-medium'>Verification</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-muted'>
            {proofs.map((i) => (
              <TableRow key={i.id} className='h-[56px]'>
                <TableCell className='border-t-[1px]'>
                  <Status status={i.status} />
                </TableCell>
                <TableCell className='border-t-[1px] text-center text-base font-medium'>{i.version}</TableCell>
                <TableCell className='border-t-[1px] text-center text-base font-medium'>{i.name}</TableCell>
                <TableCell className='border-t-[1px] text-center text-base font-medium'>
                  {moment.utc(i.updated_at).startOf('minutes').fromNow()}
                </TableCell>
                <TableCell className='border-t-[1px] text-base font-medium'>
                  <div className='flex items-center justify-center gap-5'>
                    <a
                      href={`${BASE_URL}/proofs/${i.id}/input`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center justify-center'
                    >
                      <InfoIcon strokeWidth={1} className='h-5 w-5' />
                    </a>
                    <div>
                      <Copy strokeWidth={1} className='h-5 w-5 cursor-pointer' onClick={copyToClipboard(i.input)} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className='border-t-[1px] text-center text-base font-medium'>
                  {i.result ? (
                    <div className='flex items-center justify-center gap-5'>
                      <a
                        href={`${BASE_URL}/proofs/${i.id}/result`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-center'
                      >
                        <InfoIcon strokeWidth={1} className='h-5 w-5' />
                      </a>
                      <div>
                        <Copy strokeWidth={1} className='h-5 w-5' onClick={copyToClipboard(i.result)} />
                      </div>
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className='flex justify-center border-t-[1px] text-center text-base font-medium'>
                  {i.verification ? (
                    <div className='w-[86px] border-b-[1px] border-primary p-1 text-center'>Verified</div>
                  ) : (
                    <Button variant='outline' className='h-9 w-[86px]' onClick={verify(i.id)}>
                      Verify
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col gap-6 lg:hidden'>
        {proofs.map((pr) => (
          <div key={pr.id} className='flex flex-col bg-card p-4 '>
            <div className='flex items-center justify-between border-b-[1px] pb-3'>
              <p className='text-base font-semibold'>Status</p>
              <Status status={pr.status} />
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Version</p>
              <p className='text-sm font-medium'>{pr.version}</p>
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Expression</p>
              <p className='text-sm font-medium'>{pr.name}</p>
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Time</p>
              <p className='text-sm font-medium'>{moment.utc(pr.updated_at).startOf('minutes').fromNow()}</p>
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Input</p>
              <div className='flex items-center justify-center gap-5'>
                <a
                  href={`${BASE_URL}/proofs/${pr.id}/input`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-center'
                >
                  <InfoIcon strokeWidth={1} className='h-5 w-5' />
                </a>
                <div>
                  <Copy strokeWidth={1} className='h-5 w-5 cursor-pointer' onClick={copyToClipboard(pr.input)} />
                </div>
              </div>
            </div>
            <div className='flex items-center justify-between border-b-[1px] py-3'>
              <p className='text-base font-semibold'>Proofs</p>
              {pr.result ? (
                <div className='flex items-center justify-center gap-5'>
                  <a
                    href={`${BASE_URL}/proofs/${pr.id}/result`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center'
                  >
                    <InfoIcon strokeWidth={1} className='h-5 w-5' />
                  </a>
                  <div>
                    <Copy strokeWidth={1} className='h-5 w-5 cursor-pointer' onClick={copyToClipboard(pr.result)} />
                  </div>
                </div>
              ) : (
                '-'
              )}
            </div>
            <div className='flex items-center justify-between pt-3'>
              <p className='text-base font-semibold'>Verification</p>
              {pr.verification ? (
                <div className='w-[86px] border-b-[1px] border-primary p-1 text-center'>Verified</div>
              ) : (
                <Button variant='outline' className='h-9 w-[86px]' onClick={verify(pr.id)}>
                  Verify
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
