import { Followup, Quote } from '@server/models';
import { followupService } from '@server/services';

export default {
  Followup: {
    quote: (followup, _, { loaders }) => loaders.quote.load(followup.quoteId)
  },
  Query: {
    followup: (_, { quoteId }) => Quote.relatedQuery('followup').for(quoteId),
    followups: (_, {
      filterBy,
      sortBy,
      cursor
    }) => followupService.getFollowups({ filterBy, sortBy, cursor }),
    followupsCount: (_, { filterBy }) =>
      followupService.getFollowupsCount({ filterBy })
  },
  Mutation: {
    createFollowup: async (_, { input }) => {
      const { quoteId, typeId, ...data } = input;
      const dataGraph = {
        ...data,
        quote: {
          id: quoteId
        },
        type: {
          id: typeId
        }
      };

      const followup = await Followup.query().findOne('quoteId', quoteId);

      if (followup) {
        dataGraph.id = followup.id;
      }

      return Followup.query().upsertGraphAndFetch(dataGraph, {
        relate: true,
        unrelate: true
      });
    }
  }
};
