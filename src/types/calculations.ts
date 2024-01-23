export interface CalculationRes {
  expression_id: number
  calculation_type: 'one_time' | 'periodic'
  from_value: string
  to_value: string
  period_value: 'day' | 'block'
  status: 'new'
  created_at: Date
  updated_at: Date
  result: string
  id: number
}
