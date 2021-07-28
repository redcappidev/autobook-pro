export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    email: { type: 'string' },
    anetProfileId: { type: 'string' }
  },
  required: ['email', 'anetProfileId'],
  additionalProperties: false
};
