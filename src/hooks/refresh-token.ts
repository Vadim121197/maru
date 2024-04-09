'use client'

import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'

import { ApiRoutes, BASE_URL, axiosInstance } from '~/lib/axios-instance'
import type { Auth } from '~/types/auth'

export const useRefreshToken = () => {
  const { data: session, update } = useSession()

  return async () => {
    try {
      const { data } = await axios.post<Auth>(BASE_URL + ApiRoutes.AUTH_REFRESH, {
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
      await axiosInstance.post(ApiRoutes.AUTH_LOGOUT, {
        refresh_token: session?.refreshToken,
      })
    }
  }
}
