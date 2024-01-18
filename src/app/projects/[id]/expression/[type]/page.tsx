'use client'

import { CheckCircle2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { BackButton } from '~/components/back-button'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Textarea } from '~/components/ui/textarea'
import { AxiosRoutes, axiosInstance } from '~/lib/axios-instance'
import { expressionTypeLabels, type Expressions } from '~/lib/expressions'
import { cn } from '~/lib/utils'
import type {
  Expression,
  ExpressionAggregateFunctions,
  ExpressionConstants,
  ExpressionEvent,
  ExpressionEventParam,
  ExpressionFunction,
  ExpressionTools,
} from '~/types/expressions'
import { Nav } from '~/types/nav'

interface ExpressionHelperTable {
  key: number
  aggregate_function: ExpressionAggregateFunctions | undefined
  expression: Expression | undefined
  constant: ExpressionConstants | undefined
  function: ExpressionFunction | undefined
  param: ExpressionEventParam | undefined
}

const defaultExpression = 'sum(e.data[1] == 1 ? e.data[2] : 0) + sum(e.data[3] == 1 ? e.data[4] : 0)'

const ProjectExpressionPage = ({ params }: { params: { type: Expressions; id: string } }) => {
  const [contractAddress, setContractAddress] = useState('0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7')
  const [expressionName, setExpressionName] = useState('')
  const [expression, setExpression] = useState(defaultExpression)
  const [selectedEvent, setSelectedEvent] = useState<undefined | ExpressionEvent>()

  // data from API
  const [tools, setTools] = useState<ExpressionTools | null>(null)
  const [expressions, setExpressions] = useState<Expression[]>([])
  const [res, setRes] = useState('')

  const expressionHelperData = useMemo(() => {
    if (!tools || !selectedEvent) return []
    const maxLength = Math.max(
      expressions.length,
      tools.aggregate_functions.length,
      tools.constants.length,
      tools.functions.length,
      selectedEvent.params.length,
    )

    const arr: ExpressionHelperTable[] = []

    for (let i = 0; i < maxLength; i += 1) {
      const obj: ExpressionHelperTable = {
        key: i,
        aggregate_function: tools.aggregate_functions[i],
        expression: expressions[i],
        constant: tools.constants[i],
        function: tools.functions[i],
        param: selectedEvent.params[i],
      }

      arr.push(obj)
    }

    return arr
  }, [expressions, tools, selectedEvent])

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await axiosInstance.get<Expression[]>(`${AxiosRoutes.PROJECTS}/${params.id}/expressions`)
        setExpressions(data)
      } catch (error) {
        /* empty */
      }
    })()
  }, [params.id])

  useEffect(() => {
    if (!contractAddress) {
      setTools(null)
      setSelectedEvent(undefined)
      setExpression('')
      return
    }

    void (async () => {
      try {
        const { data } = await axiosInstance.get<ExpressionTools>(`${AxiosRoutes.EXPRESSIONS}/${contractAddress}/tools`)
        setTools(data)
        setSelectedEvent(data.events[0])
      } catch (error) {
        /* empty */
      }
    })()
  }, [contractAddress])

  const save = () => {
    if (!selectedEvent || !expression || !expressionName || !params.id || !contractAddress) return

    void (async () => {
      try {
        const { data: expressionData } = await axiosInstance.post<Expression>(AxiosRoutes.EXPRESSIONS, {
          raw_data: expression,
          name: expressionName,
          project_id: params.id,
          contract_address: contractAddress,
          event: `${selectedEvent.name}(${selectedEvent.params.map((i) => i.arg_type).join(',')})`,
        })

        const { data: expressionPrevData } = await axiosInstance.post<string>(
          `${AxiosRoutes.EXPRESSIONS}/${expressionData.id}/preview`,
        )
        setRes(expressionPrevData)
      } catch (error) {}
    })()
  }

  const helperClick = (value: string | undefined) => () => {
    if (!value) return
    setExpression((state) => `${state} ${value}`)
  }

  return (
    <section className='container grid w-[816px] items-center md:pt-[64px]'>
      <div className='flex flex-col md:gap-10 '>
        <div className='pl-[10%]'>
          <BackButton to={`${Nav.PROJECTS}/${params.id}`} />
        </div>
        <div className='flex flex-col items-center gap-4'>
          <p className='text-2xl font-bold'>New Expression with {expressionTypeLabels[params.type]}</p>
          <div className='w-full bg-card px-6 pt-6'>
            <div className='grid grid-cols-2 gap-4 pb-6'>
              <div className='flex flex-col gap-[10px]'>
                <p className='text-base font-medium'>Contact address</p>
                <Input
                  value={contractAddress}
                  onChange={(e) => {
                    setContractAddress(e.target.value)
                  }}
                />
              </div>
              <div className='flex flex-col gap-[10px]'>
                <p className='text-base font-medium'>Expression Name</p>
                <Input
                  value={expressionName}
                  onChange={(e) => {
                    setExpressionName(e.target.value)
                  }}
                />
              </div>
            </div>
            {tools && selectedEvent && (
              <div className='flex flex-col'>
                <RadioGroup
                  defaultValue={tools.events[0]?.name}
                  onValueChange={(val) => {
                    setSelectedEvent(tools.events.find((ev) => ev.name === val))
                  }}
                  className='grid grid-cols-3 gap-3 border-y-[1px] border-border pb-10 pt-6'
                >
                  {tools.events.map((ev) => (
                    <div className='flex items-center space-x-2' key={ev.name}>
                      <RadioGroupItem value={ev.name} id={ev.name} />
                      <Label
                        htmlFor={ev.name}
                        className={cn(
                          'text-base font-medium cursor-pointer break-all',
                          ev.name === selectedEvent.name ? 'text-muted' : 'text-muted-foreground',
                        )}
                      >
                        {ev.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className='flex flex-col border-b-[1px] border-border py-6 pb-[60px]'>
                  <div className='flex flex-col gap-4'>
                    <p className='text-base font-medium'>Expression</p>
                    <Textarea
                      value={expression}
                      onChange={(e) => {
                        setExpression(e.target.value)
                      }}
                    />
                  </div>
                  <p className='mb-10 mt-6 text-sm font-normal'>{`${selectedEvent.name}(${selectedEvent.params
                    .map((i) => `${i.name} ${i.arg_type}`)
                    .join(', ')})`}</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Consts</TableHead>
                        <TableHead className='text-center'>Contract Functions</TableHead>
                        <TableHead className='text-center'>Event Params</TableHead>
                        <TableHead className='text-center'>Aggregate Operations</TableHead>
                        <TableHead className='text-center'>Expression Values</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expressionHelperData.map((i) => (
                        <TableRow key={i.key}>
                          <TableCell>
                            <button onClick={helperClick(i.constant?.value)} type='button'>
                              {i.constant?.name}
                            </button>
                          </TableCell>
                          <TableCell className='text-center'>
                            <button onClick={helperClick(i.function?.value)} type='button'>
                              {i.function?.name}
                            </button>
                          </TableCell>
                          <TableCell className='text-center'>
                            <button onClick={helperClick(i.param?.value)} type='button'>
                              {i.param?.name}
                            </button>
                          </TableCell>
                          <TableCell className='text-center'>
                            <button onClick={helperClick(i.aggregate_function?.value)} type='button'>
                              {i.aggregate_function?.name}
                            </button>
                          </TableCell>
                          <TableCell className='text-center'>
                            <button onClick={helperClick(i.expression?.raw_data)} type='button'>
                              {i.expression?.name}
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button variant='outline' className='mb-10 mt-6 w-[50%] self-center' onClick={save}>
                  Save and Precalculation
                </Button>
                {res && (
                  <div className='mb-[58px] flex flex-col gap-[14px]'>
                    <p className='text-sm font-normal'>Values</p>
                    <div className='flex items-center gap-2'>
                      <p className='text-base font-medium'>result={res}</p>
                      <CheckCircle2 strokeWidth={2} className='h-4 w-4 text-primary' />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectExpressionPage
