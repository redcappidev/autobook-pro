export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    cityName: { type: 'string' },
    stateCode: { type: 'string' },
    lat: { type: 'number' },
    lng: { type: 'number' }
  },
  required: ['cityName', 'stateCode', 'lat', 'lng'],
  additionalProperties: false
};
