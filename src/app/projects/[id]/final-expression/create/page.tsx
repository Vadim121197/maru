'use client'

import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { BackButton } from '~/components/back-button'
import { ExpressionField } from '~/components/expression-field'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import useAxiosAuth from '~/hooks/axios-auth'
import { AxiosRoutes } from '~/lib/axios-instance'
import { Expressions, expressionTypeLabels, expressionTypes } from '~/lib/expressions'
import type {
  ExpressionConstants,
  ExpressionEvent,
  ExpressionEventParam,
  ExpressionFunction,
  ExpressionTools,
  ExpressionValues,
} from '~/types/expressions'

interface ExpressionHelperTable {
  key: number
  constant: ExpressionConstants | undefined
  function: ExpressionFunction | undefined
  param: ExpressionEventParam | undefined
  global_constants: ExpressionConstants | undefined
}

const defaultExpression = 'bought_id == 1 ? tokens_bought : 0'

const ProjectExpressionPage = ({ params }: { params: { id: string } }) => {
  const axiosAuth = useAxiosAuth()
  const router = useRouter()

  const [selectedSource, setSelectedSource] = useState<Expressions | undefined>()
  const [contractAddress, setContractAddress] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<ExpressionEvent | undefined>()
  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: '',
    rawData: defaultExpression,
    aggregate: undefined,
  })
  const [precalcRes, setPrecalcRes] = useState('')

  const [tools, setTools] = useState<ExpressionTools | undefined>()

  useEffect(() => {
    if (!contractAddress) {
      setTools(undefined)
      setSelectedEvent(undefined)

      return
    }

    void (async () => {
      try {
        const { data } = await axiosAuth.get<ExpressionTools>(`${AxiosRoutes.EXPRESSIONS}/${contractAddress}/tools`)

        setTools(data)
        setSelectedEvent(data.events[0])
      } catch {}
    })()
  }, [contractAddress, axiosAuth])

  const expressionHelperData = useMemo(() => {
    if (!tools || !selectedEvent) return []
    const maxLength = Math.max(
      tools.constants.length,
      tools.functions.length,
      tools.global_constants.length,
      selectedEvent.params.length,
    )

    const arr: ExpressionHelperTable[] = []

    for (let i = 0; i < maxLength; i += 1) {
      const obj: ExpressionHelperTable = {
        key: i,
        constant: tools.constants[i],
        function: tools.functions[i],
        param: selectedEvent.params[i],
        global_constants: tools.global_constants[i],
      }

      arr.push(obj)
    }

    return arr
  }, [tools, selectedEvent])

  const helperClick = (value: string | undefined) => () => {
    if (!value) return
    setExpressionValues((state) => ({ ...state, rawData: `${state.rawData} ${value}` }))
  }

  const precalculate = async () => {
    if (!selectedEvent) return
    try {
      const { data } = await axiosAuth.post<string>(`${AxiosRoutes.EXPRESSIONS}/demo`, {
        contract_address: contractAddress,
        event: `${selectedEvent.name}(${selectedEvent.params.map((i) => i.arg_type).join(',')})`,
        block_range: null,
        raw_data: expressionValues.rawData,
        aggregate_operation: expressionValues.aggregate,
        expression_type: 'base',
      })
      setPrecalcRes(data)
    } catch (error) {}
  }

  const save = async () => {
    if (
      !selectedEvent ||
      !expressionValues.rawData ||
      !expressionValues.name ||
      !contractAddress ||
      !expressionValues.aggregate
    )
      return
    try {
      await axiosAuth.post(AxiosRoutes.EXPRESSIONS, {
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
        project_id: params.id,
        contract_address: contractAddress,
        aggregate_operation: expressionValues.aggregate,
        event: `${selectedEvent.name}(${selectedEvent.params.map((i) => i.arg_type).join(',')})`,
        expression_type: 'base',
      })
      router.push(`/projects/${params.id}`)
    } catch (error) {}
  }

  return (
    <section className='flex w-full flex-col items-center px-7 lg:container lg:w-[816px] lg:pt-[64px]'>
      <div className='flex w-full flex-col lg:gap-10'>
        <BackButton />
        <div className='flex flex-col items-center gap-4'>
          <p className='text-2xl font-bold'>Create Final Expression</p>
          <div className='flex w-full flex-col gap-6 bg-card p-6'>
            <div className='flex flex-col gap-[10px]'>
              <p className='text-base font-medium'>Data source</p>
              <Select
                value={selectedSource}
                onValueChange={(e) => {
                  setSelectedSource(e as Expressions)
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='w-[200px]'>
                  {expressionTypes.map((expr) => (
                    <SelectItem value={expr.type} key={expr.type}>
                      {expressionTypeLabels[expr.type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedSource && (
              <div className='flex flex-col gap-[10px]'>
                <p className='text-base font-medium'>Contact address</p>
                <Input
                  value={contractAddress}
                  onChange={(e) => {
                    setContractAddress(e.target.value)
                  }}
                />
              </div>
            )}
            {tools && (
              <div className='flex flex-col gap-[10px]'>
                <p className='text-base font-medium'>Event</p>
                <Select
                  value={selectedEvent?.name}
                  onValueChange={(e) => {
                    setSelectedEvent(tools.events.find((event) => event.name === e))
                  }}
                >
                  <SelectTrigger className='w-full gap-4 py-3 text-left text-sm font-normal'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tools.events.map((ev) => (
                      <SelectItem value={ev.name} key={ev.name}>
                        {`${ev.name}(${ev.params.map((i) => i.name + ' ' + i.arg_type).join(', ')})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedEvent && (
              <div className='flex flex-col'>
                <div className='flex flex-col gap-[38px] border-b pb-4'>
                  <div className='flex w-full flex-col gap-2'>
                    <p className='text-base font-medium'>Expression</p>
                    <ExpressionField
                      aggregateFunctions={tools?.aggregate_operations ?? []}
                      expressionValues={expressionValues}
                      setExpressionValues={setExpressionValues}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Global Consts</TableHead>
                        <TableHead className='text-center'>Contract Consts</TableHead>
                        <TableHead className='text-center'>Contract Functions</TableHead>
                        <TableHead className='text-center'>Event Params</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expressionHelperData.map((i) => (
                        <TableRow key={i.key}>
                          <TableCell>
                            <button onClick={helperClick(i.global_constants?.name)} type='button'>
                              {i.global_constants?.name}
                            </button>
                          </TableCell>
                          <TableCell className='text-center'>
                            <button onClick={helperClick(i.constant?.name)} type='button'>
                              {i.constant?.name}
                            </button>
                          </TableCell>
                          <TableCell className='text-center'>
                            <button onClick={helperClick(i.function?.name)} type='button'>
                              {i.function?.name}
                            </button>
                          </TableCell>
                          <TableCell className='text-center'>
                            <button onClick={helperClick(i.param?.name)} type='button'>
                              {i.param?.name}
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className='mb-10 mt-4 flex items-start gap-1 text-sm font-normal'>
                  <p>The precalculation uses events in the last 1000 blocks.</p>
                  <p className='text-muted-foreground underline'>Change precalc settings</p>
                </div>
                <Button
                  variant='outline'
                  className='mb-10 w-[274px] self-center'
                  onClick={() => {
                    void (async () => {
                      await precalculate()
                    })()
                  }}
                >
                  Precalculation
                </Button>
                <div className='flex flex-col gap-4'>
                  <p className='text-base font-medium'>Expression Values</p>
                  <div className='flex items-center gap-2'>
                    <p className='text-sm font-normal'>result = {precalcRes || '????'}</p>
                    <div>
                      <CheckCircle className='h-4 w-4 text-[#6D23F8]' />
                    </div>
                  </div>
                </div>
                <Button
                  className='mt-20 w-[274px] self-center'
                  onClick={() => {
                    void (async () => {
                      await save()
                    })()
                  }}
                  disabled={
                    !expressionValues.rawData ||
                    !expressionValues.name ||
                    !contractAddress ||
                    !expressionValues.aggregate
                  }
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectExpressionPage
