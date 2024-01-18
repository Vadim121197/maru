import axios from 'axios'

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export enum AxiosRoutes {
  PROJECTS = '/projects',
  EXPRESSIONS = '/expressions',
  AUTH_CALLBACK = '/auth/callback',
  AUTH_REFRESH = '/auth/refresh',
  USERS_ME = '/users/me',
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})
