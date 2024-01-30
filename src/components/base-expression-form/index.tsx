'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import { ADDRESS, ApiRoutes } from '~/lib/axios-instance'
import { expressionTypes, type Expressions } from '~/lib/expressions'
import type { ExpressionEvent, ExpressionTools, ExpressionValues } from '~/types/expressions'
import { ExpressionField } from '../expression-field'
import { InputComponent, SelectComponent, TextLabel } from '../form-components'
import { PrecalcValues } from '../precalc-values'
import { Button } from '../ui/button'
import { BaseExpressionHelperTable } from './base-expression-helper-table'

const defaultExpression = 'bought_id == 1 ? tokens_bought : 0'

export const BaseExpressionForm = ({ projectId }: { projectId: string }) => {
  const axiosAuth = useAxiosAuth()
  const router = useRouter()

  const [selectedSource, setSelectedSource] = useState<Expressions | undefined>(expressionTypes[0]?.value)
  const [contractAddress, setContractAddress] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<ExpressionEvent | undefined>()
  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: '',
    rawData: defaultExpression,
    aggregate: undefined,
  })
  const [precalcRes, setPrecalcRes] = useState('')

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
      const { data } = await axiosAuth.post<string>(ApiRoutes.EXPRESSIONS_DEMO, {
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
      await axiosAuth.post(ApiRoutes.EXPRESSIONS, {
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
        project_id: projectId,
        contract_address: contractAddress,
        aggregate_operation: expressionValues.aggregate,
        event: `${selectedEvent.name}(${selectedEvent.params.map((i) => i.arg_type).join(',')})`,
        expression_type: 'base',
      })
      router.push(`/projects/${projectId}`)
    } catch (error) {}
  }

  const eventsOptions = useMemo(() => {
    if (!tools) return []

    return tools.events.map((ev) => {
      return {
        value: ev.name,
        label: `${ev.name}(${ev.params.map((i) => i.name + ' ' + i.arg_type).join(', ')})`,
      }
    })
  }, [tools])

  return (
    <div className='flex w-full flex-col gap-6 bg-card p-4 lg:p-6'>
      <SelectComponent
        value={selectedSource}
        onValueChange={(e) => {
          setSelectedSource(e as Expressions)
        }}
        options={expressionTypes}
        label='Data source'
      />
      {selectedSource && (
        <InputComponent
          value={contractAddress}
          onChange={(e) => {
            setContractAddress(e.target.value)
          }}
          label='Contact address'
        />
      )}
      {tools && (
        <SelectComponent
          value={selectedEvent?.name}
          onValueChange={(e) => {
            setSelectedEvent(tools.events.find((event) => event.name === e))
          }}
          options={eventsOptions}
          label='Event'
          triggerClassName='gap-4 py-3 text-left text-sm font-normal'
        />
      )}
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
          <div className='mb-6 mt-4 text-[12px] font-normal leading-[18px] lg:mb-10 lg:text-sm'>
            The precalculation uses events in the last 1000 blocks.{' '}
            <span className='text-muted-foreground underline'>Change precalc settings</span>
          </div>
          <Button
            variant='outline'
            className='mb-10 w-full self-center lg:w-[274px]'
            onClick={() => {
              void (async () => {
                await precalculate()
              })()
            }}
          >
            Precalculation
          </Button>
          <PrecalcValues res={precalcRes} />
          <Button
            className='mt-10 w-full self-center lg:mt-20 lg:w-[274px]'
            onClick={() => {
              void (async () => {
                await save()
              })()
            }}
            disabled={
              !expressionValues.rawData || !expressionValues.name || !contractAddress || !expressionValues.aggregate
            }
          >
            Save
          </Button>
        </div>
      )}
    </div>
  )
}
