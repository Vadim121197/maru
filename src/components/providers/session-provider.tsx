'use client'

import type { ReactNode } from 'react'

import type { Session } from 'next-auth'
import { SessionProvider as Provider } from 'next-auth/react'

export const SessionProvider = ({ children, session }: { children: ReactNode; session?: Session | null }) => {
  return <Provider session={session}>{children}</Provider>
}
