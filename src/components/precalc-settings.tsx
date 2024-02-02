import { useEffect, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import type { Project } from '~/types/project'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { InputBlock } from './input-block'
import { ApiRoutes } from '~/lib/axios-instance'

export const PrecalcSettings = ({ projectId }: { projectId: string }) => {
  const axiosAuth = useAxiosAuth()

  const [open, setOpen] = useState<boolean>(false)
  const [period, setPeriod] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  })

  useEffect(() => {
    void (async () => {
      try {
        const { data: project } = await axiosAuth.get<Project>(`${ApiRoutes.PROJECTS}/${projectId}`)

        const period = project.block_range.split('-')

        setPeriod({
          from: period[0] ?? '',
          to: period[1] ?? '',
        })
      } catch (error) {}
    })()
  }, [projectId, axiosAuth])

  return (
    <>
      <p className='mb-6 mt-4 text-[12px] font-normal leading-[18px] lg:mb-10 lg:text-sm'>
        The precalculation uses events in the last 1000 blocks.{' '}
        <span
          className='text-muted-foreground underline'
          onClick={() => {
            setOpen(true)
          }}
        >
          Change precalc settings
        </span>
      </p>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-base font-medium color-muted-foreground'>Change precalc settings</DialogTitle>
          </DialogHeader>
          <div className='mt-6 flex flex-col items-center gap-10'>
            <div className='grid grid-cols-2 gap-3 w-full'>
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
            <Button
              className='w-[50%]'
              disabled={Number(period.from) > Number(period.to)}
              onClick={() => {
                void (async () => {
                  try {
                    await axiosAuth.put(`${AxiosRoutes.PROJECTS}/${projectId}`, {
                      block_range: `${period.from}-${period.to}`,
                    })
                    setOpen(false)
                  } catch (error) {
                    const err = error as AxiosError
                    toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
                  }
                })()
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
