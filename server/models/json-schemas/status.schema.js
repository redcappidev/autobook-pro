export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    type: { enum: ['QUOTE', 'ORDER'] },
    name: { type: 'string' },
    parentId: { type: ['integer', 'null'] },
    emailTemplateId: { type: ['integer', 'null'] },
    smsTemplateId: { type: ['integer', 'null'] }
  },
  required: ['name', 'type'],
  additionalProperties: false
};
