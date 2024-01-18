import axios from 'axios'
import axiosInterceptorInstance, { AxiosRoutes, BASE_URL } from '~/lib/axios-interceptor-instance'
import type { Auth, User } from '~/types/auth'
import type { AllSlices, SliceCreator } from '.'

export interface AuthSlice {
  isAuthenticated: boolean
  user: null | User
  login: () => Promise<void>
  getUserInfo: () => Promise<void>
  refreshToken: () => Promise<void>
  logout: () => void
}

export const createAuthSlice = (): SliceCreator<AuthSlice> => (set, get) => {
  return {
    isAuthenticated: false,
    user: null,
    login: async () => {
      try {
        const { data: user } = await axios.get<User>('/api/me')

        set((state) => {
          state.auth.isAuthenticated = true
          state.auth.user = user
        })
      } catch {
        set((state) => {
          state.auth.isAuthenticated = false
          state.auth.user = null
        })
      }
    },
    getUserInfo: async () => {
      try {
        const { data: user } = await axiosInterceptorInstance.get<User>(AxiosRoutes.USERS_ME)
        set((state) => {
          state.auth.isAuthenticated = true
          state.auth.user = user
        })
      } catch {
        set((state) => {
          state.auth.isAuthenticated = false
          state.auth.user = null
        })
      }
    },
    refreshToken: async () => {
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const { data: auth } = await axios.post<Auth>(`${BASE_URL}${AxiosRoutes.AUTH_REFRESH}`, {
          refresh_token: refreshToken,
        })
        localStorage.setItem('access_token', auth.access_token)
        localStorage.setItem('refresh_token', auth.refresh_token)
        localStorage.setItem('user_id', auth.id.toString())

        set((state) => {
          state.auth.isAuthenticated = true
        })

        return Promise.resolve()
      } catch (error) {
        get().auth.logout()

        return Promise.reject(error)
      }
    },
    logout: () => {
      set((state) => {
        state.auth.isAuthenticated = false
        state.auth.user = null
        state.projects.userProjects = []
      })
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_id')
    },
  }
}

export const authSelector = (state: AllSlices) => state.auth
