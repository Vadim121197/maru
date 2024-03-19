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
  username: string
  avatar_url: null | string
  installation_id: null | number
  id: number
  bio: string | null
  theme: 'light' | 'dark'
}

export enum QuoteName {
  PROJECTS = 'Projects',
  PROOFS = 'Proofs',
  EVENTS = 'Events',
  DEMOS = 'Demos',
}

export enum QuoteType {
  DAILY = 'daily',
  HOURLY = 'hourly',
}

export interface Quote {
  name: QuoteName
  used: number
  total: number
  type: QuoteType | null
  percentage: number
}
