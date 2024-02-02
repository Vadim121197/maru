'use client'

import { useEffect, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { ExpressionCreateResponse, ExpressionValues, FinalExpressionTools } from '~/types/expressions'
import { ExpressionField } from '../expression-field'
import { TextLabel } from '../form-components'
import { PrecalcValues } from '../precalc-values'
import type { PrecalculateResult } from '~/types/calculations'
import { FinalExpressionHelperTable } from './final-expression-helper-table'
import { PrecalcSettings } from '../precalc-settings'
import { Button } from '../ui/button'
import { CalculationsTabs } from './calculations-tabs'

const defaultExpression = 'bought_id == 1 ? tokens_bought : 0'

export const FinalExpressionForm = ({ projectId }: { projectId: string }) => {
  const axiosAuth = useAxiosAuth()

  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: '',
    rawData: defaultExpression,
  })

  const [precalculationResult, setPrecalculationResult] = useState<PrecalculateResult[]>([])
  const [createdExpression, setCreatedExpression] = useState<ExpressionCreateResponse | undefined>()

  const [tools, setTools] = useState<FinalExpressionTools | undefined>()

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await axiosAuth.get<FinalExpressionTools>(
          ApiRoutes.PROJECTS_PROJECT_ID_TOOLS.replace(PROJECT_ID, projectId),
        )

        setTools(data)
      } catch {}
    })()
  }, [projectId, axiosAuth])

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
    if (!expressionValues.rawData || !expressionValues.name) return
    try {
      const { data } = await axiosAuth.post<ExpressionCreateResponse>(ApiRoutes.EXPRESSIONS, {
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
        project_id: projectId,
        expression_type: 'final',
      })

      setCreatedExpression(data)
    } catch (error) {}
  }

  return (
    <div className='flex w-full flex-col gap-6 bg-card p-4 lg:p-6'>
      {tools && (
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
      )}
      {createdExpression && <CalculationsTabs projectId={projectId} expressionId={createdExpression.id} />}
    </div>
  )
}
