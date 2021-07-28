export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    encryption: { type: 'string' },
    orderId: { type: 'integer' },
    type: { type: 'string' },
    expired: { type: 'boolean' }
  },
  required: ['encryption', 'type'],
  additionalProperties: false
};
