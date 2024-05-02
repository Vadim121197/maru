export interface Tag {
  name: string
  id: number
}

export interface ProjectCreateResponse {
  name: string
  created_at: Date
  updated_at: Date
  id: number
  user_id: number
}

export interface Project {
  block_range: string | null
  name: string | null
  created_at: Date
  description: string | null
  expression_count: number
  updated_at: Date
  id: number
  stars_count: number
  is_demo: boolean
  is_private: boolean
  user: {
    id: number
    avatar_url: string | null
    username: string
  }
  tags: Tag[]
}

export interface ProjectSummary {
  content: string
}
