import { SMSTemplate } from '@server/models';

export default {
  Query: {
    smsTemplate: (_, { id }, { loaders }) => loaders.smsTemplate.load(id),
    smsTemplates: () => SMSTemplate.query()
  },
  Mutation: {
    createSMSTemplate: (_, { input }) =>
      SMSTemplate.query().insert(input).returning('*'),
    updateSMSTemplate: (_, { id, input }) =>
      SMSTemplate.query().findById(id).patch(input).returning('*'),
    deleteSMSTemplate: (_, { id }) =>
      SMSTemplate.query().deleteById(id)
  }
};
