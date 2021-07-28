export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    originState: { type: 'string' },
    originCity: { type: 'string' },
    destState: { type: 'string' },
    destCity: { type: 'string' },
    originRadius1: { type: 'integer' },
    destRadius1: { type: 'integer' },
    price1: { type: 'number' },
    originRadius2: { type: 'integer' },
    destRadius2: { type: 'integer' },
    price2: { type: 'number' },
    originRadius3: { type: 'integer' },
    destRadius3: { type: 'integer' },
    price3: { type: 'number' }
  },
  required: ['originState', 'originCity', 'destState', 'destCity'],
  additionalProperties: false
};
