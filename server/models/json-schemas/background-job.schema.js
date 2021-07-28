export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    config: { type: ['object', 'array', 'null'] },
    quoteId: { type: ['integer', 'null'] },
    userId: { type: ['integer', 'null'] },
    progress: { type: 'number' },
    status: { enum: ['PENDING', 'RUNNING', 'FAILED', 'DONE'] },
    result: { type: ['object', 'null'] }
  },
  required: ['name'],
  additionalProperties: false
};
