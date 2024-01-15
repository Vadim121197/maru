import type { Deflate } from 'zlib'

export interface ExpressionEventParam {
  name: string
  arg_type: 'address' | 'int128' | 'uint256' | 'uint256[]'
  value: string
}

export interface ExpressionEvent {
  name: string
  params: ExpressionEventParam[]
}

export interface ExpressionFunction {
  name: string
  value: string
}

export interface ExpressionConstants {
  name: string
  value: string
}

export interface ExpressionAggregateFunctions {
  name: string
  value: string
}

export interface ExpressionTools {
  constants: ExpressionConstants[]
  events: ExpressionEvent[]
  functions: ExpressionFunction[]
  aggregate_functions: ExpressionAggregateFunctions[]
}

export interface Expression {
  contract_address: string
  created_at: Date
  event: string
  id: number
  name: string
  parsed_data: string
  project_id: number
  raw_data: string
  updated_at: Deflate
}
