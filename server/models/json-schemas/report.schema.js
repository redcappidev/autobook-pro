export default {
  type: 'object',
  required: ['userId'],
  properties: {
    id: { type: 'integer' },
    userId: { type: 'integer' },
    name: { type: 'string' },
    matrix: { type: 'jsonb' }
  }
};
