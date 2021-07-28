import { orderLinkService } from '@server/services';

export default {
  Mutation: {
    resolveBookOrderLink: (_, { encryption }) =>
      orderLinkService.resolveBookOrderLink(encryption),
    resolveTermsAndConditionsLink: async (_, { encryption }) => {
      const order = await orderLinkService.resolveTermsAndConditionsLink(encryption);

      if (order) {
        return {
          orderId: order.id,
          terms: order.terms
        };
      }

      return null;
    },
    resolveBillingInformationLink: async (_, { encryption }) => {
      const order = await orderLinkService.resolveBillingInformationLink(encryption);

      if (order) return true;
      return false;
    }
  }
};
