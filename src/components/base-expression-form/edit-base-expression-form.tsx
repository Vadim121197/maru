import { useEffect, useState } from 'react'
import { Trash } from 'lucide-react'
import useAxiosAuth from '~/hooks/axios-auth'
import type { PrecalculateResult } from '~/types/calculations'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import { ADDRESS, ApiRoutes, EXPRESSION_ID } from '~/lib/axios-instance'
import type { BaseExpressionValues, Expression, ExpressionEvent, ExpressionTools } from '~/types/expressions'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { InputComponent } from '../form-components'
import { BaseExpressionField } from '../expression-field'
import { BaseExpressionHelperTable } from './base-expression-helper-table'
import { Button } from '../ui/button'
import { PrecalcValues } from '../precalc-values'
import { PrecalcSettings } from '../precalc-settings'
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

interface EditBaseExpressionFormProps {
  expression: Expression
  selectedExpression: string
  updateExpressionList: (expression: Expression, type: 'create' | 'update') => void
  deleteExpression: (id: number, type: 'base_expressions' | 'final_expressions') => Promise<void>
}

export const EditBaseExpressionForm = ({
  expression,
  selectedExpression,
  updateExpressionList,
  deleteExpression,
}: EditBaseExpressionFormProps) => {
  const { project, setProject } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()

  const [expressionValues, setExpressionValues] = useState<BaseExpressionValues>({
    name: expression.name,
    rawData: expression.raw_data,
    aggregate: expression.aggregate_operation,
    filter: expression.filter_data,
  })
  const [selectedEvent, setSelectedEvent] = useState<ExpressionEvent | undefined>()
  const [precalcRes, setPrecalcRes] = useState<PrecalculateResult[]>([])
  const [tools, setTools] = useState<ExpressionTools | undefined>()

  useEffect(() => {
    if (selectedExpression !== expression.id.toString()) return

    void (async () => {
      try {
        const { data: tools } = await axiosAuth.get<ExpressionTools>(
          ApiRoutes.EXPRESSIONS_ADDRESS_TOOLS.replace(ADDRESS, expression.contract_address),
        )

        setTools(tools)

        setSelectedEvent(tools.events.find((ev) => ev.name === expression.event.split('(')[0]))
      } catch {}
    })()
  }, [axiosAuth, expression, selectedExpression])

  const precalculate = async () => {
    try {
      const { data } = await axiosAuth.post<PrecalculateResult[]>(ApiRoutes.EXPRESSIONS_DEMO, {
        raw_data: expressionValues.rawData,
        projects_id: expression.project_id,
        contract_address: expression.contract_address,
        block_range: project?.block_range,
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

  if (!project) return

  return (
    <AccordionItem value={expression.id.toString()} key={expression.id}>
      <AccordionTrigger className='flex w-full flex-col gap-4 border-2 px-4 pb-[26px] pt-[18px] data-[state=open]:border-b-0 data-[state=open]:pb-0'>
        {selectedExpression === expression.id.toString() ? (
          <BaseExpressionField
            aggregateFunctions={tools?.aggregate_operations ?? []}
            expressionValues={expressionValues}
            setExpressionValues={setExpressionValues}
          />
        ) : (
          <div className='flex w-full flex-col gap-10'>
            <p className='text-left text-base font-medium'>
              {expression.name}=map({expression.raw_data}).filter(|result| ={'>'}
              {expression.filter_data})
            </p>
            <div className='flex justify-between'>
              <div className='flex items-center gap-3'>
                <p className='text-sm font-normal'>Aggregate</p>
                <div className='border-2 px-8 py-[2px] text-sm font-normal'>{expression.aggregate_operation}</div>
              </div>
              <div>
                <Trash
                  strokeWidth={1}
                  className='h-5 w-5 text-muted-foreground'
                  onClick={(e) => {
                    e.stopPropagation()
                    void deleteExpression(expression.id, 'base_expressions')
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className='flex w-full flex-col gap-6 border-x-[2px] border-b-[2px] p-4 lg:p-6'>
          <div className='flex flex-col'>
            <div className='flex flex-col gap-[38px] border-b pb-4'>
              {tools && selectedEvent && (
                <BaseExpressionHelperTable
                  tools={tools}
                  event={selectedEvent}
                  setExpressionValues={setExpressionValues}
                />
              )}
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
                disabled={!expressionValues.rawData || !expressionValues.name || !expressionValues.aggregate}
              >
                Save
              </Button>
            </div>
            {precalcRes.length ? <PrecalcValues res={precalcRes} /> : <></>}
          </div>
          <div className='mt-11 flex w-full gap-4'>
            <InputComponent value={expression.contract_address} label='Contact address' className='w-full' />
            <InputComponent value={selectedEvent?.name} label='Signature' className='w-full' />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
