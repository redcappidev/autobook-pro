/* eslint-disable no-useless-escape */
export default {
  type: 'object',
  properties: {
    shipper: {
      type: 'object',
      properties: {
        companyName: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$' }, // must confirms to the standard E.164 format
        phone2: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$' }, // must confirms to the standard E.164 format
        address: { type: 'string' },
        address2: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zipcode: { type: 'string' },
        note: { type: 'string' }
      },
      required: ['firstName', 'phone'],
      additionalProperties: false
    },
    origin: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        address: { type: 'string' },
        address2: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zipcode: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$' }, // must confirms to the standard E.164 format
        phone2: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$' } // must confirms to the standard E.164 format
      },
      required: ['city', 'state', 'zipcode'],
      additionalProperties: false
    },
    destination: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        address: { type: 'string' },
        address2: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zipcode: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$' }, // must confirms to the standard E.164 format
        phone2: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$' } // must confirms to the standard E.164 format
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
          operable: { type: 'boolean' },
          color: { type: 'string' },
          plate: { type: 'string' },
          state: { type: 'string' },
          vin: { type: 'string' },
          lot: { type: 'string' }
        },
        required: ['year', 'make', 'model', 'operable'],
        additionalProperties: false
      }
    },
    transport: {
      type: 'object',
      properties: {
        carrierType: { type: 'string' },
        availableDate: { type: 'string', format: 'date' }, // must confirms to ISO 8601 format
        deliveryDate: { type: ['string', 'null'], format: 'date' }
      },
      required: ['carrierType', 'availableDate']
    },
    referrer: { enum: ['carship', 'irelo', 'friend', 'website'] }
  },
  required: ['shipper', 'origin', 'destination', 'vehicles', 'transport', 'referrer']
};
