'use client'

import type { Session } from 'next-auth'
import { SessionProvider as Provider } from 'next-auth/react'
import type { ReactNode } from 'react'

export const SessionProvider = ({ children, session }: { children: ReactNode; session?: Session | null }) => {
  return <Provider session={session}>{children}</Provider>
}
