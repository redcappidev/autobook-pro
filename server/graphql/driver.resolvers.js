import { Carrier, Driver } from '@server/models';

export default {
  Driver: {
    carrier: (driver, _, { loaders }) => loaders.carrier.load(driver.carrierId)
  },
  Mutation: {
    addDriver: (_, { carrierId, input }) =>
      Carrier.relatedQuery('drivers')
        .for(carrierId)
        .insert(input)
        .returning('*'),
    updateDriver: (_, { id, input }) =>
      Driver.query().patch(input).findById(id).returning('*'),
    deleteDriver: async (_, { id }) => {
      await Driver.query().deleteById(id);
      return parseInt(id, 10);
    }
  }
};
