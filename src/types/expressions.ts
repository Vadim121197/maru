import type { Address } from './deployment'

export interface EventExample {
  description: string
  name: string
  value: string
}

export interface ExpressionEventParam {
  name: string
  arg_type: string
  value: string
  is_indexed: boolean
}

export interface ExpressionEvent {
  name: string
  params: ExpressionEventParam[]
  examples: EventExample[]
}

export interface ExpressionFunction {
  name: string
  value: string
  is_active: boolean
  arg_type: string
}

export interface ExpressionConstants {
  name: string
  value: string
  arg_type: string
}

export interface ExpressionAggregateFunctions {
  name: string
  value: string
}

export interface FinalExpressionTools {
  expressions: string[]
}

export interface ExpressionTools {
  aggregate_operations: ExpressionAggregateFunctions[]
  constants: ExpressionConstants[]
  contract_name: string
  events: ExpressionEvent[]
  functions: ExpressionFunction[]
  global_constants: ExpressionConstants[]
  global_functions: ExpressionFunction[]
  proved_expressions: string[]
}

export enum ExpressionType {
  BASE = 'base',
  FINAL = 'final',
}

export interface Expression {
  aggregate_operation: string
  contract_address: Address
  created_at: Date
  event: string
  expression_type: ExpressionType
  filter_data: string
  id: number
  name: string
  parsed_data: string
  project_id: number
  raw_data: string
  rpn_data: null
  to_prove_data: null
  updated_at: Date
}

export interface ExpressionsResponse {
  final_expressions: Expression[]
  base_expressions: Expression[]
}

export interface ExpressionValues {
  name: string
  rawData: string
  aggregate?: string
}

export interface BaseExpressionValues extends ExpressionValues {
  filter: string
}

export interface ExpressionCreateResponse {
  raw_data: string
  name: string
  project_id: number
  contract_address: Address
  aggregate_operation: string
  event: string
  expression_type: ExpressionType
  id: number
  created_at: Date
  updated_at: Date
  parsed_data: string
}
