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

export interface ChainlinkPrice {
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
  chainlink_prices: ChainlinkPrice[]
}

export interface Expression {
  raw_data: string
  name: string | null
  project_id: number
  contract_address: Address | null
  aggregate_operation: string | null
  event: string | null
  parsed_data: string
  rpn_data: string | null
  data_source: EventDataType
  filter_data: string | null
  to_prove_data: string | null
  id: number
  created_at: Date
  updated_at: Date
  version: number
}

export enum ExpressionTypeResponse {
  EVENT_DATA = 'event_data_expressions',
  COMPOUND = 'compound_expressions',
}

export enum EventDataType {
  EVENT_DATA = 'event_data',
  EXPRESSIONS = 'expressions',
}

export interface ExpressionsResponse {
  [ExpressionTypeResponse.EVENT_DATA]: Expression[]
  [ExpressionTypeResponse.COMPOUND]: Expression[]
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
  data_source: EventDataType
  id: number
  created_at: Date
  updated_at: Date
  parsed_data: string
}
