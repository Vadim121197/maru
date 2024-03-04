import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import type { AxiosError } from 'axios'
import { Info } from 'lucide-react'

import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import type { Project } from '~/types/project'

import { InputBlock } from './input-block'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

export const PrecalcSettings = ({
  project,
  updateProject,
}: {
  project: Project
  updateProject: (newProject: Project) => void
}) => {
  const axiosAuth = useAxiosAuth()

  const projectCalcPeriod = useMemo(() => {
    return {
      from: project.block_range?.split('-')[0] ?? '',
      to: project.block_range?.split('-')[1] ?? '',
    }
  }, [project])

  const [open, setOpen] = useState<boolean>(false)
  const [period, setPeriod] = useState<{ from: string; to: string }>({
    from: projectCalcPeriod.from,
    to: projectCalcPeriod.to,
  })

  const updateBlockRange = () => {
    void (async () => {
      try {
        const { data } = await axiosAuth.put<Project>(`${ApiRoutes.PROJECTS}/${project.id}`, {
          block_range: `${period.from}-${period.to}`,
        })
        updateProject(data)

        setOpen(false)
      } catch (error) {
        const err = error as AxiosError
        toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
      }
    })()
  }

  return (
    <>
      <div className='mb-10 mt-4 flex justify-between gap-4 lg:justify-start'>
        <p className='text-[12px] font-normal leading-[18px] lg:text-sm'>
          The precalculation uses events in the{' '}
          <span
            className='cursor-pointer font-bold text-muted-foreground underline lg:font-semibold'
            onClick={() => {
              setOpen(true)
            }}
          >
            {projectCalcPeriod.from}-{projectCalcPeriod.to}{' '}
          </span>
          blocks.
        </p>
        <div>
          <Info className='h-4 w-4 text-primary' />
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-base font-medium text-muted-foreground'>Change precalc settings</DialogTitle>
          </DialogHeader>
          <div className='mt-6 flex flex-col items-center gap-10'>
            <div className='grid w-full grid-cols-2 gap-3'>
              <InputBlock
                className='w-full'
                type='number'
                value={period.from}
                onChange={(e) => {
                  setPeriod((state) => ({
                    ...state,
                    from: e.target.value,
                  }))
                }}
                validations={[
                  {
                    type: 'error',
                    issue: 'From bigger than to',
                    checkFn: (value) => Number(value) > Number(period.to),
                  },
                ]}
              />
              <InputBlock
                className='w-full'
                type='number'
                value={period.to}
                onChange={(e) => {
                  setPeriod((state) => ({
                    ...state,
                    to: e.target.value,
                  }))
                }}
              />
            </div>
            <Button className='w-[50%]' disabled={Number(period.from) > Number(period.to)} onClick={updateBlockRange}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
