import isUndefined from 'lodash/isUndefined';
import omit from 'lodash/omit';
import { VehicleSize } from '@server/models';

export default {
  Query: {
    vehicleSizes: () => VehicleSize.query().orderBy('name', 'asc')
  },
  Mutation: {
    createVehicleSize: (_, { name }) =>
      VehicleSize.query()
        .insert({ name, rateBump: 0, flatBump: 0 })
        .returning('*'),
    updateVehicleSizePricing: (_, { vehicleSizeID, rateBump, flatBump }) =>
      VehicleSize.query()
        .findById(vehicleSizeID)
        .patch(omit({ rateBump, flatBump }, isUndefined))
        .returning('*'),
    deleteVehicleSize: async (_, { vehicleSizeID }) => {
      const theDeleted = await VehicleSize.query()
        .delete()
        .findById(vehicleSizeID)
        .returning('*');
      return theDeleted;
    }
  }
};
