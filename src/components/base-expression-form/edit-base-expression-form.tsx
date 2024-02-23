import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { ChevronDown, Copy, Trash, X } from 'lucide-react'
import useAxiosAuth from '~/hooks/axios-auth'
import type { PrecalculateResult } from '~/types/calculations'
import { useProject } from '~/app/projects/[id]/ProjectProvider'
import { ADDRESS, ApiRoutes, EXPRESSION_ID } from '~/lib/axios-instance'
import { cutAddress } from '~/lib/cut-address'
import { copyToClipboard } from '~/lib/copy-to-clipboard'
import type { BaseExpressionValues, Expression, ExpressionEvent, ExpressionTools } from '~/types/expressions'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { TextLabel } from '../form-components'
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
        aggregate_operation: expressionValues.aggregate,
        event: expression.event,
        expression_type: 'base',
        filter_data: expressionValues.filter,
        block_range: project?.block_range,
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
          filter_data: expressionValues.filter,
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
      <div className='flex w-full flex-col border-2 p-3 data-[state=open]:border-b-0 data-[state=open]:pb-0 lg:p-4 lg:data-[state=open]:px-5'>
        {selectedExpression === expression.id.toString() ? (
          <div className='flex w-full flex-col gap-4'>
            <div className='self-end'>
              <X
                strokeWidth={1}
                className='h-5 w-5 cursor-pointer lg:h-6 lg:w-6'
                onClick={() => {
                  setSelectedExpression('')
                }}
              />
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
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-between gap-3 flex-wrap'>
              <div className='flex items-center gap-4'>
                <p className='text-sm font-normal'>Contact</p>
                <div
                  className='py-1 px-2 border-2 text-sm font-normal  bg-background text-muted-foreground cursor-pointer'
                  onClick={copyToClipboard(expression.contract_address)}
                >
                  {cutAddress(expression.contract_address)}
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <p className='text-sm font-normal'>Event</p>
                <div className='py-1 px-2 border-2 text-sm font-normal  bg-background text-muted-foreground break-all'>
                  {expression.event.split('(')[0]}
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <p className='text-sm font-normal'>Aggregate </p>
                <div className='py-1 px-2 border-2 text-sm font-normal  bg-background text-muted-foreground break-all'>
                  {expression.aggregate_operation}
                </div>
              </div>
            </div>
            <div className='flex w-full justify-between gap-2'>
              <p className='px-1 text-left text-[12px] font-normal leading-[18px] lg:text-sm break-all'>
                <span className='font-bold'>{expression.name}</span> = map({expression.raw_data})
                {expression.filter_data && `.filter(|result| ${expression.filter_data})`}
              </p>
              {deleteExpression && (
                <div className='flex gap-2 items-center'>
                  <div>
                    <Trash
                      strokeWidth={1}
                      className='h-4 w-4 text-muted-foreground lg:h-5 lg:w-5 cursor-pointer'
                      onClick={() => {
                        void deleteExpression(expression.id, 'base_expressions')
                      }}
                    />
                  </div>
                  <AccordionTrigger>
                    <ChevronDown className='h-4 w-4 text-muted-foreground lg:h-5 lg:w-5' />
                  </AccordionTrigger>
                </div>
              )}
            </div>
          </div>
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
                disabled={!expressionValues.rawData || !expressionValues.name || !expressionValues.aggregate}
              >
                Save
              </Button>
            </div>
            {precalcRes.length ? <PrecalcValues res={precalcRes} /> : <></>}
          </div>
          <div className='mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-4'>
            {/* <InputComponent value={expression.contract_address} label='Contact address' className='w-full' readOnly /> */}
            <div className='flex flex-col gap-2 w-full'>
              <TextLabel label='Contact address' />
              <div className='py-3 px-4 lg:py-[10px] border-2 text-sm font-medium lg:text-base bg-background flex justify-between items-center'>
                {cutAddress(expression.contract_address)}
                <div>
                  <Copy
                    strokeWidth={1}
                    className='w-4 h-4 cursor-pointer'
                    onClick={copyToClipboard(expression.contract_address)}
                  />
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2 w-full'>
              <TextLabel label='Contact address' />
              <div className='py-3 px-4 lg:py-[10px] border-2 text-sm font-medium lg:text-base bg-background flex items-center'>
                {selectedEvent?.name}
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
