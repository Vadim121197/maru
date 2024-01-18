import axios from 'axios'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { AuthOptions, Session, User } from 'next-auth'
import type { Auth, User as CustomUser } from '~/types/auth'
import type { JWT } from 'next-auth/jwt'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      async authorize(credentials: { code: string }) {
        try {
          const url = process.env.NEXT_PUBLIC_API_URL + '/auth/callback' + `?code=${credentials.code}`

          const { data } = await axios.get<Auth>(url)

          return {
            ...data,
            id: data.id.toString(),
          }
        } catch (error) {
          return null
        }
      },
      credentials: {
        code: { label: 'code', type: 'text', placeholder: 'code' },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken
      session.error = token.error
      session.refreshToken = token.refreshToken

      if (session.accessToken) {
        try {
          const url = process.env.NEXT_PUBLIC_API_URL + '/users/me'

          const { data } = await axios.get<CustomUser>(url, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })

          session.user = data
          return session
        } catch (error) {
          return session
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT
      user: User | null
      trigger: string
      session: Session | null
    }) {
      if (trigger === 'update' && session?.accessToken && session.refreshToken) {
        return {
          ...token,
          refreshToken: session.refreshToken,
          accessToken: session.accessToken,
        }
      }

      if (user) {
        token.refreshToken = user.refresh_token
        token.accessToken = user.access_token
      }

      return token
    },
  },
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
