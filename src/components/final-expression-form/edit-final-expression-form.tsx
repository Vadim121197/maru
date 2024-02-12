import { useEffect, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, EXPRESSION_ID, PROJECT_ID } from '~/lib/axios-instance'
import type { Expression, ExpressionValues, FinalExpressionTools } from '~/types/expressions'
import type { Project } from '~/types/project'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import type { PrecalculateResult } from '~/types/calculations'
import { ExpressionField } from '../expression-field'
import { TextLabel } from '../form-components'
import { PrecalcValues } from '../precalc-values'
import { FinalExpressionHelperTable } from './final-expression-helper-table'
import { PrecalcSettings } from '../precalc-settings'
import { Button } from '../ui/button'

export const EditFinalExpressionForm = ({
  project,
  expression,
  updateProject,
  updateExpressionList,
}: {
  project: Project
  expression: Expression
  updateProject: (newProject: Project) => void
  updateExpressionList: (expression: Expression, type: 'create' | 'update') => void
}) => {
  const axiosAuth = useAxiosAuth()

  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: expression.name,
    rawData: expression.raw_data,
  })
  const [precalculationResult, setPrecalculationResult] = useState<PrecalculateResult[]>([])

  const [tools, setTools] = useState<FinalExpressionTools | undefined>()

  useEffect(() => {
    void (async () => {
      try {
        const { data: tools } = await axiosAuth.get<FinalExpressionTools>(
          ApiRoutes.PROJECTS_PROJECT_ID_TOOLS.replace(PROJECT_ID, expression.project_id.toString()),
        )

        setTools(tools)
      } catch {}
    })()
  }, [axiosAuth, expression])

  const precalculate = async () => {
    try {
      const { data } = await axiosAuth.post<PrecalculateResult[]>(ApiRoutes.EXPRESSIONS_DEMO, {
        block_range: project.block_range,
        raw_data: expressionValues.rawData,
        expression_type: 'final',
        project_id: project.id,
      })
      setPrecalculationResult(data)
    } catch (error) {}
  }

  const save = async () => {
    if (!expressionValues.rawData || !expressionValues.name || !expression.id) return
    try {
      const { data } = await axiosAuth.put<Expression>(
        ApiRoutes.EXPRESSIONS_EXPRESSION_ID.replace(EXPRESSION_ID, expression.id.toString()),
        {
          ...expression,
          raw_data: expressionValues.rawData,
          name: expressionValues.name,
        },
      )
      updateExpressionList(data, 'update')
    } catch (error) {
      const err = error as AxiosError
      toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
    }
  }

  if (!tools) return <></>

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
            disabled={!expressionValues.rawData || !expressionValues.name}
          >
            Save
          </Button>
        </div>
        {precalculationResult.length ? <PrecalcValues res={precalculationResult} /> : <></>}
      </div>
      {/* <CalculationsTabs projectId={projectId} expressionId={expression.id} /> */}
    </div>
  )
}
