import { useEffect, useRef, useState } from 'react'

import { useProject } from '~/app/projects/[id]/ProjectProvider'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, PROJECT_ID } from '~/lib/axios-instance'
import { showErrorToast } from '~/lib/show-error-toast'
import type { PrecalculateResult } from '~/types/calculations'
import {
  EventDataType,
  ExpressionActions,
  type Expression,
  type ExpressionValues,
  type FinalExpressionTools,
} from '~/types/expressions'

import { FinalExpressionField } from '../expression-field'
import { TextLabel } from '../form-components'
import { PrecalcSettings } from '../precalc-settings'
import { Precalculations } from '../precalc-values'
import { Button } from '../ui/button'
import { CalculationsTabs } from './calculations-tabs'
import { CompoundHelperTable } from './compound-helper-table'

export const CreateCompound = ({
  updateExpressionList,
}: {
  updateExpressionList: (expression: Expression) => void
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
    try {
      const { data } = await axiosAuth.post<Expression>(ApiRoutes.EXPRESSIONS, {
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
        project_id: project.id,
        data_source: EventDataType.EXPRESSIONS,
      })

      updateExpressionList(data)
      return data.id
    } catch (error) {
      showErrorToast(error)
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
            <CompoundHelperTable tools={tools} setExpressionValues={setExpressionValues} textareaRef={textarea} />
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
              disabled={!expressionValues.rawData}
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
              disabled={!expressionValues.rawData}
            >
              Save
            </Button>
          </div>
          {precalculationResult.length ? <Precalculations res={precalculationResult} /> : <></>}
          <div className='mt-6'>
            <CalculationsTabs save={save} action={ExpressionActions.CREATE} />
          </div>
        </div>
      )}
    </div>
  )
}
