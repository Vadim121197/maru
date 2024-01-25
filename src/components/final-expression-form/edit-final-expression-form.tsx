'use client'

import { useEffect, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, EXPRESSION_ID, PROJECT_ID } from '~/lib/axios-instance'
import type { CalculationRes } from '~/types/calculations'
import type { Expression, ExpressionValues, FinalExpressionTools } from '~/types/expressions'
import { ExpressionField } from '../expression-field'
import { InputComponent, TextLabel } from '../form-components'
import { FinalExpressionHelperTable } from './final-expression-helper-table'
import { Button } from '../ui/button'
import { PrecalcValues } from '../precalc-values'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export const EditFinalExpressionForm = ({ expressionId, projectId }: { expressionId: string; projectId: string }) => {
  const axiosAuth = useAxiosAuth()

  const [expression, setExpression] = useState<Expression | undefined>()
  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: '',
    rawData: '',
  })
  const [precalcRes, setPrecalcRes] = useState('')
  const [proveRes, setProveRes] = useState<CalculationRes | undefined>()

  const [period, setPeriod] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  })

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
      const { data } = await axiosAuth.post<string>(ApiRoutes.EXPRESSIONS_DEMO, {
        block_range: null,
        raw_data: expressionValues.rawData,
        expression_type: 'final',
        project_id: projectId,
      })
      setPrecalcRes(data)
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

  const prove = async () => {
    try {
      const { data } = await axiosAuth.post<CalculationRes>(ApiRoutes.CALCULATIONS, {
        expression_id: expression?.id,
        calculation_type: 'one_time',
        from_value: period.from,
        to_value: period.to,
        period_value: 'block',
      })
      setProveRes(data)
    } catch {}
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
          disabled={!expressionValues.rawData || !expressionValues.name}
        >
          Save
        </Button>
      </div>
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
        <p>res={proveRes?.result}</p>
      </Tabs>
    </div>
  )
}
