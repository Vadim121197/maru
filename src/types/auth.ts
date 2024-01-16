export interface Auth {
  created_at: Date
  username: string
  id: number
  access_token: string
  refresh_token: string
}

export interface User {
  created_at: Date
  id: number
  username: string
  installation_id: null | number
}

//https://github.com/apps/maru-lake-app/installations/select_target
