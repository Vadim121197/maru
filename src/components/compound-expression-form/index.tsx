import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import type { AxiosError } from 'axios'

import { useProject } from '~/app/projects/[id]/ProjectProvider'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import type { PrecalculateResult } from '~/types/calculations'
import { EventDataType, type Expression, type ExpressionValues, type FinalExpressionTools } from '~/types/expressions'

import { FinalExpressionField } from '../expression-field'
import { TextLabel } from '../form-components'
import { PrecalcSettings } from '../precalc-settings'
import { PrecalcValues } from '../precalc-values'
import { Button } from '../ui/button'
import { CompoundExpressionHelperTable } from './compound-expression-helper-table'

export const CompoundExpressionForm = ({
  updateExpressionList,
}: {
  updateExpressionList: (expression: Expression, type: 'create' | 'update') => void
}) => {
  const { project, setProject } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()
  const textarea = useRef<HTMLTextAreaElement>(null)

  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: '',
    rawData: '',
  })

  const [precalculationResult, setPrecalculationResult] = useState<PrecalculateResult[]>([])

  const [tools, setTools] = useState<FinalExpressionTools | undefined>()

  useEffect(() => {
    if (!project?.id) return
    void (async () => {
      try {
        const { data } = await axiosAuth.get<FinalExpressionTools>(
          ApiRoutes.PROJECTS_PROJECT_ID_TOOLS.replace(PROJECT_ID, project.id.toString()),
        )

        console.log({ tools: data })

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
        data_source: EventDataType.EXPRESSIONS,
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
        data_source: EventDataType.EXPRESSIONS,
      })

      updateExpressionList(data, 'create')
    } catch (error) {
      const err = error as AxiosError
      toast.error(`${err.message} (${err.config?.url}, ${err.config?.method})`)
    }
  }

  return (
    <div className='mt-6 flex w-full flex-col gap-6'>
      {tools && (
        <div className='flex flex-col'>
          <div className='flex flex-col gap-[38px] border-b pb-4'>
            <div className='flex w-full flex-col gap-2'>
              <TextLabel label='Expression' />
              <FinalExpressionField
                expressionValues={expressionValues}
                setExpressionValues={setExpressionValues}
                textareaRef={textarea}
              />
            </div>
            <CompoundExpressionHelperTable
              tools={tools}
              setExpressionValues={setExpressionValues}
              textareaRef={textarea}
            />
          </div>
          <PrecalcSettings
            project={project}
            updateProject={(newProject) => {
              setProject(newProject)
            }}
          />
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-[30px]'>
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
