'use client'

import React from 'react'
import { cn } from '~/lib/utils'
import { buttonVariants } from './ui/button'

export const SigninButton = ({ className }: { className?: string }) => {
  return (
    <a
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_ID}`}
      className={cn('w-[196px]', buttonVariants(), className)}
    >
      Sign In
    </a>
  )
}
