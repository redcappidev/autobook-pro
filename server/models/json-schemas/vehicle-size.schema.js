export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    rateBump: { type: 'number' },
    flatBump: { type: 'integer' }
  },
  required: ['name'],
  additionalProperties: false
};
