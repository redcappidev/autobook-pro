import { AccountPhoneNumber } from '@server/models';

export default {
  AccountPhoneNumber: {
    user: (phoneNumber, _, { loaders }) => loaders.user.load(phoneNumber.userId)
  },
  Query: {
    phoneNumber: (_, __, { user }) => AccountPhoneNumber.query().findOne({ userId: user.id })
  },
  Mutation: {
    setPhoneNumber: async (_, { number, extension }, { user }) => {
      const accountPhoneNumber = await AccountPhoneNumber.query().findOne({ userId: user.id });
      if (accountPhoneNumber) {
        return accountPhoneNumber.$query().patch({ number, extension }).returning('*');
      }

      return AccountPhoneNumber.query().insert({ number, extension, userId: user.id }).returning('*');
    }
  }
};
