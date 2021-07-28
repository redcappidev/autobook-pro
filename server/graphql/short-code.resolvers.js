import { ShortCode } from '@server/models';

export default {
  Query: {
    shortCodes: () => ShortCode.query().orderBy('alias', 'asc')
  },
  Mutation: {
    updateShortCodes: (_, { input }) => {
      const graph = input.map((d) => {
        if (d.id) {
          return {
            ...d,
            id: parseInt(d.id, 10)
          };
        }

        return d;
      });
      return ShortCode.query().upsertGraphAndFetch(graph);
    },
    deleteShortCodes: (_, { ids }) => ShortCode.query()
      .whereIn('id', ids)
      .delete()
  }
};
