'use client'

import { useEffect, useState } from 'react'
import { BackButton } from '~/components/back-button'
import { OneTimeCalculation } from '~/components/one-time-calculation'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { AxiosRoutes, axiosInstance } from '~/lib/axios-instance'
import { cn } from '~/lib/utils'
import type { Expression } from '~/types/expressions'
import { Nav } from '~/types/nav'

const ProjectCalculationsPage = ({ params }: { params: { id: string } }) => {
  const [selectedExpression, setSelectedExpression] = useState<string | undefined>()

  const [expressions, setExpressions] = useState<Expression[]>([])

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await axiosInstance.get<Expression[]>(`${AxiosRoutes.PROJECTS}/${params.id}/expressions`)

        setExpressions(data)
        setSelectedExpression(data[0]?.id ? data[0]?.id.toString() : undefined)
      } catch (error) {
        /* empty */
      }
    })()
  }, [params.id])

  return (
    <section className='container grid w-[628px] items-center md:pt-[64px]'>
      <div className='flex flex-col md:gap-10 '>
        <div className='pl-[10%]'>
          <BackButton to={`${Nav.PROJECTS}/${params.id}`} />
        </div>
        <div className='flex flex-col items-center gap-4'>
          <p className='text-2xl font-bold'>New Calculations</p>
          <div className='w-full bg-card px-6 pt-6'>
            <RadioGroup
              value={selectedExpression}
              onValueChange={(val) => {
                setSelectedExpression(val)
              }}
              className='flex flex-col gap-4 border-b-[1px] border-border pb-4'
            >
              {expressions.map((expr) => (
                <div className='flex items-center space-x-2' key={expr.name}>
                  <RadioGroupItem value={expr.id.toString()} id={expr.name} />
                  <Label
                    htmlFor={expr.name}
                    className={cn(
                      'text-base font-medium cursor-pointer break-all',
                      expr.id.toString() === selectedExpression ? 'text-muted' : 'text-muted-foreground',
                    )}
                  >
                    {expr.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className='mt-4'>
              <Tabs defaultValue='one_time'>
                <TabsList className='mb-10 w-full'>
                  <TabsTrigger value='one_time' className='w-full data-[state=active]:bg-transparent'>
                    One time calculation
                  </TabsTrigger>
                  <TabsTrigger value='periodic' className='w-full data-[state=active]:bg-transparent'>
                    Periodic calculation
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='one_time'>
                  <OneTimeCalculation />
                </TabsContent>
                <TabsContent value='periodic'></TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectCalculationsPage
