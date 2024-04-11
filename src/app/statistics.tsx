'use client'

import { useEffect, useMemo, useState } from 'react'

import { TrendingUp } from 'lucide-react'
import moment from 'moment'
import { SparklineChart, AreaSeries, Area, Gradient, Line, GradientStop } from 'reaviz'

import useAxiosAuth from '~/hooks/axios-auth'
import { ApiRoutes } from '~/lib/axios-instance'
import type { Dashboard } from '~/types/dashboard'

export const Statistics = () => {
  const axiosAuth = useAxiosAuth()

  const [dasboard, setDashboard] = useState<Dashboard | undefined>()

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await axiosAuth.get<Dashboard>(ApiRoutes.DASHBOARD + '?period=M')

        setDashboard(data)
      } catch (error) {}
    })()
  }, [axiosAuth])

  const singleDateData = useMemo(() => {
    if (!dasboard?.proofs_dashboard.length) return []
    return dasboard.proofs_dashboard.map((pr, index) => ({
      id: index.toString(),
      key: moment.utc(pr.timestamp).toDate(),
      data: pr.value,
    }))
  }, [dasboard?.proofs_dashboard])

  return (
    <div className='order-3 flex flex-col gap-5 lg:w-[20%]'>
      <div className='flex items-center gap-3'>
        <div>
          <TrendingUp strokeWidth={1} className='h-6 w-6 text-primary' />
        </div>
        <p className='text-base font-semibold lg:text-lg lg:font-medium'>Statistics</p>
      </div>
      <div className='flex flex-col gap-[18px] lg:gap-6'>
        <div className='flex w-full flex-col border-2 border-border p-4 lg:py-5 lg:pl-5 lg:pr-[30px]'>
          <p className='mb-6 text-base font-semibold text-muted-foreground lg:mb-5 lg:text-lg lg:font-medium'>
            Proofs Generated
          </p>
          <div className='flex justify-end'>
            <SparklineChart
              width={139}
              height={64}
              data={singleDateData}
              series={
                <AreaSeries
                  symbols={null}
                  interpolation='smooth'
                  markLine={null}
                  area={
                    <Area
                      style={{ opacity: '0.4' }}
                      gradient={
                        <Gradient
                          stops={[
                            <GradientStop offset='10%' stopOpacity={0} key='start' color='#6D23F8' />,
                            <GradientStop offset='100%' stopOpacity={1} key='stop' color='#6D23F8' />,
                          ]}
                        />
                      }
                    />
                  }
                  line={
                    <Line
                      strokeWidth={1.5}
                      style={{ stroke: '#6D23F8', strokeLinecap: 'round', strokeLinejoin: 'round', opacity: '0.8' }}
                    />
                  }
                />
              }
            />
          </div>

          <p className='mt-[11px] text-base font-semibold lg:mt-[6px] lg:text-lg lg:font-medium'>
            Total count: {dasboard?.proofs_count ?? 0}
          </p>
        </div>
        <div className='flex w-full items-center justify-between gap-1  border-2 border-border p-4 lg:py-5'>
          <p className='text-base font-semibold lg:text-lg lg:font-medium lg:leading-[26px]'>Projects count :</p>
          <p className='text-lg font-semibold leading-[26px] lg:text-xl lg:leading-[30px]'>
            {dasboard?.projects_count}
          </p>
        </div>
        <div className='flex w-full items-center justify-between gap-1  border-2 border-border p-4 lg:py-5'>
          <p className='text-base font-semibold lg:text-lg lg:font-medium lg:leading-[26px]'>Total verifications :</p>
          <p className='text-lg font-semibold leading-[26px] lg:text-xl lg:leading-[30px]'>
            {dasboard?.contracts_verifications_total_count}
          </p>
        </div>
        <div className='flex w-full items-center justify-between gap-1  border-2 border-border p-4 lg:py-5'>
          <p className='text-base font-semibold lg:text-lg lg:font-medium lg:leading-[26px]'>
            Total success verifications:
          </p>
          <p className='text-lg font-semibold leading-[26px] lg:text-xl lg:leading-[30px]'>
            {dasboard?.contracts_verifications_success_count}
          </p>
        </div>
      </div>
    </div>
  )
}
