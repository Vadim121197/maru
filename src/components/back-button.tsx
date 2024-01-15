import Link from 'next/link'
import { MoveLeft } from 'lucide-react'
import { cn } from '~/lib/utils'
import type { Nav } from '~/types/nav'
import { buttonVariants } from './ui/button'

export const BackButton = ({ to }: { to: Nav | string }) => (
  <div>
    <Link
      href={to}
      className={cn(
        'flex gap-4 items-center hover:opacity-50',
        buttonVariants({
          variant: 'ghost',
        }),
      )}
    >
      <MoveLeft className='h-6 w-6 text-muted-foreground' />
      <p className='text-base font-semibold text-muted-foreground'>Back</p>
    </Link>
  </div>
)
