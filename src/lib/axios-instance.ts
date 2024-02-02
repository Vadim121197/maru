import axios from 'axios'

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const PROJECT_ID = '{project_id}'
export const TAG_ID = '{tag_id}'
export const ADDRESS = '{address}'
export const EXPRESSION_ID = '{expression_id}'
export const CALCULATION_ID = '{calculation_id}'

export enum ApiRoutes {
  USERS_INSTALLATIONS = '/users/installations',
  USERS_REPOS = '/users/repos',
  USERS_ORGS = '/users/orgs',
  USERS_ME = '/users/me',
  USERS_ME_ROJECTS = '/users/me/projects',

  AUTH_CALLBACK = '/auth/callback',
  AUTH_REFRESH = '/auth/refresh',

  PROJECTS = '/projects',
  PROJECTS_IMPORT = '/projects/import',
  PROJECTS_PROJECT_ID = '/projects/{project_id}',
  PROJECTS_PROJECT_ID_TOOLS = '/projects/{project_id}/tools',
  PROJECTS_PROJECT_ID_TAGS_TAG_ID = '/projects/{project_id}/tags/{tag_id}',
  PROJECTS_PROJECT_ID_EXPRESSIONS = '/projects/{project_id}/expressions',

  EXPRESSIONS = '/expressions',
  EXPRESSIONS_ADDRESS_TOOLS = '/expressions/{address}/tools',
  EXPRESSIONS_EXPRESSION_ID = '/expressions/{expression_id}',
  EXPRESSIONS_DEMO = '/expressions/demo',

  CALCULATIONS = '/calculations',
  CALCULATIONS_CALCULATION_ID = '/calculations/{calculation_id}',
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})
