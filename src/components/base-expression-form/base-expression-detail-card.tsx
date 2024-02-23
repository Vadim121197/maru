import { ChevronDown, Trash } from 'lucide-react'
import { copyToClipboard } from '~/lib/copy-to-clipboard'
import { cutAddress } from '~/lib/cut-address'
import type { Expression } from '~/types/expressions'
import { AccordionTrigger } from '../ui/accordion'

export const BaseExpressionDetailCard = ({
  expression,
  deleteExpression,
}: {
  expression: Expression
  deleteExpression?: (id: number, type: 'base_expressions' | 'final_expressions') => Promise<void>
}) => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between gap-3 flex-wrap'>
        <div className='py-1 px-2 border-2 text-sm  bg-background text-muted-foreground break-all font-bold'>
          {expression.name}
        </div>
        <div className='flex items-center gap-4'>
          <p className='text-sm font-normal'>Contact</p>
          <div
            className='py-1 px-2 border-2 text-sm font-normal  bg-background text-muted-foreground cursor-pointer'
            onClick={copyToClipboard(expression.contract_address)}
          >
            {cutAddress(expression.contract_address)}
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <p className='text-sm font-normal'>Event</p>
          <div className='py-1 px-2 border-2 text-sm font-normal  bg-background text-muted-foreground break-all'>
            {expression.event.split('(')[0]}
          </div>
        </div>
      </div>
      <div className='flex w-full justify-between gap-2'>
        <p className='px-1 text-left text-[12px] font-normal leading-[18px] lg:text-sm break-all'>
          {expression.raw_data}
        </p>
      </div>
      <div className='flex justify-between flex-wrap gap-2'>
        {expression.filter_data && (
          <div className='flex items-center gap-4'>
            <p className='text-sm font-normal'>Filter</p>
            <div className='py-1 px-2 border-2 text-sm font-normal  bg-background text-muted-foreground break-all'>
              {expression.filter_data}
            </div>
          </div>
        )}
        <div className='flex items-center gap-4'>
          <p className='text-sm font-normal'>Aggregate </p>
          <div className='py-1 px-2 border-2 text-sm font-normal  bg-background text-muted-foreground break-all'>
            {expression.aggregate_operation}
          </div>
        </div>
        {deleteExpression && (
          <div className='flex gap-2 items-center'>
            <div>
              <Trash
                strokeWidth={1}
                className='h-4 w-4 text-muted-foreground lg:h-5 lg:w-5 cursor-pointer'
                onClick={() => {
                  void deleteExpression(expression.id, 'base_expressions')
                }}
              />
            </div>
            <AccordionTrigger>
              <ChevronDown className='h-4 w-4 text-muted-foreground lg:h-5 lg:w-5' />
            </AccordionTrigger>
          </div>
        )}
      </div>
    </div>
  )
}
