export enum Expressions {
  EVENT_DATA = 'event_data',
  EXPRESSIONS = 'expressions',
  BLOCK_HEADERS = 'block_headers',
  STATE_DATA = 'state_data',
  STORAGE_SLOTS = 'storage_slots',
  TX_DATA = 'tx_data',
  RECEIPT_DATA = 'receipt_data',
}

export const expressionTypeLabels: Record<Expressions, string> = {
  event_data: 'Event Data',
  expressions: 'Expressions',
  block_headers: 'Block Headers',
  state_data: 'State Data',
  storage_slots: 'Storage Slots',
  tx_data: 'Transactions Data',
  receipt_data: 'Receipt Data',
}

export const expressionTypes = [
  {
    value: Expressions.EVENT_DATA,
    label: expressionTypeLabels[Expressions.EVENT_DATA],
  },
  {
    value: Expressions.EXPRESSIONS,
    label: expressionTypeLabels[Expressions.EXPRESSIONS],
  },
  // {
  //   value: Expressions.BLOCK_HEADERS,
  //   label: expressionTypeLabels[Expressions.BLOCK_HEADERS],
  //   disabled: true,
  // },
  // {
  //   value: Expressions.STATE_DATA,
  //   label: expressionTypeLabels[Expressions.STATE_DATA],
  //   disabled: true,
  // },
  // {
  //   value: Expressions.STORAGE_SLOTS,
  //   label: expressionTypeLabels[Expressions.STORAGE_SLOTS],
  //   disabled: true,
  // },
  // {
  //   value: Expressions.TX_DATA,
  //   label: expressionTypeLabels[Expressions.TX_DATA],
  //   disabled: true,
  // },
  // {
  //   value: Expressions.RECEIPT_DATA,
  //   label: expressionTypeLabels[Expressions.RECEIPT_DATA],
  //   disabled: true,
  // },
]
