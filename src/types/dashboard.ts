export interface ProofsDashboard {
  timestamp: Date
  value: number
}

export interface Dashboard {
  projects_count: number
  contracts_verifications_total_count: number
  contracts_verifications_success_count: number
  proofs_count: number
  proofs_dashboard: ProofsDashboard[]
}
