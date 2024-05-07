import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

import { X } from 'lucide-react'

import { useProject } from '~/app/projects/[id]/project-provider'
import useAxiosAuth from '~/hooks/axios-auth'
import { ADDRESS, ApiRoutes, EXPRESSION_ID } from '~/lib/axios-instance'
import { cutAddress } from '~/lib/cut-address'
import { showErrorToast } from '~/lib/show-error-toast'
import { cn } from '~/lib/utils'
import type { PrecalculateResult } from '~/types/calculations'
import {
  EventDataType,
  ExpressionActions,
  ExpressionTypeResponse,
  type BaseExpressionValues,
  type Expression,
  type ExpressionEvent,
  type ExpressionTools,
} from '~/types/expressions'

import { CalculationsTabs } from '../compound/calculations-tabs'
import { EventDataExpressionField } from '../expression-field'
import { TextLabel } from '../form-components'
import { PrecalcSettings } from '../precalc-settings'
import { Precalculations } from '../precalc-values'
import { AccordionContent, AccordionItem } from '../ui/accordion'
import { Button } from '../ui/button'
import { EventDataDetailCard } from './event-data-detail-card'
import { EventDataHelperTable } from './event-data-helper-table'
import { Filters, type Filter } from './filters'

export interface EditEventDataProps {
  expression: Expression
  selectedExpression: string
  updateExpressionList: (expression: Expression) => void
  deleteExpression?: (id: number, type: ExpressionTypeResponse) => void
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
  const [event, setEvent] = useState<ExpressionEvent | undefined>()
  const [precalculations, setPrecalculations] = useState<PrecalculateResult[]>([])
  const [tools, setTools] = useState<ExpressionTools | undefined>()
  const [filters, setFilters] = useState<Filter[]>([])

  const updateFilters = (tools: ExpressionTools, event: string) => {
    const isDefaultValue = expression.topics?.find((i) => i !== null)

    const filters = tools.events
      .find((i) => i.name === event)
      ?.params.filter((i) => !isNaN(Number(i.value)) && Number(i.value) > 0)
      .sort((a, b) => Number(a.value) - Number(b.value))
      .map((i, index) => ({
        ...i,
        value: Number(i.value),
        vissible: isDefaultValue ? Boolean(expression.topics && expression.topics[index]) : index === 0,
        enteredValue: expression.topics ? expression.topics[index] ?? '' : '',
      }))
      // sort by vissible - [true, true, false]
      .sort((a, b) => (a.vissible === b.vissible ? 0 : a.vissible ? -1 : 1))

    setFilters(filters ?? [])
  }

  useEffect(() => {
    if (selectedExpression !== expression.id.toString() || !expression.contract_address) return

    void (async () => {
      try {
        const { data: tools } = await axiosAuth.get<ExpressionTools>(
          ApiRoutes.EXPRESSIONS_ADDRESS_TOOLS.replace(ADDRESS, expression.contract_address as string),
        )

        if (expression.event) {
          const event = tools.events.find((ev) => ev.name === expression.event?.split('(')[0])
          setEvent(event)

          event?.name && updateFilters(tools, event.name)
        }

        setTools(tools)
      } catch {}
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosAuth, expression, selectedExpression])

  const precalculate = async () => {
    try {
      const topics = filters.sort((a, b) => a.value - b.value).map((i) => i.enteredValue || null)
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
        topics,
      })

      setPrecalculations(data)
    } catch (error) {
      showErrorToast(error)
    }
  }

  const save = async () => {
    try {
      const topics = filters.sort((a, b) => a.value - b.value).map((i) => i.enteredValue || null)

      const { data } = await axiosAuth.put<Expression>(
        ApiRoutes.EXPRESSIONS_EXPRESSION_ID.replace(EXPRESSION_ID, expression.id.toString()),
        {
          ...expression,
          raw_data: expressionValues.rawData,
          name: expressionValues.name,
          aggregate_operation: expressionValues.aggregate,
          filter_data: expressionValues.filter,
          topics,
        },
      )

      updateExpressionList(data)
      return data.id
    } catch (error) {
      showErrorToast(error)
    }
  }

  const isChanged = () => {
    return (
      expression.raw_data !== expressionValues.rawData ||
      expression.name !== expressionValues.name ||
      expression.aggregate_operation !== expressionValues.aggregate ||
      expression.filter_data !== expressionValues.filter
    )
  }

  const resetEdits = () => {
    setExpressionValues({
      rawData: expression.raw_data,
      name: expression.name ?? '',
      aggregate: expression.aggregate_operation ?? '',
      filter: expression.filter_data ?? '',
    })
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
                className='size-5 cursor-pointer hover:opacity-50 lg:size-6'
                onClick={() => {
                  setSelectedExpression('')

                  tools && event?.name && updateFilters(tools, event.name)
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
            {filters.length ? (
              <div className='mb-4 lg:mb-6'>
                <Filters filters={filters} setFilters={setFilters} />
              </div>
            ) : (
              <></>
            )}
            <EventDataExpressionField
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
        <div className='flex w-full flex-col gap-6 border-x-2 border-b-2 px-3 pb-[62px] pt-6 lg:px-5'>
          <div className='flex flex-col'>
            <div className='border-b pb-6 lg:pb-10'>
              {tools && event && (
                <EventDataHelperTable
                  tools={tools}
                  event={event}
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
            <div className='grid gap-4 lg:grid-cols-2 lg:gap-5'>
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
            {precalculations.length ? <Precalculations res={precalculations} /> : <></>}
          </div>
          <CalculationsTabs
            expressionId={expression.id}
            isChanged={isChanged}
            action={ExpressionActions.UPDATE}
            save={save}
            resetEdits={resetEdits}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
