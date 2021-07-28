import { FollowupType } from '@server/models';

export default {
  FollowupType: {
    smsTemplate: (followupType, _, { loaders }) => {
      if (followupType.smsTemplateId) {
        return loaders.smsTemplate.load(followupType.smsTemplateId);
      }

      return null;
    }
  },
  Query: {
    followupTypes: () => FollowupType.query()
  },
  Mutation: {
    createFollowupType: (_, { input }) =>
      FollowupType.query().insert(input).returning('*')
  }
};
