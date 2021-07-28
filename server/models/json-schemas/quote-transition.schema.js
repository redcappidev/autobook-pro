export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    quoteId: { type: ['integer', 'null'] },
    from: { type: 'string' },
    to: { type: 'string' },
    meta: { type: ['object', 'array', 'null'] }
  },
  required: ['to'],
  additionalProperties: false
};
