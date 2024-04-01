import { type Dispatch, type SetStateAction } from 'react'

import { MIN_BLOCK_HEIGHT } from '~/lib/constants'
import type { Period } from '~/types/calculations'

import { InputBlock } from '../input-block'
import { Button } from '../ui/button'
import type { CalculationsTabsProps } from './calculations-tabs'

interface OneTimeCalculationProps {
  period: Period
  minBlockHeightError: boolean
  addressValidationErrors: boolean
  prove: () => Promise<void>
  setPeriod: Dispatch<SetStateAction<Period>>
  setOpenModal: Dispatch<SetStateAction<boolean>>
  isChanged: CalculationsTabsProps['isChanged']
}

export const OneTimeCalculation = ({
  period,
  minBlockHeightError,
  addressValidationErrors,
  prove,
  setPeriod,
  setOpenModal,
  isChanged,
}: OneTimeCalculationProps) => {
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
    </>
  )
}
