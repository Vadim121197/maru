import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { useStore } from '~/state'

export const BASE_URL = 'https://maru.zpoken.dev/api/v1'

export enum AxiosRoutes {
  PROJECTS = '/projects',
  EXPRESSIONS = '/expressions',
  AUTH_CALLBACK = '/auth/callback',
  AUTH_REFRESH = '/auth/refresh',
  USERS_ME = '/users/me',
}

const axiosInterceptorInstance = axios.create({
  baseURL: BASE_URL,
})

// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')

    // If token is present add it to request's Authorization Header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  // Handle request errors here
  (error) => Promise.reject(error),
)

// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  // Modify the response data here
  (response) => {
    return response
  },
  // Handle response errors here
  async (error) => {
    const err = error as AxiosError
    if (err.response?.status === 401) {
      await useStore.getState().auth.refreshToken()
      return axiosInterceptorInstance(err.config as AxiosRequestConfig)
    }

    return Promise.resolve()
  },
)

export default axiosInterceptorInstance
