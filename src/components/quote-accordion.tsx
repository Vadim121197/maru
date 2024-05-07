'use client'

import { useEffect, useState } from 'react'

import { BarChartBig, ChevronDown } from 'lucide-react'

import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { calculatePercentage } from '~/lib/calculate-percentage'
import type { Quote } from '~/types/auth'

import { QuoteCard } from './quote-card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

export const QuoteAccordion = () => {
  const axiosAuth = useAxiosAuth()
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await axiosAuth.get<Omit<Quote, 'percentage'>[]>(ApiRoutes.USERS_ME_QUOTAS)

        setQuotes(
          data.map((q) => ({
            ...q,
            percentage: calculatePercentage(q.used, q.total),
          })),
        )
      } catch {}
    })()
  }, [axiosAuth])

  return (
    <Accordion type='single' collapsible className='flex justify-between'>
      <AccordionItem value='item-1' className='w-full'>
        <AccordionTrigger className='flex w-full items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <div>
              <BarChartBig strokeWidth='1' className='size-6' />
            </div>
            <p className='text-[12px] font-normal leading-[18px] lg:text-sm'>Limits</p>
          </div>
          <ChevronDown strokeWidth={1} className='size-6 shrink-0 text-foreground transition-transform duration-200' />
        </AccordionTrigger>
        <AccordionContent className='mt-10 flex flex-col gap-6'>
          {quotes.map((q) => (
            <QuoteCard key={q.name} quote={q} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
