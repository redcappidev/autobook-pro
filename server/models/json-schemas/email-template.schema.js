export default {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    emailFrom: { type: 'string' },
    emailFromName: { type: 'string' },
    replyTo: { type: 'string' },
    emailSubject: { type: 'string' },
    emailBcc: { type: ['string', 'null'] },
    placeholders: { type: ['array', 'null'] },
    statusOnOpen: { type: ['integer', 'null'] },
    statusOnClick: { type: ['integer', 'null'] },
    referrers: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    htmlBody: { type: ['string', 'null'] }
  },
  required: ['name']
};
