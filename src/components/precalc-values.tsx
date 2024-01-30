import { CheckCircle } from 'lucide-react'

export const PrecalcValues = ({ res }: { res: string }) => {
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-sm font-medium lg:text-base'>Expression Values</p>
      <div className='flex items-center gap-2'>
        <p className='text-[12px] font-normal lg:text-sm'>result = {res || '????'}</p>
        <div>
          <CheckCircle className='h-4 w-4 text-[#6D23F8]' />
        </div>
      </div>
    </div>
  )
}
