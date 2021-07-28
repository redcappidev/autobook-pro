export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    minMileage: { type: 'integer' },
    maxMileage: { type: 'integer' },
    price: { type: 'number' },
    order: { type: 'integer' }
  },
  required: ['minMileage', 'maxMileage', 'price'],
  additionalProperties: false
};
