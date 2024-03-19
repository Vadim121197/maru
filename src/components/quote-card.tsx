import { QuoteName, type Quote } from '~/types/auth'

import { Progress } from './ui/progress'

export const qutoesRecords: Record<QuoteName, string> = {
  [QuoteName.PROJECTS]: 'Projects',
  [QuoteName.DEMOS]: 'Precalculations',
  [QuoteName.EVENTS]: 'Event units',
  [QuoteName.PROOFS]: 'Proofs',
}

interface QuoteCardProps {
  quote: Quote
}
export const QuoteCard = ({ quote }: QuoteCardProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <p className='text-base font-medium text-muted-foreground'>{qutoesRecords[quote.name]}</p>
        <p className='text-[8px] font-medium leading-6 text-muted-foreground'>
          {quote.used}/{quote.total} {quote.type}
        </p>
      </div>
      <Progress value={quote.percentage} />
    </div>
  )
}
