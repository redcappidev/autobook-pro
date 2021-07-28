export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    auth0Id: { type: 'string' },
    email: { type: 'string' },
    firstName: { type: 'string', minLength: 1, maxLength: 255 },
    lastName: { type: 'string', minLength: 1, maxLength: 255 },
    roleId: { type: 'integer' },
    permission: { type: 'string' },
    status: { type: 'string' },
    leadSchedule: {
      type: 'object',
      properties: {
        sundayStart: { type: ['string', 'null'] },
        sundayEnd: { type: ['string', 'null'] },
        mondayStart: { type: ['string', 'null'] },
        mondayEnd: { type: ['string', 'null'] },
        tuesdayStart: { type: ['string', 'null'] },
        tuesdayEnd: { type: ['string', 'null'] },
        wednesdayStart: { type: ['string', 'null'] },
        wednesdayEnd: { type: ['string', 'null'] },
        thursdayStart: { type: ['string', 'null'] },
        thursdayEnd: { type: ['string', 'null'] },
        fridayStart: { type: ['string', 'null'] },
        fridayEnd: { type: ['string', 'null'] },
        saturdayStart: { type: ['string', 'null'] },
        saturdayEnd: { type: ['string', 'null'] },
        wholeDay: { type: 'boolean' },
        pause: { type: 'boolean' },
        ratio: { type: 'integer' },
        maxCap: { type: 'integer' },
        today: { type: 'string' },
        todayLeads: { type: 'integer' }
      },
      additionalProperties: false
    }
  }
};
