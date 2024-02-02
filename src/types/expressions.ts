export interface EventExample {
  description: string
  name: string
  value: string
}

export interface ExpressionEventParam {
  name: string
  arg_type: 'address' | 'int128' | 'uint256' | 'uint256[]'
  value: string
}

export interface ExpressionEvent {
  name: string
  params: ExpressionEventParam[]
  examples: EventExample[]
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

export interface Expression {
  raw_data: string
  name: string
  project_id: number
  contract_address: string
  aggregate_operation: string
  event: string
  expression_type: 'base' | 'final'
  id: number
  created_at: Date
  updated_at: Date
  parsed_data: string
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

export interface ExpressionCreateResponse {
  raw_data: string
  name: string
  project_id: number
  contract_address: string
  aggregate_operation: string
  event: string
  expression_type: 'base' | 'final'
  id: number
  created_at: Date
  updated_at: Date
  parsed_data: string
}
