import { TrendingUp } from 'lucide-react'

import { ChartIcon } from '~/components/chart-icon'
import { ApiRoutes, axiosInstance } from '~/lib/axios-instance'
import type { Dashboard } from '~/types/dashboard'

export const Statistics = async () => {
  let dashboard: Dashboard = {
    projects_count: 0,
    contracts_verifications_total_count: 0,
    contracts_verifications_success_count: 0,
    proofs_count: 0,
    proofs_dashboard: [],
  }

  try {
    const { data } = await axiosInstance.get<Dashboard>(ApiRoutes.DASHBOARD + '?period=y')

    dashboard = data
  } catch (error) {}

  return (
    <div className='order-3 flex flex-col gap-5 lg:w-[20%]'>
      <div className='flex items-center gap-3'>
        <div>
          <TrendingUp strokeWidth={1} className='h-6 w-6 text-primary' />
        </div>
        <p className='text-base font-semibold lg:text-lg lg:font-medium'>Statistics</p>
      </div>
      <div className='flex w-full flex-col border-2 border-border p-4 lg:py-5 lg:pl-5 lg:pr-[30px]'>
        <p className='mb-6 text-base font-semibold text-muted-foreground lg:mb-5 lg:text-lg lg:font-medium'>
          Proofs Generated
        </p>
        <div className='w-full'>
          <ChartIcon />
        </div>
        <p className='mt-[11px] text-base font-semibold lg:mt-[6px] lg:text-lg lg:font-medium'>
          Total count: {dashboard.proofs_count}
        </p>
      </div>
    </div>
  )
}
