export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    year: { type: 'integer' },
    make: { type: 'string' },
    model: { type: 'string' },
    sizeId: { type: 'integer' },
    dontQuote: { type: 'boolean' },
    search: { type: 'string' }
  },
  additionalProperties: false
};
