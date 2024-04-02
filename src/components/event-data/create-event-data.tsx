import { useEffect, useMemo, useRef, useState } from 'react'

import type { AxiosError } from 'axios'

import { useProject } from '~/app/projects/[id]/ProjectProvider'
import useAxiosAuth from '~/hooks/axios-auth'
import { ADDRESS, ApiRoutes } from '~/lib/axios-instance'
import { showErrorToast } from '~/lib/show-error-toast'
import type { PrecalculateResult } from '~/types/calculations'
import {
  EventDataType,
  type BaseExpressionValues,
  type Expression,
  type ExpressionEvent,
  type ExpressionTools,
  ExpressionActions,
} from '~/types/expressions'

import { CalculationsTabs } from '../compound/calculations-tabs'
import { BaseExpressionField } from '../expression-field'
import { FailedFetchAbiModal } from '../failed-fetch-abi-modal'
import { SelectComponent, TextLabel } from '../form-components'
import { InputBlock } from '../input-block'
import { PrecalcSettings } from '../precalc-settings'
import { PrecalcValues } from '../precalc-values'
import { Button } from '../ui/button'
import { EventDataHelperTable } from './event-data-helper-table'

// 0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7

interface CreateEventDataProps {
  updateExpressionList: (expression: Expression) => void
}

export const CreateEventData = ({ updateExpressionList }: CreateEventDataProps) => {
  const { project, setProject } = useProject()((state) => state)
  const axiosAuth = useAxiosAuth()
  const textarea = useRef<HTMLTextAreaElement>(null)

  const [contractAddress, setContractAddress] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<ExpressionEvent | undefined>()
  const [expressionValues, setExpressionValues] = useState<BaseExpressionValues>({
    name: '',
    rawData: '',
    aggregate: undefined,
    filter: '',
  })
  const [tools, setTools] = useState<ExpressionTools | undefined>()
  const [fetchAddressError, setFetchAddressError] = useState<boolean>(false)
  const [precalcRes, setPrecalcRes] = useState<PrecalculateResult[]>([])

  const addressValidationErrors = useMemo(() => {
    if (!contractAddress) return false
    return contractAddress.length !== 42 || contractAddress.substring(0, 2) !== '0x'
  }, [contractAddress])

  const fetchTools = async () => {
    setFetchAddressError(false)
    const { data } = await axiosAuth.get<ExpressionTools>(
      ApiRoutes.EXPRESSIONS_ADDRESS_TOOLS.replace(ADDRESS, contractAddress),
    )

    setTools(data)
    setSelectedEvent(data.events[0])
    setExpressionValues((state) => ({ ...state, aggregate: data.aggregate_operations[0]?.name }))
  }

  useEffect(() => {
    if (!contractAddress) {
      setTools(undefined)
      setSelectedEvent(undefined)
      return
    }

    if (addressValidationErrors) return

    void (async () => {
      try {
        await fetchTools()
      } catch (error) {
        const err = error as AxiosError

        const errDetail = err.response?.data as { detail: string }

        if (errDetail.detail) {
          setFetchAddressError(errDetail.detail === 'Contract ABI not found')
        }

        setTools(undefined)
        setSelectedEvent(undefined)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress, axiosAuth, addressValidationErrors])

  const eventsOptions = useMemo(() => {
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
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
        project_id: project.id,
        contract_address: contractAddress,
        aggregate_operation: expressionValues.aggregate,
        event: `${selectedEvent?.name}(${selectedEvent?.params.map((i) => i.arg_type).join(',')})`,
        data_source: EventDataType.EVENT_DATA,
        filter_data: expressionValues.filter,
        block_range: project.block_range,
      })
      setPrecalcRes(data)
    } catch (error) {
      showErrorToast(error)
    }
  }

  const save = async () => {
    try {
      const { data } = await axiosAuth.post<Expression>(ApiRoutes.EXPRESSIONS, {
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
        project_id: project.id,
        contract_address: contractAddress,
        aggregate_operation: expressionValues.aggregate,
        event: `${selectedEvent?.name}(${selectedEvent?.params.map((i) => i.arg_type).join(',')})`,
        data_source: EventDataType.EVENT_DATA,
        filter_data: expressionValues.filter,
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
          <InputBlock
            label='Contact address'
            className='w-full'
            value={contractAddress}
            onChange={(e) => {
              setContractAddress(e.target.value)
              setFetchAddressError(false)
              setTools(undefined)
              setSelectedEvent(undefined)
            }}
            validations={[
              {
                type: 'error',
                issue: 'Invalid address',
                checkFn: () => addressValidationErrors,
              },
              {
                type: 'warn',
                issue: '',
                checkFn: () => fetchAddressError,
              },
            ]}
          />
          {tools && (
            <SelectComponent
              value={selectedEvent?.name}
              onValueChange={(e) => {
                setSelectedEvent(tools.events.find((event) => event.name === e))
              }}
              options={eventsOptions}
              label='Signature'
              triggerClassName='h-11 text-base font-medium text-muted'
            />
          )}
        </div>
        {selectedEvent && tools && (
          <div className='mt-10 flex flex-col'>
            <div className='flex flex-col'>
              <div className='mb-10 flex w-full flex-col gap-2 lg:mb-6'>
                <TextLabel label='Expression' />
                <BaseExpressionField
                  aggregateFunctions={tools.aggregate_operations}
                  expressionValues={expressionValues}
                  setExpressionValues={setExpressionValues}
                  textareaRef={textarea}
                />
              </div>
              <div className='border-b pb-6 lg:pb-10'>
                <EventDataHelperTable
                  tools={tools}
                  event={selectedEvent}
                  setExpressionValues={setExpressionValues}
                  textareaRef={textarea}
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
                disabled={!expressionValues.rawData || !contractAddress || !expressionValues.aggregate}
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
                disabled={!expressionValues.rawData || !contractAddress || !expressionValues.aggregate}
              >
                Save
              </Button>
            </div>
            {precalcRes.length ? <PrecalcValues res={precalcRes} /> : <></>}
            <div className='mt-6'>
              <CalculationsTabs save={save} action={ExpressionActions.CREATE} />
            </div>
          </div>
        )}
      </div>
      <FailedFetchAbiModal
        open={fetchAddressError}
        contractAddress={contractAddress}
        onOpenChange={(value) => {
          setFetchAddressError(value)
          setContractAddress('')
        }}
        fetchTools={fetchTools}
      />
    </>
  )
}
