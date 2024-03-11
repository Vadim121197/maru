import { ChevronDown, Trash } from 'lucide-react'

import { ExpressionTypeResponse, type Expression } from '~/types/expressions'

import { AccordionTrigger } from '../ui/accordion'

export const EventDataExpressionDetailCard = ({
  expression,
  deleteExpression,
}: {
  expression: Expression
  deleteExpression?: (id: number, type: ExpressionTypeResponse) => Promise<void>
}) => {
  return (
    <div className='flex h-full flex-col justify-between gap-5'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='break-all border-2 bg-background px-5 lg:px-[26px] py-[6px] lg:py-1 text-[10px] font-normal leading-4 text-foreground lg:text-sm'>
          {expression.name}
        </p>
        {deleteExpression && (
          <div className='flex items-center gap-1 lg:gap-3'>
            <div>
              <Trash
                strokeWidth={1}
                className='h-4 w-4 cursor-pointer text-foreground lg:h-5 lg:w-5 hover:opacity-50'
                onClick={() => {
                  void deleteExpression(expression.id, ExpressionTypeResponse.EVENT_DATA)
                }}
              />
            </div>
            <AccordionTrigger>
              <ChevronDown className='h-4 w-4 text-foreground lg:h-5 lg:w-5 hover:opacity-50' />
            </AccordionTrigger>
          </div>
        )}
      </div>
      <div className='flex w-full justify-between gap-2'>
        <p className='break-all px-1 text-left text-[10px] font-normal leading-4 text-muted-foreground lg:text-sm'>
          {expression.raw_data}
        </p>
      </div>
    </div>
  )
}
