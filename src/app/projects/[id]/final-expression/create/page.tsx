'use client'

import { CheckCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { BackButton } from '~/components/back-button'
import { ExpressionField } from '~/components/expression-field'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import useAxiosAuth from '~/hooks/axios-auth'
import { AxiosRoutes } from '~/lib/axios-instance'
import type { CalculationRes } from '~/types/calculations'
import type { ExpressionCreateRes, ExpressionValues, FinalExpressionTools } from '~/types/expressions'

interface ExpressionHelperTable {
  key: number
  constant: undefined
  proved: undefined
  function: undefined
  expression: string | undefined
}

const defaultExpression = 'bought_id == 1 ? tokens_bought : 0'

const ProjectExpressionPage = ({ params }: { params: { id: string } }) => {
  const axiosAuth = useAxiosAuth()

  const [expressionValues, setExpressionValues] = useState<ExpressionValues>({
    name: '',
    rawData: defaultExpression,
  })
  const [precalcRes, setPrecalcRes] = useState('')
  const [saveRes, setSaveRes] = useState<ExpressionCreateRes | undefined>()
  const [proveRes, setProveRes] = useState<CalculationRes | undefined>()

  const [period, setPeriod] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  })

  const [tools, setTools] = useState<FinalExpressionTools | undefined>()

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await axiosAuth.get<FinalExpressionTools>(`/projects/${params.id}/tools`)

        setTools(data)
      } catch {}
    })()
  }, [params.id, axiosAuth])

  const expressionHelperData = useMemo(() => {
    if (!tools) return []
    const maxLength = Math.max(tools.expressions.length)

    const arr: ExpressionHelperTable[] = []

    for (let i = 0; i < maxLength; i += 1) {
      const obj: ExpressionHelperTable = {
        key: i,
        constant: undefined,
        proved: undefined,
        function: undefined,
        expression: tools.expressions[i],
      }

      arr.push(obj)
    }

    return arr
  }, [tools])

  const helperClick = (value: string | undefined) => () => {
    if (!value) return
    setExpressionValues((state) => ({ ...state, rawData: `${state.rawData} ${value}` }))
  }

  const precalculate = async () => {
    try {
      const { data } = await axiosAuth.post<string>(`${AxiosRoutes.EXPRESSIONS}/demo`, {
        block_range: null,
        raw_data: expressionValues.rawData,
        expression_type: 'final',
      })
      setPrecalcRes(data)
    } catch (error) {}
  }

  const save = async () => {
    if (!expressionValues.rawData || !expressionValues.name) return
    try {
      const { data } = await axiosAuth.post<ExpressionCreateRes>(AxiosRoutes.EXPRESSIONS, {
        raw_data: expressionValues.rawData,
        name: expressionValues.name,
        project_id: params.id,
        expression_type: 'final',
      })
      setSaveRes(data)
    } catch (error) {}
  }

  const prove = async () => {
    if (!saveRes?.id) return
    try {
      const { data } = await axiosAuth.post<CalculationRes>('/calculations', {
        expression_id: saveRes.id,
        calculation_type: 'one_time',
        from_value: period.from,
        to_value: period.to,
        period_value: 'block', // or 'day'
      })
      setProveRes(data)
    } catch {}
  }

  return (
    <section className='flex w-full flex-col items-center px-7 lg:container lg:w-[816px] lg:pt-[64px]'>
      <div className='flex w-full flex-col lg:gap-10'>
        <BackButton />
        <div className='flex flex-col items-center gap-4'>
          <p className='text-2xl font-bold'>Create Final Expression</p>
          <div className='flex w-full flex-col gap-6 bg-card p-6'>
            {tools && (
              <div className='flex flex-col'>
                <div className='flex flex-col gap-[38px] border-b pb-4'>
                  <div className='flex w-full flex-col gap-2'>
                    <p className='text-base font-medium'>Expression</p>
                    <ExpressionField expressionValues={expressionValues} setExpressionValues={setExpressionValues} />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Global Consts</TableHead>
                        <TableHead className='text-center'>Proved Values</TableHead>
                        <TableHead className='text-center'>Expressions</TableHead>
                        <TableHead className='text-center'>Global Functions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expressionHelperData.map((i) => (
                        <TableRow key={i.key}>
                          <TableCell>
                            <button onClick={helperClick(i.constant)} type='button'>
                              {i.constant}
                            </button>
                          </TableCell>
                          <TableCell className='text-center'>
                            <button onClick={helperClick(i.proved)} type='button'>
                              {i.proved}
                            </button>
                          </TableCell>
                          <TableCell className='text-center'>
                            <button onClick={helperClick(i.expression)} type='button'>
                              {i.expression}
                            </button>
                          </TableCell>
                          <TableCell className='text-center'>
                            <button onClick={helperClick(i.function)} type='button'>
                              {i.function}
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
                  disabled={!expressionValues.rawData || !expressionValues.name}
                >
                  Save
                </Button>
              </div>
            )}
            {saveRes && (
              <Tabs defaultValue='one_time' className='mt-[60px]'>
                <TabsList className='mb-10 w-full'>
                  <TabsTrigger value='one_time' className='w-full data-[state=active]:bg-transparent'>
                    One time calculation
                  </TabsTrigger>
                  <TabsTrigger value='periodic' disabled className='w-full data-[state=active]:bg-transparent'>
                    Periodic calculation
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='one_time' className='flex flex-col gap-[60px]'>
                  <div className='grid grid-cols-2 gap-10'>
                    <div className='flex flex-col gap-[10px]'>
                      <p className='text-base font-medium'>From</p>
                      <Input
                        value={period.from}
                        onChange={(e) => {
                          setPeriod((state) => ({ ...state, from: e.target.value }))
                        }}
                      />
                    </div>
                    <div className='flex flex-col gap-[10px]'>
                      <p className='text-base font-medium'>To</p>
                      <Input
                        value={period.to}
                        onChange={(e) => {
                          setPeriod((state) => ({ ...state, to: e.target.value }))
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    className='w-[274px] self-center'
                    onClick={() => {
                      void (async () => {
                        await prove()
                      })()
                    }}
                  >
                    Prove
                  </Button>
                </TabsContent>
                <p>res={proveRes?.result}</p>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectExpressionPage
