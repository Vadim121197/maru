import { useCallback, useState, type Dispatch, type SetStateAction } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { DialogProps } from '@radix-ui/react-dialog'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Dropzone } from './dropzone'

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
      } catch {}
    })()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='py-[36px] px-7'>
        <DialogHeader className='pb-3'>
          <DialogTitle className='text-base font-medium text-muted-foreground flex items-center gap-2'>
            <AlertTriangle className='w-4 h-4 text-[rgba(255,219,0,1)]' />
            Failed to fetch contract ABI.
          </DialogTitle>
        </DialogHeader>
        <div className='mt-6 flex flex-col items-center gap-4'>
          <p className='text-sm font-normal text-muted-foreground'>
            You can attach ABI file or continue with a demo contract address
          </p>
          <Dropzone onDrop={onDrop} file={file} />
          <div className='mt-6 w-full flex gap-5'>
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
