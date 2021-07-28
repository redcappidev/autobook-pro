export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    smsTemplateId: { type: ['integer', 'null'] }
  },
  additionalProperties: false
};
