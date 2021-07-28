export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    userId: { type: 'integer' },
    connectionId: { type: 'string' }
  },
  required: ['userId', 'connectionId']
};
