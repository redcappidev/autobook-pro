export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    script: { type: 'string' },
    placeholders: { type: ['array', 'null'] }
  },
  required: ['name', 'script']
};
