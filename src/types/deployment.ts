export type Address = `0x${string}`

export enum Network {
  MAINNET = 'mainnet',
  RINKEBY = 'rinkeby', // etherscan doesn't support
  ROPSTEN = 'ropsten', // etherscan doesn't support
  KOVAN = 'kovan',
  GOERLI = 'goerli',
}

export interface Deployment {
  address: Address | null
  network: Network
  task_id: number
  expression_id: number
  name: string | null
}
