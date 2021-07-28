import { EnclosedFee } from '@server/models';

export default {
  Query: {
    enclosedFees: () => EnclosedFee.query()
  },
  Mutation: {
    updateEnclosedFees: (_, { feeData }) => {
      const graph = feeData.map((d) => {
        if (d.id) {
          return {
            ...d,
            id: parseInt(d.id, 10)
          };
        }

        return d;
      });
      return EnclosedFee.query().upsertGraphAndFetch(graph);
    },
    deleteEnclosedFees: (_, { ids }) => EnclosedFee.query()
      .whereIn('id', ids)
      .delete()
  }
};
