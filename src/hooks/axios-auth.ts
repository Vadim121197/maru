'use client'

import { useEffect } from 'react'

import { type AxiosError, type AxiosRequestHeaders } from 'axios'
import { useSession } from 'next-auth/react'

import { axiosInstance } from '~/lib/axios-instance'

import { useRefreshToken } from './refresh-token'

const useAxiosAuth = () => {
  const { data: session } = useSession()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization && session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const prevRequest = error.config as { sent: boolean; headers: AxiosRequestHeaders }

        if (error.response?.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true

          const tokens = await refreshToken()

          prevRequest.headers.Authorization = `Bearer ${tokens?.accessToken}`

          return axiosInstance(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept)
      axiosInstance.interceptors.response.eject(responseIntercept)
    }
  }, [session, refreshToken])

  return axiosInstance
}

export default useAxiosAuth
