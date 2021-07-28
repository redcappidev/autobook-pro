export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    fileUrl: { type: 'string' },
    fileName: { type: 'string' },
    attachableType: { type: ['string', 'null'] },
    attachableId: { type: ['integer', 'null'] },
    metaData: { type: 'object' }
  },
  required: ['fileUrl', 'fileName']
};
