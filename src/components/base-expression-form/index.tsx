import { useEffect, useMemo, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import { ADDRESS, ApiRoutes } from '~/lib/axios-instance'
import type { PrecalculateResult } from '~/types/calculations'
import type { Expression, ExpressionEvent, ExpressionTools, ExpressionValues } from '~/types/expressions'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { ExpressionField } from '../expression-field'
import { InputComponent, SelectComponent, TextLabel } from '../form-components'
import { PrecalcValues } from '../precalc-values'
import { Button } from '../ui/button'
import { BaseExpressionHelperTable } from './base-expression-helper-table'
import { PrecalcSettings } from '../precalc-settings'


const defaultExpression = 'bought_id == 1 ? tokens_bought : 0'
// 0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7

export const BaseExpressionForm = ({
  projectId,
  updateExpressionList,
}: {
  projectId: number
  updateExpressionList: (expression: Expression, type: 'create' | 'update') => void
}) => {
  const axiosAuth = useAxiosAuth()

  const [contractAddress, setContractAddress] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<ExpressionEvent | undefined>()
  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: '',
    rawData: defaultExpression,
    aggregate: undefined,
  })
  const [precalcRes, setPrecalcRes] = useState<PrecalculateResult[]>([])

  const [tools, setTools] = useState<ExpressionTools | undefined>()

  useEffect(() => {
    if (!contractAddress) {
      setTools(undefined)
      setSelectedEvent(undefined)
      return
    }

    void (async () => {
      try {
        const { data } = await axiosAuth.get<ExpressionTools>(
          ApiRoutes.EXPRESSIONS_ADDRESS_TOOLS.replace(ADDRESS, contractAddress),
        )

        setTools(data)
        setSelectedEvent(data.events[0])
        setExpressionValues((state) => ({ ...state, aggregate: data.aggregate_operations[0]?.name }))
      } catch {
        setTools(undefined)
        setSelectedEvent(undefined)
      }
    })()
  }, [contractAddress, axiosAuth])

  const precalculate = async () => {
    if (!selectedEvent) return
    try {
      const { data } = await axiosAuth.post<PrecalculateResult[]>(ApiRoutes.EXPRESSIONS_DEMO, {
        contract_address: contractAddress,
        event: `${selectedEvent.name}(${selectedEvent.params.map((i) => i.arg_type).join(',')})`,
        block_range: null,
        project_id: projectId,
        raw_data: expressionValues.rawData,
        aggregate_operation: expressionValues.aggregate,
        expression_type: 'base',
      })
      setPrecalcRes(data)
    } catch (error) {}
  }

  const save = async () => {
    if (
      !selectedEvent ||
      !expressionValues.rawData ||
      !expressionValues.name ||
      !contractAddress ||
      !expressionValues.aggregate
    )
      return
    try {
      const { data } = await axiosAuth.post<Expression>(ApiRoutes.EXPRESSIONS, {
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
        project_id: projectId,
        contract_address: contractAddress,
        aggregate_operation: expressionValues.aggregate,
        event: `${selectedEvent.name}(${selectedEvent.params.map((i) => i.arg_type).join(',')})`,
        expression_type: 'base',
      })
      updateExpressionList(data, 'create')
    } catch (error) {
      const err = error as AxiosError
      toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
    }
  }

  const eventsOptions = useMemo(() => {
    if (!tools) return []

    return tools.events.map((ev) => {
      return {
        value: ev.name,
        label: ev.name,
      }
    })
  }, [tools])

  return (
    <div className='flex w-full flex-col'>
      <div className='grid grid-cols-2 gap-4'>
        <InputComponent
          value={contractAddress}
          onChange={(e) => {
            setContractAddress(e.target.value)
          }}
          label='Contact address'
        />
        {tools && (
          <SelectComponent
            value={selectedEvent?.name}
            onValueChange={(e) => {
              setSelectedEvent(tools.events.find((event) => event.name === e))
            }}
            options={eventsOptions}
            label='Event'
            triggerClassName='h-11 text-base font-medium text-muted'
          />
        )}
      </div>
      {selectedEvent && tools && (
        <div className='flex flex-col'>
          <div className='flex flex-col gap-[38px] border-b pb-4'>
            <div className='flex w-full flex-col gap-2'>
              <TextLabel label='Expression' />
              <ExpressionField
                aggregateFunctions={tools.aggregate_operations}
                expressionValues={expressionValues}
                setExpressionValues={setExpressionValues}
              />
            </div>
            <BaseExpressionHelperTable tools={tools} event={selectedEvent} setExpressionValues={setExpressionValues} />
          </div>
          <PrecalcSettings projectId={projectId} />
          <div className='mb-10 grid grid-cols-2 gap-4'>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => {
                void (async () => {
                  await precalculate()
                })()
              }}
            >
              Precalculation
            </Button>
            <Button
              className='w-full'
              onClick={() => {
                void (async () => {
                  await save()
                })()
              }}
              disabled={!expressionValues.rawData || !contractAddress || !expressionValues.aggregate}
            >
              Save
            </Button>
          </div>
          {precalcRes.length ? <PrecalcValues res={precalcRes} /> : <></>}
        </div>
      )}
    </div>
  )
}
