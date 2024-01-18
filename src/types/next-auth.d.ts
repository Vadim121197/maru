import 'next-auth'
import 'next-auth/jwt'
import type { Auth, User as CustomUser } from '~/types/auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: CustomUser
    refreshToken?: string
    accessToken?: string
    error?: string | null
  }

  interface User extends Auth {}
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    refreshToken: string
    accessToken: string
    expiresIn: number
    error: string | null
  }
}
