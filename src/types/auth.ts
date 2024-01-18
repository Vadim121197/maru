export interface Auth {
  created_at: Date
  username: string
  id: number
  access_token: string
  refresh_token: string
  expires_at: Date
}

export interface User {
  created_at: Date
  id: number
  username: string
  installation_id: null | number
  avatar_url: null | string
}
