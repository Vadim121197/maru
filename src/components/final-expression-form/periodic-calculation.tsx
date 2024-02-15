import type { AxiosError } from 'axios'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { ProofType, type Proof, ProofPeridoValue } from '~/types/proof'
import { InputBlock } from '../input-block'
import { Button } from '../ui/button'

export const PeriodicCalculation = ({ expressionId }: { expressionId: number }) => {
  const axiosAuth = useAxiosAuth()

  const [period, setPeriod] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  })
  const [chunkSize, setChunkSize] = useState<string>('')

  const prove = async () => {
    try {
      await axiosAuth.post<Proof>(ApiRoutes.PROOFS, {
        expression_id: expressionId,
        proof_type: ProofType.PERIODIC,
        from_value: period.from,
        to_value: period.to,
        chunk_size: chunkSize,
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
      <div className='grid grid-cols-3 gap-5'>
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
        <InputBlock
          className='w-full'
          type='number'
          label='Chunk size'
          value={chunkSize}
          onChange={(e) => {
            setChunkSize(e.target.value)
          }}
        />
      </div>
      <Button
        className='w-[274px] self-center'
        disabled={addressValidationErrors || !period.from || !period.to || !chunkSize}
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
