import axios from 'axios'

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const PROJECT_ID = '{project_id}'
export const TAG_ID = '{tag_id}'
export const ADDRESS = '{address}'
export const EXPRESSION_ID = '{expression_id}'
export const CALCULATION_ID = '{calculation_id}'
export const CONTRACT_ID = '{contract_id}'
export const PROOF_ID = '{proof_id}'
export const TASK_ID = '{task_id}'

export enum ApiRoutes {
  USERS_INSTALLATIONS = '/users/installations',
  USERS_REPOS = '/users/repos',
  USERS_ORGS = '/users/orgs',
  USERS_ME = '/users/me',
  USERS_ME_PROJECTS = '/users/me/projects',
  USERS_ME_QUOTAS = '/users/me/quotas',

  AUTH_CALLBACK = '/auth/callback',
  AUTH_REFRESH = '/auth/refresh',
  AUTH_LOGOUT = '/auth/logout',

  PROJECTS = '/projects',
  PROJECTS_IMPORT = '/projects/import',
  PROJECTS_PROJECT_ID = '/projects/{project_id}',
  PROJECTS_PROJECT_ID_TOOLS = '/projects/{project_id}/tools',
  PROJECTS_PROJECT_ID_TAGS_TAG_ID = '/projects/{project_id}/tags/{tag_id}',
  PROJECTS_PROJECT_ID_EXPRESSIONS = '/projects/{project_id}/expressions',
  PROJECTS_PROJECT_ID_PROOFS = '/projects/{project_id}/proofs',
  PROJECTS_PROJECT_ID_TASKS = '/projects/{project_id}/tasks',
  PROJECTS_PROJECT_ID_DEPLOYMENTS = '/projects/{project_id}/deployments',
  PROJECTS_PROJECT_ID_SUMMARY = '/projects/{project_id}/summary',

  EXPRESSIONS = '/expressions',
  EXPRESSIONS_ADDRESS_TOOLS = '/expressions/{address}/tools',
  EXPRESSIONS_EXPRESSION_ID = '/expressions/{expression_id}',
  EXPRESSIONS_DEMO = '/expressions/demo',

  CALCULATIONS = '/calculations',
  CALCULATIONS_CALCULATION_ID = '/calculations/{calculation_id}',

  CONTRACTS = '/contracts',
  CONTRACTS_CONTRACT_ID = '/contracts/{contract_id}',

  PROOFS = '/proofs',
  PROOFS_PROOF_ID = '/proofs/{proof_id}',
  PROOFS_PROOF_ID_INPUT = '/proofs/{proof_id}/input',
  PROOFS_PROOF_ID_RESULT = '/proofs/{proof_id}/result',
  PROOFS_PROOF_ID_VERIFY = '/proofs/{proof_id}/verify',

  TASKS = '/tasks',
  TASKS_TASK_ID_EXPRESSIONS = '/tasks/{task_id}/expressions',

  DEPLOYMENTS = '/deployments',

  DASHBOARD = '/dashboard',
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})
