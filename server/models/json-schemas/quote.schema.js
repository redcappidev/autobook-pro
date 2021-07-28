export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    shipper: {
      type: 'object',
      properties: {
        companyName: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' }, // must confirms to the standard E.164 format
        phone2: { type: 'string' }, // must confirms to the standard E.164 format
        timezone: { type: 'string' },
        address: { type: 'string' },
        address2: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zipcode: { type: 'string' },
        note: { type: 'string' },
        noText: { type: 'boolean' },
        noEmail: { type: 'boolean' }
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
        phone: { type: 'string' }, // must confirms to the standard E.164 format
        phone2: { type: 'string' } // must confirms to the standard E.164 format
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
        phone: { type: 'string' }, // must confirms to the standard E.164 format
        phone2: { type: 'string' } // must confirms to the standard E.164 format
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
          sizeId: { type: 'integer' },
          color: { type: 'string' },
          plate: { type: 'string' },
          state: { type: 'string' },
          vin: { type: 'string' },
          lot: { type: 'string' }
        },
        required: ['make', 'model', 'operable'],
        additionalProperties: false
      }
    },
    transport: {
      type: 'object',
      properties: {
        miles: { type: 'number' },
        carrierType: { type: 'string' },
        availableDate: { type: 'string', format: 'date' }, // must confirms to ISO 8601 format
        deliveryDate: { type: ['string', 'null'], format: 'date' },
        basePrice: { type: 'number' },
        sizeFee: { type: 'number' },
        inopFee: { type: 'number' },
        enclosedFee: { type: 'number' },
        deposit: { type: 'number' },
        fullPay: { type: 'number' },
        totalPrice: { type: 'number' }
      }
    },
    assigneeId: { type: ['integer', 'null'] },
    parentStatusId: { type: ['integer', 'null'] },
    childStatusId: { type: ['integer', 'null'] },
    payerId: { type: ['integer', 'null'] },
    payerBillingMethodId: { type: ['integer', 'null'] },
    isOrder: { type: 'boolean' },
    terms: {
      type: 'object',
      properties: {
        accepted: { type: 'boolean' },
        eName: { type: 'string' },
        eSign: { type: 'string' },
        clientIp: { type: 'string' },
        signedAt: { type: 'string', format: 'date-time' }
      }
    },
    referrer: { type: ['string', 'null'] },
    parentId: { type: ['integer', 'null'] },
    hasFollowups: { type: 'boolean' },
    engagements: {
      type: ['array', 'null'],
      items: {
        type: 'string'
      }
    }
  }
};
