export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    slug: { type: 'string' },
    fee: { type: 'number' }
  },
  required: ['slug', 'fee'],
  additionalProperties: false
};
