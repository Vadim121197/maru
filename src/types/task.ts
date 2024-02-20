export interface Task {
  block_range: string
  periodical: number | null
  expression_id: number
  id: number
  expression_version: number
  created_at: Date
  name: string | null
}
