import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { X } from 'lucide-react'
import useAxiosAuth from '~/hooks/axios-auth'
import type { PrecalculateResult } from '~/types/calculations'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import { ADDRESS, ApiRoutes, EXPRESSION_ID } from '~/lib/axios-instance'
import { cutAddress } from '~/lib/cut-address'
import { copyToClipboard } from '~/lib/copy-to-clipboard'
import type { BaseExpressionValues, Expression, ExpressionEvent, ExpressionTools } from '~/types/expressions'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { BaseExpressionField } from '../expression-field'
import { BaseExpressionHelperTable } from './base-expression-helper-table'
import { Button } from '../ui/button'
import { PrecalcValues } from '../precalc-values'
import { PrecalcSettings } from '../precalc-settings'
import { AccordionContent, AccordionItem } from '../ui/accordion'
import { BaseExpressionDetailCard } from './base-expression-detail-card'

interface EditBaseExpressionFormProps {
  expression: Expression
  selectedExpression: string
  updateExpressionList: (expression: Expression, type: 'create' | 'update') => void
  deleteExpression?: (id: number, type: 'base_expressions' | 'final_expressions') => Promise<void>
  setSelectedExpression: Dispatch<SetStateAction<string>>
}

export const EditBaseExpressionForm = ({
  expression,
  selectedExpression,
  updateExpressionList,
  deleteExpression,
  setSelectedExpression,
}: EditBaseExpressionFormProps) => {
  const { project, setProject } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()
  const textarea = useRef<HTMLTextAreaElement>(null)

  const [expressionValues, setExpressionValues] = useState<BaseExpressionValues>({
    name: expression.name ?? '',
    rawData: expression.raw_data,
    aggregate: expression.aggregate_operation ?? '',
    filter: expression.filter_data ?? '',
  })
  const [selectedEvent, setSelectedEvent] = useState<ExpressionEvent | undefined>()
  const [precalcRes, setPrecalcRes] = useState<PrecalculateResult[]>([])
  const [tools, setTools] = useState<ExpressionTools | undefined>()

  useEffect(() => {
    if (selectedExpression !== expression.id.toString() || !expression.contract_address) return

    void (async () => {
      try {
        const { data: tools } = await axiosAuth.get<ExpressionTools>(
          ApiRoutes.EXPRESSIONS_ADDRESS_TOOLS.replace(ADDRESS, expression.contract_address as string),
        )

        setTools(tools)

        if (!expression.event) return

        setSelectedEvent(tools.events.find((ev) => ev.name === expression.event?.split('(')[0]))
      } catch {}
    })()
  }, [axiosAuth, expression, selectedExpression])

  const precalculate = async () => {
    try {
      const { data } = await axiosAuth.post<PrecalculateResult[]>(ApiRoutes.EXPRESSIONS_DEMO, {
        raw_data: expressionValues.rawData,
        projects_id: expression.project_id,
        contract_address: expression.contract_address,
        aggregate_operation: expressionValues.aggregate,
        event: expression.event,
        expression_type: 'base',
        filter_data: expressionValues.filter,
        block_range: project?.block_range,
        name: expressionValues.name,
      })

      setPrecalcRes(data)
    } catch (error) {
      const err = error as AxiosError

      const errData = err.response?.data as { detail: string | undefined }

      toast.error(errData.detail ?? `${err.message} (${err.config?.url}, ${err.config?.method})`)
    }
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
          filter_data: expressionValues.filter,
        },
      )

      updateExpressionList(data, 'update')
    } catch (error) {
      const err = error as AxiosError

      const errData = err.response?.data as { detail: string | undefined }

      toast.error(errData.detail ?? `${err.message} (${err.config?.url}, ${err.config?.method})`)
    }
  }

  if (!project) return

  return (
    <AccordionItem value={expression.id.toString()} key={expression.id}>
      <div className='flex w-full flex-col border-2 p-3 data-[state=open]:border-b-0 data-[state=open]:pb-0 lg:p-4 lg:data-[state=open]:px-5'>
        {selectedExpression === expression.id.toString() ? (
          <div className='flex w-full flex-col gap-4'>
            <div className='flex items-center justify-between'>
              {expression.contract_address && (
                <div className='flex items-center gap-4'>
                  <p className='text-sm font-normal'>Contact</p>
                  <div
                    className='cursor-pointer border-2 bg-background px-2 py-1  text-sm font-normal text-muted-foreground'
                    onClick={copyToClipboard(expression.contract_address)}
                  >
                    {cutAddress(expression.contract_address)}
                  </div>
                </div>
              )}
              {expression.event && (
                <div className='flex items-center gap-4'>
                  <p className='text-sm font-normal'>Event</p>
                  <div className='break-all border-2 bg-background px-2 py-1  text-sm font-normal text-muted-foreground'>
                    {expression.event.split('(')[0]}
                  </div>
                </div>
              )}
              <div>
                <X
                  strokeWidth={1}
                  className='h-5 w-5 cursor-pointer lg:h-6 lg:w-6'
                  onClick={() => {
                    setSelectedExpression('')
                  }}
                />
              </div>
            </div>
            <BaseExpressionField
              aggregateFunctions={tools?.aggregate_operations ?? []}
              expressionValues={expressionValues}
              setExpressionValues={setExpressionValues}
              className='bg-card'
              textAreaClassName='border-2 border-border'
              textareaRef={textarea}
            />
          </div>
        ) : (
          <BaseExpressionDetailCard expression={expression} deleteExpression={deleteExpression} />
        )}
      </div>
      <AccordionContent>
        <div className='flex w-full flex-col gap-6 border-x-[2px] border-b-[2px] px-3 pb-[62px] pt-6 lg:px-5'>
          <div className='flex flex-col'>
            <div className='border-b pb-6 lg:pb-10'>
              {tools && selectedEvent && (
                <BaseExpressionHelperTable
                  tools={tools}
                  event={selectedEvent}
                  setExpressionValues={setExpressionValues}
                  textareaRef={textarea}
                />
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
                disabled={!expressionValues.rawData || !expressionValues.aggregate}
              >
                Save
              </Button>
            </div>
            {precalcRes.length ? <PrecalcValues res={precalcRes} /> : <></>}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
