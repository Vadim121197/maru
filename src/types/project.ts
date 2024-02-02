export interface Tag {
  name: string
  id: number
}

export interface Project {
  block_range: string
  name: string | null
  created_at: Date
  updated_at: Date
  id: number
  stars_count: number
  is_demo: boolean
  user: {
    id: number
    avatar_url: string | null
    username: string
  }
  tags: Tag[]
}
