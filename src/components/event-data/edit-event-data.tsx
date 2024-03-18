import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'react-toastify'

import type { AxiosError } from 'axios'
import { X } from 'lucide-react'

import { useProject } from '~/app/projects/[id]/ProjectProvider'
import useAxiosAuth from '~/hooks/axios-auth'
import { ADDRESS, ApiRoutes, EXPRESSION_ID } from '~/lib/axios-instance'
import { cutAddress } from '~/lib/cut-address'
import { cn } from '~/lib/utils'
import type { PrecalculateResult } from '~/types/calculations'
import {
  EventDataType,
  type BaseExpressionValues,
  type Expression,
  type ExpressionEvent,
  type ExpressionTools,
  type ExpressionTypeResponse,
} from '~/types/expressions'

import { CalculationsTabs } from '../compound/calculations-tabs'
import { BaseExpressionField } from '../expression-field'
import { TextLabel } from '../form-components'
import { PrecalcSettings } from '../precalc-settings'
import { PrecalcValues } from '../precalc-values'
import { AccordionContent, AccordionItem } from '../ui/accordion'
import { Button } from '../ui/button'
import { EventDataDetailCard } from './event-data-detail-card'
import { EventDataHelperTable } from './event-data-helper-table'

interface EditEventDataProps {
  expression: Expression
  selectedExpression: string
  updateExpressionList: (expression: Expression, type: 'create' | 'update') => void
  deleteExpression?: (id: number, type: ExpressionTypeResponse) => Promise<void>
  setSelectedExpression: Dispatch<SetStateAction<string>>
}

export const EditEventData = ({
  expression,
  selectedExpression,
  updateExpressionList,
  deleteExpression,
  setSelectedExpression,
}: EditEventDataProps) => {
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
        name: expressionValues.name,
        projects_id: expression.project_id,
        contract_address: expression.contract_address,
        aggregate_operation: expressionValues.aggregate,
        event: expression.event,
        data_source: EventDataType.EVENT_DATA,
        filter_data: expressionValues.filter,
        block_range: project?.block_range,
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
      <div
        className={cn(
          'flex w-full flex-col border-2 px-3 py-4 data-[state=open]:border-b-0 data-[state=open]:pb-0 lg:p-4 lg:data-[state=open]:px-5',
          !selectedExpression && 'h-full',
        )}
      >
        {selectedExpression === expression.id.toString() ? (
          <div className='flex w-full flex-col'>
            <div className='mb-6 flex justify-end lg:mb-2'>
              <X
                strokeWidth={1}
                className='h-5 w-5 cursor-pointer hover:opacity-50 lg:h-6 lg:w-6'
                onClick={() => {
                  setSelectedExpression('')
                }}
              />
            </div>
            <div className='mb-4 flex flex-col gap-4 lg:mb-6 lg:flex-row'>
              {expression.contract_address && (
                <div className='flex w-full flex-col  gap-2'>
                  <TextLabel label='Contact address' />
                  <p className='w-full border-2 px-4 py-[10px] text-sm font-medium text-muted-foreground lg:text-base'>
                    {cutAddress(expression.contract_address)}
                  </p>
                </div>
              )}
              {expression.event && (
                <div className='flex w-full flex-col  gap-2'>
                  <TextLabel label='Event' />
                  <p className='w-full border-2 px-4 py-[10px] text-sm font-medium lg:text-base'>
                    {expression.event.split('(')[0]}
                  </p>
                </div>
              )}
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
          <EventDataDetailCard expression={expression} deleteExpression={deleteExpression} />
        )}
      </div>
      <AccordionContent>
        <div className='flex w-full flex-col gap-6 border-x-[2px] border-b-[2px] px-3 pb-[62px] pt-6 lg:px-5'>
          <div className='flex flex-col'>
            <div className='border-b pb-6 lg:pb-10'>
              {tools && selectedEvent && (
                <EventDataHelperTable
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
          <CalculationsTabs expressionId={expression.id} />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
