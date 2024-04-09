import { useEffect, useMemo, useRef, useState } from 'react'

import type { AxiosError } from 'axios'

import { useProject } from '~/app/projects/[id]/ProjectProvider'
import useAxiosAuth from '~/hooks/axios-auth'
import { ADDRESS, ApiRoutes } from '~/lib/axios-instance'
import { showErrorToast } from '~/lib/show-error-toast'
import type { PrecalculateResult } from '~/types/calculations'
import {
  EventDataType,
  ExpressionActions,
  type BaseExpressionValues,
  type Expression,
  type ExpressionEvent,
  type ExpressionTools,
} from '~/types/expressions'

import { CalculationsTabs } from '../compound/calculations-tabs'
import { EventDataExpressionField } from '../expression-field'
import { UploadAbiModal } from '../failed-fetch-abi-modal'
import { SelectComponent, TextLabel } from '../form-components'
import { InputBlock } from '../input-block'
import { PrecalcSettings } from '../precalc-settings'
import { Precalculations } from '../precalc-values'
import { Button } from '../ui/button'
import { EventDataHelperTable } from './event-data-helper-table'

// 0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7

interface CreateEventDataProps {
  updateExpressionList: (expression: Expression) => void
}

export const CreateEventData = ({ updateExpressionList }: CreateEventDataProps) => {
  const { project, setProject } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [contract, setContract] = useState('')
  const [event, setEvent] = useState<ExpressionEvent | undefined>()
  const [expression, setExpression] = useState<BaseExpressionValues>({
    name: '',
    rawData: '',
    aggregate: undefined,
    filter: '',
  })
  const [tools, setTools] = useState<ExpressionTools | undefined>()
  const [toolsError, setToolsError] = useState<boolean>(false)
  const [precalculations, setPrecalculations] = useState<PrecalculateResult[]>([])
  const [openUploadAbi, setOpenUploadAbi] = useState<boolean>(false)

  const isAddressValid = useMemo(() => {
    if (!contract) return false
    return contract.length !== 42 || contract.substring(0, 2) !== '0x'
  }, [contract])

  const fetchTools = async () => {
    setToolsError(false)
    const { data } = await axiosAuth.get<ExpressionTools>(
      ApiRoutes.EXPRESSIONS_ADDRESS_TOOLS.replace(ADDRESS, contract),
    )

    setTools(data)
    setEvent(data.events[0])
    setExpression((state) => ({ ...state, aggregate: data.aggregate_operations[0]?.name }))
    setOpenUploadAbi(false)
  }

  useEffect(() => {
    if (!contract) {
      setTools(undefined)
      setEvent(undefined)
      return
    }

    if (isAddressValid) return
    void (async () => {
      try {
        await fetchTools()
      } catch (error) {
        const err = error as AxiosError
        const errDetail = err.response?.data as { detail: string } | undefined
        if (errDetail && errDetail.detail) {
          setToolsError(errDetail.detail === 'Contract ABI not found')
          setOpenUploadAbi(true)
        }
        setTools(undefined)
        setEvent(undefined)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, axiosAuth, isAddressValid])

  const events = useMemo(() => {
    if (!tools) return []

    return tools.events.map((ev) => {
      return {
        value: ev.name,
        label: ev.name,
      }
    })
  }, [tools])

  if (!project) return

  const precalculate = async () => {
    try {
      const { data } = await axiosAuth.post<PrecalculateResult[]>(ApiRoutes.EXPRESSIONS_DEMO, {
        raw_data: expression.rawData,
        name: expression.name,
        project_id: project.id,
        contract_address: contract,
        aggregate_operation: expression.aggregate,
        event: `${event?.name}(${event?.params.map((i) => i.arg_type).join(',')})`,
        data_source: EventDataType.EVENT_DATA,
        filter_data: expression.filter,
        block_range: project.block_range,
      })
      setPrecalculations(data)
    } catch (error) {
      showErrorToast(error)
    }
  }

  const save = async () => {
    try {
      const { data } = await axiosAuth.post<Expression>(ApiRoutes.EXPRESSIONS, {
        raw_data: expression.rawData,
        name: expression.name,
        project_id: project.id,
        contract_address: contract,
        aggregate_operation: expression.aggregate,
        event: `${event?.name}(${event?.params.map((i) => i.arg_type).join(',')})`,
        data_source: EventDataType.EVENT_DATA,
        filter_data: expression.filter,
      })

      updateExpressionList(data)

      return data.id
    } catch (error) {
      showErrorToast(error)
    }
  }

  return (
    <>
      <div className='mt-6 flex w-full flex-col'>
        <div className='grid gap-6 lg:grid-cols-2 lg:gap-4'>
          <div className='flex flex-col gap-1'>
            <InputBlock
              label='Contact address'
              className='w-full'
              value={contract}
              onChange={(e) => {
                setContract(e.target.value)
                setToolsError(false)
                setTools(undefined)
                setEvent(undefined)
              }}
              validations={[
                {
                  type: 'error',
                  issue: 'Invalid address',
                  checkFn: () => isAddressValid,
                },
                {
                  type: 'warn',
                  issue: '',
                  checkFn: () => toolsError,
                },
              ]}
            />
            {(tools || toolsError) && (
              <Button
                variant='ghost'
                className='h-fit w-fit py-0 text-sm font-normal text-primary'
                onClick={() => {
                  setOpenUploadAbi(true)
                }}
              >
                Upload custom ABI
              </Button>
            )}
          </div>
          {tools && (
            <SelectComponent
              value={event?.name}
              onValueChange={(e) => {
                setEvent(tools.events.find((event) => event.name === e))
              }}
              options={events}
              label='Signature'
              triggerClassName='h-11 text-base font-medium text-muted'
            />
          )}
        </div>

        {event && tools && (
          <div className='mt-10 flex flex-col'>
            <div className='flex flex-col'>
              <div className='mb-10 flex w-full flex-col gap-2 lg:mb-6'>
                <TextLabel label='Expression' />
                <EventDataExpressionField
                  aggregateFunctions={tools.aggregate_operations}
                  expressionValues={expression}
                  setExpressionValues={setExpression}
                  textareaRef={textareaRef}
                />
              </div>
              <div className='border-b pb-6 lg:pb-10'>
                <EventDataHelperTable
                  tools={tools}
                  event={event}
                  setExpressionValues={setExpression}
                  textareaRef={textareaRef}
                />
              </div>
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
                disabled={!expression.rawData || !contract || !expression.aggregate}
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
                disabled={!expression.rawData || !contract || !expression.aggregate}
              >
                Save
              </Button>
            </div>
            {precalculations.length ? <Precalculations res={precalculations} /> : <></>}
            <div className='mt-6'>
              <CalculationsTabs save={save} action={ExpressionActions.CREATE} />
            </div>
          </div>
        )}
      </div>
      <UploadAbiModal
        open={openUploadAbi}
        contractAddress={contract}
        onOpenChange={(value) => {
          setOpenUploadAbi(value)
        }}
        fetchTools={fetchTools}
        errorModal={toolsError}
      />
    </>
  )
}
