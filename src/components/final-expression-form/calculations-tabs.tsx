import { useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import type { CalculationResponse } from '~/types/calculations'
import { InputComponent } from '../form-components'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export const CalculationsTabs = ({ projectId, expressionId }: { projectId: string; expressionId: number }) => {
  const axiosAuth = useAxiosAuth()

  const [period, setPeriod] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  })

  const [calculationResponse, setCalculationResponse] = useState<CalculationResponse | undefined>()

  const prove = async () => {
    try {
      const { data } = await axiosAuth.post<CalculationResponse>(ApiRoutes.CALCULATIONS, {
        expression_id: expressionId,
        calculation_type: 'one_time',
        from_value: period.from,
        to_value: period.to,
        period_value: 'block',
        project_id: projectId,
      })

      setCalculationResponse(data)
    } catch {}
  }

  return (
    <Tabs defaultValue='one_time' className='mt-[60px]'>
      <TabsList className='mb-10 w-full'>
        <TabsTrigger value='one_time' className='w-full data-[state=active]:bg-transparent'>
          One time calculation
        </TabsTrigger>
        <TabsTrigger value='periodic' disabled className='w-full data-[state=active]:bg-transparent'>
          Periodic calculation
        </TabsTrigger>
      </TabsList>
      <TabsContent value='one_time' className='flex flex-col gap-[60px]'>
        <div className='grid grid-cols-2 gap-10'>
          <InputComponent
            value={period.from}
            onChange={(e) => {
              setPeriod((state) => ({ ...state, from: e.target.value }))
            }}
            label='From'
          />
          <InputComponent
            value={period.to}
            onChange={(e) => {
              setPeriod((state) => ({ ...state, to: e.target.value }))
            }}
            label='To'
          />
        </div>
        <Button
          className='w-[274px] self-center'
          onClick={() => {
            void (async () => {
              await prove()
            })()
          }}
        >
          Prove
        </Button>
      </TabsContent>
      {calculationResponse && <p>res= {calculationResponse.result}</p>}
    </Tabs>
  )
}
