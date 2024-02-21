import { CheckCircle } from 'lucide-react'
import type { PrecalculateResult } from '~/types/calculations'

export const PrecalcValues = ({ res }: { res: PrecalculateResult[] }) => {
  return (
    <div className='mt-[60px] lg:mt-10 flex flex-col gap-6 lg:gap-4'>
      <p className='text-sm lg:text-base font-medium'>Expression Values</p>
      <div className='grid grid-cols-1 lg:grid-cols-3'>
        {res.map((i) => (
          <div className='flex items-center gap-2' key={i.name}>
            <p className='text-[12px] leading-[18px] lg:text-sm font-normal'>
              {i.name}={(i.value / 10 ** i.decimal).toFixed(1)}
            </p>
            <div>
              <CheckCircle className='h-4 w-4 text-[#6D23F8]' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
