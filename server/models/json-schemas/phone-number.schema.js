export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    number: { type: 'string' },
    extension: { type: 'string' },
    userId: { type: 'integer' }
  },
  required: ['number', 'extension'],
  additionalProperties: false
};
