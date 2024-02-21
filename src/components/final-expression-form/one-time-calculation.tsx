import { useMemo, useState } from 'react'
import type { AxiosError } from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { MIN_BLOCK_HEIGHT } from '~/lib/constants'
import type { Task } from '~/types/task'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { InputBlock } from '../input-block'
import { Button } from '../ui/button'

export const OneTimeCalculation = ({ expressionId }: { expressionId: number }) => {
  const navigate = useRouter()
  const pathname = usePathname()
  const axiosAuth = useAxiosAuth()

  const [period, setPeriod] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  })

  const prove = async () => {
    try {
      await axiosAuth.post<Task>(ApiRoutes.TASKS, {
        block_range: `${period.from}-${period.to}`,
        expression_id: expressionId,
      })
      navigate.push(`${pathname}/proofs`)
    } catch (error) {
      const err = error as AxiosError
      toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
    }
  }

  const addressValidationErrors = useMemo(() => {
    if (!period.from || !period.to) return false
    return Number(period.from) > Number(period.to)
  }, [period])

  const minBlockHeightError = useMemo(() => {
    if (!period.from) return false
    return Number(period.from) < MIN_BLOCK_HEIGHT
  }, [period])

  return (
    <>
      <div className='grid grid-cols-2 gap-10'>
        <InputBlock
          className='w-full'
          type='number'
          label='From'
          placeholder='Enter block number'
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
              issue: (
                <p>
                  Input should exceed{' '}
                  <span
                    className='underline cursor-pointer'
                    onClick={() => {
                      setPeriod({
                        from: MIN_BLOCK_HEIGHT.toString(),
                        to: (MIN_BLOCK_HEIGHT + 1000).toString(),
                      })
                    }}
                  >
                    {MIN_BLOCK_HEIGHT}
                  </span>
                </p>
              ),
              checkFn: () => minBlockHeightError,
            },
            {
              type: 'error',
              issue: 'From smaller to larger',
              checkFn: () => addressValidationErrors,
            },
          ]}
        />
        <InputBlock
          className='w-full'
          type='number'
          label='To'
          placeholder='Enter block number'
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
        className='w-[274px] self-center'
        disabled={addressValidationErrors || !period.from || !period.to || minBlockHeightError}
        onClick={() => {
          void (async () => {
            await prove()
          })()
        }}
      >
        Prove
      </Button>
    </>
  )
}
