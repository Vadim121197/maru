export interface Auth {
  created_at: Date
  username: string
  avatar_url: string | null
  installation_id: null | number
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

export interface Quote {
  name: string
  used: number
  total: number
  type: string | null
}
