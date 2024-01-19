'use client'

import { MoveLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export const BackButton = () => {
  const router = useRouter()
  return (
    <div>
      {/* <Link
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
      </Link> */}
      <Button
        onClick={() => {
          router.back()
        }}
        className='flex gap-4 items-center hover:opacity-50'
        variant='ghost'
      >
        <MoveLeft className='h-6 w-6 text-muted-foreground' />
        <p className='text-base font-semibold text-muted-foreground'>Back</p>
      </Button>
    </div>
  )
}
