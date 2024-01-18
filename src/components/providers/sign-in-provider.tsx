'use client'

import { signIn } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

export const SignInProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) return

    void (async () => {
      await signIn('credentials', {
        code,
        redirect: true,
        callbackUrl: pathname,
      })
    })()
  }, [searchParams, pathname])

  return <>{children}</>
}
