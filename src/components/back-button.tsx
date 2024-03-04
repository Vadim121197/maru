'use client'

import { MoveLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { cn } from '~/lib/utils'

import { Button, buttonVariants } from './ui/button'

export const BackButton = ({ href }: { href?: string }) => {
  const router = useRouter()
  return (
    <div>
      {href ? (
        <Link
          href={href}
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
      ) : (
        <Button
          onClick={() => {
            router.back()
          }}
          className='flex items-center gap-4 hover:opacity-50'
          variant='ghost'
        >
          <MoveLeft className='h-6 w-6 text-muted-foreground' />
          <p className='text-base font-semibold text-muted-foreground'>Back</p>
        </Button>
      )}
    </div>
  )
}
