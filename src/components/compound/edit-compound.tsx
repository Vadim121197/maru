import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

import { ChevronDown, Trash, X } from 'lucide-react'

import { useProject } from '~/app/projects/[id]/project-provider'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes, EXPRESSION_ID, PROJECT_ID } from '~/lib/axios-instance'
import { showErrorToast } from '~/lib/show-error-toast'
import type { PrecalculateResult } from '~/types/calculations'
import {
  EventDataType,
  ExpressionActions,
  ExpressionTypeResponse,
  type Expression,
  type ExpressionValues,
  type FinalExpressionTools,
} from '~/types/expressions'

import { FinalExpressionField } from '../expression-field'
import { PrecalcSettings } from '../precalc-settings'
import { Precalculations } from '../precalc-values'
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'
import { CalculationsTabs } from './calculations-tabs'
import { CompoundHelperTable } from './compound-helper-table'

interface EditCompoundProps {
  expression: Expression
  selectedExpression: string
  updateExpressionList: (expression: Expression) => void
  deleteExpression?: (id: number, type: ExpressionTypeResponse) => void
  setSelectedExpression: Dispatch<SetStateAction<string>>
}

export const EditCompound = ({
  expression,
  selectedExpression,
  updateExpressionList,
  deleteExpression,
  setSelectedExpression,
}: EditCompoundProps) => {
  const { project, setProject } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()
  const textarea = useRef<HTMLTextAreaElement>(null)

  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: expression.name ?? '',
    rawData: expression.raw_data,
  })
  const [precalculationResult, setPrecalculationResult] = useState<PrecalculateResult[]>([])

  const [tools, setTools] = useState<FinalExpressionTools | undefined>()

  useEffect(() => {
    if (selectedExpression !== expression.id.toString()) return
    void (async () => {
      try {
        const { data: tools } = await axiosAuth.get<FinalExpressionTools>(
          ApiRoutes.PROJECTS_PROJECT_ID_TOOLS.replace(PROJECT_ID, expression.project_id.toString()),
        )

        setTools(tools)
      } catch {}
    })()
  }, [axiosAuth, expression, selectedExpression])

  const precalculate = async () => {
    try {
      const { data } = await axiosAuth.post<PrecalculateResult[]>(ApiRoutes.EXPRESSIONS_DEMO, {
        block_range: project?.block_range,
        raw_data: expressionValues.rawData,
        data_source: EventDataType.EXPRESSIONS,
        project_id: project?.id,
        ...(expressionValues.name && { name: expressionValues.name }),
      })
      setPrecalculationResult(data)
    } catch (error) {}
  }

  const save = async () => {
    if (!expressionValues.rawData || !expression.id) return
    try {
      const { data } = await axiosAuth.put<Expression>(
        ApiRoutes.EXPRESSIONS_EXPRESSION_ID.replace(EXPRESSION_ID, expression.id.toString()),
        {
          ...expression,
          raw_data: expressionValues.rawData,
          name: expressionValues.name,
        },
      )
      updateExpressionList(data)

      return data.id
    } catch (error) {
      showErrorToast(error)
    }
  }

  const isChanged = () => {
    return expression.raw_data !== expressionValues.rawData || expression.name !== expressionValues.name
  }

  const resetEdits = () => {
    setExpressionValues({
      rawData: expression.raw_data,
      name: expression.name ?? '',
    })
  }

  if (!project) return <></>

  return (
    <AccordionItem value={expression.id.toString()} key={expression.id}>
      <div className='flex w-full flex-col gap-2 border-2 p-4 data-[state=open]:border-b-0 data-[state=open]:px-3 data-[state=open]:pb-0 data-[state=open]:pt-3 lg:gap-3 lg:data-[state=open]:px-5'>
        {selectedExpression === expression.id.toString() ? (
          <div className='flex w-full flex-col gap-4'>
            <div className='self-end'>
              <X
                strokeWidth={1}
                className='size-5 cursor-pointer lg:size-6'
                onClick={() => {
                  setSelectedExpression('')
                }}
              />
            </div>
            <FinalExpressionField
              expressionValues={expressionValues}
              setExpressionValues={setExpressionValues}
              className='bg-card'
              textAreaClassName='border-2 border-border'
              textareaRef={textarea}
            />
          </div>
        ) : (
          <>
            <div className='flex w-full items-center justify-between'>
              <p className='px-1 text-sm font-medium lg:text-base'>{expression.name}</p>
              {deleteExpression && (
                <div className='flex items-center gap-2'>
                  <div>
                    <Trash
                      strokeWidth={1}
                      className='size-4 cursor-pointer text-foreground hover:opacity-50 lg:size-5'
                      onClick={() => {
                        deleteExpression(expression.id, ExpressionTypeResponse.COMPOUND)
                      }}
                    />
                  </div>
                  <AccordionTrigger>
                    <ChevronDown className='size-4 cursor-pointer text-foreground hover:opacity-50 lg:size-5' />
                  </AccordionTrigger>
                </div>
              )}
            </div>
            <p className='px-1 text-[12px] font-normal leading-[18px] text-muted-foreground lg:text-sm'>
              {expression.raw_data}
            </p>
          </>
        )}
      </div>

      <AccordionContent>
        <div className='flex w-full flex-col border-x-2 border-b-2 px-3 pb-[62px] pt-6 lg:px-5'>
          <div className='flex flex-col'>
            <div className='flex flex-col gap-[38px] border-b pb-4'>
              {tools && (
                <CompoundHelperTable tools={tools} setExpressionValues={setExpressionValues} textareaRef={textarea} />
              )}
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
            {precalculationResult.length ? <Precalculations res={precalculationResult} /> : <></>}
          </div>
          <CalculationsTabs
            expressionId={expression.id}
            save={save}
            action={ExpressionActions.UPDATE}
            isChanged={isChanged}
            resetEdits={resetEdits}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
