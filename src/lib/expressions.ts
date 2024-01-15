export enum Expressions {
  EVENT_DATA = 'event_data',
  BLOCK_HEADERS = 'block_headers',
  STATE_DATA = 'state_data',
  STORAGE_SLOTS = 'storage_slots',
  TX_DATA = 'tx_data',
  RECEIPT_DATA = 'receipt_data',
}

export const expressionTypeLabels: Record<Expressions, string> = {
  event_data: 'Event Data',
  block_headers: 'Block Headers',
  state_data: 'State Data',
  storage_slots: 'Storage Slots',
  tx_data: 'Transactions Data',
  receipt_data: 'Receipt Data',
}

export const expressionTypes = [
  {
    type: Expressions.EVENT_DATA,
  },
  {
    type: Expressions.BLOCK_HEADERS,
    disabled: true,
  },
  {
    type: Expressions.STATE_DATA,
    disabled: true,
  },
  {
    type: Expressions.STORAGE_SLOTS,
    disabled: true,
  },
  {
    type: Expressions.TX_DATA,
    disabled: true,
  },
  {
    type: Expressions.RECEIPT_DATA,
    disabled: true,
  },
]
