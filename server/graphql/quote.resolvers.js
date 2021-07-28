import { Quote, VehicleSizeChart } from '@server/models';
import { quoteService, taqService, emailService, smsService } from '@server/services';
import { referrers } from '@server/constants/referrers';

const getSize = async (vehicle, loaders) => {
  if (vehicle.sizeId) {
    return loaders.vehicleSize.load(vehicle.sizeId);
  }

  const sizeChart = await VehicleSizeChart.query().findOne({
    make: vehicle.make,
    model: vehicle.model
  });

  if (sizeChart && sizeChart.sizeId) {
    return loaders.vehicleSize.load(sizeChart.sizeId);
  }

  return null;
};

const getParentStatus = (quote, loaders) => {
  if (quote.parentStatusId) {
    return loaders.status.load(quote.parentStatusId);
  }

  return null;
};

const getChildStatus = (quote, loaders) => {
  if (quote.childStatusId) {
    return loaders.status.load(quote.childStatusId);
  }

  return null;
};

const getAssignee = (quote, loaders) => {
  if (quote.assigneeId) {
    return loaders.user.load(quote.assigneeId);
  }

  return null;
};

const getInternalNotes = (quote) =>
  Quote.relatedQuery('internalNotes').for(quote.id);

const getFollowups = (quote) =>
  Quote.relatedQuery('followups').for(quote.id);

const getDispatch = (order) =>
  Quote.relatedQuery('dispatch').for(order.id).first();

const getTerms = (order) => order.terms;

const getParentQuote = (quote, loaders) => {
  if (quote.parentId) return loaders.lead.load(quote.parentId);

  return null;
};

