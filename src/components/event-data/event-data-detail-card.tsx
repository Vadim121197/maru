import { ChevronDown, Trash } from 'lucide-react'

import { copyToClipboard } from '~/lib/copy-to-clipboard'
import { cutAddress } from '~/lib/cut-address'
import { ExpressionTypeResponse, type Expression } from '~/types/expressions'

import { AccordionTrigger } from '../ui/accordion'
import type { EditEventDataProps } from './edit-event-data'

export const EventDataDetailCard = ({
  expression,
  deleteExpression,
}: {
  expression: Expression
  deleteExpression?: EditEventDataProps['deleteExpression']
}) => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='break-all border-2 bg-background px-2  py-1 text-sm font-bold text-muted-foreground'>
          {expression.name}
        </div>
        {expression.contract_address && (
          <div className='flex items-center gap-4'>
            <p className='text-sm font-normal'>Contact</p>
            <div
              className='cursor-pointer border-2 bg-background px-2 py-1  text-sm font-normal text-muted-foreground'
              onClick={copyToClipboard(expression.contract_address)}
            >
              {cutAddress(expression.contract_address)}
            </div>
          </div>
        )}
        {expression.event && (
          <div className='flex items-center gap-4'>
            <p className='text-sm font-normal'>Event</p>
            <div className='break-all border-2 bg-background px-2 py-1  text-sm font-normal text-muted-foreground'>
              {expression.event.split('(')[0]}
            </div>
          </div>
        )}
      </div>
      <div className='flex w-full justify-between gap-2'>
        <p className='break-all px-1 text-left text-[12px] font-normal leading-[18px] lg:text-sm'>
          {expression.raw_data}
        </p>
      </div>
      <div className='flex flex-wrap justify-between gap-2'>
        {expression.filter_data && (
          <div className='flex items-center gap-4'>
            <p className='text-sm font-normal'>Filter</p>
            <div className='break-all border-2 bg-background px-2 py-1  text-sm font-normal text-muted-foreground'>
              {expression.filter_data}
            </div>
          </div>
        )}
        <div className='flex items-center gap-4'>
          <p className='text-sm font-normal'>Aggregate </p>
          <div className='break-all border-2 bg-background px-2 py-1  text-sm font-normal text-muted-foreground'>
            {expression.aggregate_operation}
          </div>
        </div>
        {deleteExpression && (
          <div className='flex items-center gap-2'>
            <div>
              <Trash
                strokeWidth={1}
                className='h-4 w-4 cursor-pointer text-muted-foreground lg:h-5 lg:w-5'
                onClick={() => {
                  deleteExpression(expression.id, ExpressionTypeResponse.EVENT_DATA)
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
