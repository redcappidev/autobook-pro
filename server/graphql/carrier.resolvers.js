import { Carrier, Driver } from '@server/models';
import { carrierService } from '@server/services';

export default {
  Carrier: {
    attachments: (carrier) =>
      Carrier.relatedQuery('attachments').for(carrier.id),
    drivers: (carrier) => Carrier.relatedQuery('drivers').for(carrier.id),
    notes: (carrier) => Carrier.relatedQuery('notes').for(carrier.id),
    dispatches: (carrier) =>
      Driver.relatedQuery('dispatches').for(
        Carrier.relatedQuery('drivers').for(carrier.id)
      )
  },
  Query: {
    carrier: (_, { id }, { loaders }) => loaders.carrier.load(id),
    carriers: (_, { search, sortBy, cursor }) =>
      carrierService.getCarriers({ search, sortBy, cursor })
  },
  Mutation: {
    addCarrier: (_, { input }) => Carrier.query().insert(input).returning('*'),
    updateCarrier: (_, { id, input }) =>
      Carrier.query().patch(input).findById(id).returning('*')
  }
};
