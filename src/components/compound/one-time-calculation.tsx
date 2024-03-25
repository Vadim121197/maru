import { useMemo, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { MIN_BLOCK_HEIGHT } from '~/lib/constants'
import { showErrorToast } from '~/lib/show-error-toast'
import type { Task } from '~/types/task'

import { InputBlock } from '../input-block'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import type { CalculationsTabsProps } from './calculations-tabs'

interface OneTimeCalculationProps {
  expressionId: CalculationsTabsProps['expressionId']
  save: CalculationsTabsProps['save']
  isChanged: CalculationsTabsProps['isChanged']
}

export const OneTimeCalculation = ({ expressionId, save, isChanged }: OneTimeCalculationProps) => {
  const navigate = useRouter()
  const pathname = usePathname()
  const axiosAuth = useAxiosAuth()

  const [period, setPeriod] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  })
  const [openModal, setOpenModal] = useState<boolean>(false)

  const prove = async () => {
    let expression_id: number | undefined

    if (save) {
      expression_id = await save()
    } else {
      expression_id = expressionId
    }

    if (!expression_id) return
    try {
      await axiosAuth.post<Task>(ApiRoutes.TASKS, {
        block_range: `${period.from}-${period.to}`,
        expression_id,
      })
      navigate.push(`${pathname}/proofs`)
    } catch (error) {
      showErrorToast(error)
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
      <div className='grid gap-4 lg:grid-cols-2 lg:gap-5'>
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
                    className='cursor-pointer underline'
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
        className='w-full self-center lg:w-[274px]'
        disabled={addressValidationErrors || !period.from || !period.to || minBlockHeightError}
        onClick={() => {
          if (isChanged && isChanged()) {
            setOpenModal(true)
            return
          }

          void (async () => {
            await prove()
          })()
        }}
      >
        Prove
      </Button>
      <Dialog open={openModal}>
        <DialogContent>
          <DialogHeader className='flex flex-row items-center gap-2 border-b-0 pb-10'>
            <div>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g id='bx:error'>
                  <path
                    id='Vector'
                    d='M9.16783 8.33301H10.8345V12.4997H9.16783V8.33301ZM9.16699 13.333H10.8337V14.9997H9.16699V13.333Z'
                    fill='#FFDB00'
                  />
                  <path
                    id='Vector_2'
                    d='M11.4731 3.49999C11.1831 2.95416 10.6181 2.61499 9.99979 2.61499C9.38146 2.61499 8.81646 2.95416 8.52646 3.50082L2.41146 15.0533C2.27577 15.307 2.20855 15.5917 2.21644 15.8793C2.22433 16.1669 2.30706 16.4475 2.45646 16.6933C2.60371 16.9403 2.81283 17.1446 3.06317 17.2861C3.31351 17.4275 3.59642 17.5013 3.88396 17.5H16.1156C16.7056 17.5 17.2398 17.1983 17.544 16.6933C17.6931 16.4474 17.7757 16.1668 17.7836 15.8793C17.7915 15.5917 17.7244 15.3071 17.589 15.0533L11.4731 3.49999ZM3.88396 15.8333L9.99979 4.28082L16.1198 15.8333H3.88396Z'
                    fill='#FFDB00'
                  />
                </g>
              </svg>
            </div>
            <p className='text-base font-medium text-muted-foreground'>
              Are you sure you want to save and proof changed expression?
            </p>
          </DialogHeader>
          <div className='flex flex-col gap-4 lg:flex-row'>
            <Button
              className='w-full'
              variant='outline'
              onClick={() => {
                void (async () => {
                  // try {
                  //   await axiosAuth.delete(ApiRoutes.USERS_ME)
                  //   await signOut()
                  // } catch (error) {
                  //   showErrorToast(error)
                  // }
                })()
              }}
            >
              No
            </Button>
            <Button
              className='w-full'
              onClick={() => {
                void (async () => {
                  // try {
                  //   await axiosAuth.delete(ApiRoutes.USERS_ME)
                  //   await signOut()
                  // } catch (error) {
                  //   showErrorToast(error)
                  // }
                })()
              }}
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
