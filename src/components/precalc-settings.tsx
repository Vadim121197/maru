import { useMemo, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import type { Project } from '~/types/project'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { ApiRoutes } from '~/lib/axios-instance'
import { InputBlock } from './input-block'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

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
      <p className='mb-6 mt-4 text-[12px] font-normal leading-[18px] lg:mb-10 lg:text-sm'>
        The precalculation uses events in the{' '}
        <span
          className='cursor-pointer font-semibold text-muted-foreground underline'
          onClick={() => {
            setOpen(true)
          }}
        >
          {projectCalcPeriod.from}-{projectCalcPeriod.to}{' '}
        </span>
        blocks.
      </p>

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
