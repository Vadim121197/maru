import { useEffect, useState } from 'react'
import useAxiosAuth from '~/hooks/axios-auth'
import { Trash } from 'lucide-react'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import { ApiRoutes, EXPRESSION_ID, PROJECT_ID } from '~/lib/axios-instance'
import type { Expression, ExpressionValues, FinalExpressionTools } from '~/types/expressions'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import type { PrecalculateResult } from '~/types/calculations'
import { ExpressionField } from '../expression-field'
import { PrecalcValues } from '../precalc-values'
import { FinalExpressionHelperTable } from './final-expression-helper-table'
import { PrecalcSettings } from '../precalc-settings'
import { Button } from '../ui/button'
import { CalculationsTabs } from './calculations-tabs'
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

interface EditFinalExpressionFormProps {
  expression: Expression
  selectedExpression: string
  updateExpressionList: (expression: Expression, type: 'create' | 'update') => void
  deleteExpression: (id: number, type: 'base_expressions' | 'final_expressions') => Promise<void>
}

export const EditFinalExpressionForm = ({
  expression,
  selectedExpression,
  updateExpressionList,
  deleteExpression,
}: EditFinalExpressionFormProps) => {
  const { project, setProject } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()

  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: expression.name,
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
        expression_type: 'final',
        project_id: project?.id,
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

  if (!project) return <></>

  return (
    <AccordionItem value={expression.id.toString()} key={expression.id}>
      <AccordionTrigger className='flex w-full flex-col gap-2 lg:gap-3 border-2 p-4 data-[state=open]:border-b-0 data-[state=open]:pb-0'>
        {selectedExpression === expression.id.toString() ? (
          <ExpressionField expressionValues={expressionValues} setExpressionValues={setExpressionValues} />
        ) : (
          <>
            <div className='flex w-full items-center justify-between'>
              <p className='text-sm lg:text-base font-medium'>{expression.name}</p>
              <div>
                <Trash
                  strokeWidth={1}
                  className='h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground'
                  onClick={(e) => {
                    e.stopPropagation()
                    void deleteExpression(expression.id, 'final_expressions')
                  }}
                />
              </div>
            </div>
            <p className='text-[12px] leading-[18px] lg:text-sm font-normal text-muted-foreground'>
              {expression.raw_data}
            </p>
          </>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className='flex w-full flex-col gap-6 border-x-[2px] border-b-[2px] p-4 lg:p-6'>
          <div className='flex flex-col'>
            <div className='flex flex-col gap-[38px] border-b pb-4'>
              {tools && <FinalExpressionHelperTable tools={tools} setExpressionValues={setExpressionValues} />}
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
          <CalculationsTabs expressionId={expression.id} />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
