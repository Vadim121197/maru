export enum ProofType {
  ONE_TIME = 'one_time',
  PERIODIC = 'periodic',
}

export enum ProofPeridoValue {
  DAY = 'day',
  BLOCK = 'block',
}

export enum ProofStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface Proof {
  expression_id: number
  task_id: number
  input: string
  block_range: string
  status: ProofStatus
  version: number | null
  name: string | null
  created_at: Date
  updated_at: Date
  result: string | null
  verification: string | null
  id: number
}

export interface ProofCreate {
  expression_id: number
  proof_type: ProofType
  from_value: string
  to_value: string
  chunk_size: null | number
  period_value: ProofPeridoValue
}
