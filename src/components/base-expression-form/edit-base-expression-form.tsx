import { useEffect, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import type { PrecalculateResult } from '~/types/calculations'
import { ADDRESS, ApiRoutes, EXPRESSION_ID } from '~/lib/axios-instance'
import type { Expression, ExpressionEvent, ExpressionTools, ExpressionValues } from '~/types/expressions'
import type { Project } from '~/types/project'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { TextLabel } from '../form-components'
import { ExpressionField } from '../expression-field'
import { BaseExpressionHelperTable } from './base-expression-helper-table'
import { Button } from '../ui/button'
import { PrecalcValues } from '../precalc-values'
import { PrecalcSettings } from '../precalc-settings'

interface EditBaseExpressionFormProps {
  expression: Expression
  project: Project
  updateProject: (newProject: Project) => void
  updateExpressionList: (expression: Expression, type: 'create' | 'update') => void
}

export const EditBaseExpressionForm = ({
  expression,
  project,
  updateProject,
  updateExpressionList,
}: EditBaseExpressionFormProps) => {
  const axiosAuth = useAxiosAuth()

  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: expression.name,
    rawData: expression.raw_data,
    aggregate: expression.aggregate_operation,
  })
  const [selectedEvent, setSelectedEvent] = useState<ExpressionEvent | undefined>()
  const [precalcRes, setPrecalcRes] = useState<PrecalculateResult[]>([])
  const [tools, setTools] = useState<ExpressionTools | undefined>()

  useEffect(() => {
    void (async () => {
      try {
        const { data: tools } = await axiosAuth.get<ExpressionTools>(
          ApiRoutes.EXPRESSIONS_ADDRESS_TOOLS.replace(ADDRESS, expression.contract_address),
        )

        setTools(tools)

        setSelectedEvent(tools.events.find((ev) => ev.name === expression.event.split('(')[0]))
      } catch {}
    })()
  }, [axiosAuth, expression])

  const precalculate = async () => {
    try {
      const { data } = await axiosAuth.post<PrecalculateResult[]>(`${ApiRoutes.EXPRESSIONS}/demo`, {
        raw_data: expressionValues.rawData,
        projects_id: expression.project_id,
        contract_address: expression.contract_address,
        block_range: project.block_range,
        aggregate_operation: expressionValues.aggregate,
        event: expression.event,
        expression_type: 'base',
      })

      setPrecalcRes(data)
    } catch (error) {}
  }

  const save = async () => {
    try {
      const { data } = await axiosAuth.put<Expression>(
        ApiRoutes.EXPRESSIONS_EXPRESSION_ID.replace(EXPRESSION_ID, expression.id.toString()),
        {
          ...expression,
          raw_data: expressionValues.rawData,
          name: expressionValues.name,
          aggregate_operation: expressionValues.aggregate,
        },
      )

      updateExpressionList(data, 'update')
    } catch (error) {
      const err = error as AxiosError
      toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
    }
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
        <PrecalcSettings project={project} updateProject={updateProject} />
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
            disabled={!expressionValues.rawData || !expressionValues.name || !expressionValues.aggregate}
          >
            Save
          </Button>
        </div>
        {precalcRes.length ? <PrecalcValues res={precalcRes} /> : <></>}
      </div>
    </div>
  )
}
