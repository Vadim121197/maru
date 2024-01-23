'use client'

import { cn } from '~/lib/utils'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { buttonVariants, type ButtonProps } from './ui/button'

export const SigninButton = ({
  className,
  variant,
  children,
}: {
  className?: string
  variant?: ButtonProps['variant']
  children?: ReactNode
}) => {
  const pathname = usePathname()

  return (
    <a
      className={cn(
        'w-[196px]',
        buttonVariants({
          variant,
        }),
        className,
      )}
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_ID}&redirect_uri=${process.env.NEXT_PUBLIC_ORIGIN}${pathname}`}
    >
      {children ?? 'Sign In'}
    </a>
  )
}
