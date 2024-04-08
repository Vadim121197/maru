import { useCallback, useState } from 'react'

import type { DialogProps } from '@radix-ui/react-dialog'
import { AlertTriangle } from 'lucide-react'

import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'

import { Dropzone } from './dropzone'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

export const FailedFetchAbiModal = ({
  open,
  contractAddress,
  onOpenChange,
  fetchTools,
}: {
  open: boolean
  contractAddress: string
  onOpenChange: DialogProps['onOpenChange']
  fetchTools: () => Promise<void>
}) => {
  const axiosAuth = useAxiosAuth()

  const [file, setFile] = useState<File | undefined>()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
  }, [])

  const handleContinue = () => {
    if (!file) return

    void (async () => {
      const form = new FormData()

      form.append('abi_file', file)
      form.append(
        'contract_in',
        JSON.stringify({
          address: contractAddress,
        }),
      )
      try {
        await axiosAuth.post(ApiRoutes.CONTRACTS, form)

        await fetchTools()
        setFile(undefined)
      } catch {}
    })()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='px-7 py-[36px]'>
        <DialogHeader className='pb-3'>
          <DialogTitle className='flex items-center gap-2 text-base font-medium text-muted-foreground'>
            <AlertTriangle className='h-4 w-4 text-[rgba(255,219,0,1)]' />
            Failed to fetch contract ABI.
          </DialogTitle>
        </DialogHeader>
        <div className='mt-6 flex flex-col items-center gap-4'>
          <p className='text-sm font-normal text-muted-foreground'>
            You can attach ABI file or continue with a demo contract address
          </p>
          <Dropzone onDrop={onDrop} file={file} />
          <div className='mt-6 flex w-full gap-5'>
            <Button className='w-full' variant='outline' disabled>
              Use demo address
            </Button>
            <Button className='w-full' onClick={handleContinue} disabled={!file}>
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
