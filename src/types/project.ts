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
  stars_count: number
  user_id: number
  tags: Tag[]
}
