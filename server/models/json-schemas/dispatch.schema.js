export default {
  type: 'object',
  required: ['driverId', 'pickupDate', 'deliveryDate'],
  properties: {
    id: { type: 'integer' },
    orderId: { type: 'integer' },
    driverId: { type: 'integer' },
    instructions: { type: 'string' },
    pickupDate: { type: 'string', format: 'date' },
    deliveryDate: { type: 'string', format: 'date' }
  }
};
