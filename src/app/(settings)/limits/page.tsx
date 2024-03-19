'use client'

import { useEffect } from 'react'

import { QuoteCard } from '~/components/quote-card'
import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import { calculatePercentage } from '~/lib/calculate-percentage'
import type { Quote } from '~/types/auth'

import { useUser } from '../user-provider'

const LimitsPage = () => {
  const axiosAuth = useAxiosAuth()
  const { quotes, setQuotes } = useUser()((state) => state)

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
  }, [axiosAuth, setQuotes])

  return (
    <div className='flex flex-col gap-6 bg-card p-6'>
      <h3 className='text-2xl font-bold leading-9'>Limits</h3>
      <div className='flex flex-col gap-10'>
        {quotes.map((q) => (
          <QuoteCard key={q.name} quote={q} />
        ))}
      </div>
    </div>
  )
}

export default LimitsPage
