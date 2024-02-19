import { useEffect, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { Expression, ExpressionValues, FinalExpressionTools } from '~/types/expressions'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import type { PrecalculateResult } from '~/types/calculations'
import { ExpressionField } from '../expression-field'
import { TextLabel } from '../form-components'
import { PrecalcValues } from '../precalc-values'
import { FinalExpressionHelperTable } from './final-expression-helper-table'
import { PrecalcSettings } from '../precalc-settings'
import { Button } from '../ui/button'

export const FinalExpressionForm = ({
  updateExpressionList,
}: {
  updateExpressionList: (expression: Expression, type: 'create' | 'update') => void
}) => {
  const { project, setProject } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()

  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: '',
    rawData: '',
  })

  const [precalculationResult, setPrecalculationResult] = useState<PrecalculateResult[]>([])
  // const [createdExpression, setCreatedExpression] = useState<ExpressionCreateResponse | undefined>()

  const [tools, setTools] = useState<FinalExpressionTools | undefined>()

  useEffect(() => {
    if (!project?.id) return
    void (async () => {
      try {
        const { data } = await axiosAuth.get<FinalExpressionTools>(
          ApiRoutes.PROJECTS_PROJECT_ID_TOOLS.replace(PROJECT_ID, project.id.toString()),
        )

        setTools(data)
      } catch {}
    })()
  }, [project?.id, axiosAuth])

  if (!project) return

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
    if (!expressionValues.rawData || !expressionValues.name) return
    try {
      const { data } = await axiosAuth.post<Expression>(ApiRoutes.EXPRESSIONS, {
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
        project_id: project.id,
        expression_type: 'final',
      })

      updateExpressionList(data, 'create')
    } catch (error) {
      const err = error as AxiosError
      toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
    }
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
          <PrecalcSettings
            project={project}
            updateProject={(newProject) => {
              setProject(newProject)
            }}
          />
          <div className='grid grid-cols-2 gap-4'>
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
      )}
      {/* {createdExpression && <CalculationsTabs projectId={projectId} expressionId={createdExpression.id} />} */}
    </div>
  )
}
