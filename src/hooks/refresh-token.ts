'use client'

import { signOut, useSession } from 'next-auth/react'
import { ApiRoutes, axiosInstance } from '~/lib/axios-instance'
import type { Auth } from '~/types/auth'

export const useRefreshToken = () => {
  const { data: session, update } = useSession()

  return async () => {
    try {
      const { data } = await axiosInstance.post<Auth>(ApiRoutes.AUTH_REFRESH, {
        refresh_token: session?.refreshToken,
      })

      await update({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      })

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      }
    } catch (error) {
      await signOut()
    }
  }
}
