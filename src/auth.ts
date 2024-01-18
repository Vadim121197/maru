import axios from 'axios'
import moment from 'moment'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { AuthOptions, Session, User } from 'next-auth'
import type { Auth, User as CustomUser } from '~/types/auth'
import type { JWT } from 'next-auth/jwt'

const refreshTokenApiCall = async (token: JWT) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL + '/auth/refresh'

    const { data } = await axios.post<Auth>(url, {
      refresh_token: token.refreshToken,
    })

    return {
      ...token,
      error: null,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: moment().unix() + moment.utc(data.expire_at).local().unix() * 1000 - 2000,
    }
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

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
        } catch {
          return session
        }
      }
    },
    async jwt({ token, user }: { token: JWT; user: User | null }) {
      const now = moment().unix()

      if (user) {
        token.refreshToken = user.refresh_token
        token.accessToken = user.access_token

        token.expiresIn = now + moment.utc(user.expire_at).local().unix() * 1000 - 2000
      }

      if (now < token.expiresIn) {
        return token
      }

      return await refreshTokenApiCall(token)
    },
  },
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
