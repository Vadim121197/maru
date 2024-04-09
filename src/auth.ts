import NextAuth from 'next-auth'
import type { AuthOptions, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

import type { Auth } from '~/types/auth'

import { ApiRoutes, axiosInstance } from './lib/axios-instance'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(cred) {
        const credentials = cred as { code: string }
        try {
          const { data } = await axiosInstance.get<Auth>(ApiRoutes.AUTH_CALLBACK + `?code=${credentials.code}`)

          return Promise.resolve({
            ...data,
            id: data.id.toString(),
          })
        } catch (error) {
          return Promise.resolve(null)
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
    async session({ session, token }: { session: Session; token: JWT }) {
      const { accessToken, error, refreshToken, user } = token

      session.accessToken = accessToken
      session.error = error
      session.refreshToken = refreshToken
      session.user = {
        created_at: user.created_at,
        username: user.username,
        avatar_url: user.avatar_url,
        installation_id: user.installation_id,
        id: Number(user.id),
        bio: user.bio,
        theme: user.theme,
      }

      return Promise.resolve(session)
    },

    async jwt({ token, user: u, trigger, session: s }) {
      const session = s as Session | undefined
      const user = u as unknown as Auth | undefined

      if (trigger === 'update' && session?.accessToken && session.refreshToken) {
        return Promise.resolve({
          ...token,
          refreshToken: session.refreshToken,
          accessToken: session.accessToken,
        })
      }

      if (user) {
        token.refreshToken = user.refresh_token
        token.accessToken = user.access_token
        token.user = user
      }

      return Promise.resolve(token)
    },
  },
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
