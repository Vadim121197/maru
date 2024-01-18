export interface Tag {
  name: string
  id: number
}

export interface Project {
  name: string
  repo_url: string
  description: string
  is_private: boolean
  created_at: Date
  updated_at: Date
  id: number
  is_demo: boolean
  stars_count: number
  user: {
    id: number
    avatar_url: string
    username: string
  }
  tags: Tag[]
}
