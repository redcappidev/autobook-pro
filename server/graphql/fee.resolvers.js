import { Fee } from '@server/models';

export default {
  Query: {
    fees: () => Fee.query()
  },
  Mutation: {
    updateFees: (_, { feeData }) => {
      const graph = feeData.map((d) => {
        if (d.id) {
          return {
            ...d,
            id: parseInt(d.id, 10)
          };
        }

        return d;
      });
      return Fee.query().upsertGraphAndFetch(graph);
    }
  }
};
