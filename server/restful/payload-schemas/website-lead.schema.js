/* eslint-disable no-useless-escape */
export default {
  type: 'object',
  properties: {
    shipper: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$' } // must confirms to the standard E.164 format
      },
      required: ['firstName', 'phone'],
      additionalProperties: false
    },
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
        required: ['year', 'make', 'model', 'operable'],
        additionalProperties: false
      }
    },
    transport: {
      type: 'object',
      properties: {
        carrierType: { enum: ['OPEN', 'ENCLOSED'] },
        availableDate: { type: 'string', format: 'date' } // must confirms to ISO 8601 format
      },
      required: ['carrierType', 'availableDate']
    }
  },
  required: ['shipper', 'origin', 'destination', 'vehicles', 'transport']
};
