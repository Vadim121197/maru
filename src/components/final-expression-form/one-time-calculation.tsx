import { useMemo, useState } from 'react'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { ProofType, type Proof, ProofPeridoValue } from '~/types/proof'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { InputBlock } from '../input-block'
import { Button } from '../ui/button'

export const OneTimeCalculation = ({ expressionId }: { expressionId: number }) => {
  const axiosAuth = useAxiosAuth()

  const [period, setPeriod] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  })

  const prove = async () => {
    try {
      await axiosAuth.post<Proof>(ApiRoutes.PROOFS, {
        expression_id: expressionId,
        proof_type: ProofType.ONE_TIME,
        from_value: period.from,
        to_value: period.to,
        period_value: ProofPeridoValue.BLOCK,
      })
    } catch (error) {
      const err = error as AxiosError
      toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
    }
  }

  const addressValidationErrors = useMemo(() => {
    if (!period.from || !period.to) return false
    return Number(period.from) > Number(period.to)
  }, [period])

  return (
    <>
      <div className='grid grid-cols-2 gap-10'>
        <InputBlock
          className='w-full'
          type='number'
          label='From'
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
              checkFn: () => addressValidationErrors,
            },
          ]}
        />
        <InputBlock
          className='w-full'
          type='number'
          label='To'
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
        disabled={addressValidationErrors || !period.from || !period.to}
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
