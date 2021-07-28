export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    type: { enum: ['POSITIVE', 'NEGATIVE', 'WARNING', 'INFO', 'ONGOING'] },
    description: { type: 'string' },
    meta: { type: ['object', 'array', 'null'] },
    actions: { type: ['array', 'null'] },
    userId: { type: ['integer', 'null'] },
    viewed: { type: 'boolean' }
  },
  required: ['type', 'description'],
  additionalProperties: false
};
