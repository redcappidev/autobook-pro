export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    mcNumber: { type: 'string' },
    dotNumber: { type: 'string' },
    companyName: { type: 'string' },
    address: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    zipcode: { type: 'string' },
    phoneNumber: { type: 'string' },
    fax: { type: 'string' },
    firstContact: { type: 'string' },
    secondContact: { type: 'string' },
    insuranceExpires: { type: 'string' },
    email: { type: 'string' },
    contactOption: { type: 'string' },
    needs1099: { type: 'boolean' },
    ein: { type: 'string' },
    ssn: { type: 'string' },
    customField1: { type: 'string' },
    customField2: { type: 'string' },
    customField3: { type: 'string' },
    customField4: { type: 'string' }
  },
  required: [
    'companyName',
    'address',
    'phoneNumber'
  ],
  additionalProperties: false
};
