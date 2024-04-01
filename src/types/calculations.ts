export enum CalculationType {
  ONE_TIME = 'one_time',
  PERIODIC = 'periodic',
}

export interface CalculationResponse {
  expression_id: number
  calculation_type: CalculationType
  from_value: string
  to_value: string
  period_value: 'day' | 'block'
  status: 'new'
  created_at: Date
  updated_at: Date
  result: string
  id: number
}

export interface PrecalculateResult {
  decimal: number
  name: string
  value: number
}

export interface Period {
  from: string
  to: string
}
