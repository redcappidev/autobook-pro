export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    minMileage: { type: 'integer' },
    maxMileage: { type: 'integer' },
    fee: { type: 'number' },
    order: { type: 'integer' }
  },
  required: ['minMileage', 'maxMileage', 'fee'],
  additionalProperties: false
};
