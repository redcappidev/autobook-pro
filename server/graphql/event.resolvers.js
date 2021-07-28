import { Quote } from '@server/models';

export default {
  Query: {
    quoteEvents: async (_, { id }) => {
      const quote = await Quote.query().findById(id).withGraphFetched('events');
      return quote.events;
    }
  }
};
