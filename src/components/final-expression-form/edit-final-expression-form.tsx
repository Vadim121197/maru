'use client'

import { useEffect, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, EXPRESSION_ID, PROJECT_ID } from '~/lib/axios-instance'
import type { Expression, ExpressionValues, FinalExpressionTools } from '~/types/expressions'
import type { PrecalculateResult } from '~/types/calculations'
import { ExpressionField } from '../expression-field'
import { TextLabel } from '../form-components'
import { PrecalcValues } from '../precalc-values'
import { FinalExpressionHelperTable } from './final-expression-helper-table'
import { PrecalcSettings } from '../precalc-settings'
import { Button } from '../ui/button'
import { CalculationsTabs } from './calculations-tabs'

export const EditFinalExpressionForm = ({ expressionId, projectId }: { expressionId: string; projectId: string }) => {
  const axiosAuth = useAxiosAuth()

  const [expression, setExpression] = useState<Expression | undefined>()
  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: '',
    rawData: '',
  })
  const [precalculationResult, setPrecalculationResult] = useState<PrecalculateResult[]>([])

  const [tools, setTools] = useState<FinalExpressionTools | undefined>()

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
        })

        const { data: tools } = await axiosAuth.get<FinalExpressionTools>(
          ApiRoutes.PROJECTS_PROJECT_ID_TOOLS.replace(PROJECT_ID, data.project_id.toString()),
        )

        setTools(tools)
      } catch {}
    })()
  }, [axiosAuth, expressionId])

  const precalculate = async () => {
    try {
      const { data } = await axiosAuth.post<PrecalculateResult[]>(ApiRoutes.EXPRESSIONS_DEMO, {
        block_range: null,
        raw_data: expressionValues.rawData,
        expression_type: 'final',
        project_id: projectId,
      })
      setPrecalculationResult(data)
    } catch (error) {}
  }

  const save = async () => {
    if (!expressionValues.rawData || !expressionValues.name || !expression?.id) return
    try {
      await axiosAuth.put(ApiRoutes.EXPRESSIONS_EXPRESSION_ID.replace(EXPRESSION_ID, expression.id.toString()), {
        ...expression,
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
      })
    } catch (error) {}
  }

  if (!expression || !tools) return <></>

  return (
    <div className='flex w-full flex-col gap-6 bg-card p-4 lg:p-6'>
      <div className='flex flex-col'>
        <div className='flex flex-col gap-[38px] border-b pb-4'>
          <div className='flex w-full flex-col gap-2'>
            <TextLabel label='Expression' />
            <ExpressionField expressionValues={expressionValues} setExpressionValues={setExpressionValues} />
          </div>
          <FinalExpressionHelperTable tools={tools} setExpressionValues={setExpressionValues} />
        </div>
        <PrecalcSettings projectId={projectId} />
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
        <PrecalcValues res={precalculationResult} />
        <Button
          className='mt-10 w-full self-center lg:mt-20 lg:w-[274px]'
          onClick={() => {
            void (async () => {
              await save()
            })()
          }}
          disabled={!expressionValues.rawData || !expressionValues.name}
        >
          Save
        </Button>
      </div>
      <CalculationsTabs projectId={projectId} expressionId={expression.id} />
    </div>
  )
}
