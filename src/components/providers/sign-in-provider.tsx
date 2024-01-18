'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

export const SignInProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      void signOut()
    }
  }, [session])

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
