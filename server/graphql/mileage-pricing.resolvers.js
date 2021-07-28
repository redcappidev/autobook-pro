import { MileagePricing } from '@server/models';

export default {
  Query: {
    mileagePricings: () => MileagePricing.query().orderBy('min_mileage', 'asc')
  },
  Mutation: {
    updateMileagePricings: (_, { pricingData }) => {
      const graph = pricingData.map((d) => {
        if (d.id) {
          return {
            ...d,
            id: parseInt(d.id, 10)
          };
        }

        return d;
      });
      return MileagePricing.query().upsertGraphAndFetch(graph);
    },
    deleteMileagePricings: (_, { ids }) => MileagePricing.query()
      .whereIn('id', ids)
      .delete()
  }
};
