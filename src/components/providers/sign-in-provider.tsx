'use client'

import { useEffect, type ReactNode, useMemo } from 'react'

import { signIn, signOut, useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'

export const SignInProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { data: session } = useSession()

  const code = useMemo(() => {
    return searchParams.get('code')
  }, [searchParams])

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      void signOut()
    }
  }, [session])

  useEffect(() => {
    if (!code) return

    void (async () => {
      await signIn('credentials', {
        code,
        redirect: false,
      })
    })()
  }, [code, pathname, searchParams])

  return <>{children}</>
}
