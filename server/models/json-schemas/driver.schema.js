export default {
  type: 'object',
  required: ['firstName', 'phoneNumber'],
  properties: {
    id: { type: 'integer' },
    firstName: { type: 'string', minLength: 1, maxLength: 255 },
    lastName: { type: 'string', minLength: 1, maxLength: 255 },
    email: { type: 'string' },
    phoneNumber: { type: 'string' },
    carrierId: { type: 'integer' }
  }
};