export default {
  QuoteVehicle: {
    size: (vehicle, _, { loaders }) => getSize(vehicle, loaders)
  },
  OrderVehicle: {
    size: (vehicle, _, { loaders }) => getSize(vehicle, loaders)
  },
  Quote: {
    parent: (quote, _, { loaders }) => getParentQuote(quote, loaders),
    children: (quote) => Quote.relatedQuery('children').for(quote.id).select('id', 'isOrder'),
    parentStatus: (quote, _, { loaders }) => getParentStatus(quote, loaders),
    childStatus: (quote, _, { loaders }) => getChildStatus(quote, loaders),
    assignee: (quote, _, { loaders }) => getAssignee(quote, loaders),
    referrer: (quote) => referrers.find((r) => r.value === quote.referrer),
    internalNotes: (quote) => getInternalNotes(quote),
    followups: (quote) => getFollowups(quote),
    events: (quote) => Quote.relatedQuery('events').for(quote.id)
  },
  Order: {
    parent: (quote, _, { loaders }) => getParentQuote(quote, loaders),
    children: (quote) => Quote.relatedQuery('children').for(quote.id).select('id', 'isOrder'),
    parentStatus: (order, _, { loaders }) => getParentStatus(order, loaders),
    childStatus: (order, _, { loaders }) => getChildStatus(order, loaders),
    assignee: (order, _, { loaders }) => getAssignee(order, loaders),
    referrer: (quote) => referrers.find((r) => r.value === quote.referrer),
    internalNotes: (order) => getInternalNotes(order),
    events: (quote) => Quote.relatedQuery('events').for(quote.id),
    dispatch: (order) => getDispatch(order),
    billingInfo: (order) => quoteService.getOrderBillingInfo(order.id),
    transactions: (order) => Quote.relatedQuery('transactions').for(order.id),
    terms: (order, _, { loaders }) => getTerms(order, loaders)
  },
  Query: {
    quote: (_, { id }, { loaders }) => loaders.quote.load(id),
    quotes: (_, { filterBy, sortBy, cursor }) =>
      quoteService.getQuotes({ filterBy, sortBy, cursor, isOrder: false }),
    quotesCount: (_, { filterBy }) =>
      quoteService.getQuotesCount({ filterBy, isOrder: false }),
    order: (_, { id }, { loaders }) => loaders.order.load(id),
    orders: (_, { filterBy, sortBy, cursor }) =>
      quoteService.getQuotes({ filterBy, sortBy, cursor, isOrder: true }),
    ordersCount: (_, { filterBy }) =>
      quoteService.getQuotesCount({ filterBy, isOrder: true }),
    findPossibleDuplicates: (_, { id }) => quoteService.findPossibleDuplicates(id),
    powerSearch: (_, { search }, { user }) =>
      quoteService.powerSearch(user, search)
  },
  Mutation: {
    createQuote: async (_, { input }, { loaders }) => {
      const assignee = await loaders.user.load(input.assigneeId);
      return quoteService.createQuote(assignee, input);
    },
    createOrder: async (_, { input }, { loaders }) => {
      const assignee = await loaders.user.load(input.assigneeId);
      return quoteService.createOrder(assignee, input);
    },
    updateQuote: (_, { id, input }, { user }) =>
      quoteService.updateQuote(user, id, input),
    updateOrder: (_, { id, input }, { user }) =>
      quoteService.updateQuote(user, id, input),
    reassignQuotes: (_, { ids, userId }) => quoteService.reassignQuotes(ids, userId),
    reassignOrders: (_, { ids, userId }) => quoteService.reassignQuotes(ids, userId),
    postToLoadBoard: (_, { id }) =>
      quoteService.postToLoadBoard(id),
    removeFromLoadBoard: (_, { id }) =>
      quoteService.removeFromLoadBoard(id),
    duplicateQuote: async (_, { id, mode }, { user }) =>
      quoteService.duplicateQuote(user, id, mode),
    duplicateOrder: async (_, { id, mode }, { user }) =>
      quoteService.duplicateQuote(user, id, mode),
    convertToOrder: (_, { quoteId, input }, { user }) =>
      quoteService.convertToOrder(user, quoteId, input),
    convertToQuote: (_, { orderId, input }, { user }) =>
      quoteService.convertToQuote(user, orderId, input),
    calcQuotePrice: (_, { origin, destination, vehicles, carrierType, referrer }) => {
      const quote = {
        origin,
        destination,
        vehicles,
        transport: {
          carrierType
        },
        referrer
      };

      return taqService.calcQuotePrice(quote);
    },
    sendQuoteEmail: async (_, { id, emailTemplateId }, { user }) => {
      const quote = await Quote.query().findById(id);
      return emailService.sendEmailToQuote(user, quote, emailTemplateId);
    },
    sendQuoteSMS: async (_, { id, smsTemplateId }, { user }) => {
      const quote = await Quote.query().findById(id);
      return smsService.sendSMSToQuote(user, quote, smsTemplateId);
    },
    sendTermsAndConditionsEmail: async (_, { id }, { user, loaders }) => {
      const order = await loaders.order.load(id);
      return emailService.sendTermsAndConditionsEmail(user, order);
    },
    sendBillingInfoInputEmail: async (_, { id }, { user, loaders }) => {
      const order = await loaders.order.load(id);
      return emailService.sendBillingInfoInputEmail(user, order);
    },
    setBillingInfoToOrder: (_, { orderId, input }) =>
      quoteService.setPaymentInfoToOrder(orderId, input),
    chargeOrder: (_, { orderId, amount, note }) =>
      quoteService.chargeOrder(orderId, amount, note),
    dispatchOrder: (_, { orderId, input }) =>
      quoteService.dispatchOrder(orderId, input),
    updateQuoteByCustomer: (_, { encryption, input }, { clientIp }) =>
      quoteService.updateQuoteByCustomer(encryption, input, clientIp),
    acceptTermsAndConditions: (_, { encryption, input }, { clientIp }) =>
      quoteService.acceptTermsAndConditions(encryption, input, clientIp),
    provideBillingInfo: (_, { encryption, input }) =>
      quoteService.provideBillingInfo(encryption, input),
    getExperiencedCarriers: (_, { orderId }) =>
      quoteService.getExperiencedCarriers(orderId)
  }
};
