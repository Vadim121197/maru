import type { Address } from '~/types/deployment'

export const cutAddress = (address: Address) => {
  return address.slice(0, 6) + '...' + address.slice(address.length - 4, address.length)
}
