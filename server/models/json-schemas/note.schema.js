export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    note: { type: 'string' },
    noteableType: { type: ['string', 'null'] },
    noteableId: { type: ['integer', 'null'] },
    userId: { type: 'integer' }
  },
  required: ['note']
};
