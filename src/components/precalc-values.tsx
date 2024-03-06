import type { PrecalculateResult } from '~/types/calculations'

export const PrecalcValues = ({ res }: { res: PrecalculateResult[] }) => {
  return (
    <div className='mt-[60px] flex flex-col gap-6 lg:mt-10 lg:gap-4'>
      <p className='text-sm font-medium lg:text-base'>Expression Values</p>
      <div className='grid grid-cols-1 gap-2 lg:grid-cols-3'>
        {res.map((i) => {
          const val = !i.decimal ? BigInt(i.value).toString() : (BigInt(i.value) / BigInt(10 ** i.decimal)).toString()

          return (
            <p key={i.name} className='break-all text-[12px] font-normal leading-[18px] lg:text-sm'>
              {i.name}={val}
            </p>
          )
        })}
      </div>
    </div>
  )
}
