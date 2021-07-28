export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    payerId: { type: 'integer' },
    anetPaymentProfileId: { type: 'string' }
  },
  required: ['anetPaymentProfileId'],
  additionalProperties: false
};
