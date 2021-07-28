export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    targetType: { type: ['string', 'null'] },
    targetId: { type: ['integer', 'null'] },
    description: { type: 'string' },
    userId: { type: ['integer', 'null'] },
    eventDate: { type: 'string', format: 'date-time' }
  },
  required: ['description']
};
