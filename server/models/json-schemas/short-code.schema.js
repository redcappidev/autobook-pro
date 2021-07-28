export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    alias: { type: 'string' },
    shortCode: { type: 'string' }
  },
  required: ['alias', 'shortCode']
};
