export default {
  type: 'object',
  required: ['amount', 'transactionId'],
  properties: {
    id: { type: 'integer' },
    orderId: { type: 'integer' },
    amount: { type: 'integer' },
    note: { type: 'string' },
    transactionId: { type: 'string' }
  }
};
