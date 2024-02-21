import type { PrecalculateResult } from '~/types/calculations'

export const PrecalcValues = ({ res }: { res: PrecalculateResult[] }) => {
  return (
    <div className='mt-[60px] flex flex-col gap-6 lg:mt-10 lg:gap-4'>
      <p className='text-sm font-medium lg:text-base'>Expression Values</p>
      <div className='grid grid-cols-1 lg:grid-cols-3'>
        {res.map((i) => (
          <p key={i.name} className='text-[12px] font-normal leading-[18px] lg:text-sm'>
            {i.name}={(i.value / 10 ** i.decimal).toFixed(1)}
          </p>
        ))}
      </div>
    </div>
  )
}
