'use client'

import { useEffect, useState } from 'react'

import { BarChartBig, ChevronDown } from 'lucide-react'

import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import type { Quote } from '~/types/auth'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Progress } from './ui/progress'

export const LimitsAccordion = () => {
  const axiosAuth = useAxiosAuth()
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await axiosAuth.get<Quote[]>(ApiRoutes.USERS_ME_QUOTAS)
        setQuotes(data)
      } catch {}
    })()
  }, [axiosAuth])

  console.log(quotes)

  return (
    <Accordion type='single' collapsible className='flex justify-between'>
      <AccordionItem value='item-1' className='w-full'>
        <AccordionTrigger className='flex items-center justify-between gap-2 w-full'>
          <div className='flex items-center gap-2'>
            <div>
              <BarChartBig strokeWidth='1' className='h-6 w-6' />
            </div>
            <p className='text-[12px] font-normal leading-[18px] lg:text-sm'>Limits</p>
          </div>
          <ChevronDown strokeWidth={1} className='h-6 w-6 text-foreground shrink-0 transition-transform duration-200' />
        </AccordionTrigger>
        <AccordionContent className='mt-10 flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <p className='text-base font-medium text-muted-foreground'>Projects</p>
              <p className='text-[8px] leading-6 font-medium text-muted-foreground'>7/10</p>
            </div>
            <Progress value={33} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
