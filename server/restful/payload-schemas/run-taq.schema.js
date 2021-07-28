export default {
  type: 'object',
  properties: {
    origin: {
      type: 'object',
      properties: {
        city: { type: 'string' },
        state: { type: 'string' },
        zipcode: { type: 'string' }
      },
      required: ['city', 'state', 'zipcode'],
      additionalProperties: false
    },
    destination: {
      type: 'object',
      properties: {
        city: { type: 'string' },
        state: { type: 'string' },
        zipcode: { type: 'string' }
      },
      required: ['city', 'state', 'zipcode'],
      additionalProperties: false
    },
    vehicles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          year: { type: 'integer' },
          make: { type: 'string' },
          model: { type: 'string' },
          operable: { type: 'boolean' }
        },
        required: ['make', 'model', 'operable'],
        additionalProperties: false
      }
    },
    transport: {
      type: 'object',
      properties: {
        carrierType: { enum: ['OPEN', 'ENCLOSED'] }
      },
      additionalProperties: false
    },
    referrer: { enum: ['carship', 'irelo', 'friend', 'website'] }
  },
  required: ['origin', 'destination', 'vehicles', 'transport', 'referrer']
};
