export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    typeId: { type: 'integer' },
    notext: { type: 'boolean' },
    nofurther: { type: 'boolean' },
    note: { type: 'string' },
    followupOn: { type: 'string', format: 'date' },
    quoteId: { type: 'integer' }
  },
  required: ['followupOn'],
  additionalProperties: false
};
