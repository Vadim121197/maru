'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAxiosAuth from '~/hooks/axios-auth'
import { ADDRESS, ApiRoutes, EXPRESSION_ID } from '~/lib/axios-instance'
import type { Expression, ExpressionEvent, ExpressionTools, ExpressionValues } from '~/types/expressions'
import { TextLabel } from '../form-components'
import { ExpressionField } from '../expression-field'
import { BaseExpressionHelperTable } from './base-expression-helper-table'
import { Button } from '../ui/button'
import { PrecalcValues } from '../precalc-values'

export const EditBaseExpressionForm = ({ expressionId }: { expressionId: string }) => {
  const axiosAuth = useAxiosAuth()
  const router = useRouter()

  const [expression, setExpression] = useState<Expression | undefined>()
  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: '',
    rawData: '',
    aggregate: undefined,
  })
  const [selectedEvent, setSelectedEvent] = useState<ExpressionEvent | undefined>()
  const [precalcRes, setPrecalcRes] = useState('')
  const [tools, setTools] = useState<ExpressionTools | undefined>()

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await axiosAuth.get<Expression>(
          ApiRoutes.EXPRESSIONS_EXPRESSION_ID.replace(EXPRESSION_ID, expressionId),
        )
        setExpression(data)

        setExpressionValues({
          name: data.name,
          rawData: data.raw_data,
          aggregate: data.aggregate_operation,
        })

        const { data: tools } = await axiosAuth.get<ExpressionTools>(
          ApiRoutes.EXPRESSIONS_ADDRESS_TOOLS.replace(ADDRESS, data.contract_address),
        )

        setTools(tools)

        setSelectedEvent(tools.events.find((ev) => ev.name === data.event.split('(')[0]))
      } catch {}
    })()
  }, [axiosAuth, expressionId])

  const precalculate = async () => {
    try {
      const { data } = await axiosAuth.post<string>(ApiRoutes.EXPRESSIONS_DEMO, {
        raw_data: expressionValues.rawData,
        projects_id: expression?.project_id,
        contract_address: expression?.contract_address,
        block_range: null,
        aggregate_operation: expressionValues.aggregate,
        event: expression?.event,
        expression_type: 'base',
      })
      setPrecalcRes(data)
    } catch (error) {}
  }

  const save = async () => {
    if (!expression) return
    try {
      await axiosAuth.put(ApiRoutes.EXPRESSIONS_EXPRESSION_ID.replace(EXPRESSION_ID, expression.id.toString()), {
        ...expression,
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
        aggregate_operation: expressionValues.aggregate,
      })
      router.push(`/projects/${expression.project_id}`)
    } catch (error) {}
  }

  return (
    <div className='flex w-full flex-col gap-6 bg-card p-4 lg:p-6'>
      <div className='flex flex-col'>
        <div className='flex flex-col gap-[38px] border-b pb-4'>
          <div className='flex w-full flex-col gap-2'>
            <TextLabel label='Expression' />
            <ExpressionField
              aggregateFunctions={tools?.aggregate_operations ?? []}
              expressionValues={expressionValues}
              setExpressionValues={setExpressionValues}
            />
          </div>
          {tools && selectedEvent && (
            <BaseExpressionHelperTable tools={tools} event={selectedEvent} setExpressionValues={setExpressionValues} />
          )}
        </div>
        <div className='mb-6 lg:mb-10 mt-4 text-[12px] leading-[18px] lg:text-sm font-normal'>
          The precalculation uses events in the last 1000 blocks.{' '}
          <span className='text-muted-foreground underline'>Change precalc settings</span>
        </div>
        <Button
          variant='outline'
          className='mb-10 w-full lg:w-[274px] self-center'
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
          className='mt-10 lg:mt-20 w-full lg:w-[274px] self-center'
          onClick={() => {
            void (async () => {
              await save()
            })()
          }}
          disabled={!expressionValues.rawData || !expressionValues.name || !expressionValues.aggregate}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
